import React, { useState } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"

export default function ForgotPassword() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/delete-account`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ password }),
        headers: {
          "Content-type": "application/json"
        }
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Account deleted.",{autoClose : 2000});
        setModalOpen(false);
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.log("error occurred", error);
    }
  };

  return (
    <div>
      <button
        className="w-full bg-red-500 text-white py-2 px-4 my-2 rounded-md hover:bg-red-600"
        onClick={() => { setModalOpen(true) }}
      >
        Delete Account
      </button>
      <div className="text-center">
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
          <form onSubmit={handleDelete}>
            {!isConfirm ? (
              <div className="text-left h-20">
                <p>Are you sure you want to delete your account?</p>
                <div className="mt-8 justify-end flex gap-2">
                  <button onClick={() => { setConfirm(false); setModalOpen(false) }} className="bg-transparent w-20 h-10 border-2 p-2 border-gray-300 active:scale-95 rounded-lg">Cancel</button>
                  <button onClick={() => setConfirm(true)} type="button" className="bg-red-500 w-20 h-10 border-none p-2 text-white hover:bg-red-700 rounded-lg active:scale-95">Confirm</button>
                </div>
              </div>
            ) : (
              <div className="text-left h-50">
                <p>Enter your password to delete your account</p>
                <input className="border border-gray-300 mt-5 h-12 w-full p-2 rounded-lg" type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <div className="h-3 text-red-500 text-sm ">{error && <div>{error}</div>}</div>
                <div className="mt-4 justify-end flex gap-2">
                  <button onClick={() => { setConfirm(false); setModalOpen(false) }} type="button" className="bg-transparent w-20 h-10 border-2 p-2 border-gray-300 active:scale-95 rounded-lg">Cancel</button>
                  <button type="submit" className="bg-red-500 w-20 h-10 border-none p-2 text-white hover:bg-red-700 rounded-lg active:scale-95">Confirm</button>
                </div>
              </div>
            )}
          </form>
        </Modal>
      </div>
    </div>
  );
}

