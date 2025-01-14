import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyEmail = () => {
  const {token} = useParams();
  const [verified, setVerified] = useState(true);
  const navigate = useNavigate();
  const verifyEmail = async ()=>{
    console.log("Inside the verify email");
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/verify-email/${token}`,{
      method : "GET",
      credentials : 'include',
    });
    if(response.ok){
      setVerified(true);
    }else{
      setVerified(false);
    }
  }
  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <div className='flex text-xl gap-4 flex-col justify-center items-center h-screen'>
 
    {
      verified &&  <div className='flex text-xl gap-4 flex-col justify-center items-center '>
        <h1 className='text-5xl font-bold my-5'>Welcome to Expense Trackr App</h1>
      <p className=''> <span className='text-blue-500'>Congratulations!</span> You have been verified </p>
       <p> Please login to your account!!!</p>
      <button onClick={()=> navigate('/login')} className='bg-blue-500 text-white p-3 rounded-md hover:bg-blue-800 active:scale-95'>Click to Login</button>
      </div>
    }
    {!verified && <div className='flex text-xl gap-4 flex-col justify-center items-center '>
      <h1 className='text-5xl font-bold my-5'>Welcome to Expense Trackr App</h1>
      <p className=''> <span className='text-red-500'>Sorry!</span> Unable to verify your account. </p>
       <p> Please SignUp again to create account!!</p>
       <button onClick={()=> navigate('/signup')} className='bg-blue-500 text-white p-3 rounded-md hover:bg-blue-800 active:scale-95'>Click to Signup</button>
      </div>}
    </div>
  );
};

export default VerifyEmail;
