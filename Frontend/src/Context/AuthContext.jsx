import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const AuthProvider = (props) => {
  const [accessToken, setAccessToken] = useState(() => {
    return Cookies.get("accessToken") || null;
  });
  const updateAccessToken = (token) => {
    setAccessToken(token);
    if (token) {
      Cookies.set("accessToken", token); // Save token to local storage
    }
  };

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setAccessToken(token); // Update state if token exists
    }
  }, []);

  console.log(accessToken);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, updateAccessToken }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
