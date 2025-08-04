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

export const HomePage = () => {
  const files = [
    "asd.txt",
    "asd.docx",
    "asd.pptx",
    "asd.pdf",
    "asd.jpg",
    "asd.mp4",
    "asd.css.html.go.jsx.tsx.js.cs,cpp.c.asm.json",
    "asd.mp3",
    "asd.zip",
    "asd",
    "asd",
    "asd",
  ];

  //<FaFolder /> folder icon

  // <TbFileTypeDocx /> word
  // <TbFileTypeTxt /> txt
  // <TbFileTypePpt /> ppt
  // <TbFileTypeJpg /> img
  // <TbFileTypePdf /> pdf
  // <TbFileMusic /> hang
  // <BsFiletypeM4P /> video
  // <TbFileCode /> code
  // <TbFileTypeZip /> zip

  // <TbFileDownload /> download
  // <TbTrash /> trash

  const handleDownload = (index) => {
    alert("download", index);
  };
  const handleDelete = (index) => {
    alert("delete", index);
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
              <FaFolder size={50} className="my-2" />
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
