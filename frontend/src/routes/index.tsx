import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import { PageEnum } from "@/enum/route";

export default createBrowserRouter([
  {
    path: PageEnum.Login,
    element: <Login></Login>,
  },
  {
    path: PageEnum.Home,
    element: <Home></Home>,
  },
  {
    path: PageEnum.Page404,
    element: <div>not found</div>,
  },
]);
