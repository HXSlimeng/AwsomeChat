import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/routes/index";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
document.body.setAttribute("theme-mode", "dark");
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
