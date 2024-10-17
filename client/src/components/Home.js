// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

const Home = () => {
    const navigate = useNavigate();

    const goTo = (path) => {
        navigate(path);  // Navigates to the given path
    };

    return (
        <div className="home-container position-relative">
            <div className="circle-wrapper">
                {[...Array(10)].map((_, i) => (
                    <div className="black-circle" key={i}></div>
                ))}
            </div>
            <div className="home-content text-center">
                <button onClick={() => goTo('/create-rule')} className="btn btn-primary mx-2">Create Rule</button>
                <button onClick={() => goTo('/combine-rule')} className="btn btn-success mx-2">Combine Rules</button>
                <button onClick={() => goTo('/evaluate-rule')} className="btn btn-warning mx-2">Evaluate Rule</button>
            </div>
        </div>
    );
};

export default Home;
