import React from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import Login from "./screens/public/Login";
import Signup from "./screens/public/Signup";
import DashBoard from "./screens/protected/DashBoard";
import Home from "./screens/public/Home";
import ProtectedRoute from "./components/ProtectedRoutes";
import PublicRoute from "./components/PublicRoutes";
import EditTransaction from "./screens/protected/EditTransaction";
import About from "./screens/public/About";
import ContactUs from "./screens/public/ContactUs";
import Services from "./screens/public/Services";
import AddTransaction from "./screens/protected/AddTransaction";
import Transactions from "./screens/protected/Transactions";
import UserProfile from "./screens/protected/UserProfile";
import VerifyEmail from "./screens/public/VerifyEmail";
import ResetPassword from "./screens/public/ResetPassword";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/addtransaction" element={<AddTransaction />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/edit-transaction/:id" element={<EditTransaction />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
        <Route element={<PublicRoute />}>
          <Route path='/reset-password/:token' element={<ResetPassword/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/services" element={<Services />} />
        <Route path='/verify-email/:token' element={<VerifyEmail/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
