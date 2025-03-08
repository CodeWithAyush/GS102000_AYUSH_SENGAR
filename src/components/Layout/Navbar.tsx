import { JSX } from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  items: PropsINavbar[];
}

type PropsINavbar = {
  text: string;
  path: string;
  icon: JSX.Element;
};


const Navbar = ({ items }: NavbarProps) => {
  return (
    <nav className="h-full  shadow w-52">
      <ul>
        {items?.map((item, n: number) => (
          <li key={n}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center py-4 px-6 rounded transition duration-200 
                  ${
                    isActive
                      ? "bg-gray-100 font-semibold"
                      : " hover:bg-gray-100"
                  }`
              }
            >
              <p className="text-xl">{item.icon}</p>
              <span className="ml-4 text-l font-medium">{item.text}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
