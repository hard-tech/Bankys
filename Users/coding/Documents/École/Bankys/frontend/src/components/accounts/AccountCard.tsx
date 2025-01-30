import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AccountCardProps } from "../../type/common.types";
import { Link } from "react-router-dom";
import { constants } from "../../utils/constants"; // Corrected path
import { Menu, MenuItem, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import api from "../../services/api/axios.config"; // Import your API configuration
import toast from "react-hot-toast";

const AccountCard: React.FC<AccountCardProps> = ({ title, balance, iban, onCloseAccount }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseAccount = async () => {
    try {
      // Call API to verify password
      await api.post("/verify-password", { password }); // Adjust the endpoint as needed
      onCloseAccount(iban);
      toast.success("Compte clôturé avec succès.");
    } catch (error) {
      toast.error("Mot de passe incorrect.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    handleClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-neutral-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-primary-800">{title}</h3>
        </div>
        <IconButton
          onClick={handleClick}
          className="text-neutral-500 hover:text-primary-600 transition-colors"
          size="small"
        >
          <BsThreeDotsVertical className="h-5 w-5" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleOpenModal} className="text-red-600 hover:bg-red-50">
            <span className="text-red-500">Clôturer le compte</span>
          </MenuItem>
        </Menu>
      </div>
      <div className="mb-4">
        <span className="text-2xl font-bold text-primary-900">{parseFloat(balance).toFixed(2)}€</span>
        <p className="text-sm text-neutral-500 mt-1">IBAN: {iban}</p>
      </div>
      <div className="flex gap-4 pt-4 border-t border-neutral-200">
        <Link
          to={`${constants.ROUTES.TRANSACTIONS}?iban=${iban}`}
          className="text-sm text-primary-600 hover:text-primary-800 font-medium"
        >
          Transactions
        </Link>
      </div>

      {/* Password Confirmation Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Confirmer la clôture du compte</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mot de passe"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleCloseAccount} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccountCard;