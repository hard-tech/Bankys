import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Account, Beneficiary } from '../../type/common.types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiUser, FiDollarSign, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext'; // Ajoutez cette ligne

interface TransferModalBeneficiaryProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary: Beneficiary;
  onTransfer: (data: TransferFormData) => void;
}

interface TransferFormData {
  fromAccount: string;
  amount: number;
  note?: string;
}

const schema = yup.object().shape({
  fromAccount: yup.string().required('Veuillez sélectionner un compte'),
  amount: yup.number().positive('Le montant doit être positif').required('Le montant est requis'),
  note: yup.string().max(100, 'La note ne doit pas dépasser 100 caractères'),
});

const TransferModalBeneficiary: React.FC<TransferModalBeneficiaryProps> = ({
  isOpen,
  onClose,
  beneficiary,
  onTransfer,
}) => {
 const { accounts } = useAuth();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<TransferFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: TransferFormData) => {
    await onTransfer(data);
    onClose();
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Transfert vers <span className='font-bold text-violet-700'>{beneficiary.name}</span>
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compte émetteur
                    </label>
                    <Controller
                      name="fromAccount"
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
                    {errors.fromAccount && <p className="mt-1 text-sm text-red-600">{errors.fromAccount.message}</p>}
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
                    {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Controller
                      name="note"
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
                    {errors.note && <p className="mt-1 text-sm text-red-600">{errors.note.message}</p>}
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
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'En cours...' : 'Effectuer le transfert'}
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
