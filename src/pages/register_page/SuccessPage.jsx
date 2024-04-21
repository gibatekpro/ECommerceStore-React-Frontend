import React from 'react';
import { Link } from 'react-router-dom';

function SuccessPage() {
    return (
        <div style={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f0f8ff',
            borderRadius: '8px',
            border: '1px solid #dcdcdc'
        }}>
            <h2 style={{ color: '#4caf50' }}>Registration Successful!</h2>
            <p style={{ fontSize: '16px', color: '#333' }}>
                A verification link has been sent to your email. Please check your inbox and click on the link to verify your account.
            </p>
            <p style={{ fontSize: '14px', color: '#333' }}>
                Once verified, you can proceed to log in.
            </p>
            <Link
                to="/login"
                style={{
                    textDecoration: 'none',
                    color: '#4caf50',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    border: '1px solid #4caf50',
                    borderRadius: '5px'
                }}
            >
                Go to Login
            </Link>
        </div>
    );
}

export default SuccessPage;