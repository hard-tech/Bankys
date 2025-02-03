import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, IconButton } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

const Footer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollPosition >= documentHeight - 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <footer
      className={`bg-gray-800 text-white transition-all duration-500 ease-in-out ${
        isExpanded ? "max-h-[500px]" : "max-h-16"
      } ${isAtBottom ? "fixed bottom-0" : ""} w-full overflow-hidden`}
    >
      <Container maxWidth="lg" className="h-full">
        <div className="flex justify-between items-center h-16">
          <Typography variant="body2" className="opacity-70">
            © 2025 Bankys. Tous droits réservés.
          </Typography>
          <IconButton
            onClick={toggleExpand} 
            className="text-white transition-transform duration-300 ease-in-out p-8 cursor-auto"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <KeyboardArrowUp color="primary" />
          </IconButton>
        </div>
        <div className={`transition-opacity duration-500 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <Grid container spacing={4} className="py-8">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="mb-4 font-semibold">
                À propos de BankApp
              </Typography>
              <Typography variant="body2" className="opacity-80">
                BankApp est une application bancaire innovante conçue pour simplifier votre gestion financière au quotidien.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="mb-4 font-semibold">Liens rapides</Typography>
              <ul className="space-y-2">
                {['Fonctionnalités', 'Tarifs', 'FAQ', 'Contact'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-indigo-300 transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="mb-4 font-semibold">Suivez-nous</Typography>
              <div className="flex space-x-4 text-2xl">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, index) => (
                  <a key={index} href="#" className="hover:text-indigo-300 transition-colors duration-300">
                    <i className={`fab fa-${social}`}></i>
                  </a>
                ))}
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;