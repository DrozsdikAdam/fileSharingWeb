import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const LoginButton = (props) => {
  const { user, logout } = useUser();
  return user ? (
    <button
      onClick={() => {
        logout();
        props.setIsOpen(false);
      }}
      className="w-full text-center text-xl py-2 rounded-md hover:scale-105 mb-4 border-2 dark:hover:border-indigo-300 hover:border-indigo-700 transition-all ease-in-out duration-100"
    >
      Kijelentkezés
    </button>
  ) : (
    <div className="w-full text-center text-xl py-2 rounded-md hover:scale-105 mb-4 border-2 dark:hover:border-indigo-300 hover:border-indigo-700 transition-all ease-in-out duration-100">
      <Link to={"/login"}>Bejelentkezés</Link>
    </div>
  );
};
