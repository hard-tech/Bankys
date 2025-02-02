import React, { useEffect, useState } from 'react';
import AccountSelector from '../components/dashboard/AccountSelector';
import { useAuth } from '../context/AuthContext';
import api from '../services/api/axios.config';
import { TransactionStats } from '../type/common.types';
import toast from 'react-hot-toast';
import { endpoints } from '../services/api/endpoints';
import { formatters } from '../utils/formatters';
import DashboardCharts from '../components/dashboard/DashboardCharts';

const Dashboard: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
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

    return stats.dates.map((date, index) => {
      const formattedDate = new Date(date);
      return {
        date: formatters.dateTime(formattedDate),
        fullDate: formattedDate,
        solde: stats.sold[index],
        entrees: stats.transactionsInput[index],
        sorties: stats.transactionsOutput[index],
      };
    }).filter(data => {
      if (selectedMonth === 'all') return true;
      const [month, year] = selectedMonth.split('-');
      return data.fullDate.getMonth() === parseInt(month) - 1 &&
             data.fullDate.getFullYear() === parseInt(year);
    });
  };

  const generateMonthOptions = () => {
    const options = [{ value: 'all', label: 'Tous les mois' }];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      const label = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mon dashboard</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <AccountSelector
          accounts={accounts}
          selectedAccount={selectedAccount}
          onSelectAccount={setSelectedAccount}
        />
        <select
          className="mt-4 md:mt-0 p-2 border rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {generateMonthOptions().map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {selectedAccount && currentStats ? (
        <DashboardCharts currentStats={currentStats} prepareChartData={prepareChartData} />
      ) : (
        <div className="mt-6">Veuillez sélectionner un compte pour afficher le tableau de bord.</div>
      )}
    </div>
  );
};

export default Dashboard;