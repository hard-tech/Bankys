import { Input, Button, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginCredentials } from "../type/auth.types";

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .matches(
      regex,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number, and one special character"
    ),
});

interface LoginFormProps {
  formData: LoginCredentials;
  setFormData: React.Dispatch<React.SetStateAction<LoginCredentials>>;
}

const LoginForm = ({ formData, setFormData }: LoginFormProps) => {
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
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <Field
              name="email"
              type="email"
              as={Input}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default LoginForm;
