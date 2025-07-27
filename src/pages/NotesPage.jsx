import { useUser } from "../contexts/UserContext";
import { IoClose } from "react-icons/io5";
import { BsPlusCircle } from "react-icons/bs";

export const NotesPage = () => {
  const { user } = useUser();

  const notes = [
    {
      note: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, voluptates!",
      time: 19,
    },
    {
      note: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, voluptates!  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, voluptates!",
      time: 5,
    },
    {
      note: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, voluptates!",
      time: 7,
    },
    {
      note: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, voluptates!",
      time: 2,
    },
  ];

  const handleDelete = (index) => {
    alert(index);
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-4 text-center">
        Jegyzetek
      </h1>

      <div className="w-250">
        <ul className="flex flex-col text-lg justify-between items-center">
          {user &&
            notes.map((note, index) => (
              <li
                key={index}
                className="grid mb-2 grid-cols-5 gap-2 hover:bg-gray-500/10 dark:hover:bg-gray-600/50 p-2 w-full border-b-2 border-indigo-900 dark:border-indigo-300 shadow-lg dark:hover:shadow-indigo-300/30 hover:shadow-indigo-900/30"
              >
                <div className="col-span-4 text-left">{note.note}</div>

                <div className="col-span-1 text-right flex justify-around items-center">
                  {note.time}

                  <button
                    onClick={() => handleDelete(index)}
                    className="hover:scale-110"
                  >
                    <IoClose size={30} color="red" />
                  </button>
                </div>
              </li>
            ))}
          <li className="flex items-center shadow-lg justify-center hover:bg-gray-500/10 dark:hover:bg-gray-600 hover:scale-101 font-semibold mt-4 p-2 w-full border-2 rounded-lg  border-indigo-900 dark:border-indigo-300">
            <BsPlusCircle size={25} />
          </li>
        </ul>
      </div>
    </div>
  );
};
