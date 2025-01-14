import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideDrawer from "../../components/SideDrawer";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function EditTransaction() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [transactionError, setTransactionError] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);

  const categories = ['Income', 'Expense'];
  const subcategories = {
    Income: ['Salary', 'Shares', 'Other'],
    Expense: ['Food', 'Rent', 'Travel', 'Subscription', 'Grocery', 'Vegetables', 'Other'],
  };

  const fetchTransaction = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transactions/get-transaction/${id}`, {
          credentials: 'include',
        }
      );
      if (response.ok) {
        const result = await response.json();
        const formattedTransaction = {
          ...result,
          name: result.title,
          date: new Date(result.date).toISOString().split("T")[0],
        };
        setSelectedCategory(formattedTransaction.transaction_type);
        setSelectedSubcategory(formattedTransaction.category);
        reset(formattedTransaction);
      } else {
        toast.error("Some error occurred");
      }
    } catch (err) {
      console.error("Some error occurred", err);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    setIsCategoryOpen(false);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsSubcategoryOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        title : data.name,
        transaction_type: selectedCategory,
        category: selectedSubcategory,
      };
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/transactions/update-transaction/${id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      
      if (response.ok) {
        toast.success("Transaction Updated");
        navigate('/transactions');
      } else if (result.message === "Validation Failed") {
        setTransactionError(result.errors); // Update error state with backend validation errors
      }
    } catch (err) {
      console.error("Error occurred while submitting the form", err);
    }
  };

  return (
    <>
      <div className="flex w-full h-screen bg-gray-100">
        <SideDrawer />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="w-2/5 bg-white p-8 shadow-lg rounded-lg">
            <h1 className="text-center font-bold text-4xl text-gray-800 mb-8">
              Edit Transaction
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter Transaction Name"
                />
                {transactionError.name && (
                  <span className="text-sm text-red-500">
                    {transactionError.name}
                  </span>
                )}
              </div>
              <div className="flex justify-between">
                <div className="relative box-border mr-2 w-1/2 inline-block">
                  <div
                    className="border rounded-lg border-gray-300 bg-white p-3 cursor-pointer"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  >
                    {!selectedCategory ? (
                      <span className="text-gray-400">Category</span>
                    ) : (
                      <span>{selectedCategory}</span>
                    )}
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

                <div className="relative box-border ml-2 w-1/2 inline-block">
                  <div
                    className={`border rounded-lg border-gray-300 bg-white p-3 ${
                      selectedCategory ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                    onClick={() =>
                      selectedCategory && setIsSubcategoryOpen(!isSubcategoryOpen)
                    }
                  >
                    {selectedSubcategory ||
                      (selectedCategory ? (
                        <span>Sub Category ({selectedCategory})</span>
                      ) : (
                        <span className="text-gray-400">Select Subcategory</span>
                      ))}
                  </div>
                  {isSubcategoryOpen && selectedCategory && (
                    <ul className="absolute left-0 mt-1 w-full border border-gray-300 bg-white z-10">
                      {subcategories[selectedCategory].map(
                        (subcategory, index) => (
                          <li
                            key={index}
                            className="p-3 cursor-pointer hover:bg-blue-500 hover:text-white"
                            onClick={() => handleSubcategorySelect(subcategory)}
                          >
                            {subcategory}
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="number"
                  {...register("amount")}
                  className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter Amount"
                />
                {transactionError.amount && (
                  <span className="text-sm text-red-500">
                    {transactionError.amount}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full h-12 p-3 border border-gray-300 rounded-lg text-gray-500 focus:border-blue-500 focus:outline-none"
                />
                {transactionError.date && (
                  <span className="text-sm text-red-500">
                    {transactionError.date}
                  </span>
                )}
              </div>

              <div>
                <input
                  type="text"
                  {...register("description")}
                  className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter Transaction Description"
                />
                {transactionError.description && (
                  <span className="text-sm text-red-500">
                    {transactionError.description}
                  </span>
                )}
              </div>

              <div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full h-12 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none transition-all duration-300"
                >
                  {isSubmitting ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
