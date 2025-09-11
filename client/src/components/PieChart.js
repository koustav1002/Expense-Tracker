import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const colors = ["#0088fe", "#ffbb28"];

const DoughnutChart = ({ dt }) => {
  const data = [
    { name: "Income", value: Number(dt.income || 4418) },
    { name: "Expense", value: Number(dt.expense || 3287) },
  ];

  return (
    <div className="w-full md:w-1/3 flex flex-col items-center bg-gray-50 py-10 ml-20 overflow-auto">
      <p className="text-xl font-bold text-gray-700 mb-5">Summary</p>
      <ResponsiveContainer width={300} height={300}>
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="square"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
