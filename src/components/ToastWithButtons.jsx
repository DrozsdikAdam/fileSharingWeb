import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastButtons(onConfirm, onCancel) {
  toast(
    <div className="w-full text-lg bg-gray-400/50 text-indigo-900 dark:bg-gray-700 p-4 rounded-lg dark:text-indigo-300">
      <p className="font-semibold mb-2">Biztosan törlöd?</p>
      <div className="w-full flex justify-around gap-2">
        <button
          className="px-3 py-1  bg-red-500 text-white rounded font-semibold hover:bg-red-600 hover:scale-105 transition-all duration-200"
          onClick={() => {
            toast.dismiss();
            onConfirm();
          }}
        >
          Igen
        </button>
        <button
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400/50 text-gray-900 font-semibold hover:scale-105 transition-all duration-200"
          onClick={() => {
            toast.dismiss();
            onCancel();
          }}
        >
          Nem
        </button>
      </div>
    </div>,
    {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    }
  );
}
