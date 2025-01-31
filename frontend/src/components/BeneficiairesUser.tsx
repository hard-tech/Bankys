import { BeneficiaireUser } from "../type/auth.types";

const BeneficiairesUser = ({ iban, name }: BeneficiaireUser) => {

    return (
        <>
        <div className="relative flex flex-col p-4 bg-white shadow-md rounded-lg">

            <p className="account-name"><strong>Nom:</strong> {name}</p>
            <p className="account-iban"><strong>IBAN:</strong> {iban}</p>

            {/* Affichage du modal si isModalOpen est true */}
            
        </div>
        </>
    );
};

export default BeneficiairesUser;
