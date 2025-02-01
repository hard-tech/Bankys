"use client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LoginCredentials } from "../type/auth.types";
import LoginForm from "../components/LoginForm.tsx";
import { authService } from "../services/auth/auth.service";
import { constants } from "../utils/constants.ts";

const Login = () => {
  const navigate = useNavigate();

  const handelSubmit = async (data: LoginCredentials) => {
    console.log(data);

    if(data.rememberMe) {
      localStorage.setItem(constants.STORAGE_KEYS.SAVED_EMAIL, data.email);
      localStorage.setItem(constants.STORAGE_KEYS.SAVED_PASSWORD, data.password);
      localStorage.setItem(constants.STORAGE_KEYS.SAVED_REMEMBER_ME, 'true');
    }
    
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
      navigate(constants.ROUTES.HOME);
      window.location.reload();
    });
  };

  return (
    <div className="max-w-md mx-auto my-10">
      <LoginForm handelSubmit={handelSubmit} />
    </div>
  );
};

export default Login;