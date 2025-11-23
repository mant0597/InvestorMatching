// User Types
export type UserRole = 'investor' | 'startup' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface Investor extends User {
  role: 'investor';
  investmentPreferences: {
    sectors: string[];
    fundingStages: string[];
    minInvestment?: number;
    maxInvestment?: number;
  };
  investmentHistory?: InvestmentHistoryItem[];
}

export interface Startup extends User {
  _id?: string; // Backend ID
  role: 'startup';
  companyName: string;
  description: string;
  foundingDate: Date;
  sector: string;
  fundingStage: string;
  currentValuation: number;
  fundingAmount: number;
  founderExperience: string;
  teamSize: number;
  // Backend compatibility fields
  category?: string;
  fundingRound?: string;
  foundingYear?: number;
  founderName?: string;
}

// Other Types
export interface InvestmentHistoryItem {
  startupId: string;
  amount: number;
  date: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface MeetingRequest {
  id: string;
  investorId: string;
  startupId: string;
  proposedDate: Date;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
}