// src/components/transactions/TransactionHeader.tsx
import { Account } from "../../type/common.types";

interface TransactionHeaderProps {
  selectedAccount: string;
  accounts: Account[] | null;
  totalBalance: string;
  pendingAmount: string;
  onAccountChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTransferClick: () => void;
}

const TransactionHeader = ({
  selectedAccount,
  accounts,
  totalBalance,
  pendingAmount,
  onAccountChange,
  onTransferClick
}: TransactionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <select 
        value={selectedAccount}
        onChange={onAccountChange}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">Tous mes comptes</option>
        {accounts?.map(account => (
          <option key={account.iban} value={account.iban}>
            {account.name} - {account.iban}
          </option>
        ))}
      </select>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {Number(totalBalance).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </h1>
        <p className="text-sm text-gray-500">
          En attente : {Number(pendingAmount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>

      <button 
        onClick={onTransferClick}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Faire un virement
      </button>
    </div>
  );
};

export default TransactionHeader;