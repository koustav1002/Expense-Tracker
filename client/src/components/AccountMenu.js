import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React from "react";
import { BiTransfer } from "react-icons/bi";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { MdMoreVert } from "react-icons/md";

const AccountMenu = ({ addMoney, transferMoney }) => {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className="inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-600">
          <MdMoreVert />
        </MenuButton>

        {/* <TransitionWrapper> */}
        <MenuItems className="absolute p-2 right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white ">
          <div className="px-1 py-1 space-y-2">
            <MenuItem>
              {({ active }) => (
                <button
                  className="group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-gray-700"
                  onClick={transferMoney}
                >
                  <BiTransfer />
                  Transfer Funds
                </button>
              )}
            </MenuItem>

            <MenuItem>
              {({ active }) => (
                <button
                  className="group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-gray-700"
                  onClick={addMoney}
                >
                  <FaMoneyCheckDollar /> Add Money
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
        {/* </TransitionWrapper> */}
      </Menu>
    </>
  );
};

export default AccountMenu;
