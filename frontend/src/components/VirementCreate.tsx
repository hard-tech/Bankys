import { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import api from "../services/api/axios.config";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { VirementFormValues } from "../type/auth.types";

// Schéma de validation
const validationSchema = Yup.object().shape({
    amount: Yup.number().positive("Le montant doit être positif").required("Le montant est requis"),
});

const VirementForm = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ibanTo = queryParams.get("iban"); // 🔹 IBAN du bénéficiaire

    const [mainAccountIban, setMainAccountIban] = useState<string | null>(null);

    // Récupération du compte principal
    useEffect(() => {
        const fetchMainAccount = async () => {
            try {
                const response = await api.get("/account/get/all");
                const mainAccount = response.data.find((account: any) => account.main === true);
                if (mainAccount) {
                    setMainAccountIban(mainAccount.iban);
                } else {
                    toast.error("Aucun compte principal trouvé !");
                }
            } catch (error) {
                console.error("Erreur lors du chargement du compte principal :", error);
                toast.error("Erreur lors du chargement du compte principal.");
            }
        };
        fetchMainAccount();
    }, []);

    // Vérifie si la transaction est en PENDING et affiche le toast d'annulation
    const checkTransactionStatus = async () => {
        try {
            const response = await api.get("/transactions/get/all");
            const lastTransaction = response.data.find((transaction: any) => transaction.status === "PENDING");
            
            if (lastTransaction) {
                toast(
                    (t) => (
                        <div className="flex flex-col">
                            <p>💰 Virement en attente</p>
                            <Button 
                                onClick={() => cancelTransaction(lastTransaction.id, t.id)}
                                variant="contained" 
                                color="secondary"
                                size="small"
                            >
                                Annuler
                            </Button>
                        </div>
                    ),
                    { duration: 5000 }
                );
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des transactions :", error);
        }
    };

    // Annule la transaction (utilisation de DELETE)
    const cancelTransaction = async (transactionId: string, toastId: string) => {
        try {
            await api.delete(`/transactions/cancel/${transactionId}`);
            toast.dismiss(toastId);
            toast.success("Transaction annulée !");
        } catch (error) {
            console.error("Erreur lors de l'annulation :", error);
            toast.error("Impossible d'annuler la transaction.");
        }
    };

    return (
        <div className="flex items-center justify-center">
            <Formik<VirementFormValues>
                initialValues={{ name: "", amount: 0 }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    if (!mainAccountIban || !ibanTo) {
                        toast.error("Compte source ou bénéficiaire manquant.");
                        return;
                    }

                    try {
                        await toast.promise(
                            api.post("/transactions/transfer", {
                                account_iban_from: mainAccountIban,
                                account_iban_to: ibanTo,
                                amount: values.amount,
                            }),
                            {
                                loading: "Virement en cours...",
                                success: "Virement effectué avec succès !",
                                error: "Erreur lors du virement.",
                            }
                        );

                        // Vérifie si la transaction est en attente
                        setTimeout(() => {
                            checkTransactionStatus();
                        }, 2000);

                        resetForm();
                    } catch (error) {
                        console.error("Erreur lors du virement :", error);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="mt-20 space-y-6 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                        <Typography variant="h5" className="font-bold text-center text-gray-800">
                        💸 Effectuer un Virement 💸
                        </Typography>
                        <br></br><br></br>

                        {/* Compte Source (Lecture seule) */}
                        <div>
                            <TextField
                                fullWidth
                                label="Compte Source (Principal)"
                                variant="outlined"
                                className="bg-gray-100 rounded-md"
                                value={mainAccountIban || "Chargement..."}
                                disabled
                            />
                        </div>

                        {/* Compte Destination (Lecture seule) */}
                        <div>
                            <TextField
                                fullWidth
                                label="Compte Bénéficiaire"
                                variant="outlined"
                                className="bg-gray-100 rounded-md"
                                value={ibanTo || "Aucun bénéficiaire sélectionné"}
                                disabled
                            />
                        </div>

                        {/* Montant du Virement */}
                        <div>
                            <Field
                                as={TextField}
                                type="number"
                                name="amount"
                                fullWidth
                                label="Montant (€)"
                                variant="outlined"
                                className="bg-gray-100 rounded-md"
                            />
                            <ErrorMessage name="amount" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="flex justify-center">
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                {isSubmitting ? "Envoi..." : "Faire le Virement"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default VirementForm;
