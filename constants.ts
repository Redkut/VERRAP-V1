import { SellerInfo, ClientDevice, ClientDeviceStatus, Payment } from './types';

export const INITIAL_SELLER_INFO: SellerInfo = {
  contact: "+22966114464 / joystickmobi@gmail.com",
  amountDue: "15000 FCFA",
  nextPaymentDate: "2024-08-15", // Standardized to YYYY-MM-DD
};

const samplePaymentHistory1: Payment[] = [
  { id: "p001a", date: "2024-07-01", amount: "10000", currency: "FCFA", status: 'Payé', description: "Acompte initial" },
  { id: "p001b", date: "2024-07-15", amount: "5000", currency: "FCFA", status: 'Payé', description: "Paiement mensuel" },
  { id: "p001c", date: "2024-08-01", amount: "5000", currency: "FCFA", status: 'Demandé', description: "Tentative pour août" },
];

const samplePaymentHistory2: Payment[] = [
  { id: "p002a", date: "2024-06-20", amount: "7000", currency: "FCFA", status: 'Payé', description: "Premier versement" },
  { 
    id: "p002b", 
    date: "2024-07-27", // Corresponds to lastPaymentAttemptDate for device_002
    amount: "5000",    // Corresponds to lastPaymentAttemptAmount for device_002
    currency: "FCFA", 
    status: 'Demandé', 
    description: "Demande de déverrouillage client" 
  },
];


export const MOCK_DEVICES: ClientDevice[] = [
  {
    id: "device_001",
    name: "Client A - Samsung S21",
    status: ClientDeviceStatus.Locked,
    lastSeen: "2024-07-28 10:00",
    imei: "123456789012345",
    phoneNumber: "+1234567890",
    googleAccountEmail: "client.a@example.com",
    appInstallationDate: "2024-07-01",
    nextPaymentDate: "2024-08-10",
    isArchived: false,
    paymentHistory: samplePaymentHistory1,
  },
  {
    id: "device_002",
    name: "Client B - iPhone 13",
    status: ClientDeviceStatus.PaymentRequested,
    lastSeen: "2024-07-27 15:30",
    imei: "543210987654321",
    phoneNumber: "+0987654321",
    googleAccountEmail: "client.b@example.com",
    appInstallationDate: "2024-06-15",
    nextPaymentDate: "2024-07-25",
    isArchived: false,
    lastPaymentAttemptAmount: "5000",
    lastPaymentAttemptDate: "2024-07-27",
    paymentHistory: samplePaymentHistory2,
  },
  {
    id: "device_003",
    name: "Client C - Pixel 6 (Archived)",
    status: ClientDeviceStatus.Settled,
    lastSeen: "2024-07-28 09:15",
    appInstallationDate: "2024-07-10",
    nextPaymentDate: undefined,
    isArchived: true,
    paymentHistory: [
      { id: "p003a", date: "2024-07-10", amount: "25000", currency: "FCFA", status: 'Payé', description: "Paiement unique (solde)" },
    ]
  },
  {
    id: "device_004",
    name: "Client D - OnePlus 9 (Settled)",
    status: ClientDeviceStatus.Settled,
    lastSeen: "2024-07-28 11:00",
    imei: "987654321012345",
    phoneNumber: "+1122334455",
    googleAccountEmail: "client.d@example.com",
    appInstallationDate: "2024-07-20",
    nextPaymentDate: undefined,
    isArchived: true,
  },
  {
    id: "device_005",
    name: "Client E - Xiaomi Poco X3",
    status: ClientDeviceStatus.Unlocked, 
    lastSeen: "2024-07-29 12:00",
    imei: "135792468012345",
    phoneNumber: "+5544332211",
    googleAccountEmail: "client.e@example.com", 
    appInstallationDate: "2024-07-25",
    nextPaymentDate: "2024-09-01",
    isArchived: false,
    paymentHistory: [
        { id: "p005a", date: "2024-07-25", amount: "12000", currency: "FCFA", status: 'Payé', description: "Paiement initial" }
    ]
  },
  {
    id: "device_006",
    name: "Client F - Tecno Spark",
    status: ClientDeviceStatus.Locked,
    lastSeen: "2024-07-30 08:00",
    imei: "678901234512345",
    phoneNumber: "+22998765432",
    googleAccountEmail: "client.f.simule@example.com",
    appInstallationDate: "2024-07-15",
    nextPaymentDate: "2024-08-05",
    isArchived: false,
  },
];

export const EMERGENCY_NUMBER = "112";