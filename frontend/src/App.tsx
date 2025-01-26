import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NoPage from './pages/NotFound'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NoPage />} />
        {/* Exemple de route avec un param */}
        {/* <Route path="/user/:id" element={<UserProfile />} /> */}

        {/* 
            // Dans le composant
            function UserProfile() {
              const { id } = useParams();
              return <div>Profil de l'utilisateur {id}</div>;
            }        
        */}
      </Routes>
    </Router>
  )
}

export default App
