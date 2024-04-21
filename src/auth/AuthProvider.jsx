import React, { createContext, useContext, useState } from 'react';
import {Util} from "../util/utils";

// Creating the auth context with default values
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('user'));

    const login = async (email, password, callback) => {
        try {
            const response = await fetch(`${Util.apiUrl}account/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (response.ok) {
                setUser({ id: data.id, token: data.token });
                if (data !== null){
                    callback(data);
                }
            } else {
                throw new Error(data.message || 'Authentication failed');
            }
        } catch (error) {
            console.error("Login Error: ", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = { user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export function useAuth() {
    return React.useContext(AuthContext);
}
