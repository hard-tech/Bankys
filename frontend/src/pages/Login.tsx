"use client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LoginCredentials } from "../type/auth.types";
import LoginForm from "../components/LoginForm.tsx";
import { authService } from "../services/auth/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const handelSubmit = async (data: LoginCredentials) => {
    await toast.promise(
      authService.login(data),
      {
        loading: 'Login...',
        success: 'Login successful!',
        error: (err) => {
          return err.response?.data?.detail?.message || "An error occurred during login.";
        },
      }
    ).then(() => {
      navigate("/");
    });
  };

  return (
    <LoginForm handelSubmit={handelSubmit} />
  );
};

export default Login;