// src/components/beneficiaries/BeneficiaryForm.tsx
import { useState } from 'react';
import { FiPlusCircle, FiUser, FiCreditCard } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../services/api/axios.config';
import { endpoints } from '../../services/api/endpoints';

interface BeneficiaryFormProps {
  onSuccess: () => void;
}

const BeneficiaryForm = ({ onSuccess }: BeneficiaryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    iban: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidIBAN = (iban: string) => /^[A-Z]{2}\d{25}$/.test(iban);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      formData.iban = formData.iban.replace(/\s/g, '');
      if (!isValidIBAN(formData.iban)) {
        throw new Error('IBAN invalide - Format attendu : FR76 1234 5678 9123 4567 8901 234');
      }

      await api.post(endpoints.beneficiaries.create, {
        name: formData.name,
        iban: formData.iban.replace(/\s/g, '')
      });

      toast.success('Bénéficiaire ajouté avec succès');
      setFormData({ name: '', iban: '' });
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.detail.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FiPlusCircle className="text-indigo-600" />
        Ajouter un bénéficiaire
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du bénéficiaire
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Société XYZ"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IBAN
          </label>
          <div className="relative">
            <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={formData.iban}
              onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
              placeholder="FR76 1234 5678 9123 4567 8901 234"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enregistrement...' : 'Ajouter le bénéficiaire'}
        </button>
      </form>
    </div>
  );
};

export default BeneficiaryForm;
