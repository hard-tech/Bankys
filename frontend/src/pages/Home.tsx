import React from "react";
import { Link } from "react-router-dom";
import { constants } from "../utils/constants";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-2xl animate-fade-in">
        <h1 className="text-4xl font-extrabold text-indigo-600 drop-shadow-lg">
          Bienvenue sur Bankys
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          Gérez vos comptes bancaires en toute simplicité avec notre plateforme
          sécurisée.
        </p>

        {/* Section contenu en vedette */}
        <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900">
            🔹 Fonctionnalités principales
          </h2>
          <ul className="text-gray-700 mt-3 space-y-2">
            <li>✔️ Gestion facile de vos comptes</li>
            <li>✔️ Transactions sécurisées et rapides</li>
            <li>✔️ Interface fluide et intuitive</li>
          </ul>
        </div>

        {/* Bouton Explore */}
        <Link
          to={constants.ROUTES.ACCOUNTS}
          className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-md"
        >
          Explorer mes comptes
        </Link>
      </div>
    </div>
  );
};

export default Home;
