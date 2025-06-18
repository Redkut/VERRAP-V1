import React, { useState, useCallback, useEffect } from 'react';
import { View, SellerInfo, ClientDevice, ClientDeviceStatus } from './types';
import { INITIAL_SELLER_INFO, MOCK_DEVICES, EMERGENCY_NUMBER } from './constants';
import ClientView from './components/ClientView';
import SupervisorLoginView from './components/SupervisorLoginView';
import SupervisorDashboardView from './components/SupervisorDashboardView';
import Toast from './components/Toast';

// Helper function to add days to a YYYY-MM-DD date string
const addDaysToDate = (dateStr: string | undefined, days: number): string => {
  try {
    const date = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(date.getTime())) { 
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + days);
        return currentDate.toISOString().split('T')[0];
    }
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch (error) {
    console.error("Error in addDaysToDate:", error);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate.toISOString().split('T')[0];
  }
};

// Helper function to format YYYY-MM-DD to DD/MM/YYYY for display
const formatDateForDisplay = (dateStr: string | undefined): string => {
  if (!dateStr) return 'N/A';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day && year.length === 4 && month.length === 2 && day.length === 2) {
      return `${day}/${month}/${year}`;
    }
    return dateStr; 
  } catch {
    return dateStr; 
  }
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Client);
  const [isSupervisorLoggedIn, setIsSupervisorLoggedIn] = useState<boolean>(false);
  const [isDeviceLockedForClient, setIsDeviceLockedForClient] = useState<boolean>(true); 
  const [sellerInfo, setSellerInfo] = useState<SellerInfo>({
    ...INITIAL_SELLER_INFO,
    nextPaymentDate: formatDateForDisplay(INITIAL_SELLER_INFO.nextPaymentDate) // Format initial date
  });
  const [devices, setDevices] = useState<ClientDevice[]>(MOCK_DEVICES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [showHistoryView, setShowHistoryView] = useState<boolean>(false);


  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToastMessage(message);
    setToastType(type);
  }, []);

  // Update client lock screen based on the first non-archived device
  useEffect(() => {
    const activeDevice = devices.find(d => !d.isArchived);
    if (activeDevice) {
      setIsDeviceLockedForClient(
        activeDevice.status === ClientDeviceStatus.Locked ||
        activeDevice.status === ClientDeviceStatus.PaymentRequested 
      );
      if (activeDevice.nextPaymentDate && 
         (activeDevice.status === ClientDeviceStatus.Locked || 
          activeDevice.status === ClientDeviceStatus.Unlocked || 
          activeDevice.status === ClientDeviceStatus.PaymentRequested)) {
        setSellerInfo(prevInfo => ({...prevInfo, amountDue: INITIAL_SELLER_INFO.amountDue, contact: INITIAL_SELLER_INFO.contact, nextPaymentDate: formatDateForDisplay(activeDevice.nextPaymentDate)}));
      } else if (activeDevice.status === ClientDeviceStatus.Settled) {
         setSellerInfo(prevInfo => ({...prevInfo, amountDue: "0 FCFA", contact: INITIAL_SELLER_INFO.contact, nextPaymentDate: "Soldé"}));
      } else {
        setSellerInfo(prevInfo => ({...prevInfo, amountDue: INITIAL_SELLER_INFO.amountDue, contact: INITIAL_SELLER_INFO.contact, nextPaymentDate: formatDateForDisplay(INITIAL_SELLER_INFO.nextPaymentDate)}));
      }
    } else {
      setIsDeviceLockedForClient(true); 
      setSellerInfo({
        ...INITIAL_SELLER_INFO,
        nextPaymentDate: formatDateForDisplay(INITIAL_SELLER_INFO.nextPaymentDate) // Format on reset
      });
    }
  }, [devices]);

  const handleLogin = useCallback((success: boolean) => {
    if (success) {
      setIsSupervisorLoggedIn(true);
      setCurrentView(View.SupervisorDashboard);
      setShowHistoryView(false); 
      showToast("Superviseur connecté.", "success");
    } else {
      showToast("Échec de la connexion. Identifiants invalides.", "error");
    }
  }, [showToast]);

  const handleLogout = useCallback(() => {
    setIsSupervisorLoggedIn(false);
    setCurrentView(View.Client);
    setShowHistoryView(false);
    showToast("Superviseur déconnecté.", "info");
  }, [showToast]);

  const navigateToSupervisorLogin = useCallback(() => {
    setCurrentView(View.SupervisorLogin);
  }, []);

  const navigateToClientView = useCallback(() => {
    setCurrentView(View.Client);
  }, []);

  const handleDeviceLockToggle = useCallback((deviceId: string, lock: boolean) => {
    setDevices(prevDevices =>
      prevDevices.map(device => {
        if (device.id === deviceId) {
          const newStatus = lock ? ClientDeviceStatus.Locked : ClientDeviceStatus.Unlocked;
          // If unlocking, and there was a payment request, clear it as it's now resolved by supervisor action
          const updatedDevice = { 
            ...device, 
            status: newStatus,
            lastPaymentAttemptAmount: newStatus === ClientDeviceStatus.Unlocked ? undefined : device.lastPaymentAttemptAmount,
            lastPaymentAttemptDate: newStatus === ClientDeviceStatus.Unlocked ? undefined : device.lastPaymentAttemptDate,
          };
          showToast(`Appareil ${device.name} ${newStatus === ClientDeviceStatus.Locked ? 'verrouillé' : 'déverrouillé'}.`, "info");
          return updatedDevice;
        }
        return device;
      })
    );
  }, [showToast]);
  
  const handleArchiveDevice = useCallback((deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId && device.status === ClientDeviceStatus.Settled 
        ? { ...device, isArchived: true } 
        : device
      )
    );
    showToast("Appareil archivé avec succès.", "success");
  }, [showToast]);

  const handleToggleHistoryView = useCallback(() => {
    setShowHistoryView(prev => !prev);
  }, []);

  const handleTemporaryUnlock = useCallback((deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device => {
        if (device.id === deviceId) {
          const newPaymentDate = addDaysToDate(device.nextPaymentDate, 10);
          showToast(`Appareil ${device.name} déverrouillé temporairement. Prochain paiement: ${formatDateForDisplay(newPaymentDate)}.`, "success");
          
          // Optionally add to payment history if this action implies a payment was accepted
          // For now, focusing on the unlock action itself
          // const paymentAccepted: Payment = { id: `pay_${Date.now()}`, date: new Date().toISOString().split('T')[0], amount: device.lastPaymentAttemptAmount || 'N/A', currency: 'FCFA', status: 'Payé', description: 'Paiement pour déverrouillage temporaire' };
          
          return { 
            ...device, 
            status: ClientDeviceStatus.Unlocked, 
            nextPaymentDate: newPaymentDate,
            lastPaymentAttemptAmount: undefined, 
            lastPaymentAttemptDate: undefined,
            // paymentHistory: [...(device.paymentHistory || []), paymentAccepted] // Example: if adding payment record
          };
        }
        return device;
      })
    );
  }, [showToast]);

  const handlePermanentUnlock = useCallback((deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device => {
        if (device.id === deviceId) {
          const toastMsg = `Appareil ${device.name} déverrouillé définitivement, soldé et déplacé vers l'historique.`;
          showToast(toastMsg, "success");

          // Optionally add to payment history
          // const finalPayment: Payment = { id: `pay_${Date.now()}`, date: new Date().toISOString().split('T')[0], amount: 'Solde total', currency: 'FCFA', status: 'Payé', description: 'Règlement définitif' };

          return { 
            ...device, 
            status: ClientDeviceStatus.Settled, 
            nextPaymentDate: undefined, 
            isArchived: true,
            lastPaymentAttemptAmount: undefined, 
            lastPaymentAttemptDate: undefined,
            // paymentHistory: [...(device.paymentHistory || []), finalPayment] // Example: if adding payment record
          };
        }
        return device;
      })
    );
  }, [showToast]);

  const handleClientUnlockRequest = useCallback((paymentAmount: string) => {
    let deviceNameForToast = "l'appareil actif"; 
    setDevices(prevDevices => {
      const firstActiveDeviceIndex = prevDevices.findIndex(d => !d.isArchived);

      if (firstActiveDeviceIndex !== -1) {
        const updatedDevices = [...prevDevices];
        const deviceToUpdate = { ...updatedDevices[firstActiveDeviceIndex] };
        deviceNameForToast = deviceToUpdate.name;

        if (deviceToUpdate.status === ClientDeviceStatus.Locked || deviceToUpdate.status === ClientDeviceStatus.PaymentRequested) {
           deviceToUpdate.status = ClientDeviceStatus.PaymentRequested;
           deviceToUpdate.lastPaymentAttemptAmount = paymentAmount;
           const attemptDate = new Date().toISOString().split('T')[0];
           deviceToUpdate.lastPaymentAttemptDate = attemptDate;
           
           // Add to payment history
           const newPaymentRequest = { 
             id: `pr_${Date.now()}`, 
             date: attemptDate, 
             amount: paymentAmount, 
             currency: 'FCFA', 
             status: 'Demandé' as const, 
             description: 'Demande de déverrouillage client' 
            };
           deviceToUpdate.paymentHistory = [...(deviceToUpdate.paymentHistory || []), newPaymentRequest];

           updatedDevices[firstActiveDeviceIndex] = deviceToUpdate;
           showToast(`Demande de déverrouillage pour ${deviceNameForToast} avec paiement de ${paymentAmount} FCFA enregistrée.`, "info");
           return updatedDevices;
        } else {
           showToast(`L'appareil ${deviceNameForToast} n'est pas dans un état permettant une demande de déverrouillage (actuellement: ${deviceToUpdate.status}).`, "warning");
           return prevDevices; 
        }
      } else {
        showToast("Aucun appareil actif trouvé pour la demande de déverrouillage.", "error");
        return prevDevices; 
      }
    });
  }, [showToast]);

  const handleEmergencyCall = useCallback(() => {
    showToast(`Appel d'urgence vers ${EMERGENCY_NUMBER} simulé.`, "info");
  }, [showToast]);

  const devicesToDisplay = showHistoryView 
    ? devices.filter(d => d.isArchived) 
    : devices.filter(d => !d.isArchived);

  return (
    <>
      {currentView === View.Client && (
        <ClientView
          isLocked={isDeviceLockedForClient}
          sellerInfo={sellerInfo}
          onEmergencyCall={handleEmergencyCall}
          onRequestUnlock={handleClientUnlockRequest}
          onNavigateToSupervisorLogin={navigateToSupervisorLogin}
        />
      )}
      {currentView === View.SupervisorLogin && (
        <SupervisorLoginView 
            onLogin={handleLogin}
            onNavigateToClientView={navigateToClientView} 
        />
      )}
      {currentView === View.SupervisorDashboard && isSupervisorLoggedIn && (
        <SupervisorDashboardView
          devicesToDisplay={devicesToDisplay}
          isHistoryView={showHistoryView}
          onLogout={handleLogout}
          onToggleLock={handleDeviceLockToggle}
          onArchiveDevice={handleArchiveDevice}
          onToggleHistoryView={handleToggleHistoryView}
          onTemporaryUnlock={handleTemporaryUnlock}
          onPermanentUnlock={handlePermanentUnlock}
        />
      )}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
};

export default App;