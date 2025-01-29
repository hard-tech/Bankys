import { BsThreeDotsVertical } from "react-icons/bs";
import { AccountCardProps } from "../type/common.types";

const AccountCard: React.FC<AccountCardProps> = ({ title, balance, accountNumber }) => {
    return(
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-neutral-200">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold text-primary-800">{title}</h3>
      <button className="text-neutral-500 hover:text-primary-600 transition-colors">
        <BsThreeDotsVertical className="h-5 w-5" />
      </button>
    </div>
    <div className="mb-4">
      <span className="text-2xl font-bold text-primary-900">{balance}€</span>
      <p className="text-sm text-neutral-500 mt-1">{accountNumber}</p>
    </div>
    <div className="flex gap-4 pt-4 border-t border-neutral-200">
      <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
        Transactions
      </button>
      <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
        Cartes
      </button>
    </div>
  </div>
)};

export default AccountCard;