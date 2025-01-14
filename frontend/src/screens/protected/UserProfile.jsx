import React, { useEffect, useState, useCallback } from "react";
import SideDrawer from "../../components/SideDrawer";
import UpdateAccount from "../../components/UpdateAccount";
import ChangePassword from "../../components/ChangePassword";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "User",
    email: "user@email.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [triggerFetch, setTriggerFetch] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/user-details`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Error in fetching user details", error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, triggerFetch]);

  const handleUpdate = () => {
    setTriggerFetch(prev => !prev);  // Toggle state to re-run fetchUser
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="fixed top-0 left-0 bottom-0 w-64">
        <SideDrawer />
      </div>

      <div className="flex flex-col w-full ml-64 p-10 items-center">
        <h1 className="text-4xl font-semibold mb-8">Account Details</h1>

        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src="user.png"
              alt="user"
              className="rounded-full mb-4"
              width="120"
              height="120"
            />
            <h2 className="text-3xl font-medium">{user.name}</h2>
            <p className="text-lg text-gray-600">{user.email}</p>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="text-xl font-medium">Name</h3>
                <p className="text-lg text-gray-700">{user.name}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium">Email</h3>
                <p className="text-lg text-gray-700">{user.email}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium">Created At</h3>
                <p className="text-lg text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium">Updated At</h3>
                <p className="text-lg text-gray-700">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-6">
            <ChangePassword />
            <UpdateAccount onEdit={handleUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}
