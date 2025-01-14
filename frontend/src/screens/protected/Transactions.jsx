import React, { useEffect, useState } from "react";
import SideDrawer from "../../components/SideDrawer";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { MdOutlineModeEditOutline, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { FaDownload } from "react-icons/fa";
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [resetAvailable, setResetAvailable] = useState(false);
  const navigate = useNavigate();

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
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const handleEdit = (id) => navigate(`/edit-transaction/${id}`);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/transactions/delete-transaction/${id}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (response.ok) {
          toast.success("Transaction Deleted");
          fetchTransactions();
        }
      } catch (err) {
        toast.error("Error Occurred");
        console.log("Error occurred during deleting the transaction", err);
      }
    }
  };

  const categories = ["Income", "Expense"];
  const subcategories = {
    Income: ["Salary", "Shares", "Other"],
    Expense: [
      "Food",
      "Rent",
      "Travel",
      "Subscription",
      "Grocery",
      "Vegetables",
      "Other",
    ],
  };
  
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text("Transaction History", 10, 10);
    doc.setFontSize(10);
    const columns = [
      "Transaction Name",
      "Amount",
      "Type",
      "Category",
      "Date",
      "Description"
    ];
    const rows = transactions.map(transaction => [
      transaction.title,
      transaction.amount,
      transaction.transaction_type,
      transaction.category,
      new Date(transaction.date).toLocaleDateString(),
      transaction.description
    ]);
  
    // Add table to PDF
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 25,
      styles: { halign: 'center', fontSize: 10 },
      headStyles: {
        fillColor: [0, 0, 0]
      },
    });
    doc.save("Transactions.pdf");
  };
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    setIsCategoryOpen(false);
    setIsSubcategoryOpen(false);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsSubcategoryOpen(false);
  };

  const handleFilter = async () => {
    const filterArray = {
      date: selectedDate,
      category: selectedCategory,
      subcategory: selectedSubcategory,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions/get-transactions/filter`,
        {
          method: "POST",
          body: JSON.stringify(filterArray),
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const filteredTransaction = await response.json();
      setTransactions(filteredTransaction);
      setResetAvailable(true);
    } catch (err) {
      console.error("Error occurred", err);
    }
  };

  const handleResetFilter = async () => {
    fetchTransactions();
    setResetAvailable(false);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedDate(null);
  };
  return (
    <div className="flex">
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "250px" }}>
        <SideDrawer />
      </div>
      <div className="flex flex-col my-10 items-center ml-80 w-3/4">
        <h1 className="text-5xl font-bold mt-5 mb-10">Transactions History</h1>
        <div className="w-full flex flex-col items-center">
          <div className="flex w-11/12 justify-between mb-5">
            <input
              value={selectedDate || ""}
              onChange={(e) => setSelectedDate(e.target.value)}
              type="month"
              placeholder="Month"
              className="h-12 mb-2 mr-2 border border-slate-300 rounded-lg p-2"
            />
            <div className="flex w-2/3 gap-2">
              <div className="relative w-60">
                <div
                  className="border rounded-lg border-slate-500 bg-white p-3 cursor-pointer"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  {selectedCategory || <span className="text-gray-400">Category</span>}
                </div>
                {isCategoryOpen && (
                  <ul className="absolute left-0 mt-1 w-full border border-gray-300 bg-white z-10">
                    {categories.map((category, index) => (
                      <li
                        key={index}
                        className="p-3 cursor-pointer hover:bg-blue-500 hover:text-white"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative w-60">
                <div
                  className={`border rounded-lg border-slate-500 bg-white p-3 ${
                    selectedCategory ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  onClick={() => selectedCategory && setIsSubcategoryOpen(!isSubcategoryOpen)}
                >
                  {selectedSubcategory ||
                    (selectedCategory ? (
                      <span>Sub Category ({selectedCategory})</span>
                    ) : (
                      <span className="text-gray-400">Sub Category</span>
                    ))}
                </div>
                {isSubcategoryOpen && selectedCategory && (
                  <ul className="absolute left-0 mt-1 w-full border border-gray-300 bg-white z-10">
                    {subcategories[selectedCategory].map((subcategory, index) => (
                      <li
                        key={index}
                        className="p-3 cursor-pointer hover:bg-blue-500 hover:text-white"
                        onClick={() => handleSubcategorySelect(subcategory)}
                      >
                        {subcategory}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {resetAvailable && (
                <button
                  onClick={handleResetFilter}
                  className="bg-red-500 w-20 hover:bg-red-800 h-12 p-2 text-white rounded-lg"
                >
                  Reset
                </button>
              )}
              <button
                onClick={handleFilter}
                className="bg-blue-500 w-20 hover:bg-blue-800 h-12 p-2 text-white rounded-lg"
              >
                Filter
              </button>
            </div>
          </div>
          <table className="border border-black mx-auto w-11/12">
            <thead>
              <tr>
                <th className="border border-black p-2">Transaction Name</th>
                <th className="border border-black p-2">Type</th>
                <th className="border border-black p-2">Category</th>
                <th className="border border-black p-2">Amount</th>
                <th className="border border-black p-2">Date</th>
                <th className="border border-black p-2">Description</th>
                <th className="border border-black p-2">Options</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="text-center font-light p-5 border border-black">
                    {transaction.title}
                  </td>
                  <td className="text-center font-light p-5 border border-black">
                    {transaction.transaction_type}
                  </td>
                  <td className="text-center font-light p-5 border border-black">
                    {transaction.category}
                  </td>
                  <td className="text-center font-light p-5 border border-black">
                   ₹ {transaction.amount}
                  </td>
                  <td className="text-center font-light p-5 border border-black">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="text-center font-light p-5 border border-black">
                    {transaction.description}
                  </td>
                  <td className="text-center font-light p-5 border border-black">
                    <div className="flex justify-center gap-2">
                      <MdOutlineModeEditOutline
                        className="text-green-500 hover:text-green-800 cursor-pointer"
                        onClick={() => handleEdit(transaction._id)}
                        title="Edit"
                      />
                      <MdDelete
                        className="text-red-500 hover:text-red-800 cursor-pointer"
                        onClick={() => handleDelete(transaction._id)}
                        title="Delete"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={() => handleDownload()}
        style={{ borderRadius: "100%" }}
        className="bg-green-500 hover:bg-green-800 hover:scale-110 flex items-center justify-center fixed text-white text-2xl w-16 h-16 bottom-24 right-10"
        title="Download History"
      >
        <FaDownload />
        </button>
      <button
        onClick={() => navigate("/addtransaction")}
        style={{ borderRadius: "100%" }}
        className="bg-blue-500 hover:bg-blue-800 hover:scale-110 flex items-center justify-center fixed text-white text-2xl w-16 h-16 bottom-4 right-10"
        title="Add New"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default Transactions;
