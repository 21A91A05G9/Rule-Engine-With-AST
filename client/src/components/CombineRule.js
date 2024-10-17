import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

const CombineRule = () => {
    const [combinedRule, setCombinedRule] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleCombineRule = () => {
        setShowAlert(true);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Combine Rules</h2>
            <div className="form-group">
                <label>Rule Name</label>
                <input type="text" className="form-control" />
            </div>
            <div className="form-group mt-2">
                <label>Rule</label>
                <input type="text" className="form-control" />
            </div>
            <button className="btn btn-success mt-3" onClick={handleCombineRule}>Combine Rule</button>
            {showAlert && <Alert variant="success" className="mt-3">Rules Combined Successfully!</Alert>}
        </div>
    );
};

export default CombineRule;
