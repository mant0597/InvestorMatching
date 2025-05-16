import React from 'react';
import { Heart, Calendar, DollarSign, Users, Building, Briefcase } from 'lucide-react';
import { Startup } from '../types';

interface StartupCardProps {
  startup: Startup;
  onWishlist?: (startupId: string) => void;
  isWishlisted?: boolean;
  onContactRequest?: (startupId: string) => void;
}

const StartupCard: React.FC<StartupCardProps> = ({ 
  startup, 
  onWishlist, 
  isWishlisted = false,
  onContactRequest 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const getCompanyAge = (foundingDate: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - new Date(foundingDate).getTime());
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
              {startup.companyName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Building className="w-4 h-4 mr-1" />
              {startup.sector}
            </p>
          </div>
          {onWishlist && (
            <button 
              onClick={() => onWishlist(startup.id)}
              className={`p-2 rounded-full transition-colors ${
                isWishlisted 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        
        <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
          {startup.description}
        </p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{getCompanyAge(startup.foundingDate)} old</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{startup.teamSize} team members</span>
          </div>
          
          <div className="flex items-center text-sm">
            <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">Valuation: {formatCurrency(startup.currentValuation)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{startup.fundingStage} stage</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Raising</p>
              <p className="text-lg font-bold text-teal-600 dark:text-teal-500">
                {formatCurrency(startup.fundingAmount)}
              </p>
            </div>
            
            {onContactRequest && (
              <button 
                onClick={() => onContactRequest(startup.id)}
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

export default StartupCard;