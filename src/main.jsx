import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { NotesPage } from "./pages/NotesPage.jsx";
import { UploadPage } from "./pages/UploadPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { MainLayout } from "./layouts/MainLayout.jsx";
import { AuthLayout } from "./layouts/AuthLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "notes",
            element: <NotesPage />,
          },
          {
            path: "upload",
            element: <UploadPage />,
          },
        ],
      },
      {
        path: "login",
        element: <AuthLayout />,
        children: [{ index: true, element: <LoginPage /> }],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </StrictMode>
);
