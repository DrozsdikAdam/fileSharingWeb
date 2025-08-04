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
import { useMemo } from "react";

export const HomePage = () => {
  const initialFiles = [
    "asd.txt",
    "asd.docx",
    "asd.pptx",
    "asd.pdf",
    "asd.jpg",
    "asd.mp4",
    "asd.css.html.go.jsx.tsx.js.cs,cpp.c.asm.json",
    "asd.mp3",
    "asd.zip",
    "asd.ppt",
    "asd",
    "asd",
  ];

  const files = useMemo(() => {
    // A [...initialFiles] egy másolatot készít a tömbről, hogy az eredeti ne módosuljon.
    // A rendezés így a rövidebb nevűeket (kevesebb pontot tartalmazókat) teszi előre.
    return [...initialFiles].sort(
      (a, b) => a.split(".").length - b.split(".").length
    );
  }, []);

  const handleDownload = (index) => {
    alert(`download ${index}`);
  };
  const handleDelete = (index) => {
    alert(`delete ${index}`);
  };

  const selectIcons = (file) => {
    const extension = file.split(".")[file.split(".").length - 1];
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

  return (
    <div className="w-full h-full flex flex-col items-center overflow-auto">
      <h1 className="text-xl md:text-2xl font-semibold text-center">
        Feltöltött fájlok
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 w-full p-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="border-2 border-amber-500 overflow-hidden rounded-lg flex justify-center flex-col bg-indigo-900/30"
          >
            <div className="flex items-center justify-center w-full p-1">
              {selectIcons(file)}
            </div>
            <div className="p-1 text-gray-300" title={file}>
              {file}
            </div>
            <div className="flex justify-around w-full p-1.5">
              <TbFileDownload
                size={25}
                onClick={() => handleDownload(index)}
                className="mr-1.5 hover:text-blue-500/90 hover:scale-105 transition-all"
              />
              <TbTrash
                size={25}
                onClick={() => handleDelete(index)}
                className="hover:text-red-500/90 hover:scale-105 transition-all"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
