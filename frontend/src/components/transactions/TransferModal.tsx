// src/components/modals/TransferModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Account, TransactionType } from '../../type/common.types';
import { toast } from 'react-hot-toast';
import api from '../../services/api/axios.config';
import { endpoints } from '../../services/api/endpoints';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[] | null;
  selectedAccount?: string;
}

const TransferModal = ({ isOpen, onClose, accounts, selectedAccount }: TransferModalProps) => {
  const [formData, setFormData] = useState({
    fromAccount: selectedAccount || '',
    toAccount: '',
    amount: '',
    description: '',
    beneficiaryName: '',
    beneficiaryIban: ''
  });
  
  const [transferType, setTransferType] = useState<'internal' | 'external'>('internal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await api.post(endpoints.transactions.transfer, {
        account_iban_from: formData.fromAccount,
        account_iban_to: formData.toAccount,
        amount: Number(formData.amount),
        transaction_note: formData.description,
      }).then(() => {
          toast.success('Virement effectué avec succès');
          onClose(); // Move onClose() here to ensure it's only called on success
      }).catch((err) => {
          toast.error(err.response?.data?.detail?.message || 'Virement impossible');
      });
    } catch (error) {
      toast.error('Erreur lors du virement');
    }
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
                  Effectuer un virement
                </Dialog.Title>

                <div className="mb-4">
                  <div className="flex space-x-4 mb-4">
                    <button
                      className={`flex-1 py-2 px-4 rounded-lg ${
                        transferType === 'internal' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setTransferType('internal')}
                    >
                      Virement interne
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 rounded-lg ${
                        transferType === 'external' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setTransferType('external')}
                    >
                      Virement externe
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Compte émetteur
                      </label>
                      <select
                        value={formData.fromAccount}
                        onChange={(e) => setFormData({...formData, fromAccount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Sélectionner un compte</option>
                        {accounts?.map(account => (
                          <option key={account.iban} value={account.iban}>
                            {account.name} - {account.iban}
                          </option>
                        ))}
                      </select>
                    </div>

                    {transferType === 'internal' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Compte destinataire
                        </label>
                        <select
                          value={formData.toAccount}
                          onChange={(e) => setFormData({...formData, toAccount: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Sélectionner un compte</option>
                          {accounts?.map(account => (
                            account.iban !== formData.fromAccount && (
                              <option key={account.iban} value={account.iban}>
                                {account.name} - {account.iban}
                              </option>
                            )
                          ))}
                        </select>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du bénéficiaire
                          </label>
                          <input
                            type="text"
                            value={formData.beneficiaryName}
                            onChange={(e) => setFormData({...formData, beneficiaryName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            IBAN du bénéficiaire
                          </label>
                          <input
                            type="text"
                            value={formData.beneficiaryIban}
                            onChange={(e) => setFormData({...formData, beneficiaryIban: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Montant
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
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
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                      >
                        Effectuer le virement
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransferModal;