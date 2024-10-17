import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

const CreateRule = () => {
    const [ruleName, setRuleName] = useState('');
    const [rule, setRule] = useState('');
    const [createdRule, setCreatedRule] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    const handleCreateRule = () => {
        setCreatedRule({ ruleName, rule });
        setShowAlert(true);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Create Rule</h2>
            <div className="row">
                <div className="col-md-3">
                    <h5>Options</h5>
                    <ul className="list-group">
                        <li className="list-group-item">Create Rule</li>
                        <li className="list-group-item">Combine Rules</li>
                        <li className="list-group-item">Evaluate Rule</li>
                    </ul>
                </div>
                <div className="col-md-9">
                    <div className="form-group">
                        <label>Rule Name</label>
                        <input type="text" className="form-control" value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
                    </div>
                    <div className="form-group mt-2">
                        <label>Rule</label>
                        <input type="text" className="form-control" value={rule} onChange={(e) => setRule(e.target.value)} />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleCreateRule}>Create Rule</button>
                    {showAlert && <Alert variant="success" className="mt-3">Rule Created Successfully!</Alert>}
                    {createdRule && (
                        <div className="mt-4">
                            <h5>Created Rule:</h5>
                            <p>Rule Name: {createdRule.ruleName}</p>
                            <p>Rule: {createdRule.rule}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateRule;
