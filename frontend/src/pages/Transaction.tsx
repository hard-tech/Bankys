import { useEffect, useState } from "react";
import TransactionItem from "../components/TransactionItem";
import { Account, Transaction, TransactionStatus } from "../type/common.types";
import api from "../services/api/axios.config";
import { endpoints } from "../services/api/endpoints";

const TransactionPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Janvier 2025');
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const request = await api.get(endpoints.transactions.getAll);
        const { data } = request;
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchAccounts = async () => {
      try {
        const request = await api.get(endpoints.accounts.getAll);
        const { data } = request;
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    }

    fetchTransactions();
    fetchAccounts();
  }, []);

  if (!transactions) {
    return <p className="text-center p-8 text-gray-500">Chargement des transactions...</p>;
  }

  if (!accounts) {
    return <p className="text-center p-8 text-gray-500">Chargement des comptes...</p>;
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.transaction_note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAccount = selectedAccount === 'all' || transaction.id === parseInt(selectedAccount, 10);
    // Add logic to filter by month if needed
    return matchesSearch && matchesAccount;
  });

  const pendingAmount = transactions
    .filter(transaction => transaction.status === TransactionStatus.PENDING)
    .reduce((total, transaction) => total + transaction.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <select 
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="all">Tous mes comptes</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {accounts.reduce((total, account) => total + account.balance, 0)}€
          </h1>
          <p className="text-sm text-gray-500">En attente : {pendingAmount}€</p>
        </div>

        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Faire un virement
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <input 
          type="text"
          placeholder="Rechercher une transaction"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Filtres */}
      <div className="flex justify-between items-center mb-6">
        <select 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option>Janvier 2025</option>
          {/* Add more months as needed */}
        </select>

        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <span>Télécharger un relevé</span>
        </button>
      </div>

      {/* Onglets */}
      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        <button className="px-4 py-2 border-b-2 border-indigo-600 text-indigo-600">
          Transactions
        </button>
        <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
          Recettes
        </button>
        <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
          Dépenses
        </button>
      </div>

      {/* Liste des transactions */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="p-4 text-lg font-medium border-b border-gray-200">
          En cours
        </h2>
        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction, index) => (
            <TransactionItem
              key={index}
              {...transaction}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;