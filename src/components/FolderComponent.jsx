import { FaFolder } from "react-icons/fa";

export const FolderComponent = (props) => {
  const { currentFolder, setCurrentFolder, file } = props;
  const itemName = file.split("/")[0];

  const openFolder = (file) => {
    const newFolder = currentFolder ? `${currentFolder}/${file}` : file;
    setCurrentFolder(newFolder);
  };

  const goBack = () => {
    if (currentFolder === "") return;
    const parts = currentFolder.split("/");
    parts.pop();
    setCurrentFolder(parts.join("/"));
  };

  return (
    <div
      onDoubleClick={
        itemName.trim() === ".." ? goBack : () => openFolder(itemName)
      }
      className="w-full h-full"
    >
      <div className="flex items-center justify-center w-full p-1 hover:animate-pulse">
        <FaFolder size={65} className="my-2" />
      </div>
      <div
        className={`p-1 overflow-hidden ${
          itemName !== ".." ? "text-lg" : "font-bold text-3xl"
        }`}
        title={itemName === ".." ? "Vissza" : itemName}
      >
        {itemName}
      </div>
    </div>
  );
};
