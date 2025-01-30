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
  name: string;
  balance: number;
  iban: string;
  main: boolean;
  actived: boolean;
}

export interface AddAccountModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  newAccountName: string;
  setNewAccountName: (name: string) => void;
  handleAddAccount: () => void;
}

export interface LayoutProps {
  children: React.ReactNode;
}