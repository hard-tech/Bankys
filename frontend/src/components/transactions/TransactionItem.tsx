import React from 'react';
import { Transaction, TransactionStatus } from '../../type/common.types';

interface TransactionItemProps extends Transaction {}

const TransactionItem: React.FC<TransactionItemProps> = ({ id, amount, transaction_note, status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case TransactionStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case TransactionStatus.PENDING:
        return 'bg-orange-100 text-orange-800';
      default:
        return '';
    }
  };

  return (
    <div className={`p-4 flex justify-between items-center ${getStatusStyles()}`}>
      <div>
        <p className="font-medium">{transaction_note}</p>
        <p className="text-sm text-gray-500">ID: {id}</p>
      </div>
      <div className={"font-bold " + (amount < 0 ? "text-red-500" : "text-green-500")}>
        {(amount < 0 ? "-" : "+")}{Math.abs(amount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
      </div>
    </div>
  );
};

export default TransactionItem;
