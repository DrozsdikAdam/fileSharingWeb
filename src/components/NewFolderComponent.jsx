import { FaFolderPlus } from "react-icons/fa";

export const NewFolderComponent = (props) => {
  const {
    isNewFolder,
    setIsNewFolder,
    newFolderRef,
    fetchFiles,
    currentFolder,
    token,
  } = props;

  const newFolder = async () => {
    const folderName = newFolderRef.current.value.trim();
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
      newFolderRef.current.value = "";
      setIsNewFolder(true);
      await fetchFiles();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        onDoubleClick={() => setIsNewFolder(false)}
        className="w-full h-full p-0.5"
      >
        <div className="flex items-center justify-center w-full p-1 hover:animate-pulse">
          <FaFolderPlus size={!isNewFolder ? 40 : 65} className="my-2" />
        </div>
        <div className="p-1 overflow-hidden" title="Új mappa">
          <input
            ref={newFolderRef}
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
    </>
  );
};
