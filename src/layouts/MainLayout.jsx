import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { SidePanel } from "../components/SidePanel";

export const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useOutletContext();

  return (
    <div className="flex h-screen w-full">
      {isOpen ? (
        <div className="w-72 border-r-2 border-gray-400 dark:border-gray-600 shadow-md shadow-gray-500 dark:shadow-gray-600">
          <SidePanel setIsOpen={setIsOpen} theme={theme} setTheme={setTheme} />
        </div>
      ) : (
        <div>
          <div
            className="animate-pulse cursor-pointer text-center hover:bg-gray-500/50 dark:hover:bg-gray-600 text-2xl p-4 rounded-r-xl my-2 shadow-lg shadow-gray-500 dark:shadow-gray-600 transition-all transition-discrete duration-200 border-2 border-indigo-900/80 dark:border-indigo-300 "
            onClick={() => setIsOpen(true)}
          >
            <LuMenu />
          </div>
        </div>
      )}

      <div
        className={`h-screen p-4 w-full items-start justify-center ${
          isOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};
