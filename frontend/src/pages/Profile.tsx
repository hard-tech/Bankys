import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import api from "../services/api/axios.config";
import { endpoints } from "../services/api/endpoints";
import { authService } from "../services/auth/auth.service";
import toast from "react-hot-toast";
import { ChangePasswordCredentials } from "../type/auth.types";

const Profile = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false); // État pour gérer le modal
  const [formValues, setFormValues] = useState<ChangePasswordCredentials | null>(null); // Stocker les valeurs du formulaire

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;
  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Mot de passe actuel requis"),
    newPassword: Yup.string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .required("Le nouveau mot de passe est requis")
      .matches(
        regex,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Les mots de passe doivent correspondre")
      .required("Veuillez confirmer votre mot de passe"),
  });

  const handlePasswordChange = () => {
    if (!formValues) return;
  
    return toast.promise(
      api.post(endpoints.auth.changePassword, {
        current_password: formValues.oldPassword,
        new_password: formValues.newPassword,
      }),
      {
        loading: 'Modification du mot de passe en cours...',
        success: () => {
          setTimeout(() => {
            authService.logout();
          }, 3000);
          return 'Mot de passe changé avec succès. Vous allez être déconnecté.';
        },
        error: (err) => {
          const errorMessage = err.response?.data?.detail?.message || 
                             'Erreur lors de la modification du mot de passe';
          setOpen(false);
          return errorMessage;
        },
      },
      {
        success: {
          duration: 3000,
        },
        error: {
          duration: 4000,
        },
      }
    );
  };
  

  return (
    <div className="flex w-full items-center justify-center flex-col p-6">
      <h1 className="text-3xl font-bold mb-4">Mon Profil</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <Typography variant="h6">Informations Personnelles</Typography>
        <div className="mt-2 mb-4">
          <p><strong>Email :</strong> {user?.email}</p>
          <p><strong>Nom :</strong> {user?.last_name}</p>
          <p><strong>Prénom :</strong> {user?.first_name}</p>
        </div>

        <Formik
          initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setFormValues(values);
            setOpen(true); // Afficher le modal
          }}
        >
          <Form className="space-y-4">
            <Typography variant="h6">Changer le mot de passe</Typography>
            <div>
              <Field name="oldPassword" type="password" placeholder="Mot de passe actuel" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="oldPassword" component="div" className="text-red-500" />
            </div>
            <div>
              <Field name="newPassword" type="password" placeholder="Nouveau mot de passe" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="newPassword" component="div" className="text-red-500" />
            </div>
            <div>
              <Field name="confirmPassword" type="password" placeholder="Confirmer le nouveau mot de passe" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
            </div>
            <Button type="submit" variant="contained" color="primary" className="w-full">
              Mettre à jour le mot de passe
            </Button>
          </Form>
        </Formik>
      </div>

      {/* MODAL DE CONFIRMATION */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmer le changement de mot de passe</DialogTitle>
        <DialogContent>
          <DialogContentText>Êtes-vous sûr de vouloir modifier votre mot de passe ? Cette action vous déconnectera.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
          <Button onClick={handlePasswordChange} color="primary" variant="contained">Confirmer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;
