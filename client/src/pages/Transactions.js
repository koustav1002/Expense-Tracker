import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { IoCheckmarkDoneCircle, IoSearchOutline } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { CiExport } from "react-icons/ci";
import DateRange from "../components/DateRange";
import { RiProgress3Line } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";
import ViewTransaction from "../components/ViewTransaction";
import AddTransaction from "../components/AddTransaction";
import { getAccessToken } from "../store/utils";

const Transactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");
  const startDate = searchParams.get("df") || "";
  const endDate = searchParams.get("dt") || "";

  const handleViewTransaction = (el) => {
    setSelected(el);
    setIsOpenView(true);
  };

  const fetchTransactions = async () => {
    try {
      const URL = `http://127.0.0.1:8000/api-v1/transactions?df=${startDate}&dt=${endDate}&s=${search}`;

      const config = {
        headers: {
          Authorization: `${getAccessToken()}`,
        },
      };
      const { data: res } = await axios.get(URL, config);

      setData(res?.data);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
        "Something unexpected happened try again later!"
      );

      if (error?.response?.data?.status === "auth_failed") {
        localStorage.clear();
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    setSearchParams({
      df: startDate,
      dt: endDate,
    });

    setIsLoading(true);

    await fetchTransactions();
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTransactions();
  }, [startDate, endDate]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div className="mt-6 border-b-2 border-gray-600 dark:border-gray-200">
              <p className="text-2xl 2xl:text-3xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                Transaction Activity
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="py-1.5 px-2 rounded bg-black text-white flex items-center justify-center gap-2 border border-gray-500"
              >
                <MdAdd size={22} />
                <span>Pay</span>
              </button>
              <button
                onClick={() => {
                  // exportToExcel(data, `Transactions ${startDate}-${endDate}`) 
                }}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-400 hover:underline"
              >
                Export <CiExport size={22} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 mb-10 gap-4">
            <DateRange />

            <form onSubmit={(e) => handleSearch(e)}>
              <div className="w-full flex items-center gap-2 border border-gray-300 rounded-md px-2 py-2 bg-gray-50 dark:bg-transparent dark:border-gray-700">
                <IoSearchOutline className="text-xl text-gray-600 dark:text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search transactions..."
                  className="outline-none bg-transparent text-gray-700 dark:text-gray-300 placeholder:text-gray-600 dark:placeholder:text-gray-500 w-full"
                />
              </div>
            </form>
          </div>

          <div className="overflow-x-auto mt-5">
            {data?.length === 0 ? (
              <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-400 text-lg">
                <span>No Transaction History</span>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead className="border-b border-gray-300 dark:border-gray-700">
                  <tr className="text-left text-gray-700 dark:text-gray-300">
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Description</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Source</th>
                    <th className="py-3 px-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100/60 dark:hover:bg-gray-800/40 text-gray-700 dark:text-gray-400"
                    >
                      <td className="py-4 px-2 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          dateStyle: "medium",
                        })}
                      </td>
                      <td className="py-4 px-2">
                        <p className="text-black dark:text-gray-300 text-base line-clamp-2">
                          {item.description}
                        </p>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          {item.status === "Pending" && (
                            <RiProgress3Line
                              className="text-amber-600"
                              size={22}
                            />
                          )}
                          {item.status === "Completed" && (
                            <IoCheckmarkDoneCircle
                              className="text-emerald-600"
                              size={22}
                            />
                          )}
                          {item.status === "Rejected" && (
                            <TiWarning className="text-red-600" size={22} />
                          )}
                          <span>{item.status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">{item.source}</td>
                      <td className="py-4 px-2 text-black dark:text-gray-300 font-semibold">
                        <span
                          className={`${item.type === "income"
                            ? "text-emerald-600"
                            : "text-red-600"
                            } font-bold`}
                        >
                          {item.type === "income" ? "+" : "-"}
                        </span>
                        {` Rs.${Number(
                          item.amount?.$numberDecimal
                        ).toLocaleString()}`}
                      </td>
                      <td className="py-4 px-2">
                        <button
                          onClick={() => handleViewTransaction(item)}
                          className="outline-none text-violet-600 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      <AddTransaction
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchTransactions}
        key={new Date().getTime()}
      />
      <ViewTransaction
        data={selected}
        isOpen={isOpenView}
        setIsOpen={setIsOpenView}
      />
    </>
  );
};

export default Transactions;
