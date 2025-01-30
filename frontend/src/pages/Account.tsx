// Account.tsx
import React, { useEffect, useState } from "react";
import AccountCard from "../components/accounts/AccountCard";
import api from "../services/api/axios.config";
import { endpoints } from "../services/api/endpoints";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import AddAccountModal from "../components/accounts/AddAccountModal";
import { Account } from "../type/common.types";

const AccountPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccountName, setNewAccountName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    api.get(endpoints.accounts.getAll).then((response) => {
      setAccounts(response.data);
    }).catch(() => {
      toast.error("Erreur lors de la récupération des comptes");
    });
  };

  const handleCloseAccount = (iban: string) => {
    toast.promise(
      api.delete(endpoints.accounts.close(iban)),
      {
        loading: 'Fermeture du compte...',
        success: 'Compte fermé avec succès !',
        error: (err) => {
          return err.response?.data?.detail?.message || "Une erreur est survenue lors de la fermeture du compte.";
        },
      }
    ).then(() => {
      fetchAccounts();
    });
  };

  const handleAddAccount = () => {
    if (newAccountName.trim() === "") {
      toast.error("Veuillez entrer un nom de compte valide");
      return;
    }

    toast.promise(
      api.post(endpoints.accounts.create, { account_name: newAccountName }),
      {
        loading: 'Création du compte...',
        success: 'Compte créé avec succès !',
        error: (err) => {
          return err.response?.data?.detail?.message || "Une erreur est survenue lors de la création du compte.";
        },
      }
    ).then(() => {
      setIsModalOpen(false);
      setNewAccountName("");
      fetchAccounts();
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Mes comptes</h1>
            <p className="text-neutral-600 mt-1">
              Total des actifs : {accounts.reduce((total, account) => total + account.balance, 0).toFixed(2)}€
            </p>
          </div>
          <Button 
            variant="contained"
            className="bg-secondary-500 px-6 py-2 rounded-lg hover:bg-secondary-600 transition-colors duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter un compte
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((account, index) => (
            <AccountCard
              key={index}
              title={account.name}
              balance={String(account.balance)}
              iban={account.iban}
              onCloseAccount={handleCloseAccount}
            />
          ))}
        </div>
      </div>
      <AddAccountModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        newAccountName={newAccountName}
        setNewAccountName={setNewAccountName}
        handleAddAccount={handleAddAccount}
      />
    </div>
  );
};

export default AccountPage;