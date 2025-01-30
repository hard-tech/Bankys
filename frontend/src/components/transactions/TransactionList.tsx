// src/components/transactions/TransactionList.tsx
import { Transaction } from "../../type/common.types";
import TransactionItem from "./TransactionItem";

interface TransactionListProps {
  transactions: Transaction[] | null;
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="p-4 text-lg font-medium border-b border-gray-200">
        En cours
      </h2>
      <div className="divide-y divide-gray-200">
        {transactions?.map((transaction, index) => (
          <TransactionItem
            key={`${transaction.id}-${index}`}
            {...transaction}
          />
        ))}
        {transactions?.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            Aucune transaction trouvée
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;