import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);

      if (response.ok) {
        reset();
        toast.success("User Created Succesfully");
        const { email, password } = data;
        const loginResponse = await authenticateUser(email, password);
        if (loginResponse.ok) {
          navigate("/dashboard");
        } else {
          console.log("Error in redirecting to the dashboard");
        }
      } else if (result.message === "User with Email already exists") {
        setFormErrors({ email: "User already exists!!" });
      } else if (result.message === "Validation Failed") {
        setFormErrors(result.errors);
      } else {
        toast.error("Error occurred.");
      }
    } catch (err) {
      console.log(err);
      console.log("Invalid Credentials. Please try again later!");
    }
  };

  const authenticateUser = async (email, password) => {
    try {
      let response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      return response;
    } catch (error) {
      console.error("Error authenticating user", error);
      return { ok: false };
    }
  };

  return (
    <div className="h-dvh w-full flex items-center justify-center overflow-hidden">
      <div className="w-1/3 p-10">
        <div className="text-center mb-5">
          <div className="text-4xl w-full font-bold flex justify-center">
            <span className="font-bold">Welcome</span>
            <span className="h-full flex items-center">
              <img className="m-1 h-8 md:m-2 md:h-10 md:w-30" src="/wave.png" alt="Logo" />
            </span>
          </div>
          <div className="text-4xl font-bold">To </div>
          <div className="text-4xl font-bold">
            Expense <span className="text-blue-500">Trackr</span>
          </div>
        </div>
        <div className="text-xl">Sign Up</div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col space-y-4">
          <div>
            <input
              autoComplete="off"
              
              className="w-full h-12 p-4 border-2 border-gray-300 outline-none focus:border-gray-500"
              placeholder="Enter your Full name"
              {...register("name")}
            />
            {formErrors.name && <span className="text-red-500">{formErrors.name}</span>}
          </div>
          <div>
            <input
              autoComplete="off"
              
              type="email"
              className="w-full h-12 p-4 border-2 border-gray-300 outline-none focus:border-gray-500"
              placeholder="Enter your Email"
              {...register("email")}
            />
            {formErrors.email && <span className="text-red-500">{formErrors.email}</span>}
          </div>
          <div>
            <input
              autoComplete="off"
              
              type="password"
              className="w-full h-12 p-4 border-2 border-gray-300 outline-none focus:border-gray-500"
              placeholder="Enter your password"
              {...register("password")}
            />
            {formErrors.password && <span className="text-red-500">{formErrors.password}</span>}
          </div>
          <div>
            <input
              autoComplete="off"
              type="password"
              
              className="w-full h-12 p-4 border-2 border-gray-300 outline-none focus:border-gray-500"
              placeholder="Confirm password"
              {...register("confirmPassword")}
            />
            {formErrors.confirmPassword && <span className="text-red-500">{formErrors.confirmPassword}</span>}
          </div>
          <div>
            <button
              className="w-full h-12 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
        <div className="text-center mt-5 text-blue-500 hover:text-blue-700 underline">
          <Link to="/login">Already have an Account? Log In</Link>
        </div>
        <hr className="border-gray-200 border w-1/2 mx-auto mt-2" />
        <div className="text-center w-full mt-2">
          <p>Or Continue With</p>
        </div>
        <div className="flex flex-row mt-5 justify-center gap-12 h-8 md:h-10">
          <img className="w-8 md:w-10" src="/facebook.png" alt="Facebook" />
          <img className="w-8 md:w-10" src="/google.png" alt="Google" />
          <img className="w-8 md:w-10" src="/microsoft.png" alt="Microsoft" />
        </div>
      </div>
    </div>
  );
}
