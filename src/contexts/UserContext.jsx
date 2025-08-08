import { createContext, useContext, useEffect, useState } from "react";

const userContext = createContext(null);

export const useUser = () => useContext(userContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Hibás email vagy jelszó!");
        return false;
      }

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.token);
        return true;
      }
    } catch (error) {
      console.error("Bejelentkezési hiba:", error);
      alert("Hiba történt a bejelentkezés során.");
    }
    return false;
  };

  const logout = () => {
    alert("Sikeres kijelentkezés!");
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(token);
    }
  }, []);

  return (
    <userContext.Provider value={{ user, login, logout }}>
      {children}
    </userContext.Provider>
  );
};
