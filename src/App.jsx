import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserProvider } from "./contexts/UserContext";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <UserProvider>
        <div className="flex h-screen bg-gray-300 dark:bg-gray-800 text-indigo-900 dark:text-indigo-300 transition-all duration-300">
          <Outlet context={{ theme, setTheme }} />
        </div>
      </UserProvider>
    </>
  );
}

export default App;
