import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../services/api/axios.config";
import { AccountUser } from "../type/auth.types";
import AccountClose from "./AccountClose"; // Importation du modal

const AccountsUser = ({ id, name, iban, sold }: AccountUser) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await api.delete(`/account/close/${id}`);
            toast.success("Compte clôturé avec succès !");
            setIsModalOpen(false); // Ferme le modal après suppression
        } catch (err) {
            toast.error("Erreur lors de la clôture du compte.");
        }
    };

    return (
        <>
        <div className="relative flex flex-col p-4 bg-white shadow-md rounded-lg">
            {/* Icône de suppression en haut à droite */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
                <FaTrash size={15} />
            </button>

            <p className="account-name"><strong>Nom:</strong> {name}</p>
            <p className="account-iban"><strong>IBAN:</strong> {iban}</p>
            <p className="account-balance"><strong>Solde:</strong> {sold} €</p>

            {/* Affichage du modal si isModalOpen est true */}
            
        </div>
        {isModalOpen && (
            <AccountClose
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete} // Passe la fonction de suppression
            />
        )}
        </>
    );
};

export default AccountsUser;
