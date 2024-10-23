import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = (props) => {
  const [accessToken, setAccessToken] = useState(null);
  return (
    <AuthContext.Provider value={{accessToken, setAccessToken}}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
