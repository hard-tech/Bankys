"use client";

import React, { useEffect, useState } from 'react';
import AccountSelector from '../components/dashboard/AccountSelector';
import { useAuth } from '../context/AuthContext';
import api from '../services/api/axios.config';
import { TransactionStats } from '../type/common.types';
import toast from 'react-hot-toast';
import { endpoints } from '../services/api/endpoints';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const prepareChartData = (stats: TransactionStats[string]) => {
    return stats.dates.map((date, index) => ({
      date: formatters.dateTime(date),
      solde: stats.sold[index],
      entrees: stats.transactionsInput[index],
      sorties: stats.transactionsOutput[index],
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mon dashboard</h1>
      <AccountSelector
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={setSelectedAccount}
      />
      
      {selectedAccount && currentStats ? (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Graphique Solde */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Solde</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareChartData(currentStats)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="solde" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graphique Entrées */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Entrées</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareChartData(currentStats)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="entrees" stroke="#4CAF50" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graphique Sorties */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Sorties</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareChartData(currentStats)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sorties" stroke="#f44336" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Graphique combiné */}
          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <h2 className="text-xl font-bold mb-4">Flux de trésorerie</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareChartData(currentStats)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="solde" stroke="#8884d8" name="Solde" />
                  <Line type="monotone" dataKey="entrees" stroke="#4CAF50" name="Entrées" />
                  <Line type="monotone" dataKey="sorties" stroke="#f44336" name="Sorties" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">Veuillez sélectionner un compte pour afficher le tableau de bord.</div>
      )}
    </div>
  );
};

export default Dashboard;