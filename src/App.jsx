import { Outlet } from "react-router-dom";

import { SidePanel } from "./components/SidePanel";

function App() {
  return (
    <>
      <div className="flex h-screen bg-gray-300 dark:bg-gray-800 text-indigo-900 dark:text-indigo-300">
        <div className="w-72 border-r-2 border-gray-400 dark:border-gray-600 shadow-md shadow-gray-500 dark:shadow-gray-600">
          <SidePanel />
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default App;
