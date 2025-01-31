export interface MenuItem {
    title: string;
    icon: JSX.Element;
    path: string;
  }
  
  export interface AccountCardProps {
    title: string;
    balance: string;
    iban: string;
    onCloseAccount: (iban: string, password: string) => void;
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
  
  export interface Transaction {
    id: number;
    account_to_iban: string;
    account_from_iban: string;
    created_at: Date;
    updated_at: Date;
    type: TransactionType;
    amount: number;
    user_id: number;
    status: TransactionStatus;
    transaction_note: string;
  }
  
  export enum TransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    TRANSFER = "TRANSFER",
    CLOSING = "CLOSING"
  }
  
  export enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED"
  }