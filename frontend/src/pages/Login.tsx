import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LoginCredentials } from "../type/auth.types";
import { authService } from "../services/auth/auth.service";
import LoginForm from "../components/LoginForm";

const Login = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "@NewPassword123",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loginUser = async () => {
      
      if (formData.email && formData.password) {
        toast.promise(
          // api.post("/auth/register", formData),  
          authService.login(formData),
          {
            loading: 'Logging in...',
            success: 'Login successful!',
            error: (err) => {
              return err.response?.data?.detail?.message || "An error occurred during the login process.";
            },
          }
        ).then(() => {
          navigate("/");
        }).catch(() => {
        }).finally(() => {
        });
      }
    };

    loginUser();
  }, [formData]);

  return (
    <LoginForm formData={formData} setFormData={setFormData} />
  );
};

export default Login;
