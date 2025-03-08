import { JSX } from "react";
import { FaRegChartBar } from "react-icons/fa";
import { HiOutlineChartPie } from "react-icons/hi";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { RiFunctionAddLine } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";

type PropsINavbar = {
  text: string;
  path: string;
  icon: JSX.Element;
}[];

const navItems: PropsINavbar = [
  { text: "Store", path: "/store", icon: <MdOutlineMapsHomeWork /> },
  { text: "SKU", path: "/sku", icon: <RiFunctionAddLine /> },
  { text: "Planning", path: "/planning", icon: <FaRegChartBar /> },
  { text: "Charts", path: "/charts", icon: <HiOutlineChartPie /> },
];

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar items={navItems} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
