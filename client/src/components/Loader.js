import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="w-full flex items-center justify-center py-2">
      <FaSpinner className="animate-spin text-violet-600 text-bold" size={30} />
    </div>
  );
};

export default Loader;
