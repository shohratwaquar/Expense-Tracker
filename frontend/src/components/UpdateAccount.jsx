import React, { useState } from "react";
import Modal from "./Modal";
import DeleteAccount from '../components/DeleteAccount';
import { toast } from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';

export default function ChangePassword() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState({
    nameError: null,
    emailError: null,
  });

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/update-profile`, {
        method: "POST",
        body: JSON.stringify({ name, email }),
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Data updated successfully", { autoClose: 2000 });
        setErrorMessage({});
        setModalOpen(false);
      } else {
        setErrorMessage(result);
      }
    } catch (error) {
      console.error("Error occurred", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {/* ToastContainer ideally should be in App.js for a single instance across the app */}
      <button
        className="bg-blue-500 text-white w-40 h-10 rounded-lg hover:bg-blue-800 active:scale-95"
        onClick={() => setModalOpen(true)}
      >
        Edit
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Edit Account Details</h2>
        <form onSubmit={handleEdit}>
          <div className="mb-4 text-left">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Full Name"
              required
            />
            {errorMessage.nameError && (
              <div className="h-8 text-sm text-red-500 text-left p-1">
                {errorMessage.nameError}
              </div>
            )}
          </div>

          <div className="mb-4 text-left">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
            {errorMessage.emailError && (
              <div className="h-8 text-sm text-red-500 text-left p-1">
                {errorMessage.emailError}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>

        {/* DeleteAccount Component */}
        <DeleteAccount />
      </Modal>
    </div>
  );
}
