import { Transaction } from "../type/common.types";
const TransactionItem = ( {...Transaction} :Transaction) => (
    <div className="transaction-item">
      {/* <div className="transaction-left">
        <div className={`transaction-icon ${icon}`}></div>
        <div className="transaction-info">
          <h3>{title}</h3>
          <span className="subtitle">{subtitle}</span>
        </div>
      </div>
      <span className={`amount ${amount > 0 ? 'positive' : 'negative'}`}>
        {amount > 0 ? '+' : ''}{amount} €
      </span> */}
    </div>
  );  

  export default TransactionItem;