export const ThemeToggler = ({ setTheme }) => {
  return (
    <>
      {" "}
      <div className="w-full flex flex-row justify-between items-center text-xl">
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
    </>
  );
};
