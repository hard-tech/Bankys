import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NoPage from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Layout from './layouts/Layout';
import { Toaster } from 'react-hot-toast';
import Account from './pages/Account';

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/" element={<PrivateRoute />}>
            {/* Ajoutez d'autres routes privées ici */}
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
