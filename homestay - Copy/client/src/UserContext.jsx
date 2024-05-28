import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

// Create a context
export const UserContext = createContext({});

// Create a provider component
export function UserContextProvider({ children }) {
    // Define state to hold user information
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    // Define function to update user information
    //const updateUser = (userData) => {
    //  setUser(userData);
    //};

    // Context value to be provided
    //const contextValue = {
    //  user: user,
    //  updateUser: updateUser
    //};
    useEffect(() => {
        if (!user) {
            axios.get('/profile').then(({ data }) => {
                setUser(data);
                setReady(true);
            });
        }
    }, []);
    return (
        // Provide context value to children
        //<UserContext.Provider value={contextValue}>
        <UserContext.Provider value={{ user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    );
}
