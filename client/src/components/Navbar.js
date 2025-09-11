import React, { useState } from "react";
import { GrMoney } from "react-icons/gr";
import { HiOutlineMoon } from "react-icons/hi";
import UserDropdown from "./UserDropdown";
import HamburgerMenu from "./MobileModal";
import Menu from "./Menu";
import { Link } from "react-router-dom";

const Navbar = () => {
  const toggleDarkMode = (e) => {
    e.preventDefault();
    // Toggle between light and dark mode
  };

  const [currentItem, setCurrentItem] = useState(0);

  return (
    <div className="w-full flex items-center justify-between py-6">
      <Link to="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center rounded-xl bg-violet-700">
            <GrMoney className="text-white hover:animate-spin" size={25} />
          </div>
          <span className="text-xl font-bold text-black">My-Finance</span>
        </div>
      </Link>
      <Menu currentItem={currentItem} setCurrentItem={setCurrentItem} />
      <div className="hidden md:flex items-center gap-10 2xl:gap-20">
        <button onClick={toggleDarkMode}>
          <HiOutlineMoon size={25} />
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
