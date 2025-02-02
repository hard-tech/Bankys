// src/pages/Beneficiary.tsx
import { useEffect, useState } from 'react';
import api from '../services/api/axios.config';
import { endpoints } from '../services/api/endpoints';
import BeneficiaryForm from '../components/beneficiary/BeneficiaryForm';
import BeneficiaryList from '../components/beneficiary/BeneficiaryList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Beneficiary } from '../type/common.types';
import toast from 'react-hot-toast';

const Beneficiary = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await api.get(endpoints.beneficiaries.getAll);
        setBeneficiaries(response.data);
      } catch (error) {
        console.error('Erreur de chargement des bénéficiaires:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBeneficiaries();
  }, []);

  const handleDelete = async (id: number) => {
    await api.delete(endpoints.beneficiaries.delete(id)).then(() => {
      toast.success('Bénéficiaire supprimé avec succès');
      setBeneficiaries(beneficiaries.filter((b) => b.id!== id));
    }).catch((error) => {
      toast.error(error.response.data.detail.message || 'Erreur lors de la suppression');
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <BeneficiaryForm onSuccess={() => window.location.reload()} />
        <BeneficiaryList
          beneficiaries={beneficiaries} 
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Beneficiary;
