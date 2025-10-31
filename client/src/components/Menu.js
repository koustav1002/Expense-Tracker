import React from "react";
import menuItems from "../store/menuItems";
import { Link, useLocation } from "react-router-dom";

const Menu = ({ currentItem, setCurrentItem }) => {
  const { pathname } = useLocation();

  return (
    <div className="hidden md:flex items-center gap-4">
      {menuItems.map((item) => (
        <div
          key={item._id}
          className={`px-6 py-2 ${item.link === pathname && "bg-black dark:bg-gray-500 rounded-full"
            } ${item.link === pathname ? "text-white" : "text-gray-500"}`}
        >
          <Link to={item.link}>{item.title}</Link>
        </div>
      ))}
    </div>
  );
};

export default Menu;
