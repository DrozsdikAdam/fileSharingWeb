import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { UploadPage } from "./pages/UploadPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "notes",
        element: <AboutPage />,
      },
      {
        path: "upload",
        element: <UploadPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>{<RouterProvider router={router} />}</StrictMode>
);
