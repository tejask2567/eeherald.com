import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // Initialize auth state from local storage
    const [auth, setAuth] = useState(() => {
        const username = localStorage.getItem("username");
        const roles = localStorage.getItem("roles");
        return  { username, roles }  // Return an object if token exists
    });

    // Persist auth state to local storage whenever it changes
    useEffect(() => {
        if (auth.username && auth.roles) {
            localStorage.setItem("username", auth.username);
            localStorage.setItem("roles", auth.roles);
        } else {
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
