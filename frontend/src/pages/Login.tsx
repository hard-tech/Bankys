import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LoginCredentials, RegisterCredentials } from "../type/auth.types";
import LoginForm from "../components/LoginForm.tsx";
import { authService } from "../services/auth/auth.service";

const Login = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const registerUser = async () => {
      
      if (formData.email && formData.password) {
        toast.promise(
          // api.post("/auth/register", formData),  
          authService.login(formData),
          {
            loading: 'Login...',
            success: 'Login successful!',
            error: (err) => {
              return err.response?.data?.detail?.message || "An error occurred during registration.";
            },
          }
        ).then(() => {
          navigate("/");
        }).catch(() => {
          // Handle any additional error logic here if needed
        }).finally(() => {
        });
      }
    };

    registerUser();
  }, [formData]);

  return (
    <LoginForm formData={formData} setFormData={setFormData} />
  );
};

export default Login;