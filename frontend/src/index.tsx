import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/routes/index";
import { utilsContext } from "./provider/utils";
import "./App.css";
import dayjs from "dayjs";

const root = ReactDOM.createRoot(document.getElementById("root")!);
document.body.setAttribute("theme-mode", "dark");
root.render(
  <React.StrictMode>
    <utilsContext.Provider value={dayjs}>
      <RouterProvider router={router}></RouterProvider>
    </utilsContext.Provider>
  </React.StrictMode>
);
