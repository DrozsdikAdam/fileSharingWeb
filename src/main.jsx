import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
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
            element: <AboutPage />,
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
  <StrictMode>{<RouterProvider router={router} />}</StrictMode>
);
