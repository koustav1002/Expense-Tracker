import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Info from "../components/ui/Info";
import Stats from "../components/Stats";
import Chart from "../components/Chart";
import DoughnutChart from "../components/PieChart";
import RecentTransactions from "../components/RecentTransactions";
import { getAccessToken } from "../store/utils";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardStats = async () => {
    const URL = "http://127.0.0.1:8000/api-v1/transactions/dashboard";
    try {
      const config = {
        headers: {
          Authorization: `${getAccessToken()}`,
        },
      };
      const { data } = await axios.get(URL, config);
      setData(data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Oops!! Seems like there's an error");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardStats();
  }, []);
  return isLoading ? (
    <div className="flex items-center justify-center w-full h-[80vh]">
      <Loader />
    </div>
  ) : (
    <div className="px-0 md:px-5 2xl:px-20">
      <Info title="Dashboard" subtitle="Monitor your financial activities" />
      <Stats dt = {{
              balance: data.availableBalance,
              income: data.totalIncome,
              expense: data.totalExpense,
            }}/>
      <div className="flex flex-col-reverse items-center gap-10 w-full md:flex-row">
        <Chart data={data.chartData} />
        {data.totalIncome && (
          <DoughnutChart
            dt={{
              balance: data.availableBalance,
              income: data.totalIncome,
              expense: data.totalExpense,
            }}
          />
        )}
      </div>
      <div className="flex flex-col-reverse gap-0 md:flex-row md:gap-10 2xl:gap-20">
        <RecentTransactions data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
