import React from 'react';
import { useParams } from 'react-router-dom';

const Transaction: React.FC = () => {
  const { iban } = useParams<{ iban: string }>();

  return (
    <div>
      <h1>Transactions for IBAN: {iban}</h1>
      {/* Render transactions related to the IBAN */}
    </div>
  );
};

export default Transaction;