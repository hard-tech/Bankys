import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { RegisterCredentials } from "../type/auth.types";
import RegisterForm from "../components/RegisterForm";
import { authService } from "../services/auth/auth.service";
import { constants } from "../utils/constants";

const Register = () => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
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
          navigate(constants.ROUTES.HOME);
        }).finally(() => {
        });
      }
    };

    registerUser();
  }, [formData]);

  return (
    <div className="max-w-md mx-auto my-10">
      <RegisterForm formData={formData} setFormData={setFormData} />
    </div>
  );
};

export default Register;
