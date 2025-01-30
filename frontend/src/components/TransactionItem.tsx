import { AiOutlineDollar } from "react-icons/ai";
import { Transaction } from "../type/common.types";

const TransactionItem = ({ ...Transaction }: Transaction) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50">
    <div className="flex items-center space-x-4">
      <div className="p-2 rounded-full bg-gray-200">
        <AiOutlineDollar className="w-6 h-6 text-gray-600" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-900">
          {Transaction.transaction_note}
        </h3>
        <span className="text-xs text-gray-500">
          {Transaction.account_from_iban}
        </span>
        <span className="text-xs text-gray-500">
          {Transaction.account_to_iban}
        </span>
      </div>
    </div>
    <span className={`text-sm font-medium ${
      Transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
    }`}>
      {Transaction.amount > 0 ? '+' : ''}{Transaction.amount} €
    </span>
  </div>
);

export default TransactionItem;
