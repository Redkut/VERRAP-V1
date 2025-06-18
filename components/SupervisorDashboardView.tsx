
import React, { useState } from 'react';
import { ClientDevice, ClientDeviceStatus } from '../types';
import { LogOut, Smartphone, Lock, Unlock, KeyRound, CreditCard, Trash2, Edit3, Eye, MoreVertical, Search, Phone, Mail, CalendarDays, Tag, Archive, History, Clock3, ShieldCheck, AlertTriangle, Coins, ListChecks } from 'lucide-react';
import PaymentHistoryModal from './PaymentHistoryModal'; // Import the new modal

interface SupervisorDashboardViewProps {
  devicesToDisplay: ClientDevice[];
  isHistoryView: boolean;
  onLogout: () => void;
  onToggleLock: (deviceId: string, lock: boolean) => void;
  onArchiveDevice: (deviceId: string) => void;
  onToggleHistoryView: () => void;
  onTemporaryUnlock: (deviceId: string) => void;
  onPermanentUnlock: (deviceId: string) => void;
}

const getStatusIcon = (status: ClientDeviceStatus) => {
  switch (status) {
    case ClientDeviceStatus.Locked: return <Lock className="mr-1 inline-block" size={14} />;
    case ClientDeviceStatus.Unlocked: return <Unlock className="mr-1 inline-block" size={14} />;
    case ClientDeviceStatus.PaymentRequested: return <AlertTriangle className="mr-1 inline-block" size={14} />;
    case ClientDeviceStatus.Settled: return <ShieldCheck className="mr-1 inline-block" size={14} />;
    default: return <Smartphone className="mr-1 inline-block" size={14} />;
  }
};


const getStatusColor = (status: ClientDeviceStatus) => {
  switch (status) {
    case ClientDeviceStatus.Locked: return 'bg-red-600 text-red-100';
    case ClientDeviceStatus.Unlocked: return 'bg-green-600 text-green-100';
    case ClientDeviceStatus.PaymentRequested: return 'bg-yellow-500 text-yellow-900';
    case ClientDeviceStatus.Settled: return 'bg-blue-600 text-blue-100';
    default: return 'bg-gray-600 text-gray-100';
  }
};

const getTranslatedClientDeviceStatus = (status: ClientDeviceStatus): string => {
  switch (status) {
    case ClientDeviceStatus.Locked: return 'Verrouillé';
    case ClientDeviceStatus.Unlocked: return 'Déverrouillé';
    case ClientDeviceStatus.PaymentRequested: return 'Paiement demandé';
    case ClientDeviceStatus.Settled: return 'Soldé';
    default: return status;
  }
};

