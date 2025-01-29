import { AccountUser } from "../type/auth.types";

const AccountsUser = ({ id, name, iban, sold }: AccountUser) => {
    return (
        <div key={id} className="account-item">
            <p className="account-name"><strong>Nom:</strong> {name}</p>
            <p className="account-iban"><strong>IBAN:</strong> {iban}</p>
            <p className="account-balance"><strong>Solde:</strong> {sold} €</p>
        </div>
    );
};


export default AccountsUser;
