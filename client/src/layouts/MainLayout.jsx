import { Outlet } from "react-router";
import Header from "./Header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="mt-14 bg-[#f7f4ed] h-screen font-primary">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
