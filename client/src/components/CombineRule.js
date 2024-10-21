import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Spinner } from 'react-bootstrap';
import '../styles/ruleForm.css';  
import CustomNavbar from "./Navbar"; 

const CombineRulePage = () => {
    const [ruleName, setRuleName] = useState('');
    const [rules, setRules] = useState([{ rule: '' }]);
    const [addedRules, setAddedRules] = useState([]);
    const [combinedAst, setCombinedAst] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRuleChange = (index, value) => {
        const updatedRules = [...rules];
        updatedRules[index].rule = value;
        setRules(updatedRules);
    };

    const handleCreateRule = (index) => {
        const newRule = rules[index];
        if (newRule.rule) {
            setAddedRules([...addedRules, newRule]);
            setRules(rules.map((rule, i) => (i === index ? { rule: '' } : rule)));
        }
    };

    const handleCombineRules = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/rules/combine', {
                rule_name: ruleName,
                rules: addedRules.map(rule => rule.rule),
            });
            setCombinedAst(response.data.ast);
            setShowAlert(true);
            setErrorMessage('');
        } catch (err) {
            console.error("Error combining rules: ", err.response.data);
            setErrorMessage(err.response.data.error || 'Failed to combine rules.');
            setShowAlert(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        
        <CustomNavbar />
        <div className="combine-rule-container mt-5">
            <h2 className="text-center">Combine Rules</h2>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <div className="form-group mb-4">
                <label>Combined Rule Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                />
            </div>

            {rules.map((rule, index) => (
                <div key={index} className="mb-3">
                    <div className="form-group">
                        <label>Rule {index + 1}</label>
                        <input
                            type="text"
                            className="form-control"
                            value={rule.rule}
                            onChange={(e) => handleRuleChange(index, e.target.value)}
                        />
                    </div>
                    <Button variant="primary" className="mt-2" onClick={() => handleCreateRule(index)}>
                        Create Rule
                    </Button>
                </div>
            ))}

            <Button className="btn btn-success mt-3" onClick={handleCombineRules}>
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Combine Rules'}
            </Button>

            {showAlert && <Alert variant="success" className="mt-3">Rules Combined Successfully!</Alert>}

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
                            <strong>Rule:</strong> {rule.rule}
                        </div>
                        <Button
                            variant="danger"
                            onClick={() => {
                                const updatedAddedRules = addedRules.filter((_, i) => i !== index);
                                setAddedRules(updatedAddedRules);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default CombineRulePage;