// This helper is also in App.tsx, consider moving to a utils file if app grows
const formatDateForDisplay = (dateStr: string | undefined): string => {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const SupervisorDashboardView: React.FC<SupervisorDashboardViewProps> = ({
  devicesToDisplay,
  isHistoryView,
  onLogout,
  onToggleLock,
  onArchiveDevice,
  onToggleHistoryView,
  onTemporaryUnlock,
  onPermanentUnlock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewingPaymentsForDevice, setViewingPaymentsForDevice] = useState<ClientDevice | null>(null);

  const filteredDevices = devicesToDisplay.filter(device => {
    const translatedStatus = getTranslatedClientDeviceStatus(device.status);
    return device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (device.imei && device.imei.toLowerCase().includes(searchTerm.toLowerCase())) ||
    translatedStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (device.phoneNumber && device.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (device.googleAccountEmail && device.googleAccountEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  });

  const toggleDropdown = (deviceId: string) => {
    setActiveDropdown(activeDropdown === deviceId ? null : deviceId);
  };

  const handleViewPayments = (device: ClientDevice) => {
    setViewingPaymentsForDevice(device);
    setActiveDropdown(null); // Close dropdown
  };
  
  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 bg-zinc-900">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Smartphone size={32} className="text-purple-400" />
          <h1 className="text-3xl font-bold text-purple-400">
            {isHistoryView ? 'Historique des Appareils' : 'Tableau de Bord Superviseur'}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
            <button
                onClick={onToggleHistoryView}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
                <History size={20} />
                <span>{isHistoryView ? 'Voir Appareils Actifs' : 'Voir Historique'}</span>
            </button>
            <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
                <LogOut size={20} />
                <span>Déconnexion</span>
            </button>
        </div>
      </header>

      <div className="mb-6">
        <div className="relative">
          <input 
            type="text"
            placeholder={`Rechercher dans ${isHistoryView ? 'l\'historique' : 'les appareils actifs'} (nom, IMEI, statut, tél, email)...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
        </div>
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-10">
          <Smartphone size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400 text-lg">
            Aucun appareil trouvé{searchTerm ? " pour votre recherche" : ""}{isHistoryView ? " dans l'historique" : " actif"}.
          </p>
          {!isHistoryView && !searchTerm && (
            <p className="text-gray-400 text-sm mt-2">Les nouveaux appareils s'afficheront ici automatiquement.</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDevices.map((device) => {
          const translatedStatusText = getTranslatedClientDeviceStatus(device.status);
          const statusIcon = getStatusIcon(device.status);
          
          return (
            <div key={device.id} className={`bg-zinc-800 p-5 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 flex flex-col justify-between space-y-3 ${device.isArchived ? 'opacity-70 grayscale-[30%]' : ''}`}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-purple-300 break-all pr-2">{device.name}</h3>
                  {/* Action menu button is now always visible */}
                  <div className="relative flex-shrink-0">
                      <button 
                          onClick={() => toggleDropdown(device.id)} 
                          className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-zinc-700 transition-colors"
                          aria-label="Actions de l'appareil"
                      >
                          <MoreVertical size={20} />
                      </button>
                      {activeDropdown === device.id && (
                          <div className="absolute right-0 mt-2 w-64 bg-zinc-700 rounded-md shadow-xl z-20 py-1 border border-zinc-600">
                              {/* Actions for NON-ARCHIVED devices */}
                              {!device.isArchived && device.status === ClientDeviceStatus.Unlocked && (
                                <button onClick={() => { onToggleLock(device.id, true); toggleDropdown(device.id); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-purple-600 hover:text-white flex items-center space-x-2 transition-colors">
                                    <Lock size={16}/>
                                    <span>Verrouiller Appareil</span>
                                </button>
                              )}
                              {!device.isArchived && (device.status === ClientDeviceStatus.Locked || device.status === ClientDeviceStatus.PaymentRequested) && (
                                <button onClick={() => { onTemporaryUnlock(device.id); toggleDropdown(device.id); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-purple-600 hover:text-white flex items-center space-x-2 transition-colors">
                                    <Clock3 size={16}/><span>Déverrouillage Temporaire</span>
                                </button>
                              )}
                              {!device.isArchived && device.status !== ClientDeviceStatus.Settled && (
                                <button onClick={() => { onPermanentUnlock(device.id); toggleDropdown(device.id); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-purple-600 hover:text-white flex items-center space-x-2 transition-colors">
                                    <ShieldCheck size={16}/><span>Déverrouillage Définitif</span>
                                </button>
                              )}
                              
                              {/* "Voir Paiements" - available for ALL devices */}
                              <button onClick={() => { handleViewPayments(device); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-purple-600 hover:text-white flex items-center space-x-2 transition-colors">
                                  <ListChecks size={16}/><span>Voir Paiements</span>
                              </button>

                              {!device.isArchived && device.status === ClientDeviceStatus.Settled && (
                                <button onClick={() => { onArchiveDevice(device.id); toggleDropdown(device.id); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-purple-600 hover:text-white flex items-center space-x-2 transition-colors">
                                    <Archive size={16}/><span>Archiver</span>
                                </button>
                              )}

                              {/* Separator for general actions if there were specific actions above */}
                              {(!device.isArchived || (device.isArchived && (device.paymentHistory && device.paymentHistory.length > 0))) && (
                                <div className="my-1 border-t border-zinc-600"></div>
                              )}
                              
                              {/* General actions - always available (placeholders for now) */}
                              <button onClick={() => { alert('Fonctionnalité d\'édition non implémentée.'); toggleDropdown(device.id); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-purple-600 hover:text-white flex items-center space-x-2 transition-colors">
                                  <Edit3 size={16}/><span>Éditer Appareil</span>
                              </button>
                              <button onClick={() => { if(window.confirm(`Êtes-vous sûr de vouloir supprimer ${device.name} ? Cette action est irréversible.`)) { alert('Suppression non implémentée.'); } toggleDropdown(device.id); }} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-600 hover:text-white flex items-center space-x-2 transition-colors">
                                  <Trash2 size={16}/><span>Supprimer Appareil</span>
                              </button>
                          </div>
                      )}
                  </div>
                </div>
                <p
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center mb-3 ${getStatusColor(device.status)}`}
                  title={translatedStatusText}
                >
                  {statusIcon}
                  <span className="ml-1">{translatedStatusText} {device.isArchived && "(Archivé)"}</span>
                </p>
                
                <div className="space-y-1.5 text-sm">
                  {device.imei && (
                      <div className="flex items-center space-x-2 text-gray-400">
                          <Tag size={15} className="text-purple-400 flex-shrink-0"/>
                          <span className="truncate" title={device.imei}>IMEI: <span className="text-gray-300">{device.imei}</span></span>
                      </div>
                  )}
                  {device.phoneNumber && (
                      <div className="flex items-center space-x-2 text-gray-400">
                          <Phone size={15} className="text-purple-400 flex-shrink-0"/>
                          <span className="truncate" title={device.phoneNumber}>N° Tél: <span className="text-gray-300">{device.phoneNumber}</span></span>
                      </div>
                  )}
                  {device.googleAccountEmail && (
                      <div className="flex items-center space-x-2 text-gray-400">
                          <Mail size={15} className="text-purple-400 flex-shrink-0"/>
                          <span className="truncate" title={device.googleAccountEmail}>Email: <span className="text-gray-300">{device.googleAccountEmail}</span></span>
                      </div>
                  )}
                  {device.appInstallationDate && (
                      <div className="flex items-center space-x-2 text-gray-400">
                          <CalendarDays size={15} className="text-purple-400 flex-shrink-0"/>
                          <span>Installé le: <span className="text-gray-300">{formatDateForDisplay(device.appInstallationDate)}</span></span>
                      </div>
                  )}
                   {device.nextPaymentDate && (device.status !== ClientDeviceStatus.Settled) && (
                      <div className="flex items-center space-x-2 text-gray-400">
                          <CalendarDays size={15} className={`${device.status === ClientDeviceStatus.PaymentRequested ? 'text-yellow-400' : 'text-red-400'} flex-shrink-0`}/>
                          <span>Proch.Paiement: <strong className={`${device.status === ClientDeviceStatus.PaymentRequested ? 'text-yellow-300' : 'text-red-300'}`}>{formatDateForDisplay(device.nextPaymentDate)}</strong></span>
                      </div>
                  )}
                  {device.status === ClientDeviceStatus.PaymentRequested && device.lastPaymentAttemptAmount && device.lastPaymentAttemptDate && (
                    <>
                      <div className="flex items-center space-x-2 text-gray-400">
                          <Coins size={15} className="text-yellow-400 flex-shrink-0"/>
                          <span>Dernier Paiement Tenté: <strong className="text-yellow-300">{device.lastPaymentAttemptAmount} FCFA</strong></span>
                      </div>
                       <div className="flex items-center space-x-2 text-gray-400">
                          <CalendarDays size={15} className="text-yellow-400 flex-shrink-0"/>
                          <span>Date Tentative: <strong className="text-yellow-300">{formatDateForDisplay(device.lastPaymentAttemptDate)}</strong></span>
                      </div>
                    </>
                  )}
                   <div className="flex items-center space-x-2 text-gray-400">
                      <Eye size={15} className="text-purple-400 flex-shrink-0"/>
                      <span>Vu: <span className="text-gray-300">{device.lastSeen}</span></span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {viewingPaymentsForDevice && (
        <PaymentHistoryModal
          isOpen={!!viewingPaymentsForDevice}
          onClose={() => setViewingPaymentsForDevice(null)}
          device={viewingPaymentsForDevice}
        />
      )}

      <footer className="text-xs text-gray-500 pt-8 text-center">
          VERRAPP Web v1.0.0 - Supervisor Panel
      </footer>
    </div>
  );
};

export default SupervisorDashboardView;
