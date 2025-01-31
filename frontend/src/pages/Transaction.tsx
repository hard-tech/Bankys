import { useState, useEffect } from "react";
import api from "../services/api/axios.config";
import { TransactionUser, User } from "../type/auth.types";
import TransactionItem from "../components/TransactionUser";
import { authService } from "../services/auth/auth.service";

const Transaction = () => {
    const [transactions, setTransactions] = useState<TransactionUser[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<TransactionUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [filter, setFilter] = useState<string>("ALL");

    useEffect(() => {
        const getUser = async () => {
            const user = await authService.getCurrentUser();
            setUser(user);
        };
        getUser();
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get<TransactionUser[]>("/transactions/get/all");
                setTransactions(response.data);
                setFilteredTransactions(response.data);
            } catch (err) {
                setError("Erreur lors du chargement des transactions");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        if (filter === "ALL") {
            setFilteredTransactions(transactions);
        } else if (filter === "RECEIPTS") {
            setFilteredTransactions(transactions.filter(t => t.type === "DEPOSIT" || (t.type === "TRANSFER" && t.user_id.toString() != user?.id)));
        } else if (filter === "EXPENSES") {
            setFilteredTransactions(transactions.filter(t => t.type === "TRANSFER" && t.user_id.toString() == user?.id));
        }
    }, [filter, transactions, user]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="spinner-border animate-spin border-4 border-blue-500 rounded-full w-8 h-8"></div>
        </div>
    );

    if (error) return <p className="account-error text-red-500">{error}</p>;

    // Helper function to format the date
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    };

    // Group transactions by day
    const groupByDay = (transactions: TransactionUser[]) => {
        return transactions.reduce((groups, transaction) => {
            const date = transaction.created_at.toString().split('T')[0]; // Get the date part (YYYY-MM-DD)
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(transaction);
            return groups;
        }, {} as Record<string, TransactionUser[]>);
    };

    const groupedTransactions = groupByDay(filteredTransactions);

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <div className="flex gap-4 mb-6">
                <button
                    className={`px-6 py-3 rounded-full transition-all duration-200 ${filter === "ALL" ? "bg-blue-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
                    onClick={() => setFilter("ALL")}
                >
                    Toutes
                </button>
                <button
                    className={`px-6 py-3 rounded-full transition-all duration-200 ${filter === "RECEIPTS" ? "bg-green-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-green-100"}`}
                    onClick={() => setFilter("RECEIPTS")}
                >
                    Recettes
                </button>
                <button
                    className={`px-6 py-3 rounded-full transition-all duration-200 ${filter === "EXPENSES" ? "bg-red-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-red-100"}`}
                    onClick={() => setFilter("EXPENSES")}
                >
                    Dépenses
                </button>
            </div>

            {Object.keys(groupedTransactions).length > 0 ? (
                <div className="space-y-8">
                    {Object.entries(groupedTransactions).map(([date, transactions]) => (
                        <div key={date}>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{formatDate(date)}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {transactions
                                    .filter(transaction => transaction.status !== "REJECTED")
                                    .map(transaction => (
                                        <div key={transaction.id} className="bg-gradient-to-r from-blue-200 to-green-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                                            {user && (
                                                <TransactionItem
                                                    id={transaction.id}
                                                    user_id={transaction.user_id}
                                                    account_to={transaction.account_to}
                                                    type={transaction.type}
                                                    amount={transaction.amount}
                                                    created_at={transaction.created_at}
                                                    user={user.id}
                                                    status={transaction.status}
                                                />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-10">Aucune transaction trouvée.</p>
            )}
        </div>
    );
};

export default Transaction;
