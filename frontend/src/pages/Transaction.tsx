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

    if (loading) return <p className="account-loading">Chargement des transactions...</p>;
    if (error) return <p className="account-error">{error}</p>;

    return (
        <>
            <div className="flex gap-4 mb-6">
                <button className={`px-4 py-2 rounded-lg ${filter === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setFilter("ALL")}>Toutes</button>
                <button className={`px-4 py-2 rounded-lg ${filter === "RECEIPTS" ? "bg-green-500 text-white" : "bg-gray-200"}`} onClick={() => setFilter("RECEIPTS")}>Recettes</button>
                <button className={`px-4 py-2 rounded-lg ${filter === "EXPENSES" ? "bg-red-500 text-white" : "bg-gray-200"}`} onClick={() => setFilter("EXPENSES")}>Dépenses</button>
            </div>
            {filteredTransactions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl mt-10">
                    {filteredTransactions
                        .filter(transaction => transaction.status !== "REJECTED") // 🔹 Filtrage ici
                        .map(transaction => (
                            <div key={transaction.id} className="bg-white p-4 rounded-lg shadow-md">
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
            ) : (
                <p className="text-gray-500 mt-10">Aucune transaction trouvée.</p>
            )}
        </>
    );
};

export default Transaction;
