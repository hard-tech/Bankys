import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { Account } from '../../type/common.types';

interface AccountSelectorProps {
  accounts: Account[] | null;
  selectedAccount: string | null;
  onSelectAccount: (accountId: string) => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ accounts, selectedAccount, onSelectAccount }) => {
  return (
    <Select
      value={selectedAccount || ''}
      onChange={(e) => onSelectAccount(e.target.value as string)}
      displayEmpty
      className="w-full md:w-64"
    >
      <MenuItem value="" disabled>
        Sélectionnez un compte
      </MenuItem>
      {accounts?.map((account: Account) => (
        <MenuItem key={account.id} value={account.iban}>
          {account.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default AccountSelector;