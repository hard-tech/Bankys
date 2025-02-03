import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./layouts/Layout";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import CrmLayout from "./layouts/CrmLayout.tsx";
import { constants } from "./utils/constants";
import Dashboard from "./pages/Dashboard";
import TransactionPage from "./pages/Transaction";
import Account from "./pages/Account";
import Beneficiary from "./pages/Beneficiary.tsx";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
              path={`${constants.ROUTES.TRANSACTIONS}`}
              element={
                <CrmLayout>
                  <TransactionPage />
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
            <Route
              path={constants.ROUTES.BENEFICIAIRES}
              element={
                <CrmLayout>
                  <Beneficiary />
                </CrmLayout>
              }
            />
            {/* Add more private routes here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
