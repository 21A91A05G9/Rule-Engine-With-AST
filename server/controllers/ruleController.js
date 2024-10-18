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


// Evaluate a rule
export const evaluateRule = (req, res) => {
    const { ast, data } = req.body;

    try {
        // Evaluate the rule against the provided data
        const result = evaluateAST(ast, data);
        res.json({ result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Evaluate AST logic
function evaluateAST(ast, data) {
    // Traverse the AST and evaluate based on user data
    if (ast.type === "operator") {
        const leftValue = evaluateAST(ast.left, data);
        const rightValue = evaluateAST(ast.right, data);
        switch (ast.value) {
            case "AND":
                return leftValue && rightValue;
            case "OR":
                return leftValue || rightValue;
            default:
                return false;
        }
    } else if (ast.type === "operand") {
        const { field, operator, value } = ast.value;
        switch (operator) {
            case ">":
                return data[field] > value;
            case "<":
                return data[field] < value;
            case "=":
                return data[field] === value;
            // Add more operators as needed
            default:
                return false;
        }
    }
    return false;
}
