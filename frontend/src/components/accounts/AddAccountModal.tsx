import React, { useState } from "react";
import { Modal, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, IconButton, Typography } from "@mui/material";
import { AddAccountModalProps } from "../type/common.types";
import CloseIcon from '@mui/icons-material/Close';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  newAccountName,
  setNewAccountName,
  handleAddAccount,
}) => {
  const [accountType, setAccountType] = useState<"current" | "savings">("current");

  const handleSubmit = () => {
    handleAddAccount();
    setAccountType("current");
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => setIsModalOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom>
          Ajouter un nouveau compte
        </Typography>

        <TextField
          fullWidth
          label="Nom du compte"
          variant="outlined"
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="account-type-label">Type de compte</InputLabel>
          <Select
            labelId="account-type-label"
            value={accountType}
            label="Type de compte"
            onChange={(e) => setAccountType(e.target.value as "current" | "savings")}
          >
            <MenuItem value="current">
              <AccountBalanceIcon sx={{ mr: 1 }} /> Courant
            </MenuItem>
            <MenuItem value="savings">
              <SavingsIcon sx={{ mr: 1 }} /> Épargne
            </MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Créer le compte
        </Button>
      </Box>
    </Modal>
  );
};

export default AddAccountModal;
