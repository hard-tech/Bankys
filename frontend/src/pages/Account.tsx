import { useState, useEffect } from "react";
import api from "../services/api/axios.config";
import { AccountFormValues, AccountUser } from "../type/auth.types";
import AccountsUser from "../components/AccountsUser";
import AccountForm from "../components/AccountCreate";
import { toast } from "react-hot-toast";

const Account = () => {
  const [formData, setFormData] = useState<AccountFormValues>({
    name: "",
    type: "",
  });
  const [accounts, setAccounts] = useState<AccountUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get<AccountUser[]>("/account/get/all");
        setAccounts(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des comptes");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [accounts]);

  useEffect(() => {
    const addAccount = async () => {
      if (formData.name) {
        toast
          .promise(api.post(`/account/create/${formData.name}`), {
            loading: "Ajout",
            success: "Ajouté avec succès",
            error: (err) => {
              return (
                err.response?.data?.detail?.message ||
                "An error occurred during registration."
              );
            },
          })
          .then((response) => {
            setAccounts((prevAccounts) => [...prevAccounts, response.data]);
            setFormData({ name: "", type: "" });
          })
          .catch(() => {
            // Handle any additional error logic here if needed
          });
      }
    };

    addAccount();
  }, [formData]);

  if (loading)
    return <p className="account-loading">Chargement des comptes...</p>;
  if (error) return <p className="account-error">{error}</p>;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Conteneur du titre et du bouton */}
      <div className="absolute top-4 w-full px-6 flex justify-between items-center">
        {/* Titre en haut à gauche */}
        <h2 className="text-5xl font-bold">Mes Comptes</h2>

        {/* Bouton en haut à droite */}
        <AccountForm formData={formData} setFormData={setFormData} />
      </div>

      {/* Contenu principal */}
      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl mt-20">
          {accounts.map((account) => (
            <div key={account.id} className="bg-white p-4 rounded-lg shadow-md">
              <AccountsUser
                id={account.id}
                name={account.name}
                iban={account.iban}
                sold={account.sold}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-20">Aucun compte trouvé.</p>
      )}
    </section>
  );
};

export default Account;
