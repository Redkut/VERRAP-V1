import React from 'react';
import { ClientDevice, Payment } from '../types';
import Modal from './Modal';
import { CheckCircle, AlertTriangle, XCircle, CalendarDays, Coins, MessageSquare } from 'lucide-react';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: ClientDevice | null;
}

const formatDateForDisplay = (dateStr: string | undefined): string => {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const getPaymentStatusIcon = (status: Payment['status']) => {
  switch (status) {
    case 'Payé':
      return <CheckCircle size={18} className="text-green-400" />;
    case 'Demandé':
      return <AlertTriangle size={18} className="text-yellow-400" />;
    case 'Annulé':
      return <XCircle size={18} className="text-red-400" />;
    default:
      return null;
  }
};

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ isOpen, onClose, device }) => {
  if (!isOpen || !device) return null;

  const payments = device.paymentHistory || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Historique des Paiements: ${device.name}`}>
      {payments.length === 0 ? (
        <p className="text-gray-300 text-center py-4">Aucun historique de paiement disponible pour cet appareil.</p>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-zinc-700 p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  {getPaymentStatusIcon(payment.status)}
                  <span className={`font-semibold ${
                    payment.status === 'Payé' ? 'text-green-300' :
                    payment.status === 'Demandé' ? 'text-yellow-300' :
                    'text-red-300'
                  }`}>
                    {payment.status}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <CalendarDays size={14} />
                  <span>{formatDateForDisplay(payment.date)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-300 mb-1">
                <Coins size={16} className="text-purple-400" />
                <span className="font-medium">{payment.amount} {payment.currency}</span>
              </div>

              {payment.description && (
                <div className="flex items-start space-x-2 text-sm text-gray-400 mt-1">
                  <MessageSquare size={15} className="text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="italic">{payment.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Fermer
        </button>
      </div>
    </Modal>
  );
};

export default PaymentHistoryModal;