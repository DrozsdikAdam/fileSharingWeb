import { Outlet } from "react-router-dom";
import { LuMenu } from "react-icons/lu";

import { SidePanel } from "./components/SidePanel";
import { useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-gray-300 dark:bg-gray-800 text-indigo-900 dark:text-indigo-300 transition-all duration-300 transform-border ">
        {isOpen ? (
          <div
            className={`w-72 border-r-2 border-gray-400 dark:border-gray-600 shadow-md shadow-gray-500 dark:shadow-gray-600`}
          >
            <SidePanel setIsOpen={setIsOpen} />
          </div>
        ) : (
          <div>
            <div
              className="animate-pulse cursor-pointer text-center hover:bg-gray-500/50 dark:hover:bg-gray-600 text-2xl p-4 rounded-r-xl my-2 shadow-lg shadow-gray-500 dark:shadow-gray-600 transition-all transition-discrete duration-200 border-2 border-indigo-300"
              onClick={() => setIsOpen(true)}
            >
              <LuMenu />
            </div>
          </div>
        )}
        <div className="h-screen p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
