import { FaFolder } from "react-icons/fa";
import {
  TbFileTypeZip,
  TbTrash,
  TbFileDownload,
  TbFileTypeDocx,
  TbFileCode,
  TbFileMusic,
  TbFileTypeTxt,
  TbFileTypeJpg,
  TbFileTypePpt,
  TbFileTypePdf,
} from "react-icons/tb";
import { BsFiletypeM4P } from "react-icons/bs";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { FaFolderPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastButtons } from "../components/ToastWithButtons";

export const HomePage = () => {
  let token = localStorage.getItem("token");
  const navigate = useNavigate();
  const NewFolderRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState("");
  const [initialFiles, setInitialFiles] = useState([]);
  const [isNewFolder, setIsNewFolder] = useState(true);

  const selectIcons = (file) => {
    const extension = file
      .split(".")
      [file.split(".").length - 1].toString()
      .trim()
      .toLowerCase();

    switch (extension) {
      case "txt":
        return <TbFileTypeTxt size={50} className="my-2" />;
      case "docx":
        return <TbFileTypeDocx size={50} className="my-2" />;
      case "ppt":
      case "pptx":
        return <TbFileTypePpt size={50} className="my-2" />;
      case "pdf":
        return <TbFileTypePdf size={50} className="my-2" />;
      case "zip":
        return <TbFileTypeZip size={50} className="my-2" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "tiff":
      case "svg":
        return <TbFileTypeJpg size={50} className="my-2" />;
      case "mp4":
      case "avi":
      case "mkv":
        return <BsFiletypeM4P size={50} className="my-2" />;
      case "mp3":
      case "wav":
      case "ogg":
        return <TbFileMusic size={50} className="my-2" />;
      default:
        return <TbFileCode size={50} className="my-2" />;
    }
  };

  const openFolder = (file) => {
    const newFolder = currentFolder ? `${currentFolder}/${file}` : file;
    setCurrentFolder(newFolder);
  };

  const handleDownload = async (file) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/files/download/${file}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        // Optionally show a toast message about session expiration
        return;
      }
      if (!res.ok) throw new Error("Nem sikerült letölteni a fájlt!");

      const url = await res.json();

      const fileName = file.split("@&|")[1];

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (file) => {
    ToastButtons(
      () => deleteFile(file),
      () => alert(`törlés megszakítva`)
    );
  };

  const deleteFile = async (file) => {
    try {
      const res = await fetch(`http://localhost:5000/api/files/${file}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        // Optionally show a toast message about session expiration
        return;
      }
      if (res.ok) setInitialFiles(initialFiles.filter((f) => f !== file));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files", {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
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

  const newFolder = async () => {
    const folderName = NewFolderRef.current.value.trim();
    if (!folderName) return;

    if (folderName.includes("/") || folderName.includes("\\")) {
      alert("A mappa neve nem tartalmazhat perjelet!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/files/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          folderName: folderName,
          path: currentFolder,
        }),
      });
      if (!res.ok) {
        // Kezeljük a nem JSON hibaüzeneteket is
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Mappa létrehozása sikertelen.");
        } catch (jsonError) {
          throw new Error(
            `HTTP hiba: ${res.status} - ${res.statusText}. Szerver válasza: ${errorText}`
          );
        }
      }
      NewFolderRef.current.value = "";
      setIsNewFolder(true);
      await fetchFiles();
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    if (currentFolder === "") return;
    const parts = currentFolder.split("/");
    parts.pop();
    setCurrentFolder(parts.join("/"));
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
                    {/*Itt kezdődik az új mappa készítés */}
                    {file.split("/")[0] === "+" ? (
                      <div
                        onDoubleClick={() => setIsNewFolder(false)}
                        className="w-full h-full p-0.5"
                      >
                        <div className="flex items-center justify-center w-full p-1 hover:animate-pulse">
                          <FaFolderPlus
                            size={!isNewFolder ? 40 : 50}
                            className="my-2"
                          />
                        </div>
                        <div className="p-1 overflow-hidden" title="Új mappa">
                          <input
                            ref={NewFolderRef}
                            type="text"
                            disabled={isNewFolder}
                            className={`w-full rounded-sm text-lg font-medium p-0.5 placeholder:text-indigo-900 dark:placeholder:text-indigo-300 ${
                              isNewFolder ? null : "ring-2 ring-indigo-500"
                            }`}
                            placeholder="Új mappa neve"
                          />
                        </div>
                        {!isNewFolder && (
                          <div className="grid grid-cols-2 gap-2 w-full p-1.5">
                            <button
                              onClick={() => {
                                setIsNewFolder(true);
                                NewFolderRef.current.value = "";
                              }}
                              className="bg-red-500 text-black hover:rounded-md hover:bg-red-600 transition-all duration-200"
                            >
                              Elvetés
                            </button>
                            <button
                              onClick={newFolder}
                              className="bg-green-500 text-black hover:rounded-md hover:bg-green-600 transition-all duration-200"
                            >
                              Mentés
                            </button>
                          </div>
                        )}
                      </div>
                    ) : null}
                    {/*Itt ér véget az új mappa készítés */}

                    {/*itt kezdődik a két pont "visszalépés mappa" */}
                    {file.split("/")[0] === ".." ? (
                      <div onDoubleClick={goBack} className="w-full h-full">
                        <div className="flex items-center justify-center w-full p-1 hover:animate-pulse">
                          <FaFolder size={50} className="my-2" />
                        </div>
                        <div
                          className="p-1 font-bold text-3xl overflow-hidden"
                          title="Vissza"
                        >
                          {file.split("/")[0]}
                        </div>
                      </div>
                    ) : null}
                    {/*itt ér véget a két pont "visszalépés mappa" */}

                    {/*itt kezdődik a mappa kezelés */}
                    {file.split("/")[0].split(".").length === 1 &&
                    file.split("/")[0] !== "+" &&
                    file.split("/")[0] !== ".." ? (
                      <div
                        onDoubleClick={() => openFolder(file.split("/")[0])}
                        className="w-full h-full"
                      >
                        <div className="flex items-center justify-center w-full p-1 hover:animate-pulse">
                          <FaFolder size={50} className="my-2" />
                        </div>
                        <div
                          className="p-1  overflow-hidden"
                          title={file.split("/")[0]}
                        >
                          {file.split("/")[0]}
                        </div>
                      </div>
                    ) : null}
                    {/*itt ér véget a mappa kezelés */}

                    {/*itt kezdődik a fájl kezelés */}
                    {file.split("/")[0] !== ".." &&
                    file.split("/")[0] !== "+" &&
                    file.split("/")[0].split(".").length > 1 ? (
                      <div className="w-full h-full">
                        <div className="flex items-center justify-center w-full p-1 hover:animate-pulse">
                          {selectIcons(file.split("/")[0])}
                        </div>
                        <div
                          className="p-1 overflow-hidden"
                          title={file.split("/")[0].split("@&|")[1]}
                        >
                          {file.split("/")[0].split("@&|")[1]}
                        </div>

                        <div className="flex justify-around w-full p-1.5">
                          <TbFileDownload
                            title="Letöltés"
                            size={25}
                            onClick={() => handleDownload(file.split("/")[0])}
                            className="mr-1.5 hover:text-blue-500/90 hover:scale-105 transition-all"
                          />
                          <TbTrash
                            title="Törlés"
                            size={25}
                            onClick={() => handleDelete(file.split("/")[0])}
                            className="hover:text-red-500/90 hover:scale-105 transition-all"
                          />
                        </div>
                      </div>
                    ) : null}
                    {/*itt ér véget a fájl kezelés */}
                  </div>
                )
              );
            })}
        </div>
      )}
    </div>
  );
};
