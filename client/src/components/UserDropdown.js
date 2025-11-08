import React, { useState, useEffect, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store";

const UserDropdown = () => {
  const { user, signOut } = useStore((state) => state);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = (e) => {
    e.preventDefault();

    localStorage.clear();
    signOut();
    navigate("/sign-in");
  };

  return (
    <div className="relative inline-block">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleDropdown}
      >
        {" "}
        {/* Use justify-between for alignment */}
        <div>
          <p className="text-lg font-medium text-black dark:text-white">
            {user?.firstName || "Guest"}
          </p>
          <span className="text-sm text-gray-700 dark:text-gray-400">
            {user?.email || "Guest Email"}
          </span>
        </div>
        <RiArrowDropDownLine size={30} className="dark:text-white" />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg dark:bg-slate-800 dark:text-white"
        >
          <ul className="p-2">
            <li className="py-2 hover:bg-gray-100 dark:hover:bg-gray-500">
              <button onClick={handleSignOut} className="block px-4">
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
