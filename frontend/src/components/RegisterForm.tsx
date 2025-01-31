"use client";

import { useState } from "react";
import { 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton,
  Paper,
  Typography,
  Grid
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Person,
  PersonOutline
} from '@mui/icons-material';
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { RegisterCredentials } from "../type/auth.types";

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format d'email invalide")
    .required("L'email est requis"),
  password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .required("Le mot de passe est requis")
    .matches(
      regex,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    ),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Les mots de passe doivent correspondre")
    .required("La confirmation du mot de passe est requise"),
  first_name: Yup.string().required("Le prénom est requis"),
  last_name: Yup.string().required("Le nom est requis"),
});

interface RegisterFormProps {
  formData: RegisterCredentials;
  setFormData: React.Dispatch<React.SetStateAction<RegisterCredentials>>;
}

const RegisterForm = ({ formData, setFormData }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Paper elevation={3} className="w-full max-w-2xl mx-auto p-8 rounded-xl">
      <div className="text-center mb-8">
        <Typography variant="h4" className="text-gray-800 font-bold mb-2">
          Créer un compte
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Rejoignez Bankys dès aujourd'hui
        </Typography>
      </div>

      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setFormData(values);
        }}
      >
        {({ errors, touched, handleChange, handleBlur, values, isValid }) => (
          <Form className="space-y-6">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="first_name"
                  name="first_name"
                  label="Prénom"
                  value={values.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.first_name && Boolean(errors.first_name)}
                  helperText={touched.first_name && errors.first_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                  className="bg-white"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="last_name"
                  name="last_name"
                  label="Nom"
                  value={values.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.last_name && Boolean(errors.last_name)}
                  helperText={touched.last_name && errors.last_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                  className="bg-white"
                />
              </Grid>
            </Grid>

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
              sx={{ mb: 3 }} // Add margin bottom
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="bg-white"
            />
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
              sx={{ mb: 3 }} // Add margin bottom
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
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

            <TextField
              fullWidth
              id="confirm_password"
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirmer le mot de passe"
              value={values.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirm_password && Boolean(errors.confirm_password)}
              helperText={touched.confirm_password && errors.confirm_password}
              sx={{ mb: 3 }} // Add margin bottom
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="bg-white"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!isValid}
              fullWidth
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              Créer mon compte
            </Button>

            <div className="text-center mt-4">
              <Typography variant="body2" className="text-gray-600">
                Vous avez déjà un compte ?{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Se connecter
                </a>
              </Typography>
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default RegisterForm;
