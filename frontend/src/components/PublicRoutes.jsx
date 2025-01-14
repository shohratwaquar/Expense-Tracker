import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function PublicRoute() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/is_protected`, {
          method: 'GET',
          credentials: 'include',
        });
        setIsLoggedIn(response.ok); 
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoggedIn === null) {
    return <div>Loading .... </div>; 
  }

  return isLoggedIn ? <Navigate to="/dashboard" /> : <Outlet />;
}
