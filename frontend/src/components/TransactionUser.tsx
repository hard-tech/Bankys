import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { TransactionUser } from "../type/auth.types";

const TransactionItem = ({ user_id, type, amount, created_at, user, status }: TransactionUser) => {
    // 🔹 Ne pas afficher la transaction si elle est rejetée
    if (status === "REJECTED") return null;

    let isReceived = false;
    let transactionLabel = "Transaction";

    // Gestion du type de transaction
    if (type === "DEPOSIT") {
        isReceived = true; // Un dépôt est toujours un crédit
        transactionLabel = "Dépôt reçu";
    } else if (type === "TRANSFER") {
        if (user_id.toString() == user) {
            isReceived = false; // L'utilisateur a envoyé de l'argent
            transactionLabel = "Virement envoyé";
        } else {
            isReceived = true; // L'utilisateur a reçu de l'argent
            transactionLabel = "Virement reçu";
        }
    }

    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
            {/* Icône */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
                    {isReceived ? (
                        <ArrowDownLeft size={20} className="text-green-500" />
                    ) : (
                        <ArrowUpRight size={20} className="text-red-500" />
                    )}
                </div>

                {/* Détails de la transaction */}
                <div>
                    <p className="text-sm font-semibold">{transactionLabel}</p>
                    <p className="text-xs text-gray-500">{new Date(created_at).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Montant */}
            <div className={`text-lg font-bold ${isReceived ? "text-green-500" : "text-red-500"}`}>
                {isReceived ? "+" : "-"} {amount} €
            </div>
        </div>
    );
};

export default TransactionItem;
