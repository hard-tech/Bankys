import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeneficiaireFormValues, BeneficiaireUser } from "../type/auth.types";
import React from "react";

// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Le nom est requis"),
    iban: Yup.string().required("L'IBAN est requis"),
});

import api from "../services/api/axios.config";
import { toast } from "react-hot-toast";

const BeneficiaireForm = ({ setBeneficiaires }: { setBeneficiaires: React.Dispatch<React.SetStateAction<BeneficiaireUser[]>> }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <center>
                <Button
                    onClick={handleOpen}
                    variant="contained"
                    color="primary"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Ajouter un bénéficiaire
                </Button>
            </center>

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
                <div className="fixed inset-0 flex items-center justify-center">
                    <Box className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                        <Formik<BeneficiaireFormValues>
                            initialValues={{ name: "", iban: "" }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                try {
                                    const response = await toast.promise(
                                        api.post("/beneficiaires/create", values),
                                        {
                                            loading: "Ajout en cours...",
                                            success: "Bénéficiaire ajouté avec succès !",
                                            error: "Erreur lors de l'ajout.",
                                        }
                                    );

                                    setBeneficiaires(prev => [...prev, response.data]); // Mise à jour de la liste
                                    resetForm();
                                    handleClose();
                                } catch (error) {
                                    console.error("Erreur lors de l'ajout du bénéficiaire :", error);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-6">
                                    <Typography
                                        variant="h5"
                                        className="font-bold text-center text-gray-800"
                                    >
                                        Ajouter un bénéficiaire
                                    </Typography>

                                    <div>
                                        <Field
                                            as={TextField}
                                            name="name"
                                            fullWidth
                                            label="Nom du bénéficiaire"
                                            variant="outlined"
                                            className="bg-gray-100 rounded-md"
                                        />
                                        <ErrorMessage
                                            name="name"
                                            component="p"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Field
                                            as={TextField}
                                            name="iban"
                                            fullWidth
                                            label="IBAN"
                                            variant="outlined"
                                            className="bg-gray-100 rounded-md"
                                        />
                                        <ErrorMessage
                                            name="iban"
                                            component="p"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>

                                    <div className="flex justify-between">
                                        <Button onClick={handleClose} variant="outlined">
                                            Annuler
                                        </Button>
                                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                                            Ajouter
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

export default BeneficiaireForm;
