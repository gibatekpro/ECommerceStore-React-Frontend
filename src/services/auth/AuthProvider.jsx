import React, {createContext, useContext, useEffect, useState} from 'react';
import {Util} from "../../util/utils";
import {json, useNavigate} from "react-router-dom";
import {useLocation} from "react-router-dom";

// Creating the auth context with default values
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(localStorage.getItem('user'));
    const [userProfile, setUserProfile] = useState(localStorage.getItem('userProfile'));
    const [token, setToken] = useState(localStorage.getItem('userProfile'));
    const [tokenExpired, setTokenExpired] = useState(false);
    const [email, setEmail] = useState('');

    let location = useLocation();

    let navigate = useNavigate();

    useEffect(() => {

        if (user != null){
            checkTokenExpiration();
            checkRoles();
        }

    }, [location]);

    const login = async (email, password, callback) => {
        try {
            const response = await fetch(`${Util.apiUrl}account/login`, {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();
            if (response.ok) {
                let userData = {id: data.id, token: data.token}

                //I am saving the user as a string
                let userDataString = JSON.stringify(userData);

                setUser(userDataString);
                if (data !== null) {
                    callback(userDataString);
                    localStorage.setItem("token", data.token);
                    await fetchUserProfile(email, data.token);
                    checkRoles();
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
        localStorage.removeItem("token");
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userRoles');

        alert("You have been logged out");
    };

    const checkRoles = () => {

        if (user) {
            const jsonUser = JSON.parse(user);
            const theToken = jsonUser.token;

            if (theToken) {
                const decodedPayload = JSON.parse(atob(theToken.split('.')[1]));

                const roles = decodedPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decodedPayload.roles;

                if (roles) {

                    localStorage.setItem('userRoles', roles);

                    console.log(`Roles: ${roles}`);
                } else {
                    console.log("No roles found in the token.");
                }
            } else {
                console.error("Invalid token.");
            }
        } else {
            console.error("User is null.");
        }

    }

    const checkTokenExpiration = () => {


        if (user != null) {

            let jsonUser = JSON.parse(user);

            let theToken = jsonUser.token;

            const decode = JSON.parse(atob(theToken.split('.')[1]));

            let expiry = decode.exp * 1000;

            let expiration = new Date(expiry).toUTCString();
            let currentTime = new Date(new Date().getTime()).toUTCString();

            console.log(`Token Expiration time = ${expiration}  \nCurrent time = ${currentTime}`)

            if (expiry < new Date().getTime()) {


                setTokenExpired(true);
                logout();
                console.log('Token expired');

            }
        }

    };

    const value = {user, token, tokenExpired, login, logout, checkTokenExpiration};


    const fetchUserProfile = async (email, token) => {

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
