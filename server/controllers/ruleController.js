import Rule from '../models/Rule.js';
import Node from '../models/Node.js'; // Assuming you have an AST Node class

// Function to create AST from a rule string
function createAST(ruleString) {
    const tokens = tokenize(ruleString);
    const ast = parseTokens(tokens);
    return ast;
}

// Tokenize the input rule string (split by spaces, keeping operators and values intact)
function tokenize(ruleString) {
    const regex = /\s*(>=|<=|=|>|<|AND|OR|\(|\))\s*/i;  // Split by operators, keeping them
    const parts = ruleString.split(regex).filter(token => token.trim() !== '');
    return parts;
}

// Parse tokens and build the AST recursively
function parseTokens(tokens) {
    let index = 0;

    function parseExpression() {
        let left = parseTerm();

        while (index < tokens.length) {
            const operator = tokens[index].toUpperCase();

            // Handling logical operators (AND, OR)
            if (operator === "AND" || operator === "OR") {
                index++;
                const right = parseTerm();
                left = new Node("operator", left, right, operator);  // Create an operator node
            } else {
                break;
            }
        }

        return left;
    }

    function parseTerm() {
        if (tokens[index] === "(") {
            index++; // Skip '('
            const expr = parseExpression();
            index++; // Skip ')'
            return expr;
        }

        // Parse operand (e.g., age > 30)
        const field = tokens[index++];  // Operand, e.g., "age"
        const operator = tokens[index++];  // Operator, e.g., ">"
        const value = tokens[index++];  // Operand value, e.g., "30" or "'Sales'"

        return new Node("operand", null, null, { field, operator, value });
    }

    return parseExpression();
}

// Create a rule and return the AST
export const createRule = async (req, res) => {
    const { ruleName, ruleString } = req.body;

    try {
        // Ensure the rule name is unique
        const existingRule = await Rule.findOne({ ruleName });
        if (existingRule) {
            return res.status(400).json({ error: "Rule name must be unique." });
        }

        // Convert the rule string to an AST
        const ast = createAST(ruleString);
        const newRule = new Rule({
            ruleName,
            ruleString,
            ruleAST: ast // Store AST in the database
        });

        await newRule.save();
        res.status(201).json({ message: "Rule created successfully", ast });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const combineRules = async (req, res) => {
    const { rule_name, rules } = req.body;

    // Input validation
    if (!rule_name || !rules || !Array.isArray(rules) || rules.length === 0) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        // Check for unique rule name
        const existingRule = await Rule.findOne({ ruleName: rule_name });
        if (existingRule) {
            return res.status(400).json({ error: 'Rule name must be unique.' });
        }

        // Create the combined AST
        const combinedAST = {
            type: "CombinedRule",
            name: rule_name,
            rules: rules.map((rule, index) => {
                const ruleExpression = {
                    type: "Expression",
                    operator: "AND", // Assuming all combined rules use AND
                    left: {
                        type: "Condition",
                        field: rule.field1, // Adjust these based on your rule structure
                        operator: rule.operator1,
                        value: rule.value1
                    },
                    right: {
                        type: "Condition",
                        field: rule.field2,
                        operator: rule.operator2,
                        value: rule.value2
                    }
                };

                return {
                    type: "Rule",
                    name: `rule ${index + 1}`,
                    expression: ruleExpression
                };
            }),
            operator: "AND" // Assuming the top-level operator is AND
        };

        // Save the combined rule in the database
        const newRule = new Rule({
            ruleName: rule_name,
            ruleString: rules.join(' AND '), // Combine the rules into a single string
            ruleAST: combinedAST // Store the combined AST
        });

        await newRule.save();
        return res.status(201).json({ message: "Rules combined and saved successfully!", ast: combinedAST });
    } catch (err) {
        console.error("Error saving combined rules: ", err);
        res.status(500).json({ error: err.message });
    }
};

const evaluateCondition = (condition, data) => {
    const { field, operator, value } = condition.value;

    // Remove single quotes from the value for string comparison
    const parsedValue = value.replace(/'/g, "");

    let result;
    switch (operator) {
        case '>':
            result = data[field] > parseInt(parsedValue, 10);
            break;
        case '<':
            result = data[field] < parseInt(parsedValue, 10);
            break;
        case '=':
            result = data[field] === parsedValue;
            break;
        default:
            console.warn(`Unknown operator: ${operator}`);
            result = false;
    }

    console.log(`Evaluating: ${field} ${operator} ${parsedValue} => ${result}`);
    return result;
};

// Function to evaluate the AST recursively
export const evaluateRule = async (req, res) => {
    const { ast, data } = req.body; // Access node and data from request body
    console.log('Evaluating node:', ast);

    // Check if node is defined
    if (!ast) {
        console.warn('Node is undefined or null');
        return res.status(400).json({ success: false, message: 'Node is undefined or null' });
    }

    let evaluationResult;

    // Evaluate based on node type
    if (ast.type === "operand") {
        evaluationResult = evaluateCondition(ast, data);
    } else if (ast.type === "operator") {
        const leftResult = await evaluateRule({ body: { ast: ast.left, data } }, res);
        if (leftResult === undefined) return; // Prevent further execution if leftResult is undefined

        const rightResult = await evaluateRule({ body: { ast: ast.right, data } }, res);
        if (rightResult === undefined) return; // Prevent further execution if rightResult is undefined

        switch (ast.value) {
            case "AND":
                evaluationResult = leftResult && rightResult;
                break;
            case "OR":
                evaluationResult = leftResult || rightResult;
                break;
            default:
                console.warn(`Unknown operator: ${ast.value}`);
                return res.status(400).json({ success: false, message: 'Unknown operator' });
        }

        console.log(`Evaluating operator '${ast.value}': ${leftResult} ${ast.value} ${rightResult} => ${evaluationResult}`);
    } else if (ast.type === "CombinedRule") {
        const results = await Promise.all(ast.rules.map(async (rule) => {
            const result = await evaluateRule({ body: { ast: rule.expression, data } }, res);
            return result === undefined ? undefined : result; // Prevent undefined results
        }));

        if (results.includes(undefined)) {
            return; // Early return if any rule couldn't be evaluated
        }

        // Apply the operator to the results
        if (ast.operator === "AND") {
            evaluationResult = results.every(result => result === true);
        } else if (ast.operator === "OR") {
            evaluationResult = results.some(result => result === true);
        } else {
            console.warn(`Unknown operator for CombinedRule: ${ast.operator}`);
            return res.status(400).json({ success: false, message: 'Unknown operator for CombinedRule' });
        }

        console.log(`Evaluating CombinedRule '${ast.name}' with operator '${ast.operator}': ${results} => ${evaluationResult}`);
    } else {
        console.warn(`Unknown node type: ${ast.type}`);
        return res.status(400).json({ success: false, message: 'Unknown node type' });
    }

    // Send the evaluation result as a JSON response
    if (!res.headersSent) {
        return res.status(200).json({ success: true, result: evaluationResult });
    }
};



export const fetchData = async(req, res) => { 
    try {
        const rules = await Rule.find(); // Fetch all rules from the database
        res.json({ rules });
    } catch (error) {
        console.error('Error fetching rules:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}