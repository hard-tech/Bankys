"use client";

import React, { useEffect, useState } from 'react';
import AccountSelector from '../components/dashboard/AccountSelector';
import { useAuth } from '../context/AuthContext';
import api from '../services/api/axios.config';
import { TransactionStats } from '../type/common.types';
import toast from 'react-hot-toast';
import { endpoints } from '../services/api/endpoints';
import { formatters } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<TransactionStats | undefined>(undefined);
  const [currentStats, setCurrentStats] = useState<TransactionStats[string] | undefined>(undefined);
  const { accounts } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(endpoints.transactions.stats);
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques', error);
        toast.error('Erreur lors de la récupération des statistiques');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (stats && accounts && selectedAccount) {
      if (selectedAccount) {
        setCurrentStats(stats[selectedAccount]);
      }
    } else {
      setCurrentStats(undefined);
    }
  }, [selectedAccount, accounts]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!accounts) {
    return <div>Compte non trouvé</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mon tableau de bord</h1>
      <AccountSelector
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={setSelectedAccount}
      />
      {selectedAccount && currentStats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
            {/* Sold */}
            <div>
              <h2 className="text-xl font-bold mb-2">Solde</h2>
              {currentStats.sold.map((s, i) => (
                <div className='text-green-500' key={i}>{s}</div>
              ))}
            </div>
            {/* Input */}
            <div>
              <h2 className="text-xl font-bold mb-2">Entrées</h2>
              {currentStats.transactionsInput.map((t, i) => (
                <div className='text-blue-500' key={i}>{t}</div>
              ))}
            </div>
            {/* Output */}
            <div>
              <h2 className="text-xl font-bold mb-2">Sorties</h2>
              {currentStats.transactionsOutput.map((t, i) => (
                <div className='text-purple-500' key={i}>{t}</div>
              ))}
            </div>
            {/* Date */}
            <div>
              <h2 className="text-xl font-bold mb-2">Date</h2>
              {currentStats.dates.map((d, i) => (
                <div className='text-gray-500' key={i}>{formatters.dateTime(d)}</div>
              ))}
            </div>
            {/* Type */}
            <div>
              <h2 className="text-xl font-bold mb-2">Type</h2>
              {currentStats.types.map((t, i) => (
                <div className='text-yellow-500' key={i}>{t}</div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6">Veuillez sélectionner un compte pour afficher le tableau de bord.</div>
      )}
    </div>
  );
};

export default Dashboard;