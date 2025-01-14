import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoIosAddCircleOutline } from "react-icons/io";
import { GrTransaction } from "react-icons/gr";
import { MdManageAccounts } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import toast from "react-hot-toast";

export default function SideDrawer(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      let response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        toast.success("User Log Out");
        navigate("/");
      }
    } catch (err) {
      toast.error("Error Occurred");
      console.log("Some error occurred", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen border-solid border-2 shadow-xl w-60 justify-center bg-white">
      <div
        onClick={() => navigate("/")}
        className="text-center p-4 text-3xl font-bold flex items-center cursor-pointer"
      >
        <p className="text-center">
          Expense
          <span className="text-blue-500">Trackr</span>
        </p>
      </div>
      <div className="my-5">
        <Link to="/dashboard">
          <div
            className={`${
              isActive("/dashboard")
                ? "bg-blue-500 text-white text-xl shadow-lg"
                : "hover:bg-gray-100"
            } flex justify-center m-auto rounded-3xl w-4/5 my-5 p-5 items-center`}
          >
            <span className="mr-2">
              <LuLayoutDashboard />
            </span>
            Dashboard
          </div>
        </Link>
        <Link to="/addtransaction">
          <div
            className={`${
              isActive("/addtransaction")
                ? "bg-blue-500 text-white text-xl shadow-lg"
                : "hover:bg-gray-100"
            } flex justify-center m-auto rounded-3xl w-4/5 my-5 p-5 items-center`}
          >
            <span className="mr-2">
              <IoIosAddCircleOutline />
            </span>
            Add New
          </div>
        </Link>
        <Link to="/transactions">
          <div
            className={`${
              isActive("/transactions") || isActive("/edit-transaction/")
                ? "bg-blue-500 text-white text-xl shadow-lg"
                : "hover:bg-gray-100"
            } flex justify-center m-auto rounded-3xl w-4/5 my-5 p-5 items-center`}
          >
            <span className="mr-2">
              <GrTransaction />
            </span>
            Transactions
          </div>
        </Link>
        <Link to="/profile">
          <div
            className={`${
              isActive("/profile")
                ? "bg-blue-500 text-white text-xl shadow-lg"
                : "hover:bg-gray-100"
            } flex justify-center m-auto rounded-3xl w-4/5 my-5 p-5 items-center`}
          >
            <span className="mr-2">
              <MdManageAccounts />
            </span>
            Accounts
          </div>
        </Link>
      </div>
      <div className="mt-20">
        <Link onClick={handleLogout} to="/logout">
          <div
            className={`${
              isActive("/logout")
                ? "bg-blue-500 text-white text-xl shadow-lg"
                : "hover:bg-gray-100"
            } flex justify-center rounded-3xl m-auto w-40 my-5 p-5 items-center`}
          >
            <span className="mr-2">
              <IoIosLogOut />
            </span>
            Log Out
          </div>
        </Link>
      </div>
    </div>
  );
}
