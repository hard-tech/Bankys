import React from 'react';
import { Transaction, TransactionStatus, TransactionType } from '../../type/common.types';
import { AiOutlineArrowRight, AiOutlineShoppingCart, AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { formatters } from '../../utils/formatters';

interface TransactionItemProps extends Transaction {}

const TransactionItem: React.FC<TransactionItemProps> = ({
  id,
  amount,
  transaction_note,
  status,
  account_from_iban,
  account_to_iban,
  type,
  created_at
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case TransactionStatus.REJECTED:
        return 'bg-red-50';
      case TransactionStatus.PENDING:
        return 'bg-orange-50';
      case TransactionStatus.COMPLETED:
        return 'bg-green-50';
      default:
        return 'hover:bg-gray-50';
    }
  };

  const getIcon = () => {
    switch (type) {
      case TransactionType.TRANSFER:
        return <AiOutlineArrowRight className="w-5 h-5" />;
      case TransactionType.DEPOSIT:
        return <AiOutlineArrowDown className="w-5 h-5" />;
      case TransactionType.WITHDRAWAL:
        return <AiOutlineArrowUp className="w-5 h-5" />;
      default:
        return <AiOutlineShoppingCart className="w-5 h-5" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case TransactionStatus.REJECTED:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Rejeté
          </span>
        );
      case TransactionStatus.PENDING:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
            En attente
          </span>
        );
      case TransactionStatus.COMPLETED:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Complété
          </span>
        );
      default:
        return null;
    }
  };

  const getTransactionTypeLabel = () => {
    switch (type) {
      case TransactionType.TRANSFER:
        return 'Virement';
      case TransactionType.DEPOSIT:
        return 'Dépôt';
      case TransactionType.WITHDRAWAL:
        return 'Retrait';
      default:
        return 'Transaction';
    }
  };
  return (
    <div className={`p-4 flex items-center gap-4 transition-colors ${getStatusStyles()}`}>
      {/* Icon Section */}
      <div className={`p-2 rounded-full ${amount >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
        <div className={`${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {getIcon()}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">{transaction_note || getTransactionTypeLabel()}</h3>
          {getStatusBadge()}
        </div>

        <div className="mt-1 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-medium">De:</span>
            <span className="font-mono">{formatters.formatIBAN(account_from_iban)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">À:</span>
            <span className="font-mono">{formatters.formatIBAN(account_to_iban)}</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="text-right">
        <div className={`font-medium ${amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
          {amount < 0 ? '-' : '+'}{Math.abs(amount).toLocaleString('fr-FR', {
            style: 'currency', 
            currency: 'EUR' 
          })}
        </div>
        <div className="text-xs text-gray-500">
          {formatters.date(created_at)}
        </div>
        <div className="text-xs text-gray-400">
          ID: {id}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;