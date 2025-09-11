import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AppContext = createContext();

function AppProvider({ children }) {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkToken = () => {
      if (authToken) {
        try {
          const decoded = jwtDecode(authToken);
          setUser(decoded);

          const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          setIsAdmin(role === "Admin");
          setIsUser(role === "User");

          const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          setUserId(id);
        } catch (err) {
          console.log(err.message);
          logout();
        }
      } else {
        setUser(null);
        setUserId(null);
        setIsAdmin(false);
        setIsUser(false);
      }
      setIsLoading(false); 
    };

    checkToken();
  }, [authToken]);

  function login(token) {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  }

  function logout() {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  }

  return (
    <AppContext.Provider
      value={{
        authToken,
        user,
        userId,
        isAdmin,
        isUser,
        login,
        logout,
        isLoading 
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
