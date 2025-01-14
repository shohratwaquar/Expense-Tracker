import React, { useState } from 'react';
import SideDrawer from '../../components/SideDrawer';
import { useForm } from 'react-hook-form';
import CategoryDropdown from '../../components/CategoryDropdown';
import toast from 'react-hot-toast';

export default function AddExpense() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [error, setError] = useState({});

  const handleAddTransaction = async (data) => {
    try {
      const formData = {
        ...data,
        category,
        subcategory,
      };
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/transactions/addtransaction`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
      });
      const result = await response.json();
      console.log(result);

      if (response.ok) {
        toast.success("Transaction added successfully");
        reset();
      } else if (result.message === "Validation Failed") {
        console.log("Validation error detected");
        setError(result.errors);
      } else {
        toast.error("Transaction could not be added");
        console.log('Transaction not added');
      }
    } catch (err) {
      toast.error("Transaction could not be added");
      console.log('Some error occurred', err);
    }
  };

  const handleCategory = ({ category, subcategory }) => {
    setCategory(category);
    setSubcategory(subcategory);
  };

  return (
    <>
      <div className="flex w-full h-screen bg-gray-100">
        <SideDrawer />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="w-2/5 bg-white p-8 shadow-lg rounded-lg">
            <h1 className="text-center font-bold text-4xl text-gray-800 mb-8">Add Transaction</h1>
            <form onSubmit={handleSubmit(handleAddTransaction)} className="space-y-6">
              {/* Transaction Name */}
              <div>
                <input
                  type="text"
                  autoComplete='off'
                  {...register('name')}
                  className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Transaction Name"
                />
                {error.name && <span className="text-sm text-red-500">{error.name}</span>}
              </div>

              {/* Category Dropdown */}
              <div>
                <CategoryDropdown onDataPass={handleCategory} />
              </div>

              {/* Amount */}
              <div>
                <input
                  type="number"
                  autoComplete='off'
                  {...register('amount')}
                  className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Amount"
                />
                {error.amount && <span className="text-sm text-red-500">{error.amount}</span>}
              </div>

              {/* Date */}
              <div>
                <input
                  type="date"
                  autoComplete='off'
                  {...register('date')}
                  className="w-full h-12 p-3 border border-gray-300 rounded-lg text-gray-500 focus:border-blue-500 focus:outline-none"
                />
                {error.date && <span className="text-sm text-red-500">{error.date}</span>}
              </div>

              {/* Description */}
              <div>
                <input
                  type="text"
                  autoComplete='off'
                  {...register('description')}
                  className="w-full h-12 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Description"
                />
                {error.description && <span className="text-sm text-red-500">{error.description}</span>}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full h-12 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none transition-all duration-300"
                >
                  {isSubmitting ? 'Adding...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
