import React from "react";
import { DialogWrapper } from "./wrapper/DialogWrapper";
import { PiSealCheckFill } from "react-icons/pi";
import { DialogPanel, DialogTitle } from "@headlessui/react";

const ViewTransaction = ({ data, isOpen, setIsOpen }) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  const longDateString = new Date(data?.createdAt).toLocaleDateString("en-US", {
    dateStyle: "full",
  });
  
  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel className="w-full max-w-md tranform overflow-hidden rounded-2xl bg-white p-6 align-baseline">
        <DialogTitle
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900 mb-4 uppercase"
        >
          Transaction Detail
        </DialogTitle>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600 border-y border-gray-300">
            <p>{data?.source}</p>
            <PiSealCheckFill size={30} className="text-emerald-600 ml-4" />
          </div>
        </div>

        <div className="mb-10">
          <p className="text-xl text-black">{data?.description}</p>
          <span className="text-xs text-gray-600">
            {longDateString}
          </span>
        </div>

        <div className="mt-10 mb-3 flex justify-between">
          <p className="text-black text-2xl font-bold">
            <span
              className={`${
                data?.income === "income" ? "text-emerald-600" : "text-red-600"
              } font-bold mgl-1`}
            >
              {data?.type === "income" ? "+" : "-"}
            </span>{" "}
            {`Rs.${Number(data?.amount.$numberDecimal).toLocaleString()}`}
          </p>
          <button
            className="rounded-md outline-none bg-violet-800 px-4 py-2 text-sm font-medium text-white"
            type="button"
            onClick={closeModal}
          >
            Got it, thanks!
          </button>
        </div>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default ViewTransaction;
