import React from "react";

const Info = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-black">{title}</h1>
        <span className="text-gray-600">{subtitle}</span>
      </div>
    </div>
  );
};

export default Info;
