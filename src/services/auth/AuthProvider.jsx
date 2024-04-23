import React, {createContext, useContext, useEffect, useState} from 'react';
import {Util} from "../../util/utils";
import {json} from "react-router-dom";

// Creating the auth context with default values
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(localStorage.getItem('user'));
    const [userProfile, setUserProfile] = useState(localStorage.getItem('userProfile'));
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    const login = async (email, password, callback) => {
        try {
            const response = await fetch(`${Util.apiUrl}account/login`, {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();
            if (response.ok) {
                setUser({id: data.id, token: data.token});
                if (data !== null) {
                    callback(data);
                    await fetchUserProfile(email, data.token);
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
        setUserProfile(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userProfile');

        alert("You have been logged out");
    };

    const checkTokenExpiration = (token) => {
        const decode = JSON.parse(atob(token.split('.')[1]));
        console.log(decode);
        console.log(`Time Expiry >>> ${decode.exp}`);
        if (decode.exp * 1000 < new Date().getTime()) {

            console.log('Time Expired');
        }
    };

    const value = {user, login, logout};


    const fetchUserProfile = async (email, token) => {

        const parsedUser = JSON.parse(user);

        setToken(token);

        setEmail(email);

        const baseUrl = `${Util.apiUrl}UserProfiles/getUserByEmail?email=${email}`;

        try {
            const response = await fetch(baseUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                let dataString = JSON.stringify(data);
                setUserProfile(dataString);
                localStorage.setItem('userProfile', dataString);
            } else {
                console.log("Failed to fetch user profile");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };


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