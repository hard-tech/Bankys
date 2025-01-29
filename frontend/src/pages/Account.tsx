import { useState, useEffect } from "react";
import api from "../services/api/axios.config";
import { AccountFormValues, AccountUser } from "../type/auth.types";
import AccountsUser from "../components/AccountsUser";
import AccountForm from "../components/AccountCreate";
import { toast } from "react-hot-toast";

const AccountsList = () => {
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
  }, []);

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
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Formulaire de création */}
      <div>
        <AccountForm formData={formData} setFormData={setFormData} />
      </div>

      <h2 className="text-2xl font-bold mt-6">Mes Comptes</h2>

      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl mt-4">
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
        <p className="text-gray-500 mt-4">Aucun compte trouvé.</p>
      )}
    </section>
  );
};

export default AccountsList;
