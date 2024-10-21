import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import CustomNavbar from "./Navbar";  // Importing the Navbar component
import '../styles/ruleForm.css';

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
            setRuleName("");
            setRuleString("");
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred.");
        }
    };

    return (
        <>
            {/* Using the Custom Navbar */}
            <CustomNavbar />

            {/* Rule Form Section */}
            <Container className="rule-form-container mt-5 p-4 shadow-sm">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <h2 className="text-center mb-4">Create a New Rule</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formRuleName">
                                <Form.Label>Rule Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                    placeholder="Enter rule name"
                                    required
                                    className="rounded-pill"
                                />
                            </Form.Group>
                            <Form.Group controlId="formRuleString" className="mt-3">
                                <Form.Label>Rule String</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={ruleString}
                                    onChange={(e) => setRuleString(e.target.value)}
                                    placeholder="Enter rule string (e.g., age > 30 AND department = Sales)"
                                    required
                                    className="rounded"
                                />
                            </Form.Group>
                            <div className="text-center mt-4">
                                <Button variant="primary" type="submit" className="px-5 py-2 rounded-pill">
                                    Create AST
                                </Button>
                            </div>
                        </Form>
                        {ast && (
                            <div className="mt-5">
                                <h3>Generated AST:</h3>
                                <pre className="ast-output p-3 rounded">{JSON.stringify(ast, null, 2)}</pre>
                            </div>
                        )}
                        {error && (
                            <Alert variant="danger" className="mt-4">
                                {error}
                            </Alert>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RuleForm;
