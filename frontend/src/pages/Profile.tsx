import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { 
  Button, 
  Typography, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Paper,
  Avatar,
  Divider
} from "@mui/material";
import { LockOutlined, PersonOutline, EmailOutlined } from '@mui/icons-material';
import api from "../services/api/axios.config";
import { endpoints } from "../services/api/endpoints";
import { authService } from "../services/auth/auth.service";
import toast from "react-hot-toast";
import { ChangePasswordCredentials } from "../type/auth.types";

const Profile = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<ChangePasswordCredentials | null>(null);

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
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Paper elevation={3} className="rounded-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-12 text-white text-center">
            <Avatar
              className="mx-auto mb-4 w-24 h-24 border-4 border-white shadow-lg"
              src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random`}
            />
            <Typography variant="h4" className="font-bold mb-2">
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="body1" className="opacity-90">
              {user?.email}
            </Typography>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="mb-8">
              <Typography variant="h6" className="text-gray-700 font-semibold mb-4">
                Informations Personnelles
              </Typography>
              <br />
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <PersonOutline className="mr-2" />
                  <span className="font-medium">Nom complet:</span>
                  <span className="ml-2">{user?.first_name} {user?.last_name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <EmailOutlined className="mr-2" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{user?.email}</span>
                </div>
              </div>
            </div>

            <Divider className="my-6" />

            {/* Password Change Form */}
            <div className="mt-8">
              <Typography variant="h6" className="text-gray-700 font-semibold mb-4 space-y-1  flex items-center">
                <LockOutlined className="mr-2" />
                Changer le mot de passe
              </Typography>
              <br />
              <Formik
                initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  setFormValues(values);
                  setOpen(true);
                }}
              >
                <Form className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Field
                        name="oldPassword"
                        type="password"
                        placeholder="Mot de passe actuel"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      <ErrorMessage name="oldPassword" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <Field
                        name="newPassword"
                        type="password"
                        placeholder="Nouveau mot de passe"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <Field
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirmer le nouveau mot de passe"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="contained"
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-lg transition duration-200 transform hover:scale-[1.02]"
                  >
                    Mettre à jour le mot de passe
                  </Button>
                </Form>
              </Formik>
            </div>
          </div>
        </Paper>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          className: "rounded-lg"
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          Confirmer le changement de mot de passe
        </DialogTitle>
        <DialogContent className="mt-4">
          <DialogContentText>
            Êtes-vous sûr de vouloir modifier votre mot de passe ? Cette action vous déconnectera.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <Button 
            onClick={() => setOpen(false)} 
            className="text-gray-600 hover:bg-gray-100"
          >
            Annuler
          </Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            className="bg-gradient-to-r from-indigo-600 to-blue-600"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;