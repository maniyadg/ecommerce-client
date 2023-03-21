import React , { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [accessToken, setaccessToken] = useState({
    user: null,
    token: "",
  });

  //default axios
  axios.defaults.headers.common["Authorization"] = accessToken.token;
  
  useEffect(() => {
    const data = localStorage.getItem('accessToken')
    if (data) {
      const parseData = JSON.parse(data);
      setaccessToken({
        ...accessToken,
        user: parseData.user,
        token: parseData.token,
      });
    }
        //eslint-disable-next-line
  }, []);
  return (
    <AuthContext.Provider value={[accessToken, setaccessToken]}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };