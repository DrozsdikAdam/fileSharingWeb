import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { ImSpinner9 } from "react-icons/im";

export function UploadPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadFiles] = useState([]);
  const [error, setError] = useState(null);
  const [folders, setFolders] = useState([]);
  const [initialFiles, setInitialFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("/"); // Új állapot a kiválasztott mappának
  const [isLoading, setIsLoading] = useState(true);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploading(true);
      setError(null);

      const uploadPromises = acceptedFiles.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", selectedFolder); // A kiválasztott mappa hozzáadása

        return fetch("http://localhost:5000/api/files/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
          .then(async (res) => {
            // A then blokkot async-ként jelöljük, hogy használhassuk az await-et
            // Először ellenőrizzük, hogy a kérés sikeres volt-e (pl. 200 OK).
            if (!res.ok) {
              // Ha nem, akkor a válasz valószínűleg HTML vagy szöveg, nem JSON.
              // Olvassuk ki a választ szövegként, hogy lássuk a szerver hibaüzenetét.
              const errorText = await res.text();
              // Dobjunk egy informatívabb hibát.
              throw new Error(
                `HTTP hiba: ${res.status} - ${
                  res.statusText
                }. A szerver válasza: ${errorText.substring(0, 200)}...`
              );
            }

            // Ha a válasz sikeres volt, akkor próbáljuk meg JSON-ként feldolgozni.
            // A res.json() már eleve hibát dob, ha a formátum nem megfelelő,
            // amit a .catch() blokk elkap.
            return res.json();
          })
          .then((data) => {
            setUploadFiles((prev) => [...prev, data]);
          })
          .catch((err) => {
            console.error(
              `Feltöltési hiba a(z) ${file.name} fájlnál:`,
              err.message
            );
            setError(`Hiba a(z) ${file.name} feltöltésekor: ${err.message}`);
          });
      });

      // Megvárjuk, amíg az összes feltöltés befejeződik, majd kikapcsoljuk a "feltöltés" állapotot.
      Promise.allSettled(uploadPromises).finally(() => {
        setUploading(false);
      });
    },
    [token, selectedFolder] // Függőség hozzáadása
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/files", {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setInitialFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [token]);

  const makeFolders = useCallback(() => {
    const folderSet = new Set();

    initialFiles.forEach((file) => {
      // Csak a mappa részeket vesszük, a fájlnevet levágjuk
      const pathParts = file.split("/").slice(0, -1);

      if (pathParts.length > 0) {
        let currentPath = "";
        for (const part of pathParts) {
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          folderSet.add(currentPath);
        }
      }
    });

    // Gyűjtsük ki az összes almappa nevét (azaz nem a teljes útvonalát).
    // Például a 'szulomappa/gyerekmappa' útvonalból a 'gyerekmappa' nevet.
    const subfolderBaseNames = new Set();
    folderSet.forEach((path) => {
      if (path.includes("/")) {
        subfolderBaseNames.add(path.split("/").pop());
      }
    });

    // Szűrjük ki azokat a gyökérmappákat, amelyeknek a neve megegyezik egy
    // máshol létező almappa nevével. Ez a vizuális egyértelműséget szolgálja,
    // de elrejthet egy valós feltöltési célpontot, ha a gyökérben és egy
    // almappában is van azonos nevű mappa.
    const allPaths = Array.from(folderSet);
    const filteredPaths = allPaths.filter((path) => {
      const isRootFolder = !path.includes("/");
      // Ha ez egy gyökérmappa, és a neve szerepel az almappanevek között, akkor ne jelenítsük meg.
      if (isRootFolder && subfolderBaseNames.has(path)) {
        return false;
      }
      return true;
    });

    // A szűrt mappákat rendezzük név szerint.
    const sortedPaths = filteredPaths.sort();
    // Létrehozunk egy strukturált listát a legördülő menühöz, behúzásokkal.
    const structuredFolders = sortedPaths.map((path) => {
      const depth = path.split("/").length - 1;
      const folderName = path.split("/").pop();

      // A böngészők összenyomják a sima szóközöket, ezért "nem törhető szóközt" (nbsp) használunk a behúzás garantálásához.
      const indentation = "\u00A0\u00A0\u00A0".repeat(depth); // 3 "nem törhető szóköz" szintenként
      const prefix = depth > 0 ? "└─ " : ""; // Prefix hozzáadása az almappákhoz

      return { value: path, label: `${indentation}${prefix}📁 ${folderName}` };
    });

    setFolders(structuredFolders);
  }, [initialFiles]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchFiles();
  }, [token, navigate, fetchFiles]);

  useEffect(() => {
    if (initialFiles.length > 0) {
      makeFolders();
    }
  }, [initialFiles, makeFolders]);

  return (
    <div className="flex items-center flex-col justify-center h-full">
      {isLoading ? (
        <div className="flex">
          <ImSpinner9 size={50} className="transition-all animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p>Válaszd ki a mappát ahova fel szeretnéd tölteni a fájlokat!</p>
          <select
            name="folder-select"
            id="folder-select"
            className="p-2 my-2 rounded-md dark:bg-slate-700"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
          >
            <option value="/">📁 Főkönyvtár</option>
            {folders.map((folder) => (
              <option key={folder.value} value={folder.value}>
                {folder.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="w-75 h-75 border-2 rounded-md border-dashed border-indigo-900 dark:border-indigo-300 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height="70"
                width="70"
                fill="currentColor"
              >
                <path d="M1 14.5C1 12.1716 2.22429 10.1291 4.06426 8.9812C4.56469 5.044 7.92686 2 12 2C16.0731 2 19.4353 5.044 19.9357 8.9812C21.7757 10.1291 23 12.1716 23 14.5C23 17.9216 20.3562 20.7257 17 20.9811L7 21C3.64378 20.7257 1 17.9216 1 14.5ZM16.8483 18.9868C19.1817 18.8093 21 16.8561 21 14.5C21 12.927 20.1884 11.4962 18.8771 10.6781L18.0714 10.1754L17.9517 9.23338C17.5735 6.25803 15.0288 4 12 4C8.97116 4 6.42647 6.25803 6.0483 9.23338L5.92856 10.1754L5.12288 10.6781C3.81156 11.4962 3 12.927 3 14.5C3 16.8561 4.81833 18.8093 7.1517 18.9868L7.325 19H16.675L16.8483 18.9868ZM13 13V17H11V13H8L12 8L16 13H13Z"></path>
              </svg>
            </div>
          ) : (
            <div className="w-75 h-75 flex items-center justify-center">
              Drop your files here or click to browse
            </div>
          )}
        </div>
        {uploading && (
          <div className="flex">
            <ImSpinner9 size={50} className="transition-all animate-spin" />
          </div>
        )}
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold">Feltöltött fájlok:</h3>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.originalName || file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
