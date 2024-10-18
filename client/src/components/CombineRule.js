// CombineRulePage.js

import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';

const CombineRulePage = () => {
    const [rules, setRules] = useState([{ ruleName: '', rule: '' }]);
    const [addedRules, setAddedRules] = useState([]);
    const [combinedAst, setCombinedAst] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleAddRule = () => {
        setRules([...rules, { ruleName: '', rule: '' }]);
    };

    const handleRuleChange = (index, field, value) => {
        const updatedRules = [...rules];
        updatedRules[index][field] = value;
        setRules(updatedRules);
    };

    const handleCreateRule = async (index) => {
        const newRule = rules[index];
        if (newRule.ruleName && newRule.rule) {
            try {
                const response = await axios.post('http://localhost:5000/api/rules/create', newRule);
                const createdRule = response.data;
                setAddedRules([...addedRules, createdRule]);
                setRules(rules.map((rule, i) => (i === index ? { ruleName: '', rule: '' } : rule)));
            } catch (error) {
                console.error("Error creating rule:", error);
                setErrorMessage("Failed to create rule.");
            }
        }
    };

    const handleDeleteRule = (index) => {
        const updatedRules = rules.filter((_, i) => i !== index);
        setRules(updatedRules);
    };

    const handleDeleteAddedRule = (index) => {
        const updatedAddedRules = addedRules.filter((_, i) => i !== index);
        setAddedRules(updatedAddedRules);
    };

    const handleCombineRules = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/rules/combine', {
                ruleIds: addedRules.map(rule => rule.ruleId),
            });
            if (response.data && response.data.combinedAst) {
                setCombinedAst(response.data.combinedAst);
                setShowAlert(true);
                setErrorMessage("");
            } else {
                throw new Error("Invalid response structure.");
            }
        } catch (err) {
            console.error("Error combining rules: ", err);
            setErrorMessage(err.response?.data?.error || "An error occurred while combining rules.");
            setShowAlert(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Combine Rules</h2>
            
            {rules.map((rule, index) => (
                <div key={index} className="mb-3">
                    <div className="form-group">
                        <label>Rule Name {index + 1}</label>
                        <input
                            type="text"
                            className="form-control"
                            value={rule.ruleName}
                            onChange={(e) => handleRuleChange(index, 'ruleName', e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label>Rule {index + 1}</label>
                        <input
                            type="text"
                            className="form-control"
                            value={rule.rule}
                            onChange={(e) => handleRuleChange(index, 'rule', e.target.value)}
                        />
                    </div>
                    <Button variant="primary" className="mt-2" onClick={() => handleCreateRule(index)}>
                        Create Rule
                    </Button>
                    <Button variant="danger" className="mt-2 ml-2" onClick={() => handleDeleteRule(index)}>
                        Delete Input
                    </Button>
                </div>
            ))}

            <Button className="btn btn-primary mt-3" onClick={handleAddRule}>
                Add Rule Input
            </Button>

            <Button className="btn btn-success mt-3 ml-3" onClick={handleCombineRules}>
                Combine Rules
            </Button>

            {showAlert && <Alert variant="success" className="mt-3">Rules Combined Successfully!</Alert>}
            {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}

            {combinedAst && (
                <div className="mt-5">
                    <h4>Combined AST</h4>
                    <pre>{JSON.stringify(combinedAst, null, 2)}</pre>
                </div>
            )}

            <div className="mt-5">
                <h4>Added Rules</h4>
                {addedRules.map((rule, index) => (
                    <div key={index} className="mb-2 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Rule Name:</strong> {rule.ruleName} <br />
                            <strong>Rule:</strong> {rule.rule}
                        </div>
                        <div>
                            <Button variant="danger" onClick={() => handleDeleteAddedRule(index)}>
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CombineRulePage;
