import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LogIn.css';
import axiosInstance from '../../axios/axiosInstance.jsx';
import FormLS from "../../components/FormLS/FormLS.jsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../../context/AppContext';

const fields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];

function LogIn() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AppContext); 
  const from = location.state?.from?.pathname || "/";

const handleSubmit = async (formData) => {
  setLoading(true);
  setError("");

  try {
    const response = await axiosInstance.post("/User/login-user", formData);
    const result = response.data;

    login(result);
    navigate(from);

    setLoading(false);  
  } catch (err) {
    console.log(err);
    const msg = err.response?.data?.message || "Login failed. Please try again.";
    setError(msg);
    toast.error(msg);
    
    setLoading(false);  
  }
};
  return (
    <div className='login-page'>
      <FormLS
        title="Log in"
        fields={fields}
        submitButtonText={loading ? "Logging in..." : "Log in"}
        onSubmit={handleSubmit}
        imageSrc="/images/New Project (1)1.jpg"
        pageType="login"
        error={error}
        loading={loading}
      />
    </div>
  );
}

export default LogIn;
