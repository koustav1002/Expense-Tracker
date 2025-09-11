import React from "react";
import { Card } from "./ui/Cards";
import { BsCurrencyDollar, BsCashCoin } from "react-icons/bs";
import { SiCashapp } from "react-icons/si";

const Stats = ({ dt }) => {
  const data = [
    {
      label: "Total Balance",
      amount: dt?.balance,
      icon: <BsCurrencyDollar size={26} />,
    },
    {
      label: "Total Income",
      amount: dt?.income,
      icon: <BsCashCoin size={26} />,
    },
    {
      label: "Total Expense",
      amount: dt?.expense,
      icon: <SiCashapp size={26} />,
    },
  ];

  const Icon_Styles = [
    "bg-blue-300 text-blue-800",
    "bg-emerald-300 text-emerald-800",
    "bg-rose-300 text-rose-800",
  ];

  const ItemCard = ({ item, index }) => {
    return (
      <Card className="flex items-center justify-between w-full h-48 gap-5 px-4 py-12 2xl:min-w-96 2xl:px-8">
        <div className="flex items-center w-full h-full gap-4">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full ${Icon_Styles[index]}`}
          >
            {item.icon}
          </div>
          <div className="space-y-3">
            <span className="text-base text-gray-600 md:text-lg">
              {item.label}
            </span>
            <p className="text-2xl font-medium text-black 2xl:text-3xl">
              ₹{item.amount || 0.0}
            </p>
            <span className="text-xs text-gray-600 md:text-sm 2xl:text-base">
              Overall {item.label}
            </span>
          </div>
        </div>
      </Card>
    );
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 2xl:gap-x-40 mb-20">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10 2xl:gap-20">
        {data.map((item, index) => (
          <ItemCard key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Stats;
