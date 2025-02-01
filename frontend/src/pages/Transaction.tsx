import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Account, Transaction, TransactionStatus } from "../type/common.types";
import api from "../services/api/axios.config";
import { endpoints } from "../services/api/endpoints";
import { toast } from "react-hot-toast";
import TransactionHeader from "../components/transactions/TransactionHeader";
import TransactionSearch from "../components/transactions/TransactionSearch";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionTabs from "../components/transactions/TransactionTabs";
import TransactionList from "../components/transactions/TransactionList";
import LoadingSpinner from "../components/common/LoadingSpinner";

const TransactionPage = () => {
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [isLoading, setIsLoading] = useState(true);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch data on mount or when location.search changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const accountIban = params.get("iban");
        const month = params.get("month") || "all";

        // Fetch transactions and accounts
        const [transactionsRes, accountsRes] = await Promise.all([
          api.get(endpoints.transactions.getAll),
          api.get(endpoints.accounts.getAll),
        ]);

        setTransactions(transactionsRes.data);
        setAccounts(accountsRes.data);
        setSelectedMonth(month);
        if (accountIban) setSelectedAccount(accountIban);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  // Event Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const iban = e.target.value;
    setSelectedAccount(iban);
    const params = new URLSearchParams(location.search);

    if (iban === "all") {
      params.delete("iban");
    } else {
      params.set("iban", iban);
    }

    navigate({ search: params.toString() });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);
    const params = new URLSearchParams(location.search);

    if (month === "all") {
      params.delete("month");
    } else {
      params.set("month", month);
    }

    navigate({ search: params.toString() });
  };

  const handleDownloadStatement = async () => {
    try {
      toast.success("Téléchargement du relevé en cours...");
      // Implement download logic here
    } catch (error) {
      toast.error("Erreur lors du téléchargement du relevé");
    }
  };

  // Utility Functions
  const getAvailableMonths = () => {
    if (!transactions) return [];

    const months = transactions.map((transaction) => {
      const date = new Date(transaction.created_at);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    });

    return [...new Set(months)].sort().reverse();
  };

  // Derived Data
  const totalBalance =
    selectedAccount === "all"
      ? accounts
          ?.reduce((sum, account) => sum + account.balance, 0)
          .toFixed(2) || "0.00"
      : accounts
          ?.find((account) => account.iban === selectedAccount)
          ?.balance.toFixed(2) || "0.00";

          const pendingAmount = transactions
          ?.filter((t, index, self) => {
            const isPending = t.status === TransactionStatus.PENDING;
            const isRelevantAccount =
              selectedAccount === "all" ||
              t.account_from_iban === selectedAccount ||
              t.account_to_iban === selectedAccount;
        
            // Check for duplicates by transaction ID
            const isUniqueTransaction = self.findIndex((tr) => tr.id === t.id) === index;
        
            return isPending && isRelevantAccount && isUniqueTransaction;
          })
          .reduce((sum, t) => {
            // Determine the sign of the amount based on the selected account
            if (selectedAccount === "all") {
              // For "all" accounts, consider only positive amounts
              return sum + Math.abs(t.amount);
            } else if (t.account_from_iban === selectedAccount) {
              // For outgoing transactions, subtract the amount
              return sum - Math.abs(t.amount);
            } else if (t.account_to_iban === selectedAccount) {
              // For incoming transactions, add the amount
              return sum + Math.abs(t.amount);
            }
            return sum;
          }, 0)
          .toFixed(2) || "0.00";
        

  // Filter Transactions
  const filteredTransactions =
    transactions?.filter((transaction) => {
      // Filter by search query
      const matchesSearch =
        transaction.transaction_note
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.amount.toString().includes(searchQuery);

      // Filter by account
      const matchesAccount =
        selectedAccount === "all" || (transaction.account_from_iban === selectedAccount && transaction.amount < 0) || (transaction.account_to_iban === selectedAccount && transaction.amount > 0);

      // Filter by month
      const transactionDate = new Date(transaction.created_at);
      const transactionMonth = `${transactionDate.getFullYear()}-${String(
        transactionDate.getMonth() + 1
      ).padStart(2, "0")}`;
      const matchesMonth = selectedMonth === "all" || transactionMonth === selectedMonth;

      // Filter by type (income or expense)
      const matchesType =
        activeTab === "all" ||
        (activeTab === "income" && transaction.amount > 0) ||
        (activeTab === "expense" && transaction.amount < 0);

      return matchesSearch && matchesAccount && matchesMonth && matchesType;
    }) || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <TransactionHeader
        selectedAccount={selectedAccount}
        accounts={accounts}
        totalBalance={totalBalance}
        pendingAmount={pendingAmount}
        onAccountChange={handleAccountChange}
      />

      <TransactionSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />

      <TransactionFilters
        selectedMonth={selectedMonth}
        availableMonths={getAvailableMonths()}
        onMonthChange={handleMonthChange}
        onDownloadClick={handleDownloadStatement}
      />

      <TransactionTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <TransactionList transactions={filteredTransactions} />
    </div>
  );
};

export default TransactionPage;