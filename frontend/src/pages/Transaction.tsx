import { useEffect, useState } from "react";
import TransactionItem from "../components/TransactionItem";
import { Transaction } from "../type/common.types";
import api from "../services/api/axios.config";
import { endpoints } from "../services/api/endpoints";

const TransactionPage = () => {
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Janvier 2025');
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  useEffect(() => {
    // Récupérer les transactions depuis l'API
    const fetchTransactions = async () => {
      try {
        const request = await api.get(endpoints.transactions.getAll);
        const { data } = request;
        console.log('Transactions:', data);
        
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  if(!transactions) {
    return <p>Chargement des transactions...</p>;
  }

  return (
    <div className="transaction-page">
      {/* En-tête */}
      <div className="header">
        <div className="account-selector">
          <select 
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="all">Tous mes comptes</option>
          </select>
        </div>
        
        <div className="balance-info">
          <h1 className="amount">1234,56€</h1>
          <p className="pending">En attente : 0€</p>
        </div>
        
        <button className="transfer-button">
          Faire un virement
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="search-bar">
        <input 
          type="text"
          placeholder="Rechercher une transaction"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filtres */}
      <div className="filters">
        <select 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option>Janvier 2025</option>
        </select>
        
        <button className="download-button">
          Télécharger un relevé
        </button>
      </div>

      {/* Onglets */}
      <div className="tabs">
        <button className="tab active">Transactions</button>
        <button className="tab">Recettes</button>
        <button className="tab">Dépenses</button>
      </div>

      {/* Liste des transactions */}
      <div className="transactions-list">
        <h2>En cours</h2>
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            {...transaction}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionPage;