import React, { createContext, useState, useContext, useEffect } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [curRole, setCurRole] = useState('cp'); // 'cp', 'fan', 'act'

  // Update body class when role changes, to mirror the original vanilla CSS scoping
  useEffect(() => {
    document.body.className = `role-${curRole}`;
  }, [curRole]);

  return (
    <RoleContext.Provider value={{ curRole, setCurRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
