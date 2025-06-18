
import React, { useState, useEffect } from 'react';
import { X, UserCircle, CalendarDays, Euro, Unlock, ArrowLeft, Send } from 'lucide-react';
import { SellerInfo } from '../types';
import Modal from './Modal';

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sellerInfo: SellerInfo;
  onRequestUnlock: (amount: string) => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ isOpen, onClose, sellerInfo, onRequestUnlock }) => {
  const [dialogView, setDialogView] = useState<'initial' | 'paymentEntry'>('initial');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');

  // Reset view and amount when dialog is closed or opened
  useEffect(() => {
    if (isOpen) {
      setDialogView('initial');
      setPaymentAmount('');
      setAmountError('');
    }
  }, [isOpen]);

  const handleRequestUnlockClick = () => {
    setDialogView('paymentEntry');
  };

  const handleBackClick = () => {
    setDialogView('initial');
    setPaymentAmount('');
    setAmountError('');
  };

  const handlePaymentSubmit = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount < 2000) { 
      setAmountError('Le montant doit être supérieur ou égal à 2000 FCFA.'); 
      return;
    }
    setAmountError('');
    onRequestUnlock(paymentAmount);
    onClose(); // Close dialog after submission
  };

  const isPaymentAmountInvalid = isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) < 2000;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dialogView === 'initial' ? "Informations Vendeur" : "Effectuer un Paiement"}>
      {dialogView === 'initial' && (
        <>
          <div className="space-y-4 text-sm">
            <div className="flex items-center space-x-3 p-3 bg-zinc-700 rounded-md">
              <UserCircle className="text-purple-400" size={20} />
              <span>Contact Vendeur: <strong className="text-purple-300">{sellerInfo.contact}</strong></span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-zinc-700 rounded-md">
              <Euro className="text-purple-400" size={20} />
              <span>Montant Restant: <strong className="text-purple-300">{sellerInfo.amountDue}</strong></span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-zinc-700 rounded-md">
              <CalendarDays className="text-purple-400" size={20} />
              <span>Prochaine Échéance: <strong className="text-purple-300">{sellerInfo.nextPaymentDate}</strong></span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleRequestUnlockClick}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Unlock size={18} />
              <span>Demander le Déverrouillage</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              OK
            </button>
          </div>
        </>
      )}

      {dialogView === 'paymentEntry' && (
        <>
          <p className="text-sm text-gray-300 mb-4">
            Veuillez entrer le montant que vous souhaitez payer pour demander le déverrouillage de votre appareil. Le montant doit être supérieur ou égal à 2000 FCFA.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-300 mb-1">
                Montant du Paiement (FCFA)
              </label>
              <input
                type="number"
                id="paymentAmount"
                value={paymentAmount}
                onChange={(e) => {
                  setPaymentAmount(e.target.value);
                  if (amountError) setAmountError(''); 
                }}
                placeholder="Ex: 2000" 
                className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                min="0" 
                step="500" // Added step attribute
              />
              {amountError && <p className="text-red-400 text-xs mt-1">{amountError}</p>}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleBackClick}
              className="w-full sm:w-auto px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft size={18} />
              <span>Retour</span>
            </button>
            <button
              onClick={handlePaymentSubmit}
              disabled={isPaymentAmountInvalid}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              <span>Soumettre Paiement</span>
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default InfoDialog;
