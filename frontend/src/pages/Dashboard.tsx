// Dashboard.tsx
import React from 'react';
import AccountCard from '../components/a';

const Dashboard: React.FC = () => {

    const [accounts, setAccounts] = React.useState<Account[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Mes comptes</h1>
            <p className="text-neutral-600 mt-1">Total des actifs : 12 345€</p>
          </div>
          <button className="bg-secondary-500 text-white px-6 py-2 rounded-lg hover:bg-secondary-600 transition-colors duration-300">
            Ajouter un compte
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountCard
            title="Compte principal"
            balance="1234,56"
            accountNumber="FR76 1234 4321 0987"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;