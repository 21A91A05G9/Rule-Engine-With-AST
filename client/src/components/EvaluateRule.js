import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

const EvaluateRule = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [isJsonValid, setIsJsonValid] = useState(true);

    const validateJson = (value) => {
        try {
            JSON.parse(value);
            setIsJsonValid(true);
        } catch (e) {
            setIsJsonValid(false);
        }
        setJsonInput(value);
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
                <select className="form-control">
                    <option>Select a rule</option>
                </select>
            </div>
            <button className="btn btn-warning mt-3">Evaluate Rule</button>
        </div>
    );
};

export default EvaluateRule;
