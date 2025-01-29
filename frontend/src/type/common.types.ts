export interface MenuItem {
  title: string;
  icon: JSX.Element;
  path: string;
}

export interface AccountCardProps {
  title: string;
  balance: string;
  iban: string;
  onCloseAccount: (iban: string) => void;
}

export interface Account {
  id: string;
  account_name: string;
  balance: number;
  iban: string;
}