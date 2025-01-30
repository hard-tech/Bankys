// src/components/transactions/TransactionSearch.tsx
import { AiOutlineSearch } from "react-icons/ai";

interface TransactionSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TransactionSearch = ({ searchQuery, onSearchChange }: TransactionSearchProps) => {
  return (
    <div className="relative">
      <input 
        type="text"
        placeholder="Rechercher une transaction"
        value={searchQuery}
        onChange={onSearchChange}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
      <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
};

export default TransactionSearch;