
import React, { createContext, useState } from 'react';

export const VotingPermissionContext = createContext();

export const VotingPermissionProvider = ({ children }) => {
    const [hasVotingPermission, setHasVotingPermission] = useState(false);

    return (
        <VotingPermissionContext.Provider value={{ hasVotingPermission, setHasVotingPermission }}>
            {children}
        </VotingPermissionContext.Provider>
    );
};
