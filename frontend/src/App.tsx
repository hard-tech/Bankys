import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NoPage from "./pages/NotFound";

import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import SideBar from "./components/SideBar";
import Layout from "./layouts/Layout";
import CrmLayout from "./layouts/CrmLayout.tsx";
import { constants } from "./utils/constants";
import Dashboard from "./pages/Dashboard";
import Transaction from "./pages/Transaction";
import Account from "./pages/Account";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route
            path={constants.ROUTES.LOGIN}
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path={constants.ROUTES.REGISTER}
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />
          <Route
            index
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <NoPage />
              </Layout>
            }
          />
          {/* Private Routes */}
            <Route path={constants.ROUTES.HOME} element={<PrivateRoute />}>
            <Route
              path={constants.ROUTES.DASHBOARD}
              element={
                <CrmLayout>
                  <Dashboard />
                </CrmLayout>
              }
            />
            <Route
              path={`${constants.ROUTES.TRANSACTIONS}/:iban`}
              element={
                <CrmLayout>
                  <Transaction />
                </CrmLayout>
              }
            />
            <Route
              path={constants.ROUTES.ACCOUNTS}
              element={
                <CrmLayout>
                  <Account />
                </CrmLayout>
              }
            />
            <Route
              path={constants.ROUTES.PROFILE}
              element={
                <CrmLayout>
                  <Profile />
                </CrmLayout>
              }
            />
            
            {/* Add more private routes here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
