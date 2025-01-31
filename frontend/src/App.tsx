import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NoPage from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Layout from './layouts/Layout';
import { Toaster } from 'react-hot-toast';
import Account from './pages/Account';
import Transaction from './pages/Transaction';
import Beneficiaire from './pages/Beneficiaire';
import Virement from './pages/Virement';

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/beneficiaire" element={<Beneficiaire />} />
            <Route path="/virement" element={<Virement />} />
            {

        }
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
