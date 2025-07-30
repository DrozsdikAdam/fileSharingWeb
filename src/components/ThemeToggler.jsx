export const ThemeToggler = ({ theme, setTheme }) => {
  return (
    <div className="w-full flex flex-row justify-between items-center text-xl">
      <div className="grid grid-cols-2 gap-4 lg:gap-8">
        <button
          onClick={() => setTheme("light")}
          className={` hover:scale-105 text-indigo-900 py-1 px-2 rounded-lg border-2 shadow-md shadow-gray-500 hover:bg-gray-400/95 transition-all duration-200 ${
            theme === "light"
              ? "border-indigo-500/80 bg-gray-500/30"
              : "border-indigo-300 bg-gray-400"
          }`}
        >
          Világos
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`bg-gray-800 text-indigo-300 hover:scale-105 py-1 px-2 rounded-lg border-2  shadow-md shadow-gray-500  hover:bg-gray-600 transition-all duration-200 ${
            theme === "dark" ? "border-blue-600" : "border-indigo-300"
          }`}
        >
          Sötét
        </button>
      </div>
    </div>
  );
};
