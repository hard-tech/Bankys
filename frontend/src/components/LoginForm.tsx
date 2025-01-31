import { Input, Button, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginCredentials } from "../type/auth.types";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email requis"),

  password: Yup.string().required("Mot de passe"),
});

interface LoginFormProps {
  formData: LoginCredentials;
  setFormData: React.Dispatch<React.SetStateAction<LoginCredentials>>;
  onSubmit: () => void; // Ajout de cette prop
}

const LoginForm = ({ formData, setFormData, onSubmit }: LoginFormProps) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setFormData(values);
        onSubmit();
        console.log("Form submitted", values);
      }}
    >
      <Form className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <Field
              name="email"
              type="email"
              as={Input}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4"
              placeholder="Email address"
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
            <ErrorMessage
              className="text-red-500"
              name="password"
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
            Se connecter
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default LoginForm;
