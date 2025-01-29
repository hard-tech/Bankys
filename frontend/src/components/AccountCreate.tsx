import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AccountFormValues } from "../type/auth.types";


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
  return (
    <Formik<AccountFormValues>
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setFormData(values);
        console.log("Form submitted", values);
      }}
    >
      {({ handleChange, values }) => (
        <Form className="mt-8 space-y-6">
          <Typography variant="h5" fontWeight="bold">Ajouter un compte</Typography>

          {/* Sélecteur du type de compte */}
          <Field
            as={Select}
            name="type"
            fullWidth
            value={values.type}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>Type de compte</MenuItem>
            <MenuItem value="Compte courant">Compte courant</MenuItem>
            <MenuItem value="Épargne">Épargne</MenuItem>
          </Field>
          <ErrorMessage name="type">{(msg) => <span className="text-red-500 text-sm">{msg}</span>}</ErrorMessage>

          {/* Champ pour le nom du compte */}
          <Field
            as={TextField}
            name="name"
            fullWidth
            label="Nom du compte"
            variant="outlined"
          />
          <ErrorMessage name="name">{(msg) => <span className="text-red-500 text-sm">{msg}</span>}</ErrorMessage>

          {/* Boutons */}
          <div className="flex gap-4">
            <Button variant="outlined" color="secondary">Annuler</Button>
            <Button type="submit" variant="contained" color="primary">Créer un compte</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AccountForm;
