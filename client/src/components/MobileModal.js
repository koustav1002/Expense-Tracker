import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import { FaBars, FaTimes } from "react-icons/fa";
import menuItems from "../store/menuItems";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMoon } from "react-icons/hi";
import { TbLogout2 } from "react-icons/tb";

export default function HamburgerMenu({ currentItem, setCurrentItem }) {
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
            className="absolute left-0 -translate-x-1 z-50 bg-white shadow-lg mt-3 w-[384px] rounded-lg  px-4 py-6 opacity-100 scale-100 "
          >
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link to={item.link} key={item._id}>
                  <button
                    className={`text-gray-700 w-1/2 px-6 py-2 rounded-full text-left ${
                      item._id === currentItem && "bg-black text-white"
                    }`}
                    onClick={() => {
                      setCurrentItem(item._id);
                      console.log("hello");
                      close();
                    }}
                  >
                    {item.title}
                  </button>
                </Link>
              ))}
              <div className="flex items-center justify-between py-6 px-4">
                <HiOutlineMoon size={25} />
                <button
                  onClick={() => {
                    // localStorage.remove('user')
                    navigate("/sign-in");
                  }}
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
