import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LoginCredentials } from "../type/auth.types";
import LoginForm from "../components/LoginForm";
import { authService } from "../services/auth/auth.service";

const Login = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (formData.email && formData.password) {
      setLoading(true);
      try {
        await toast.promise(authService.login(formData), {
          loading: "Connexion en cours...",
          success: "Connexion réussie !",
          error: "Une erreur est survenue lors de la connexion.",
        });
        navigate("/");
      } catch (error) {
        console.error("Erreur de connexion :", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Connexion
        </h2>

        {/* Formulaire avec espacement entre chaque champ */}
        <div className="space-y-4">
        <LoginForm formData={formData} setFormData={setFormData} onSubmit={handleLogin} />
        </div>

        {loading && (
          <p className="text-center text-gray-500 mt-4">
            Veuillez patienter...
          </p>
        )}

        <div className="border-t border-gray-400 my-4"></div>
        {/* Bouton pour aller vers l'inscription */}
        <p className="text-center text-gray-700 mt-6">
          Vous n'avez pas encore de compte ?{" "}
          <Link
            to="/register"
            className="text-blue-800 font-semibold underline hover:underline"
          >
            Inscrivez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
