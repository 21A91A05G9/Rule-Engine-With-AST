import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

const RuleForm = () => {
    const [ruleName, setRuleName] = useState("");
    const [ruleString, setRuleString] = useState("");
    const [ast, setAst] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/rules/create", { ruleName, ruleString });
            setAst(response.data.ast);
            setError("");
            // Resetting inputs after submission
            setRuleName("");
            setRuleString("");
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create Rule</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRuleName">
                    <Form.Label>Rule Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        placeholder="Enter rule name"
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formRuleString">
                    <Form.Label>Rule String</Form.Label>
                    <Form.Control
                        type="text"
                        value={ruleString}
                        onChange={(e) => setRuleString(e.target.value)}
                        placeholder="Enter rule string (e.g., age > 30 AND department = Sales)"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Create AST
                </Button>
            </Form>
            {ast && (
                <div className="mt-4">
                    <h3>Generated AST:</h3>
                    <pre>{JSON.stringify(ast, null, 2)}</pre>
                </div>
            )}
            {error && (
                <Alert variant="danger" className="mt-4">
                    {error}
                </Alert>
            )}
        </div>
    );
};

export default RuleForm;
