import Rule from '../models/Rule.js';
import Node from '../models/Node.js'; // Assuming you have an AST Node class

// Function to create AST from a rule string
function createAST(ruleString) {
    // Implement a parser that converts the ruleString into an AST.
    // This is a placeholder implementation. You need to replace it with actual parsing logic.
    // Here’s an example of a simple AST:
    const andNode = new Node("operator", new Node("operand", "age", null, 30, ">"), new Node("operand", "department", "Sales", null, "="), "AND");
    return andNode;
}

// Create a rule and return the AST
export const createRule = async (req, res) => {
    const ruleString = req.body.ruleString;

    // Convert the rule string to an AST
    const ast = createAST(ruleString);
    const newRule = new Rule({ ruleString });

    try {
        await newRule.save();
        res.status(201).json({ ast });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Combine rules into a single AST
export const combineRules = (req, res) => {
    const { rules } = req.body;

    // Combine the rules into a single AST
    const combinedAst = combineASTs(rules);
    res.json({ combinedAst });
};

// Evaluate a rule
export const evaluateRule = (req, res) => {
    const { ast, data } = req.body;

    // Evaluate the rule against the provided data
    const result = evaluateAST(ast, data);
    res.json({ result });
};

// Placeholder function to combine multiple ASTs (implement as needed)
function combineASTs(rules) {
    const combinedRoot = new Node("operator", null, null, "AND");
    // Logic to combine the ASTs from rules would go here
    return combinedRoot;
}

// Placeholder function to evaluate AST (implement as needed)
function evaluateAST(ast, data) {
    // This function should traverse the AST and evaluate it against the provided data
    // Here’s an example of simple evaluation logic:
    if (ast.type === "operator") {
        const leftValue = evaluateAST(ast.left, data);
        const rightValue = evaluateAST(ast.right, data);
        switch (ast.value) {
            case "AND":
                return leftValue && rightValue;
            case "OR":
                return leftValue || rightValue;
            default:
                return false; // Handle unexpected cases
        }
    } else if (ast.type === "operand") {
        // Assuming the operand has fields for comparison
        const { key, value, operator } = ast;
        switch (operator) {
            case ">":
                return data[key] > value;
            case "=":
                return data[key] === value;
            // Add more operators as needed
            default:
                return false; // Handle unexpected cases
        }
    }
    return false; // Fallback for unexpected node types
}
