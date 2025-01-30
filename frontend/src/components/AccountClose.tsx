import { createPortal } from "react-dom";

interface AccountCloseProps {
    onClose: () => void;
    onConfirm: () => void;
}

const AccountClose = ({ onClose, onConfirm }: AccountCloseProps) => {
    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
                <h2 className="text-xl font-bold">Clôturer un compte</h2>
                <p className="text-gray-600 mt-2">
                    Vous êtes sur le point de clôturer votre compte. Le solde de votre compte sera
                    transféré sur votre compte principal.
                </p>

                <div className="mt-4 flex justify-between">
                    <button 
                        onClick={onClose}
                        className="border border-gray-600 text-gray-600 px-4 py-2 rounded-md"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>,
        document.body // Monte le modal dans le <body> pour qu'il soit au-dessus de tout
    );
};

export default AccountClose;
