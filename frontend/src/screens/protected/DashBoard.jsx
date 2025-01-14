import React, { useEffect, useState } from "react";
import SideDrawer from "../../components/SideDrawer";
import { Line } from "react-chartjs-2";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function DashBoard() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const [incomeData, setIncomeData] = useState({
    labels: [],
    datasets: [],
  });
  const [expenseData, setExpenseData] = useState({
    labels: [],
    datasets: [],
  });

  const currentYear = new Date().getFullYear();
  const allMonths = Array.from(
    { length: 12 },
    (_, i) => `${currentYear}-${i + 1}`
  );

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions/get-transactions`,
        {
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const sortedTransactions = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(sortedTransactions.slice(0, 4));

      const aggregateByMonth = (transactions, type) => {
        const monthlyData = allMonths.reduce((acc, month) => {
          acc[month] = 0;
          return acc;
        }, {});

        transactions
          .filter((transaction) => transaction.transaction_type === type)
          .forEach((transaction) => {
            const date = new Date(transaction.date);
            const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (monthlyData[month] !== undefined) {
              monthlyData[month] += transaction.amount;
            }
          });

        const labels = Object.keys(monthlyData);
        const amounts = labels.map((month) => monthlyData[month]);

        return { labels, amounts };
      };

      const { labels: incomeLabels, amounts: incomeAmounts } = aggregateByMonth(
        data,
        "Income"
      );
      const { labels: expenseLabels, amounts: expenseAmounts } =
        aggregateByMonth(data, "Expense");

      setIncomeData({
        labels: incomeLabels,
        datasets: [
          {
            label: "Income",
            data: incomeAmounts,
            borderColor: "green",
            backgroundColor: "rgba(0, 255, 0, 0.2)",
            tension: 0.1,
            fill: true,
          },
        ],
      });

      setExpenseData({
        labels: expenseLabels,
        datasets: [
          {
            label: "Expense",
            data: expenseAmounts,
            borderColor: "red",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            fill: true,
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        labels: allMonths,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 3000,
        },
      },
    },
  };

  return (
    <div className="flex bg-gray-100">
      <SideDrawer />
      <div className="mx-10 mt-10 flex flex-col w-full ">
        <div className="flex mb-10 ">
          <div className="mr-5 w-1/2 h-90 bg-white shadow-xl rounded-lg p-4">
            <h1 className="font-bold text-2xl mb-4">Monthly Income</h1>
            <div style={{ width: "100%", height: "300px" }}>
              <Line data={incomeData} options={chartOptions} />
            </div>
          </div>
          <div className="ml-5 w-1/2 h-90 bg-white shadow-xl rounded-lg p-4">
            <h1 className="font-bold text-2xl mb-4">Monthly Expense</h1>
            <div style={{ width: "100%", height: "300px" }}>
              <Line data={expenseData} options={chartOptions} />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold underline my-2">
          Recent Transactions
        </h1>
        <div className="flex p-2 gap-3 w-full h-32 ">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="w-60 h-32 p-2 border-none bg-white drop-shadow-lg rounded-lg "
            >
              <h3 className="text-xl font-bold">{transaction.title}</h3>
              <p
                className={`mt-2 text-xl ${
                  transaction.transaction_type === "Income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                ₹ {transaction.amount}
              </p>
              <p className="text-sm my-1">{transaction.description}</p>
              <p className="text-sm">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
          ))}
          {transactions && <div className="w-40 h-32 p-2 flex flex-col justify-center items-center border-none bg-white drop-shadow-lg rounded-lg ">
            <button className="w-16 h-16 rounded-full bg-blue-500 text-3xl items-center justify-center flex text-white hover:bg-blue-800 active:scale-95" onClick={()=> navigate('/transactions') } ><FaArrowRight /></button>
            <h1 onClick={()=> navigate('/transactions')} className="text-blue-500 underline cursor-pointer hover:text-blue-800 my-2">
              View All
            </h1>
          </div>}
        </div>
      </div>
    </div>
  );
}
