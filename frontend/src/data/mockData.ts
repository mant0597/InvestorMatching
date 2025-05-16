import { Startup, Investor, Message, MeetingRequest } from '../types';

// Mock startups
export const mockStartups: Startup[] = [
  {
    id: '1',
    email: 'contact@ecoflow.tech',
    name: 'Alex Chen',
    role: 'startup',
    createdAt: new Date('2022-03-15'),
    companyName: 'EcoFlow Technologies',
    description: 'Developing sustainable energy solutions for residential buildings, focusing on innovative solar integration and energy storage systems.',
    foundingDate: new Date('2022-03-15'),
    sector: 'CleanTech',
    fundingStage: 'Seed',
    currentValuation: 5000000,
    fundingAmount: 800000,
    founderExperience: '8 years in renewable energy sector',
    teamSize: 12
  },
  {
    id: '2',
    email: 'founder@healthpulse.io',
    name: 'Sarah Johnson',
    role: 'startup',
    createdAt: new Date('2021-11-08'),
    companyName: 'HealthPulse',
    description: 'AI-powered health monitoring platform that provides personalized insights and early disease detection through non-invasive wearable technology.',
    foundingDate: new Date('2021-11-08'),
    sector: 'HealthTech',
    fundingStage: 'Series A',
    currentValuation: 12000000,
    fundingAmount: 3000000,
    founderExperience: '10 years in medical devices and AI',
    teamSize: 24
  },
  {
    id: '3',
    email: 'hello@urbanfarmer.co',
    name: 'Michael Torres',
    role: 'startup',
    createdAt: new Date('2023-01-20'),
    companyName: 'UrbanFarmer',
    description: 'Vertical farming solution for urban environments, utilizing hydroponics and IoT systems to grow fresh produce with 90% less water.',
    foundingDate: new Date('2023-01-20'),
    sector: 'AgTech',
    fundingStage: 'Pre-seed',
    currentValuation: 2000000,
    fundingAmount: 500000,
    founderExperience: '5 years in agricultural innovation',
    teamSize: 7
  },
  {
    id: '4',
    email: 'team@finlytic.com',
    name: 'Rachel Wong',
    role: 'startup',
    createdAt: new Date('2022-06-12'),
    companyName: 'Finlytic',
    description: 'Financial analytics platform that helps SMEs optimize cash flow and make data-driven financial decisions through predictive modeling.',
    foundingDate: new Date('2022-06-12'),
    sector: 'FinTech',
    fundingStage: 'Seed',
    currentValuation: 7500000,
    fundingAmount: 1200000,
    founderExperience: '12 years in financial services',
    teamSize: 15
  },
  {
    id: '5',
    email: 'founders@logistix.ai',
    name: 'David Park',
    role: 'startup',
    createdAt: new Date('2021-09-03'),
    companyName: 'Logistix.AI',
    description: 'Supply chain optimization using AI and machine learning to reduce waste, cut costs, and increase delivery efficiency by up to 30%.',
    foundingDate: new Date('2021-09-03'),
    sector: 'LogisticsTech',
    fundingStage: 'Series A',
    currentValuation: 18000000,
    fundingAmount: 4500000,
    founderExperience: '15 years in logistics and supply chain',
    teamSize: 32
  }
];

// Mock investors
export const mockInvestors: Investor[] = [
  {
    id: '101',
    email: 'james@venturecap.com',
    name: 'James Wilson',
    role: 'investor',
    createdAt: new Date('2020-05-12'),
    investmentPreferences: {
      sectors: ['FinTech', 'HealthTech', 'AI'],
      fundingStages: ['Seed', 'Series A'],
      minInvestment: 200000,
      maxInvestment: 2000000
    },
    investmentHistory: [
      {
        startupId: '2',
        amount: 1000000,
        date: new Date('2022-02-15')
      }
    ]
  },
  {
    id: '102',
    email: 'elena@techfund.io',
    name: 'Elena Rodriguez',
    role: 'investor',
    createdAt: new Date('2019-11-30'),
    investmentPreferences: {
      sectors: ['CleanTech', 'AgTech', 'Sustainability'],
      fundingStages: ['Pre-seed', 'Seed'],
      minInvestment: 100000,
      maxInvestment: 1000000
    }
  },
  {
    id: '103',
    email: 'michael@angelinvest.net',
    name: 'Michael Chang',
    role: 'investor',
    createdAt: new Date('2021-03-17'),
    investmentPreferences: {
      sectors: ['E-commerce', 'LogisticsTech', 'Marketplace'],
      fundingStages: ['Seed', 'Series A', 'Series B'],
      minInvestment: 500000,
      maxInvestment: 5000000
    },
    investmentHistory: [
      {
        startupId: '5',
        amount: 2000000,
        date: new Date('2022-06-20')
      }
    ]
  }
];

// Mock messages
export const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: '101',
    receiverId: '2',
    content: "I'm interested in your AI-powered health monitoring technology. Could we schedule a meeting to discuss it further?",
    timestamp: new Date('2023-09-15T10:30:00'),
    read: true
  },
  {
    id: 'm2',
    senderId: '2',
    receiverId: '101',
    content: "Thank you for your interest! I'd be happy to discuss our technology. How does next Tuesday at 2 PM sound?",
    timestamp: new Date('2023-09-15T14:45:00'),
    read: true
  },
  {
    id: 'm3',
    senderId: '101',
    receiverId: '2',
    content: "Tuesday at 2 PM works perfectly. I'll send a calendar invite. Looking forward to our discussion!",
    timestamp: new Date('2023-09-16T09:20:00'),
    read: false
  },
  {
    id: 'm4',
    senderId: '103',
    receiverId: '5',
    content: "Your logistics optimization platform looks promising. I'd like to learn more about your machine learning models and how they improve efficiency.",
    timestamp: new Date('2023-09-10T16:15:00'),
    read: true
  },
  {
    id: 'm5',
    senderId: '5',
    receiverId: '103',
    content: "Thanks for reaching out! Our ML models focus on route optimization and demand forecasting. Would you be available for a demo this week?",
    timestamp: new Date('2023-09-11T11:30:00'),
    read: true
  }
];

// Mock meeting requests
export const mockMeetingRequests: MeetingRequest[] = [
  {
    id: 'mtg1',
    investorId: '101',
    startupId: '2',
    proposedDate: new Date('2023-09-20T14:00:00'),
    status: 'accepted',
    message: 'Looking forward to discussing your AI health monitoring platform.'
  },
  {
    id: 'mtg2',
    investorId: '103',
    startupId: '5',
    proposedDate: new Date('2023-09-22T11:00:00'),
    status: 'pending',
    message: 'Interested in seeing a demo of your logistics optimization technology.'
  },
  {
    id: 'mtg3',
    investorId: '102',
    startupId: '3',
    proposedDate: new Date('2023-09-25T10:30:00'),
    status: 'pending',
    message: 'Would love to learn more about your vertical farming solution and how it addresses urban food challenges.'
  }
];