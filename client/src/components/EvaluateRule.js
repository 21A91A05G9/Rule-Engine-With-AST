import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const EvaluateRule = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [isJsonValid, setIsJsonValid] = useState(true);
    const [rules, setRules] = useState([]);
    const [selectedRule, setSelectedRule] = useState('');
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
        if (!isJsonValid || !selectedRule) return;

        setLoading(true);
        setEvaluationResult(null); // Reset previous result
        try {
            const ast = JSON.parse(selectedRule); // Assuming the selected rule is in JSON format
            const data = JSON.parse(jsonInput); // Convert the user input to a JSON object
            
            const response = await axios.post('http://localhost:5000/api/rules/evaluate', {
                ast,
                data,
            });

            setEvaluationResult(response.data.result);
        } catch (error) {
            console.error('Error evaluating rule:', error);
            setEvaluationResult('Error evaluating rule. Please check your input.');
        } finally {
            setLoading(false);
        }
    };

    const clearInputs = () => {
        setJsonInput('');
        setIsJsonValid(true);
        setSelectedRule('');
        setEvaluationResult(null);
    };

    return (
        <div className="container mt-5">
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
                    value={selectedRule} 
                    onChange={(e) => setSelectedRule(e.target.value)}
                    disabled={loading}  // Disable while loading
                >
                    <option value="">Select a rule</option>
                    {rules.map((rule, index) => (
                        <option key={index} value={JSON.stringify(rule.ruleAST)}>{rule.ruleName}</option>
                    ))}
                </select>
            </div>
            <Button className="btn btn-warning mt-3" onClick={handleEvaluateRule} disabled={loading || !selectedRule}>
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
    );
};

export default EvaluateRule;
