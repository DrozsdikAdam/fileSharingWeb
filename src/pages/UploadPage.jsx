import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) navigate("/login");
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadFiles] = useState([]);

  const onDrop = async (acceptedFiles) => {
    setUploading(true);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: {
            authorization: `Bearer: ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (res.ok) setUploadFiles((prev) => [...prev, data]);
        else console.log("Hiba: ", data.error);
      } catch (err) {
        console.log("feltöltési hiba: ", err);
      }
    }
    setUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex items-center justify-center h-full">
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
        {uploading && (
          <p className="mt-4 text-blue-600">Feltöltés folyamatban…</p>
        )}
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
