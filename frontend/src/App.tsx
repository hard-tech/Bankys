import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NoPage from "./pages/NotFound";

import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Layout from "./layouts/Layout";
import { constants } from "./utils/constants";

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
              path={constants.ROUTES.PROFILE}
              element={
                <>
                  <SideBar />
                  <Profile />
                </>
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
