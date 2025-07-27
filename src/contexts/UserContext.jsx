import { createContext, useContext, useState } from "react";

const userContext = createContext(null);

export const useUser = () => useContext(userContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const login = async (email, password) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      const useremail = email;
      setUser(useremail);
      alert("sikeres");
    } else {
      alert("Hibás email vagy jelszó!");
    }
  };

  const logout = () => {
    alert("Sikeres kijelentkezés!");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <userContext.Provider value={{ user, login, logout }}>
      {children}
    </userContext.Provider>
  );
};
