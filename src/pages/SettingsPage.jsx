import { useEffect, useState } from "react";

export const SettingsPage = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <div className="h-full overflow-hidden lg:w-225 md:w-175 w-85 flex flex-col items-center text-center rounded-lg border-2 border-gray-400">
        <div className="w-full rounded-t-sm border-b-2 p-2 font-semibold border-gray-400 text-2xl">
          Beállítások
        </div>
        <div className="p-4 w-full h-full">
          <div className="w-full flex flex-row justify-between items-center text-xl">
            <p>Válassz témát:</p>
            <div className="grid grid-cols-2 gap-4 lg:gap-8">
              <button
                onClick={() => setTheme("light")}
                className="bg-gray-300 hover:scale-105 text-indigo-900 py-1 px-2 rounded-lg border-2 border-indigo-300 shadow-md shadow-gray-400 hover:bg-gray-400/95 transition-all duration-200"
              >
                Világos
              </button>
              <button
                onClick={() => setTheme("dark")}
                className="bg-gray-800 text-indigo-300 hover:scale-105 py-1 px-2 rounded-lg border-2 border-indigo-300 shadow-md shadow-gray-400  hover:bg-gray-600 transition-all duration-200"
              >
                Sötét
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
