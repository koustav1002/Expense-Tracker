import React, { useState } from "react";
import { GrMoney } from "react-icons/gr";
import { LuSunMoon } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import UserDropdown from "./UserDropdown";
import HamburgerMenu from "./MobileModal";
import Menu from "./Menu";
import { Link } from "react-router-dom";
import useStore from "../store";

const Navbar = () => {
  const { theme, setTheme } = useStore((state) => state);
  const toggleDarkMode = (e) => {
    e.preventDefault();
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const [currentItem, setCurrentItem] = useState(0);

  return (
    <div className="w-full flex items-center justify-between py-6">
      <Link to="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center rounded-xl bg-violet-700">
            <GrMoney className="text-white hover:animate-spin" size={25} />
          </div>
          <span className="text-xl font-bold text-black dark:text-gray-300">My-Finance</span>
        </div>
      </Link>
      <Menu currentItem={currentItem} setCurrentItem={setCurrentItem} />
      <div className="hidden md:flex items-center gap-10 2xl:gap-20">
        <button onClick={toggleDarkMode} className="outline-none">
          {theme === 'dark' ? (<LuSunMoon size={26} className="text-gray-500" />) : (<IoMoonOutline size={26} className="text-gray-500" />)
          }
        </button>
        <UserDropdown />
      </div>

      <div className="flex md:hidden">
        <HamburgerMenu
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
        />
      </div>
    </div>
  );
};

export default Navbar;
