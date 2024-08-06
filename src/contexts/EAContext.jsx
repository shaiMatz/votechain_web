/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';

export const EAContext = createContext();

export const EAProvider = ({ children }) => {
    const [EAs, setEAs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <EAContext.Provider value={{ EAs, setEAs, loading, setLoading, error, setError }}>
            {children}
        </EAContext.Provider>
    );
};
