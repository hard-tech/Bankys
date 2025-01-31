import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Import du hook de navigation
import api from "../services/api/axios.config";
import { AccountUser, BeneficiaireUser } from "../type/auth.types";
import BeneficiairesUser from "../components/BeneficiairesUser";
import BeneficiaireForm from "../components/BeneficiairesCreate";
import AccountsBeneficiaire from "../components/AccountsBeneficiaire";

const Beneficiaire = () => {
  const [beneficiaires, setBeneficiaires] = useState<BeneficiaireUser[]>([]);
  const [accounts, setAccounts] = useState<AccountUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // 🔹 Hook pour rediriger

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get<AccountUser[]>("/account/get/all");
        setAccounts(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des comptes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchBeneficiaires = async () => {
      try {
        const response = await api.get<BeneficiaireUser[]>(
          "/beneficiaires/get/all"
        );
        setBeneficiaires(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des bénéficiaires", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiaires();
  }, [beneficiaires]);

  if (loading)
    return (
      <p className="text-center text-gray-500">Chargement des données...</p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="flex flex-col items-center min-h-screen bg-gray-100 py-12 px-6">
      <div className="flex justify-between w-full max-w-4xl items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Gestion des Bénéficiaires
        </h2>
        <BeneficiaireForm setBeneficiaires={setBeneficiaires} />
      </div>

      {/* Section Comptes bancaires */}
      <div className="w-full max-w-4xl">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          💳 Mes Comptes Bancaires
        </h3>
        {accounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/virement?iban=${account.iban}`)} // 🔹 Redirection avec IBAN
              >
                <AccountsBeneficiaire
                  id={account.id}
                  name={account.name}
                  iban={account.iban}
                  sold={account.sold}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Aucun compte trouvé.</p>
        )}
      </div>

      {/* Section Bénéficiaires */}
      <div className="w-full max-w-4xl mt-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          🏦 Bénéficiaires Ajoutés
        </h3>
        {beneficiaires.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {beneficiaires.map((beneficiaire) => (
              <div
                key={beneficiaire.id}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/virement?iban=${beneficiaire.iban}`)} // 🔹 Redirection avec IBAN
              >
                <BeneficiairesUser
                  id={beneficiaire.id}
                  name={beneficiaire.name}
                  iban={beneficiaire.iban}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            Aucun bénéficiaire trouvé.
          </p>
        )}
      </div>
    </section>
  );
};

export default Beneficiaire;
