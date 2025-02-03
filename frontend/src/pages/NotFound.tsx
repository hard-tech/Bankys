import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { constants } from "../utils/constants";
import { motion } from "framer-motion";
import { FiHome, FiAlertTriangle } from "react-icons/fi";

const NotFound: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#f0f4f8";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <FiAlertTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-5xl font-bold text-indigo-600 mb-2">404</h1>
        <p className="text-2xl text-gray-800 mb-4">Page introuvable</p>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out"
            to={constants.ROUTES.HOME}
          >
            <FiHome className="mr-2" />
            Retour à l'accueil
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;