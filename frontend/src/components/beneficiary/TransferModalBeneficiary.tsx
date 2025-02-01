import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  Account,
  Beneficiary,
  Transaction,
  TransferFormData,
} from "../../type/common.types";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiUser, FiDollarSign, FiFileText } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../services/api/axios.config";
import { endpoints } from "../../services/api/endpoints";

interface TransferModalBeneficiaryProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary: Beneficiary;
}

const schema = yup.object().shape({
  account_iban_from: yup.string().required("Veuillez sélectionner un compte"),
  account_iban_to: yup.string().required("Le compte bénéficiaire est requis"),
  amount: yup
    .number()
    .positive("Le montant doit être positif")
    .required("Le montant est requis")
    .test(
      "two-decimals",
      "Le montant ne peut avoir que deux décimales",
      (value) => (value ? /^\d+(\.\d{1,2})?$/.test(value.toString()) : true)
    ),
  transaction_note: yup
    .string()
    .max(100, "La note ne doit pas dépasser 100 caractères")
    .required("La note est requise"),
});

const TransferModalBeneficiary: React.FC<TransferModalBeneficiaryProps> = ({
  isOpen,
  onClose,
  beneficiary,
}) => {
  const { accounts } = useAuth();
  const [isTransferring, setIsTransferring] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      account_iban_to: beneficiary.iban,
    },
  });

  const onSubmit = async (data: TransferFormData) => {
    setIsTransferring(true);
    await api.post<Transaction>(
      endpoints.transactions.transfer,
      data
    ).then((response) => {
    toast.success("Transaction effectuée avec succès.");
      reset();
    onClose();

    // Show success toast with undo option
    toast.custom(
      (t) => (
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
          <div className="flex-1 w-0 p-4">
            <p className="text-sm font-medium text-gray-900">
              Transaction réussie
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {data.transaction_note}
            </p>
            <p className="text-sm text-gray-600">
              Montant :{" "}
              {Number(data.amount).toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={async () => {
                try {
                  await api.delete(
                    endpoints.transactions.cancel(response.data.id)
                  );
                  toast.success("Transaction annulée avec succès.");
                } catch (error) {
                  toast.error("Impossible d'annuler la transaction.");
                } finally {
                  toast.dismiss(t.id);
                }
              }}
              className="w-full border border-transparent rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              Annuler
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
    }).catch((error) => {
      toast.error(error.response?.data?.detail.message || error.message);
    }).finally(() => {
      setIsTransferring(false);
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Transfert vers{" "}
                  <span className="font-bold text-violet-700">
                    {beneficiary.name}
                  </span>
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compte émetteur
                    </label>
                    <Controller
                      name="account_iban_from"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            {...field}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Sélectionnez un compte</option>
                            {accounts?.map((account) => (
                              <option key={account.id} value={account.iban}>
                                {account.name} - {account.iban}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    />
                    {errors.account_iban_from && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.account_iban_from.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compte destinataire
                    </label>
                    <div className="relative">
                      <Controller
                        name="account_iban_to"
                        defaultValue={beneficiary.iban}
                        control={control}
                        render={({ field }) => (
                          <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              {...field}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                              placeholder="IBAN du bénéficiaire"
                              readOnly
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant
                    </label>
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            {...field}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      )}
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Controller
                      name="transaction_note"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            {...field}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ajouter une note"
                          />
                        </div>
                      )}
                    />
                    {errors.transaction_note && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.transaction_note.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isTransferring}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTransferring
                        ? "Transfert en cours..."
                        : "Effectuer le transfert"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransferModalBeneficiary;
