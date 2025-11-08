import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import { FaBars, FaTimes } from "react-icons/fa";
import menuItems from "../store/menuItems";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { LuSunMoon } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import useStore from "../store";

export default function HamburgerMenu({ currentItem, setCurrentItem }) {
  const { theme, setTheme } = useStore((state) => state);
  const { pathname } = useLocation();

  const toggleDarkMode = (e) => {
    e.preventDefault();
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  // const [currentItem, setCurrentItem] = useState(0);
  const navigate = useNavigate();
  return (
    <Popover>
      {({ open, close }) => (
        <>
          <PopoverButton className="flex items-center gap-2 outline-none">
            <FaBars className={clsx("size-5", open && "hidden")} />
            <FaTimes className={clsx("size-5", !open && "hidden")} />
          </PopoverButton>
          <PopoverPanel
            anchor="bottom"
            className="absolute left-0 -translate-x-1 z-50 bg-white shadow-xl mt-3 w-[384px] rounded-lg  px-4 py-6 opacity-100 scale-100 dark:bg-slate-900 dark:shadow-[0_0_20px_4px_rgba(31,41,55,0.6)]"
          >
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link to={item.link} key={item._id}>
                  <button
                    className={`text-gray-700 w-1/2 px-6 py-2 ${item.link === pathname && "bg-black dark:bg-gray-600 rounded-full"
                      } text-left ${item.link === pathname ? "text-white" : "text-gray-400"}`}
                    onClick={() => {
                      close();
                    }}
                  >
                    {item.title}
                  </button>
                </Link>
              ))}
              <div className="flex items-center justify-between py-6 px-4">
                <button onClick={toggleDarkMode} className="outline-none">
                  {theme === 'dark' ? (<LuSunMoon size={26} className="text-gray-500" />) : (<IoMoonOutline size={26} className="text-gray-500" />)
                  }
                </button>
                <button
                  onClick={() => {
                    // localStorage.remove('user')
                    navigate("/sign-in");
                  }}
                  className="dark:text-gray-500"
                >
                  <TbLogout2 size={25} />
                </button>
              </div>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
