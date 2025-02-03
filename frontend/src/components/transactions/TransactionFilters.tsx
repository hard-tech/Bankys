// src/components/transactions/TransactionFilters.tsx
import { AiOutlineDownload } from "react-icons/ai";

interface TransactionFiltersProps {
  selectedMonth: string;
  availableMonths: string[];
  onMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDownloadClick: () => void;
}

const TransactionFilters = ({
  selectedMonth,
  availableMonths,
  onMonthChange,
  onDownloadClick
}: TransactionFiltersProps) => {
  return (
    <div className="flex justify-between items-center">
      <select 
        value={selectedMonth}
        onChange={onMonthChange}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">Toutes les dates</option>
        {availableMonths.map(month => (
          <option key={month} value={month}>
            {new Date(month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </option>
        ))}
      </select>

      <button 
        onClick={onDownloadClick}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
      >
        <AiOutlineDownload className="text-gray-600" />
        <span>Télécharger un relevé</span>
      </button>
    </div>
  );
};

export default TransactionFilters;