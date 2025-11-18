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

// Additional / Dashboard-oriented types

export interface FundingRound {
  id: string;
  roundType: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'other';
  amount: number;
  date: Date;
  leadInvestor?: string; // investor id or name
}

// Extended Startup schema for dashboard/profile completion
export interface StartupProfile extends Startup {
  previousFundings?: FundingRound[];
  category?: string; // e.g. 'FinTech', 'HealthTech'
  foundedYear?: number; // convenience field for forms
  website?: string;
  traction?: string; // short traction metrics
  team?: Array<{ name: string; role: string }>;
  profileCompleted?: boolean;
}

// Extended Investor schema for dashboard/profile
export interface InvestorProfile extends Investor {
  organization?: string;
  title?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedIn?: string;
  profileCompleted?: boolean;
}

export type NotificationType =
  | 'interest' // investor expressed interest
  | 'message'
  | 'meeting'
  | 'system'
  | 'summary_ready';

export interface Notification {
  id: string;
  userId: string; // who receives it
  type: NotificationType;
  title: string;
  body?: string;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>; // e.g. { startupId, investorId, meetingId }
}

export interface Meeting {
  id: string;
  startupId: string;
  investorId: string;
  scheduledAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  message?: string;
  meetLink?: string; // e.g. Google Meet link
  calendarEventId?: string;
}

export interface ChatSummary {
  id: string;
  sourceType: 'startup' | 'investor';
  sourceId: string; // id of the startup or investor the summary is about
  summaryText: string;
  generatedAt: Date;
  wordCount?: number;
}

// Re-export types used across the app for convenience
export type { Startup as BaseStartup, Investor as BaseInvestor };