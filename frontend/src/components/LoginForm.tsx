"use client";

import { useState } from "react";
import { 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton,
  Paper,
  Typography
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock 
} from '@mui/icons-material';
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { LoginCredentials } from "../type/auth.types";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format d'email invalide")
    .required("L'email est requis"),
  password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .required("Le mot de passe est requis")
});

interface LoginFormProps {
  handelSubmit: (values: LoginCredentials) => void;
}

const LoginForm = ({ handelSubmit }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Paper elevation={3} className="w-full max-w-md mx-auto p-8 rounded-xl">
      <div className="text-center mb-8">
        <Typography variant="h4" className="text-gray-800 font-bold mb-2">
          Connexion
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Connectez-vous à votre compte Bankys
        </Typography>
      </div>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handelSubmit}
      >
        {({ errors, touched, handleChange, handleBlur, values }) => (
          <Form className="space-y-6">
            <div>
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                className="bg-white"
              />
            </div>

            <div>
              <TextField
                fullWidth
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Mot de passe"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className="bg-white"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Mot de passe oublié ?
              </a>
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              Se connecter
            </Button>

            <div className="text-center mt-4">
              <Typography variant="body2" className="text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Créer un compte
                </a>
              </Typography>
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default LoginForm;
