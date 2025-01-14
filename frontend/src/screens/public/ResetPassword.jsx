import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const {token} = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: 'sumit@123',
        confirmPassword: 'sumit@123'
    });

    const handleReset = async (e) => {
        e.preventDefault(); 
        console.log("Inside the handleReset function");
        console.log(formData);
        console.log(token);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/reset-password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({formData, token})
            });

            if (response.ok) {
                console.log("Password reset successful");
                alert("Password Reset successful. Redirecting to the login page");
                toast.success("Password Changed. Redirecting to Login Page", {autoClose : 4000});
                setFormData({});
                navigate('/login');
            } else {
                toast.error("Password Reset failed");
                console.log("Password reset failed");
            }
        } catch (error) {
            toast.error("Password Reset failed");
            console.error("Error resetting password:", error);
        }
    }

    return (
        <div className='w-full h-screen bg-slate-100 flex flex-col justify-center items-center'>
            <div className='w-1/2 h-80 bg-white shadow-lg flex flex-col justify-center items-center'>
                <h2 className='font-bold text-4xl my-2'>Reset your password</h2>
                <form className='flex flex-col' onSubmit={handleReset}>
                    <input
                        value={formData.newPassword}
                        type="password"
                        className='h-12 border-gray-300 rounded-sm border-2 text-lg p-2 my-5'
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        placeholder='Enter new Password'
                    />
                    <input
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        type="password"
                        className='h-12 border-gray-300 rounded-sm border-2 text-lg p-2 my-5'
                        placeholder='Confirm Password'
                    />
                    <button type='submit' className='w-full h-12 bg-blue-500 text-white hover:bg-blue-800 cursor-pointer active:scale-95'>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
