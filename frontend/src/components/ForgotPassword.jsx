import React, { useState } from "react";
import Modal from "./Modal";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("sngsumit2003@gmail.com");
  const [emailError, setEmailError] = useState("");
  const [mailSent, setEmailSent] = useState(false);
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/forgot-password`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();
      if (result.error) {
        setEmailError(result.error);
      }
      if (response.ok) {
        toast.success("Reset Link sent to your email");
        setEmailSent(true);
      }
    } catch (err) {
      toast.error("Error Occurred");
      console.error("Error occurred ", err);
    }
  };

  return (
    <div>
      <button
        className="text-blue-500 underline hover:text-blue-800"
        onClick={() => setModalOpen(true)}
      >
        Forgot Password?
      </button>
      <div className="text-center">
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          {!mailSent && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label className="block text-start text-md font-medium text-gray-700">
                    Enter your email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email"
                    required
                  />
                  <div className="h-4 text-md text-red-500 text-left p-1">
                    {emailError}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Send Reset Link
                </button>
              </form>
            </div>
          )}
          {mailSent && <div>
            <h2 className="text-md my-2 text-left">A mail has been sent to your registered email with the password reset link.</h2>
            <h2 className="text-md my-2">Kindly check your mail to reset your password.</h2>
            <button onClick={()=> setModalOpen(false)} className="bg-blue-500 my-2 text-white text-md cursor-pointer hover:bg-blue-800 active:scale-95  rounded-sm px-5 py-2">OK</button>
          </div> }
        </Modal>
      </div>
    </div>
  );
}
