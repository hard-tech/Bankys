import { Input, Button, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { RegisterCredentials } from "../type/auth.types";

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format de l'email invalide")
    .required("Email requis"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Mot de passe requis")
    .matches(
      regex,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number, and one special character"
    ),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Les mots de passe doivent correspondre")
    .required("La confirmation du mot de passe est requise"),
  first_name: Yup.string().required("Prénom requis"),
  last_name: Yup.string().required("Nom requis"),
});

interface RegisterFormProps {
  formData: RegisterCredentials;
  setFormData: React.Dispatch<React.SetStateAction<RegisterCredentials>>;
}

const RegisterForm = ({ formData, setFormData }: RegisterFormProps) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setFormData(values);
        // Ajoutez ici la logique supplémentaire, comme l'envoi des données à un serveur
        console.log("Form submitted", values);
      }}
    >
      <Form className="mt-8 space-y-6">
        <div className="space-y-4">
          {" "}
          {/* Ajout de l'espace entre les champs */}
          <div>
            <Field
              name="first_name"
              type="text"
              as={Input}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Prénom"
            />
            <ErrorMessage
              className="text-red-500"
              name="first_name"
              component={Typography}
            />
          </div>
          <div>
            <Field
              name="last_name"
              type="text"
              as={Input}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nom"
            />
            <ErrorMessage
              className="text-red-500"
              name="last_name"
              component={Typography}
            />
          </div>
          <div>
            <Field
              name="email"
              type="email"
              as={Input}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email"
            />
            <ErrorMessage
              className="text-red-500"
              name="email"
              component={Typography}
            />
          </div>
          <div>
            <Field
              name="password"
              type="password"
              as={Input}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Mot de passe"
            />
            <ErrorMessage
              className="text-red-500"
              name="password"
              component={Typography}
            />
          </div>

          <div>
            <Field
              name="confirm_password"
              type="password"
              as={Input}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirmer mot de passe"
            />
            <ErrorMessage
              className="text-red-500"
              name="confirm_password"
              component={Typography}
            />
          </div>

        </div>

        <div>
          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium 
              rounded-md text-white bg-indigo-500 hover:bg-indigo-700 
              transition-transform transform hover:scale-105 shadow-md"
          >
            Register
          </Button>
        </div>
      </Form>
    </Formik>
  );
};
export default RegisterForm;
