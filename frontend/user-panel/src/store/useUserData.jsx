'use client';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context
const UserContext = createContext();

// Create a context provider
export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  console.log(userData);
  const router = useRouter();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
      setUserData(userData);
    }
    // else {
    //   router.push('/auth/login');
    // }
  }, []);

  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

// Custom hook to consume the context
export const useUserData = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }

  return context;
};
