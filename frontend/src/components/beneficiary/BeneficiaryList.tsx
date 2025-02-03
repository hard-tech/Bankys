import { FiUser, FiTrash2, FiSend } from 'react-icons/fi';
import { Beneficiary } from '../../type/common.types';
import { useState } from 'react';
import TransferModalBeneficiary from './TransferModalBeneficiary';
import { formatters } from '../../utils/formatters';

interface BeneficiaryListProps {
  beneficiaries: Beneficiary[];
  onDelete: (id: number) => void;
}

const BeneficiaryList = ({ beneficiaries, onDelete }: BeneficiaryListProps) => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  const handlePrepareTransfer = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
    setSelectedBeneficiary(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FiUser className="text-indigo-600" />
            Mes bénéficiaires ({beneficiaries.length})
          </h2>
        </div>

        {beneficiaries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucun bénéficiaire enregistré
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-grow cursor-pointer"
                    onClick={() => handlePrepareTransfer(beneficiary)}
                  >
                    <h3 className="font-medium text-gray-900">{beneficiary.name}</h3>
                    <span className="text-sm text-gray-500 font-mono">{formatters.formatIBAN(beneficiary.iban)}</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handlePrepareTransfer(beneficiary)}
                      className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 mr-2"
                      title="Préparer un virement"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(beneficiary.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                      title="Supprimer le bénéficiaire"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isTransferModalOpen && selectedBeneficiary && (
        <TransferModalBeneficiary
          isOpen={isTransferModalOpen}
          onClose={closeTransferModal}
          beneficiary={selectedBeneficiary}
        />
      )}
    </>
  );
};

export default BeneficiaryList;
