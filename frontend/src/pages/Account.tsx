import { useState, useEffect } from "react";
import api from "../services/api/axios.config";
import { AccountFormValues, AccountUser } from "../type/auth.types";
import AccountsUser from '../components/AccountsUser';
import AccountForm from '../components/AccountCreate';

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

    if (loading) return <p className="account-loading">Chargement des comptes...</p>;
    if (error) return <p className="account-error">{error}</p>;

    return (
        <section className="account-container">
            <AccountForm formData={formData} setFormData={setFormData} />
            <h2 className="account-title">Mes Comptes</h2>
            {accounts.length > 0 ? (
                <div className="">
                    {accounts.map((account) => (
                        <AccountsUser 
                            id={account.id}
                            name={account.name} 
                            iban={account.iban} 
                            sold={account.sold} 
                        />
                    ))}
                </div>
            ) : (
                <p className="account-no-data">Aucun compte trouvé.</p>
            )}
        </section>
    );
};

export default AccountsList;
