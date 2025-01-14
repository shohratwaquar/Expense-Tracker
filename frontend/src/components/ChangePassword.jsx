import React, { useState } from "react";
import Modal from "./Modal";
import { toast } from "react-hot-toast";

export default function ChangePassword() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPassword, setCurrentpassword] = useState("");
  const [newPassword, setNewpassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    currentPasswordError: null,
    newPasswordError: null,
    confirmPasswordError: null,
  });
  const formData = {
    currentPassword: currentPassword,
    newPassword: newPassword,
    confirmPassword: confirmPassword,
  };
  const handleChangePassword = async () => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/change-password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success("Password Changed Successfully",{autoClose : 2000});
        setCurrentpassword('');
        setNewpassword('');
        setConfirmpassword('');
        setErrorMessage('');
        setModalOpen(false);
      } else if (result.message === "Invalid password") {
        setErrorMessage((prevState) => ({
          ...prevState,
          currentPasswordError: result.message,
        }));
      }else{
        toast.error("Could not change Password");
        setErrorMessage((prevState)=>({
          ...prevState,
          currentPasswordError : result.currentPasswordError,
          newPasswordError : result.newPasswordError,
          confirmPasswordError : result.confirmPasswordError
        }));
      }
    } catch (error) {
      toast.error("Error Occurred. Please try again later");
      console.log("Error occurred", error);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white hover:bg-blue-800 active:scale-95 w-40 h-10 rounded-lg"
        onClick={() => setModalOpen(true)}
      >
        Change Password
      </button>
      <div className="text-center">
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentpassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter current pasword"
                required
              />
              <div className="h-8 text-sm text-red-500 text-left p-1">
                {errorMessage.currentPasswordError && (
                  <span>{errorMessage.currentPasswordError}</span>
                )}
              </div>
            </div>
            <div className="mb-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewpassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="New Password"
                required
              />
               <div className="h-8 text-sm text-red-500 text-left p-1">
                {errorMessage.newPasswordError && (
                  <span>{errorMessage.newPasswordError}</span>
                )}
              </div>
            </div>
            <div className="mb-4">
              <input
              title="Password must be 8 character long and combination of alphabet, number and special character"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm Password"
                required
              />
               <div className="h-8 text-sm text-red-500 text-left p-1">
                {errorMessage.confirmPasswordError && (
                  <span>{errorMessage.confirmPasswordError}</span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Change Password
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
