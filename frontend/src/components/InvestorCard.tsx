import React from 'react';
import { DollarSign, Target, Briefcase, Calendar } from 'lucide-react';
import { Investor } from '../types';

interface InvestorCardProps {
  investor: Investor;
  onContactRequest?: (investorId: string) => void;
}

const InvestorCard: React.FC<InvestorCardProps> = ({ investor, onContactRequest }) => {
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'Not specified';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const getExperienceYears = (createdAt: Date) => {
    const today = new Date();
    const joined = new Date(createdAt);
    const diffTime = Math.abs(today.getTime() - joined.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    
    if (diffYears < 1) {
      const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    }
    
    return `${diffYears} year${diffYears !== 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {investor.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Investor for {getExperienceYears(investor.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Preferences</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center text-sm">
              <Target className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
              <div>
                <span className="text-gray-600 dark:text-gray-400">Sectors: </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {investor.investmentPreferences.sectors.join(', ')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
              <div>
                <span className="text-gray-600 dark:text-gray-400">Stages: </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {investor.investmentPreferences.fundingStages.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Min investment:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(investor.investmentPreferences.minInvestment)}
                </p>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Max investment:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(investor.investmentPreferences.maxInvestment)}
                </p>
              </div>
            </div>
            
            {onContactRequest && (
              <button 
                onClick={() => onContactRequest(investor.id)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Contact
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorCard;