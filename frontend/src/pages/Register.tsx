import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { RegisterCredentials } from "../type/auth.types";
import RegisterForm from "../components/RegisterForm";
import api from "../services/api/axios.config";
import { authService } from "../services/auth/auth.service";

const Register = () => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: "",
    password: "@NewPassword123",
    first_name: "Eloise",
    last_name: "Tomlinson",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const registerUser = async () => {
      
      if (formData.email && formData.password && formData.first_name && formData.last_name) {
        toast.promise(
          // api.post("/auth/register", formData),  
          authService.register(formData),
          {
            loading: 'Registering...',
            success: 'Registration successful!',
            error: (err) => {
              return err.response?.data?.detail?.message || "An error occurred during registration.";
            },
          }
        ).then(() => {
          toast.promise(
            authService.login({ email: formData.email, password: formData.password }),
            {
              loading: 'Logging in...',
              success: 'Login successful!',
              error: (err) => {
                return err.response?.data?.detail?.message || "An error occurred during login.";
              },
            }
          )
          navigate("/");
        }).catch(() => {
        }).finally(() => {
        });
      }
    };

    registerUser();
  }, [formData]);

  return (
    <RegisterForm formData={formData} setFormData={setFormData} />
  );
};

export default Register;
