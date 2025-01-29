import React from "react";
import { Link } from "react-router-dom";
import { constants } from "../utils/constants";

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <p className="text-2xl text-gray-800 mt-4">Page Not Found</p>
        <p className="text-gray-600 mt-2">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          className="mt-6 inline-block px-6 py-3 bg-blue-600 font-semibold rounded-md hover:bg-blue-700"
          to={constants.ROUTES.HOME}
        >
          <span className="text-white">
            Go to Homepage
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
