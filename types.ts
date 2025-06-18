export enum View {
  Client,
  SupervisorLogin,
  SupervisorDashboard,
}

export interface SellerInfo {
  contact: string;
  amountDue: string;
  nextPaymentDate: string; // General next payment date for display (DD/MM/YYYY)
}

export enum ClientDeviceStatus {
  Locked = 'Locked',
  Unlocked = 'Unlocked',
  PaymentRequested = 'Payment Requested',
  Settled = 'Settled',
}

export interface Payment {
  id: string;
  date: string; // YYYY-MM-DD
  amount: string;
  currency: string; // e.g., "FCFA"
  status: 'Payé' | 'Demandé' | 'Annulé';
  description?: string;
}

export interface ClientDevice {
  id: string;
  name: string;
  status: ClientDeviceStatus;
  lastSeen: string;
  imei?: string;
  phoneNumber?: string;
  googleAccountEmail?: string;
  appInstallationDate?: string; // Should be in YYYY-MM-DD format for proper sorting
  nextPaymentDate?: string; // Specific next payment date for this device (YYYY-MM-DD)
  isArchived?: boolean; 
  lastPaymentAttemptAmount?: string; 
  lastPaymentAttemptDate?: string; // Date of the last payment attempt (YYYY-MM-DD)
  paymentHistory?: Payment[]; // New field for payment history
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
}