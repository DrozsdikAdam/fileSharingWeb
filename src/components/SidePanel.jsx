import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { FaHouse } from "react-icons/fa6";
import { MdNotes } from "react-icons/md";
import { ThemeToggler } from "./ThemeToggler";

export const SidePanel = ({ setIsOpen, theme, setTheme }) => {
  return (
    <div className="h-screen p-4 flex flex-col items-center w-72">
      <div className="w-full text-right">
        <button
          className="cursor-pointer text-red-500 hover:scale-115 transition-all duration-200"
          onClick={() => setIsOpen(false)}
        >
          <IoClose size={30} color="red" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-between h-full w-full">
        <ul className="flex flex-col items-center w-full">
          <li className="list-item">
            <Link to="/" className="flex items-center justify-center gap-2">
              <FaHouse />
              <span title="Főoldal">Főoldal</span>
            </Link>
          </li>
          <li className="list-item">
            {" "}
            <Link
              to={"/notes"}
              className="flex items-center justify-center gap-2"
            >
              <MdNotes />
              <span title="Jegyzetek">Jegyzetek</span>
            </Link>
          </li>
        </ul>
        <div>
          <ThemeToggler theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </div>
  );
};
