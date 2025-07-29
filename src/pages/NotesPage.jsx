import { useUser } from "../contexts/UserContext";
import { IoClose } from "react-icons/io5";
import { BsPlusCircle } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";

export const NotesPage = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const textRef = useRef();
  const token = localStorage.getItem("token");

  const [notes, setNotes] = useState([
    {
      note: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, voluptates!",
      time: "2025.02.17 14:57",
      active: true,
    },
    {
      note: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, voluptates!  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, voluptates!",
      time: "2025.02.17 14:57",
      active: true,
    },
    {
      note: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, voluptates!",
      time: "2025.02.17 14:57",
      active: true,
    },
    {
      note: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis, voluptates!",
      time: "2025.02.17 14:57",
      active: true,
    },
  ]);

  const fetchNotes = async () => {
    if (!user) return;
    const res = await fetch("/api/notes", {
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    });
    const data = await res.json();
    setNotes(data);
  };

  const handleDelete = (index) => {
    var arr = [...notes];
    arr.splice(index, 1);
    setNotes(arr);
  };

  const completedNote = (index) => {
    var arr = [...notes];
    arr[index].active = !arr[index].active;
    setNotes(arr);
  };

  const newNote = () => {
    let text = textRef.current.value.trim();
    if (text.length === 0) return;
    var arr = [...notes];
    arr.push({
      note: text,
      time: new Date().toLocaleString(),
      active: true,
    });
    setNotes(arr);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold pb-4 text-center">
        {isOpen ? "Új jegyzet" : "Jegyzetek"}
      </h1>

      <div className="w-90 md:w-150 lg:w-230">
        {isOpen ? (
          <div className="flex justify-center flex-col items-center">
            <textarea
              name="textarea"
              ref={textRef}
              placeholder="Adj meg egy jegyzetet..."
              className="resize-none md:w-1/2 w-10/12 border-2 p-4 rounded-lg border-indigo-900 dark:border-indigo-300 focus:outline-none"
              rows={16}
              id="textarea"
            ></textarea>
            <div className="flex md:w-1/2 w-10/12  items-center justify-around mt-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hover:bg-gray-500/10 dark:hover:bg-gray-600/50 border-2 px-4 text-xl font-semibold py-1 rounded-lg border-indigo-900 dark:border-indigo-300 hover:scale-105 transition-all duration-200 ease-in-out"
              >
                Vissza
              </button>
              <button
                onClick={() => newNote()}
                className="hover:bg-gray-500/10 dark:hover:bg-gray-600/50 border-2 px-4 text-xl font-semibold py-1 rounded-lg border-indigo-900 dark:border-indigo-300 hover:scale-105 transition-all duration-200 ease-in-out"
              >
                Mentés
              </button>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col text-lg justify-between items-center">
            {user &&
              notes.map((note, index) => (
                <li
                  key={index}
                  className="grid mb-2 grid-cols-4 lg:grid-cols-5 gap-1 hover:bg-gray-500/10 dark:hover:bg-gray-600/50 p-2 w-full border-b-2 border-indigo-900 dark:border-indigo-300 shadow-lg dark:hover:shadow-indigo-300/30 hover:shadow-indigo-900/30"
                >
                  <div
                    onClick={() => completedNote(index)}
                    className={`lg:col-span-4 col-span-3 ${
                      note.active ? null : "line-through"
                    }`}
                  >
                    {note.note}
                  </div>

                  <div className="col-span-1 text-right flex justify-around items-center">
                    <div className="flex h-full items-end">
                      <span className="text-sm text-gray-600/80 dark:text-gray-400">
                        {note.time}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(index)}
                      className="hover:scale-110"
                    >
                      <IoClose size={30} color="red" />
                    </button>
                  </div>
                </li>
              ))}
            <li
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center shadow-lg justify-center hover:bg-gray-500/10 dark:hover:bg-gray-600 hover:scale-101 font-semibold mt-4 p-2 w-full border-2 rounded-lg  border-indigo-900 dark:border-indigo-300"
            >
              <BsPlusCircle size={25} />
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
