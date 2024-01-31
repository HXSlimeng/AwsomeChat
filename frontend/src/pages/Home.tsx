import { Outlet } from "react-router";

export default function Home() {
  return (
    <div>
      <header>this is home header</header>
      <Outlet></Outlet>
    </div>
  );
}
