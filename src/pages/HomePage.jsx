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
    "asd.jpg",
    "asd.css.html.go.jsx.tsx.js.cs,cpp.c.asm.json",
    "asd",
    "asd",
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

  return (
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-xl md:text-2xl font-semibold text-center">
        Feltöltött fájlok
      </h1>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 w-full p-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="border-2 border-amber-500 overflow-hidden p-2 rounded-lg flex justify-center flex-col "
          >
            {file}
          </div>
        ))}
      </div>
    </div>
  );
};
