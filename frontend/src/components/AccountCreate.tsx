import { Box, Button, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AccountFormValues } from "../type/auth.types";
import React from "react";

// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Le nom est requis"),
  type: Yup.string().oneOf(["Compte courant", "Épargne"], "Type invalide").required("Le type est requis")
});

interface AccountFormProps {
  formData: AccountFormValues;
  setFormData: React.Dispatch<React.SetStateAction<AccountFormValues>>;
}

const AccountForm = ({ formData, setFormData }: AccountFormProps) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen} variant="contained" color="primary" className="bg-blue-600 hover:bg-blue-700 text-white">
        Ajouter un compte
      </Button>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <div className="fixed inset-0 flex items-center justify-center">
          <Box className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <Formik<AccountFormValues>
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                setFormData(values);
                console.log("Form submitted", values);
                handleClose();
              }}
            >
              {({ handleChange, values }) => (
                <Form className="space-y-6">
                  <Typography variant="h5" className="font-bold text-center text-gray-800">
                    Ajouter un compte
                  </Typography>

                  {/* Sélecteur du type de compte */}
                  <div>
                    <Field as={Select} name="type" fullWidth value={values.type} onChange={handleChange} displayEmpty className="bg-gray-100 rounded-md">
                      <MenuItem value="" disabled>Type de compte</MenuItem>
                      <MenuItem value="Compte courant">Compte courant</MenuItem>
                      <MenuItem value="Épargne">Épargne</MenuItem>
                    </Field>
                    <ErrorMessage name="type" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Champ pour le nom du compte */}
                  <div>
                    <Field as={TextField} name="name" fullWidth label="Nom du compte" variant="outlined" className="bg-gray-100 rounded-md" />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Boutons */}
                  <div className="flex justify-between">
                    <Button onClick={handleClose} variant="outlined" className="text-gray-700 border-gray-400 hover:bg-gray-200">
                      Annuler
                    </Button>
                    <Button type="submit" variant="contained" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Créer un compte
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Box>
        </div>
      </Modal>
    </>
  );
};

export default AccountForm;
