import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, StarOff, BookOpen, MessageCircle, Calendar, Settings, Bell, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StartupCard from '../components/StartupCard';
import InvestorCard from '../components/InvestorCard';
import SearchFilters from '../components/SearchFilters';
import { mockStartups, mockInvestors, mockMeetingRequests } from '../data/mockData';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlistedStartups, setWishlistedStartups] = useState<string[]>([]);
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleWishlist = (startupId: string) => {
    if (wishlistedStartups.includes(startupId)) {
      setWishlistedStartups(wishlistedStartups.filter(id => id !== startupId));
    } else {
      setWishlistedStartups([...wishlistedStartups, startupId]);
    }
  };

  const handleContactRequest = (id: string) => {
    navigate(`/messages/${id}`);
  };

  const handleSearch = (query: string, filters: any) => {
    console.log('Search:', query, filters);
    // In a real app, this would filter the data based on the query and filters
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {user.role === 'investor' ? 'Investor Dashboard' : 'Startup Dashboard'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user.role === 'investor' 
            ? 'Discover promising startups and manage your investment opportunities.' 
            : 'Connect with potential investors and manage your fundraising journey.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Search and filtering section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {user.role === 'investor' ? 'Discover Startups' : 'Find Investors'}
            </h2>
            <SearchFilters 
              onSearch={handleSearch} 
              entityType={user.role === 'investor' ? 'startup' : 'investor'} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {user.role === 'investor' ? (
                // Show startups for investors
                mockStartups.map(startup => (
                  <StartupCard 
                    key={startup.id} 
                    startup={startup} 
                    onWishlist={handleWishlist}
                    isWishlisted={wishlistedStartups.includes(startup.id)}
                  />
                ))
              ) : (
                // Show investors for startups
                mockInvestors.map(investor => (
                  <InvestorCard 
                    key={investor.id} 
                    investor={investor} 
                    onContactRequest={handleContactRequest}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Sidebar sections */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Meetings</h3>
            {mockMeetingRequests.length > 0 ? (
              <div className="space-y-4">
                {mockMeetingRequests.map(meeting => (
                  <div 
                    key={meeting.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.role === 'investor' 
                            ? mockStartups.find(s => s.id === meeting.startupId)?.companyName
                            : mockInvestors.find(i => i.id === meeting.investorId)?.name
                          }
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(meeting.proposedDate)}
                        </p>
                      </div>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          meeting.status === 'accepted'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : meeting.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                      </span>
                    </div>
                    {meeting.message && (
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        "{meeting.message}"
                      </p>
                    )}
                    <div className="mt-3 text-right">
                      <button className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-500 dark:hover:text-teal-400">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">No upcoming meetings.</p>
            )}
          </div>

          {user.role === 'investor' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Wishlisted Startups</h3>
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              {wishlistedStartups.length > 0 ? (
                <div className="space-y-4">
                  {wishlistedStartups.map(id => {
                    const startup = mockStartups.find(s => s.id === id);
                    if (!startup) return null;
                    
                    return (
                      <div 
                        key={id}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {startup.companyName}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {startup.sector} • {startup.fundingStage}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleWishlist(id)}
                          className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500"
                        >
                          <StarOff className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm">No wishlisted startups yet.</p>
              )}
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left">
                <MessageCircle className="h-5 w-5 text-teal-600 dark:text-teal-500 mb-1" />
                <span className="block text-sm font-medium text-gray-900 dark:text-white">Messages</span>
              </button>
              <button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left">
                <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-500 mb-1" />
                <span className="block text-sm font-medium text-gray-900 dark:text-white">Schedule</span>
              </button>
              <button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left">
                <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-500 mb-1" />
                <span className="block text-sm font-medium text-gray-900 dark:text-white">Resources</span>
              </button>
              <button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left">
                <Settings className="h-5 w-5 text-teal-600 dark:text-teal-500 mb-1" />
                <span className="block text-sm font-medium text-gray-900 dark:text-white">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;