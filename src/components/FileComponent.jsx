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
import { ToastButtons } from "../components/ToastWithButtons";

export const FileComponent = (props) => {
  const { file, token, initialFiles, setInitialFiles, navigate } = props;

  async function handleDownload(file) {
    console.log(file);
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

      console.log(file);

      const url = await res.json();

      const fileName = file.split("/")[0].split("@&|")[1];
      console.log(fileName);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  }

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

  return (
    <>
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
    </>
  );
};
