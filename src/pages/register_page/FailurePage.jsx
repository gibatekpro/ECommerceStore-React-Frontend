import React from 'react';
import { Link } from 'react-router-dom';

function FailurePage() {
    return (
        <div style={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#ffe6e6',
            borderRadius: '8px',
            border: '1px solid #ff6666'
        }}>
            <h2 style={{ color: '#ff3333' }}>Registration Failed!</h2>
            <p style={{ fontSize: '16px', color: '#333' }}>
                Something went wrong during the registration process. Please try again.
            </p>
            <Link
                to="/register"
                style={{
                    textDecoration: 'none',
                    color: '#ff3333',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    border: '1px solid #ff3333',
                    borderRadius: '5px'
                }}
            >
                Try Again
            </Link>
        </div>
    );
}

export default FailurePage;