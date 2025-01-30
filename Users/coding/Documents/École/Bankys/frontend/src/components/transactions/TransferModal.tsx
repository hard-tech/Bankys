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