import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, DollarSign, Users, Building, Briefcase, Eye, MessageCircle } from 'lucide-react';
import { Startup } from '../types';
import { useAuth } from '../context/AuthContext';

interface StartupCardProps {
  startup: Startup;
  onWishlist?: (startupId: string) => void;
  isWishlisted?: boolean;
}

const StartupCard: React.FC<StartupCardProps> = ({ 
  startup, 
  onWishlist, 
  isWishlisted = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_BASE = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:4000';
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


  const handleConnect = async () => {
    const startupId = startup?.id || startup?._id;
    console.log('Connect clicked for startup:', startupId);
    if (!user) {
      navigate('/login');
      return;
    }
    if (!startupId) {
      console.error('startup id missing on card', startup);
      return;
    }

    try {
      const token = localStorage.getItem('innova_token') || '';
      const res = await fetch(`${API_BASE}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ participants: [user.id, startupId] }),
      });

      if (!res.ok) {
        console.error('create/get room failed', await res.text());
        return;
      }

      const body = await res.json();
      const room = body.room || body;
      const roomId = room && (room._id || room.id || room.roomId);
      if (roomId) {
        navigate(`/messages/${roomId}`);
      } else {
        console.error('no room id returned', body);
      }
    } catch (err) {
      console.error('connect error', err);
    }
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
          <div className="flex justify-between items-center gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Raising</p>
              <p className="text-lg font-bold text-teal-600 dark:text-teal-500">
                {formatCurrency(startup.fundingAmount)}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/startup/${startup.id}`)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1"
              >
                <Eye className="h-3 w-3" /> Open
              </button>
              <button 
                onClick={handleConnect}
                className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1"
              >
                <MessageCircle className="h-3 w-3" /> Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupCard;
