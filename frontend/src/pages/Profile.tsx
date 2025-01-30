import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Typography } from '@mui/material';
import api from '../services/api/axios.config';
import { endpoints } from '../services/api/endpoints';
import { authService } from '../services/auth/auth.service';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;
  const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
      .matches(
        regex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handlePasswordChange = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      await api.post(endpoints.auth.changePassword, {
        current_password: values.currentPassword,
        new_password: values.newPassword 
      });
  
      // Afficher un message de succès avec toast
      toast.success("Mot de passe changé avec succès. Vous allez être déconnecté.", {
        duration: 3000, // Toast visible pendant 3 secondes
      });
  
      // Ajouter un délai avant la déconnexion
      setTimeout(() => {
        authService.logout();
      }, 3000); // Déconnexion après 3
  
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe :", error);
  
      // Afficher un message d'erreur avec toast
      toast.error("Une erreur est survenue lors du changement de mot de passe");

    }
  };
  return (
    <div className='flex w-full items-center justify-center flex-col p-6'>
      <h1 className='text-3xl font-bold mb-4'>Mon Profile !</h1>
      <div className='bg-white shadow-md rounded-lg p-6 w-full max-w-md'>
        <div className='mb-4'>
          <Typography variant="h6">Informations Personnelles</Typography>
          <div className='mt-2'>
            <span className='block'>
              <label className='font-semibold'>Email:</label>
              <p>{user?.email}</p>
            </span>
            <span className='block'>
              <label className='font-semibold'>Nom:</label>
              <p>{user?.last_name}</p>
            </span>
            <span className='block'>
              <label className='font-semibold'>Prénom:</label>
              <p>{user?.first_name}</p>
            </span>
          </div>
        </div>

        <Formik
          initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handlePasswordChange}
        >
          <Form className='space-y-4'>
            <Typography variant="h6">Changer le mot de passe</Typography>
            <div>
              <Field
                name="currentPassword"
                type="password"
                placeholder="Mot de passe actuel"
                className="w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="currentPassword" component="div" className="text-red-500" />
            </div>
            <div>
              <Field
                name="newPassword"
                type="password"
                placeholder="Nouveau mot de passe"
                className="w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="newPassword" component="div" className="text-red-500" />
            </div>
            <div>
              <Field
                name="confirmPassword"
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                className="w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
            </div>
            <Button type="submit" variant="contained" color="primary" className="w-full">
              Mettre à jour le mot de passe
            </Button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Profile;
