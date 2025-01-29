import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { RegisterCredentials } from "../type/auth.types";
import RegisterForm from "../components/RegisterForm";
import api from "../services/api/axios.config";

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: "",
    password: "@NewPassword123",
    first_name: "Eloise",
    last_name: "Tomlinson",
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("formData", formData);
    const registerUser = async () => {
      
      if (formData.email && formData.password && formData.first_name && formData.last_name) {
        setLoading(true);
        toast.promise(
          api.post("/auth/register", formData),
          {
            loading: 'Registering...',
            success: 'Registration successful!',
            error: (err) => {
              setError("Registration failed. Please try again.");
              return err.response?.data?.detail || "An error occurred during registration.";
            },
          }
        ).then(() => {
          navigate("/");
        }).catch(() => {
          // Handle any additional error logic here if needed
        }).finally(() => {
          setLoading(false);
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
