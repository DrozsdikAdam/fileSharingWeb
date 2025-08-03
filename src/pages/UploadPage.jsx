import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { PiSpinnerGapLight } from "react-icons/pi";
import { ImSpinner9 } from "react-icons/im";
import { ImSpinner } from "react-icons/im";

export function UploadPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) navigate("/login");
  const [uploading, setUploading] = useState(true);
  const [uploadedFiles, setUploadFiles] = useState([]);
  const [error, setError] = useState(null);

  const onDrop = (acceptedFiles) => {
    setUploading(true);
    setError(null);

    const uploadPromises = acceptedFiles.map((file) => {
      const formData = new FormData();
      formData.append("file", file);

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
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex items-center justify-center h-full">
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
            <PiSpinnerGapLight
              size={45}
              className="transition-all animate-spin"
            />
            <ImSpinner9 size={45} className="transition-all animate-spin" />
            <ImSpinner size={45} className="transition-all animate-spin" />
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
