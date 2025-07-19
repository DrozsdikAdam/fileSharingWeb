import { IoClose } from "react-icons/io5";

export const SidePanel = (props) => {
  return (
    <div className="h-screen fixed p-4 flex flex-col items-center w-72">
      <div className="w-full text-right">
        <button
          className="cursor-pointer text-red-500"
          onClick={() => props.setIsOpen(false)}
        >
          <IoClose size={30} color="red" />
        </button>
      </div>

      <ul className="flex flex-col items-center">
        <li className="list-item">Főoldal</li>
        <li className="list-item">Jegyzetek</li>
        <li className="list-item">asd</li>
        <li className="list-item">asd</li>
      </ul>
    </div>
  );
};
