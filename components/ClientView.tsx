
import React, { useState } from 'react';
import { Info, Smartphone, ShieldAlert, LogIn, PhoneCall } from 'lucide-react';
import { SellerInfo } from '../types';
import InfoDialog from './InfoDialog';

interface ClientViewProps {
  isLocked: boolean;
  sellerInfo: SellerInfo;
  onEmergencyCall: () => void;
  onRequestUnlock: (amount: string) => void; // Now accepts amount
  onNavigateToSupervisorLogin: () => void;
}

const ClientView: React.FC<ClientViewProps> = ({
  isLocked,
  sellerInfo,
  onEmergencyCall,
  onRequestUnlock,
  onNavigateToSupervisorLogin,
}) => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between w-full h-screen p-4 bg-zinc-800 relative">
      {/* Info Button Top Left */}
      <button
        onClick={() => setShowInfoDialog(true)}
        className="absolute top-4 left-4 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors"
        aria-label="Information"
      >
        <Info size={24} />
      </button>

      {/* Supervisor Login Button Top Right */}
       <button
        onClick={onNavigateToSupervisorLogin}
        className="absolute top-4 right-4 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-lg transition-colors flex items-center space-x-2 text-sm"
        aria-label="Supervisor Login"
      >
        <LogIn size={20} /> 
        <span className="hidden sm:inline">Supervisor</span>
      </button>


      {/* Main Content Centered */}
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        {isLocked ? (
          <>
            <ShieldAlert size={80} className="text-red-500 mb-6" />
            <h1 className="text-4xl font-bold text-red-400 mb-2">
              Téléphone Verrouillé
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Veuillez contacter votre vendeur.
            </p>
          </>
        ) : (
          <>
            <Smartphone size={80} className="text-green-500 mb-6" />
            <h1 className="text-4xl font-bold text-green-400 mb-2">
              Téléphone Déverrouillé
            </h1>
            <p className="text-xl text-gray-300">
              Votre appareil est prêt à être utilisé.
            </p>
          </>
        )}
      </div>

      {/* Emergency Call Button Bottom Center */}
      <button
        onClick={onEmergencyCall}
        className="mb-8 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
      >
        <PhoneCall size={24} />
        <span>Appel d'Urgence</span>
      </button>

      {/* Info Dialog */}
      <InfoDialog
        isOpen={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        sellerInfo={sellerInfo}
        onRequestUnlock={(amount) => { // Modified to accept amount
          onRequestUnlock(amount); // Pass amount up
          // setShowInfoDialog(false); // Dialog is now closed from within InfoDialog on submit
        }}
      />
       <footer className="text-xs text-gray-500 pb-2">
          VERRAPP Web v1.0.0
        </footer>
    </div>
  );
};

export default ClientView;
