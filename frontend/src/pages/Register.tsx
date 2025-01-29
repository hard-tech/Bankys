import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { RegisterCredentials } from "../type/auth.types";
import RegisterForm from "../components/RegisterForm";
import { authService } from "../services/auth/auth.service";

const Register = () => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const registerUser = async () => {
      if (
        formData.email &&
        formData.password &&
        formData.first_name &&
        formData.last_name
      ) {
        setLoading(true);
        try {
          await toast.promise(authService.register(formData), {
            loading: "Inscription en cours...",
            success: "Inscription réussie !",
            error: (err) =>
              err.response?.data?.detail?.message || "Une erreur est survenue.",
          });
          navigate("/");
        } catch (error) {
          console.error("Erreur d'inscription :", error);
        } finally {
          setLoading(false);
        }
      }
    };

    registerUser();
  }, [formData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Inscription
        </h2>

        {/* Formulaire avec espacement entre chaque champ */}
        <div className="space-y-4">
          <RegisterForm formData={formData} setFormData={setFormData} />
        </div>

        {loading && (
          <p className="text-center text-gray-500 mt-4">
            Veuillez patienter...
          </p>
        )}
        <br></br>
        <br></br>
        <div className="border-t border-gray-400 my-4"></div>
        {/* Bouton pour aller vers la connexion */}
        <p className="text-center text-gray-700 mt-6">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-blue-800 font-semibold underline hover:underline"
          >
            Connectez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
