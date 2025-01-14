import React from "react";
import { useNavigate, Link } from "react-router-dom";
export default function Navbar({ isLoggedIn }) {
  const handleLogOut = async () => {
    try {
      let response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        location.reload();
        const navigate = useNavigate();
        navigate("/");
        isLoggedIn = false;
      } else {
        console.log("Some error occured during log out");
      }
    } catch (err) {
      console.log("Some error occurred", err);
    }
  };

  return (
    <>
      <div className="nav flex bg-blue-400">
        <ul className="flex list-none justify-around w-2/3 ">
          <Link to="/">
            <li className="cursor-pointer w-40 h-full hover:text-white font-bold text-center p-2 pt-5 hover:border-white hover:border-solid hover:border-b-2 hover:bg-blue-500">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="cursor-pointer w-40 h-full hover:text-white font-bold text-center p-2 pt-5 hover:border-white hover:border-solid hover:border-b-2 hover:bg-blue-500">
              About Us
            </li>
          </Link>
          <Link to="/contact">
            <li className="cursor-pointer w-40 h-full hover:text-white font-bold text-center p-2 pt-5 hover:border-white hover:border-solid hover:border-b-2 hover:bg-blue-500">
              Contact Us
            </li>
          </Link>
          <Link to="/services">
            <li className="cursor-pointer w-40 h-full hover:text-white font-bold text-center p-2 pt-5 hover:border-white hover:border-solid hover:border-b-2 hover:bg-blue-500">
              Services
            </li>
          </Link>
        </ul>
        <div className="options flex w-1/3 justify-end mr-5 p-3">
          {isLoggedIn ? (
            <>
              <button
                className="text-white border-solid border-white border-2 rounded-3xl bg-transparent h-10 p-1 w-20 m-2 hover:scale-110"
                onClick={handleLogOut}
              >
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login">
            <button className="text-white border-solid border-white border-2 rounded-3xl bg-transparent h-10 p-1 w-20 m-2 hover:scale-110">
              Log In
            </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
