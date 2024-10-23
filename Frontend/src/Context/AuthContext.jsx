import { createContext, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const AuthProvider = (props) => {
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
