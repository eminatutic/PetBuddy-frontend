import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import './SignUp.css'; 
import axiosInstance from '../../axios/axiosInstance.jsx';
import FormLS from "../../components/FormLS/FormLS.jsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fields = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter your username",
    required: true,
  },
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
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
    required: true,
  },
];

function SignUp() {
const location = useLocation();
const from = location.state?.from || '/';
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const navigate = useNavigate(); 

const handleSubmit = async (formData) => {
  setLoading(true);
  setError("");

  
  if (!validateForm(formData)) {
    setLoading(false);
    return;
  }

  try {
    const response = await axiosInstance.post("/User/register-user", formData);
    toast.success(response.data + " Redirecting to login...");
    setTimeout(() => navigate("/login", { state: { from } }), 2000);
  } catch (err) {
    if (err.response && err.response.status === 400) {
      setError(err.response.data);
      toast.error(err.response.data);
    } else {
      setError("Registration failed. Please try again.");
      toast.error("Registration failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

const validateForm = (formData) => {
  console.log("Form data during validation:", formData); 
  
  if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
    setError("All fields are required.");
    return false;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    console.log("Passwords do not match:", formData.password, formData.confirmPassword); 
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(formData.email)) {
    setError("Please enter a valid email address.");
    return false;
  }

  const password = formData.password;

  if (password.length < 5) {
    setError("Password must be at least 5 characters.");
    return false;
  }

  if (/^\d+$/.test(password)) {
    setError("Password cannot be only numbers.");
    return false;
  }

  if (!/[a-z]/.test(password)) {
    setError("Password must contain at least one lowercase letter.");
    return false;
  }
  if (!/[0-9]/.test(password)) {
    setError("Password must contain at least one number.");
    return false;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    setError("Password must contain at least one special character.");
    return false;
  }

  return true;
};

  
return (
  <FormLS
      title="Sign up"
      fields={fields}
      submitButtonText={loading ? "Signing up..." : "Sign up"}
      onSubmit={handleSubmit}  
      imageSrc="/images/New Project (1)1.jpg"
      pageType="signup"
      error={error}
      loading={loading}
  />
);
}

export default SignUp;
