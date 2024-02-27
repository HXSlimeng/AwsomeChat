import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import ChatBox from "@/pages/Chat";
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
    path: PageEnum.Chat,
    element: <ChatBox></ChatBox>,
  },
  {
    path: PageEnum.Page404,
    element: <div>not found</div>,
  },
  {
    path: "/",
    element: <Navigate to={PageEnum.Chat}></Navigate>
  }
]);
