import { createContext, useContext, useState } from "react";

const userContext = createContext(null);

export const useUser = () => useContext(userContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      const userObject = { email, password };
      setUser(userObject);
    } else {
      Alert("Hibás email vagy jelszó!");
    }
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
