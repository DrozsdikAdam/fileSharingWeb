import { useEffect, useMemo, useRef, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { FolderComponent } from "../components/FolderComponent";
import { FileComponent } from "../components/FileComponent";
import { NewFolderComponent } from "../components/NewFolderComponent";

export const HomePage = () => {
  let token = localStorage.getItem("token");
  const navigate = useNavigate();
  const newFolderRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState("");
  const [initialFiles, setInitialFiles] = useState([]);
  const [isNewFolder, setIsNewFolder] = useState(true);

  const fetchFiles = async () => {
    try {
      const res = await fetch(
        "https://filesharingbackend-rbmf.onrender.com/api/files",
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        // Optionally show a toast message about session expiration
        return;
      }
      if (!res.ok) {
        // Throw an error to be caught by the catch block, this handles 403 and other errors
        const errorBody = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, body: ${errorBody}`
        );
      }
      const data = await res.json();
      // Defensively ensure the data is an array before setting state
      setInitialFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const files = useMemo(() => {
    // A rendezés a mappákat (feltételezve, hogy nincs bennük pont) előre helyezi.
    const directChildren = new Set();

    initialFiles.forEach((file) => {
      // Ha a gyökérkönyvtárban vagyunk
      if (currentFolder === "") {
        // Az útvonal első részét adjuk hozzá (ez lehet egy mappa vagy egy fájl a gyökérben)
        directChildren.add(file.split("/")[0]);
      } else {
        // Ha egy almappában vagyunk, ellenőrizzük, hogy a fájl a jelenlegi mappával kezdődik-e
        const prefix = currentFolder + "/";
        if (file.startsWith(prefix)) {
          // Levágjuk a jelenlegi mappa útvonalát, hogy megkapjuk a relatív útvonalat
          const restOfPath = file.substring(prefix.length);
          // Hozzáadjuk a következő mappát vagy fájlnevet
          directChildren.add(restOfPath.split("/")[0]);
        }
      }
    });
    directChildren.add("+");
    if (currentFolder !== "") {
      directChildren.add("..");
    }
    // Elemek rendezése: +, .., mappák, fájlok
    return Array.from(directChildren).sort((a, b) => {
      const getItemType = (item) => {
        if (item === "+") return 0; // Új mappa gomb
        if (item === "..") return 1; // Visszalépés
        if (!item.includes(".")) return 2; // Mappa (nincs benne pont)
        return 3; // Fájl
      };

      const typeA = getItemType(a);
      const typeB = getItemType(b);

      if (typeA !== typeB) {
        return typeA - typeB;
      }

      return a.localeCompare(b);
    });
  }, [initialFiles, currentFolder]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchFiles();
  }, [token, navigate]);

  return (
    <div className="w-full h-full flex flex-col items-center overflow-auto">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-2">
        Feltöltött fájlok
      </h1>

      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="flex">
            <ImSpinner9 size={60} className="transition-all animate-spin" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5 w-full p-4">
          {token &&
            files.map((file, index) => {
              return (
                file.split("/")[0] !== "" && (
                  <div
                    key={index}
                    className="shadow-md shadow-indigo-800 hover:scale-105 hover:shadow-indigo-700 border-2 border-purple-700 hover:shadow-lg transition-all overflow-hidden rounded-lg flex justify-center flex-col dark:bg-indigo-900/30"
                  >
                    {file.split("/")[0] === "+" ? (
                      /*Itt van az új mappa készítés */
                      <NewFolderComponent
                        isNewFolder={isNewFolder}
                        setIsNewFolder={setIsNewFolder}
                        newFolderRef={newFolderRef}
                        fetchFiles={fetchFiles}
                        currentFolder={currentFolder}
                        token={token}
                      />
                    ) : file.split("/")[0].split(".").length === 1 ||
                      file.split("/")[0] === ".." ? (
                      /*itt van a mappa kezelés */
                      <FolderComponent
                        file={file}
                        currentFolder={currentFolder}
                        setCurrentFolder={setCurrentFolder}
                      />
                    ) : (
                      /*itt van a fájl kezelés */
                      <FileComponent
                        file={file}
                        token={token}
                        initialFiles={initialFiles}
                        setInitialFiles={setInitialFiles}
                        navigate={navigate}
                      />
                    )}
                  </div>
                )
              );
            })}
        </div>
      )}
    </div>
  );
};
