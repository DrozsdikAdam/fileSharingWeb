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
import { useEffect, useMemo, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { ToastButtons } from "../components/ToastWithButtons";

export const HomePage = () => {
  var token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [initialFiles, setInitialFiles] = useState([]);

  const selectIcons = (file) => {
    const extension = file
      .split(".")
      [file.split(".").length - 1].toString()
      .trim()
      .toLowerCase();
    const parts = file.split(".");

    if (parts.length === 1) return <FaFolder size={50} className="my-2" />;

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
    alert(`opening folder: ${file}`);
  };

  const handleDownload = (index) => {
    alert(`download ${index}`);
  };

  const handleDelete = async (file) => {
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
      const data = await res.json();
      setInitialFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const files = useMemo(() => {
    // A rendezés a mappákat (feltételezve, hogy nincs bennük pont) előre helyezi.
    return [...initialFiles].sort(
      (a, b) => a.split(".").length - b.split(".").length
    );
  }, [initialFiles]);

  useEffect(() => {
    token = localStorage.getItem("token");
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
            files.map((file, index) => (
              <div
                key={index}
                className="shadow-md shadow-indigo-800 hover:scale-105 hover:shadow-indigo-700 border-2 border-purple-700 hover:shadow-lg transition-all overflow-hidden rounded-lg flex justify-center flex-col p-0.5 dark:bg-indigo-900/30"
                {...(file.split(".").length === 1
                  ? { onDoubleClick: () => openFolder(file) }
                  : null)}
              >
                <div className="flex items-center justify-center w-full p-1 hover:animate-pulse">
                  {selectIcons(file)}
                </div>
                <div className="p-1 overflow-hidden" title={file}>
                  {file.split("@&|")[1]}
                </div>
                {file.split(".").length === 1 ? null : (
                  <div className="flex justify-around w-full p-1.5">
                    <TbFileDownload
                      title="Letöltés"
                      size={25}
                      onClick={() => handleDownload(file)}
                      className="mr-1.5 hover:text-blue-500/90 hover:scale-105 transition-all"
                    />
                    <TbTrash
                      title="Törtés"
                      size={25}
                      onClick={() => handleDelete(file)}
                      className="hover:text-red-500/90 hover:scale-105 transition-all"
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
