import React, { useEffect, useState } from "react";
import useStore from "../store";
import { useForm } from "react-hook-form";
import axios from "axios";
import { MdOutlineWarning } from "react-icons/md";
import Input from "./ui/Input";
import { toast } from "react-toastify";
import { DialogWrapper } from "./wrapper/DialogWrapper";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { BiLoader } from "react-icons/bi";
import { Button } from "./ui/Button";
import { getAccessToken } from   "../store/utils";

const TransferMoney = ({ isOpen, setIsOpen, refetch }) => {
  const { user } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [fromAccountInfo, setFromAccountInfo] = useState([]);
  const [toAccountInfo, setToAccountInfo] = useState([]);

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const newData = {
        ...data,
        from_account: fromAccountInfo._id,
        to_account: toAccountInfo._id,
      };

      const config = {
        headers: {
          Authorization: `${getAccessToken()}`,
        },
      };

      const URL = "http://127.0.0.1:8000/api-v1/transactions/transfer-money";

      const { data: res } = await axios.put(
        URL,
        newData,
        config
      );

      if (res?.status === "success") {
        toast.success(res?.message);
        setIsOpen(false);
        refetch();
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAccountBalance = (setAccount, val) => {
    const filteredAccount = accountData?.find(
      (account) => account.account_name === val
    );

    setAccount(filteredAccount);
  };

  function closeModal() {
    setIsOpen(false);
  }

  const fetchAccount = async () => {
    try {
      const config = {
        headers: {
          Authorization: `${getAccessToken()}`,
        },
      };

      const URL = "http://127.0.0.1:8000/api-v1/account/";
      
      const { data: res } = await axios.get(URL, config);

      setAccountData(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);
  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900 mb-4 uppercase"
        >
          Transfer Money
        </DialogTitle>

        {isLoading ? (
          <BiLoader className="text-xl animate-spin text-white" />
        ) : (
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col gap-1 mb-2">
              <p className="text-gray-700 text-sm mb-2">Select Account</p>

              <select
                onChange={(e) =>
                  getAccountBalance(setFromAccountInfo, e.target.value)
                }
                className="inputStyles"
              >
                <option
                  disabled
                  selected
                  className="w-full flex items-center justify-center"
                >
                  Select Account
                </option>

                {accountData?.map((acc, index) => (
                  <option
                    key={index}
                    value={acc?.account_name}
                    className="w-full flex items-center justify-center"
                  >
                    {acc?.account_name}
                    {" - "}
                    {Number(acc?.account_balance.$numberDecimal).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 mb-2">
              <p className="text-gray-700 text-sm mb-2">From Account</p>
              <select
                onChange={(e) =>
                  getAccountBalance(setToAccountInfo, e.target.value)
                }
                className="inputStyles"
              >
                <option
                  disabled
                  selected
                  className="w-full flex items-center justify-center"
                >
                  To Account
                </option>
                {accountData?.map((acc, index) => (
                  <option
                    key={index}
                    value={acc?.account_name}
                    className="w-full flex items-center justify-center"
                  >
                    {acc?.account_name}
                    {" - "}
                    {Number(acc?.account_balance.$numberDecimal).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {Number(fromAccountInfo?.account_balance?.$numberDecimal ?? 0) <= 0 && (
              <div className="flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded">
                <MdOutlineWarning size={30} />
                <span className="text-sm">
                  You can not transfer money from this account. Insufficient
                  account balance.
                </span>
              </div>
            )}
            
            {Number(fromAccountInfo?.account_balance?.$numberDecimal ?? 0) > 0 && toAccountInfo._id && (
              <>
                <Input
                  type="number"
                  name="amount"
                  label="Amount"
                  placeholder="10.56"
                  {...register("amount", {
                    required: "Transaction amount is required!",
                  })}
                  error={errors.amount ? errors.amount.message : ""}
                />
                <div className="w-full mt-8">
                  <Button
                    loading={loading}
                    type="submit"
                    className="bg-violet-700 text-white w-full"
                  >
                    {`Transfer Rs.${watch("amount") || " 0"}`}
                  </Button>
                </div>
              </>
            )}
          </form>
        )}
      </DialogPanel>
    </DialogWrapper>
  );
};

export default TransferMoney;
