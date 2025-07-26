import { createContext, useContext, useState } from "react";

const userContext = createContext(null);

export const useUser = () => useContext(userContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const login = (email, password) => {
    const userObject = { email, password };
    setUser(userObject);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <userContext.Provider value={{ user, login, logout }}>
      {children}
    </userContext.Provider>
  );
};
