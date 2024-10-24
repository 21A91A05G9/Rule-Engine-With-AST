import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import '../styles/ruleForm.css';  
import CustomNavbar from "./Navbar"; 

const EvaluateRule = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [isJsonValid, setIsJsonValid] = useState(true);
    const [rules, setRules] = useState([]);
    const [selectedRuleAST, setSelectedRuleAST] = useState('');
    const [selectedRuleString, setSelectedRuleString] = useState('');
    const [selectedRuleName, setSelectedRuleName] = useState(''); // New state for rule name
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    // Fetch rules from the backend
    const fetchRules = useCallback(async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const response = await axios.get('http://localhost:5000/api/rules/fetch');
            setRules(response.data.rules);
        } catch (error) {
            console.error('Error fetching rules:', error.message);
            setFetchError('Failed to fetch rules. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const validateJson = (value) => {
        try {
            JSON.parse(value);
            setIsJsonValid(true);
        } catch (e) {
            setIsJsonValid(false);
        }
        setJsonInput(value);
    };

    const handleEvaluateRule = async () => {
        if (!isJsonValid || !selectedRuleAST) {
            console.warn('Invalid JSON or no rule selected');
            return;
        }

        setLoading(true);
        setEvaluationResult(null); // Reset previous result

        try {
            let ast, data;
            try {
                ast = JSON.parse(selectedRuleAST);
                data = JSON.parse(jsonInput);
                console.log('AST:', ast);
                console.log('Input Data:', data);
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError.message);
                setEvaluationResult('Invalid JSON format. Please check your input.');
                setLoading(false);
                return;
            }

            // Include selected rule name in the payload
            const response = await axios.post('http://localhost:5000/api/rules/evaluate', {
                ast,
                data,
                ruleName: selectedRuleName // Pass rule name here
            });
            setEvaluationResult(response.data.result);
        } catch (error) {
            if (error.response) {
                console.error('Server error:', error.response.data);
                setEvaluationResult(`Server error: ${error.response.data.error || 'Unknown error'}`);
            } else if (error.request) {
                console.error('No response from server:', error.request);
                setEvaluationResult('No response from server. Please try again later.');
            } else {
                console.error('Error:', error.message);
                setEvaluationResult('Error evaluating rule. Please check your input.');
            }
        } finally {
            setLoading(false);
        }
    };

    const clearInputs = () => {
        setJsonInput('');
        setIsJsonValid(true);
        setSelectedRuleAST('');
        setSelectedRuleString('');
        setSelectedRuleName(''); // Reset rule name
        setEvaluationResult(null);
    };

    const handleRuleSelection = (e) => {
        const ruleIndex = e.target.value;
        if (ruleIndex !== '') {
            const selectedRule = rules[ruleIndex];
            setSelectedRuleAST(JSON.stringify(selectedRule.ruleAST));
            setSelectedRuleString(selectedRule.ruleString);
            setSelectedRuleName(selectedRule.ruleName); // Set the selected rule name
        } else {
            setSelectedRuleAST('');
            setSelectedRuleString('');
            setSelectedRuleName(''); // Reset rule name
        }
    };

    return (
        <>
        <CustomNavbar/>
        <div className="evaluate-rule-container mt-5">
            <h2 className="text-center">Evaluate Rule</h2>
            <div className="form-group">
                <label>Input JSON</label>
                <textarea
                    className="form-control"
                    value={jsonInput}
                    onChange={(e) => validateJson(e.target.value)}
                    placeholder="Enter JSON"
                />
                {!isJsonValid && <Alert variant="danger" className="mt-2">Invalid JSON format!</Alert>}
            </div>
            <div className="form-group mt-2">
                <label>Select Rule</label>
                <select 
                    className="form-control" 
                    onChange={handleRuleSelection} 
                    disabled={loading}  // Disable while loading
                >
                    <option value="">Select a rule</option>
                    {rules.map((rule, index) => (
                        <option key={index} value={index}>{rule.ruleName}</option>
                    ))}
                </select>
            </div>
            <div className="form-group mt-2">
                <label>Selected Rule String</label>
                <textarea
                    className="form-control"
                    value={selectedRuleString}
                    readOnly
                />
            </div>
            <Button className="btn btn-warning mt-3" onClick={handleEvaluateRule} disabled={loading || !selectedRuleAST}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Evaluate Rule'}
            </Button>
            <Button className="btn btn-secondary mt-3 ms-2" onClick={clearInputs}>Clear</Button>
            
            {evaluationResult !== null && (
                <div className="mt-3">
                    <h4>Evaluation Result</h4>
                    <p>{evaluationResult ? 'True' : 'False'}</p>
                </div>
            )}

            {fetchError && <Alert variant="danger" className="mt-2">{fetchError}</Alert>}
        </div>
        </>
    );
};

export default EvaluateRule;
