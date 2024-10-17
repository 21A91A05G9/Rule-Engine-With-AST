import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateRule from './components/CreateRule';
import CombineRule from './components/CombineRule';
import EvaluateRule from './components/EvaluateRule';
import './styles/main.css';  // Make sure you have the styles applied globally

const App = () => {
    return (
        <Router>
            <div className="app-container">
        
                <Routes>
                    
                    <Route path="/" element={<Home />} />

                    <Route path="/create-rule" element={<CreateRule />} />
                    <Route path="/combine-rule" element={<CombineRule />} />
                    <Route path="/evaluate-rule" element={<EvaluateRule />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
