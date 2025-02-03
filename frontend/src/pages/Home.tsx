import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { FaMoneyBillWave, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { constants } from "../utils/constants";
import picCrm from "../assets/pic-crm.jpg";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col mb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20 rounded-3xl shadow-lg animate-fade-in">
        <Container maxWidth="md" className="text-center">
          <Typography variant="h2" className="mb-4 font-bold tracking-wide animate-slide-up">
            Gérez vos finances en toute simplicité
          </Typography>
          <Typography variant="h5" className="mb-8 opacity-90 animate-slide-up delay-200">
            Une application bancaire moderne pour tous vos besoins financiers
          </Typography>
          <br />
          <Link to={constants.ROUTES.DASHBOARD}>
            <Button variant="contained" color="secondary" className="shadow-md hover:shadow-lg transition-all duration-300">
              Commencer
            </Button>
          </Link>
        </Container>
      </div>

      {/* Features Section */}
      <Container maxWidth="lg" className="my-16">
        <Grid container spacing={4}>
          {[
            { icon: <FaMoneyBillWave />, title: "Virements simplifiés", text: "Effectuez des virements entre vos comptes ou vers des bénéficiaires en quelques clics." },
            { icon: <FaChartLine />, title: "Suivi des dépenses", text: "Visualisez vos dépenses et recettes avec des graphiques clairs et intuitifs." },
            { icon: <FaShieldAlt />, title: "Sécurité renforcée", text: "Profitez d'une sécurité de pointe pour protéger vos informations financières." },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card className="h-full shadow-lg rounded-xl hover:shadow-xl transition-transform transform hover:scale-105 animate-fade-in delay-100">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="text-5xl text-indigo-500 mb-4">{feature.icon}</div>
                  <Typography variant="h5" className="mb-2 font-semibold">
                    {feature.title}
                  </Typography>
                  <Typography className="opacity-80">{feature.text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Screenshot Section */}
      <div className="bg-gray-100 py-16 animate-fade-in delay-200">
        <Container maxWidth="lg">
          <Typography variant="h3" className="text-center mb-12 font-semibold">
            Une interface intuitive et moderne
          </Typography>
          <Card className="shadow-lg rounded-xl overflow-hidden">
            <CardMedia component="img" height="400" image={picCrm} alt="Application screenshot" className="animate-slide-up" />
          </Card>
        </Container>
      </div>

      {/* Testimonial Section */}
      <Container maxWidth="md" className="my-16 animate-fade-in delay-300">
        <Typography variant="h4" className="text-center mb-8 font-semibold">
          Ce que disent nos utilisateurs
        </Typography>
        <Card className="bg-indigo-50 p-6 shadow-md rounded-xl">
          <Typography variant="body1" className="italic text-center text-gray-800 animate-slide-up">
            "Cette application a complètement changé ma façon de gérer mes finances. C'est simple, rapide et sécurisé !"
          </Typography>
          <Typography variant="subtitle1" className="text-center mt-4 font-bold text-indigo-600 animate-slide-up delay-100">
            - Marie D., utilisatrice satisfaite
          </Typography>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
