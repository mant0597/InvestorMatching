import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarOff, BookOpen, MessageCircle, Calendar, Settings, Bell, Heart, Edit, TrendingUp, Zap, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StartupCard from '../components/StartupCard';
import SearchFilters from '../components/SearchFilters';
import { mockStartups, mockInvestors, mockMeetingRequests } from '../data/mockData';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlistedStartups, setWishlistedStartups] = useState<string[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');

  const [startups, setStartups] = useState<any[]>(mockStartups);
  const [investors, setInvestors] = useState<any[]>(mockInvestors);
  const [loadingStartups, setLoadingStartups] = useState(false);
  const [loadingInvestors, setLoadingInvestors] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const API_BASE = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:4000';
  const TOKEN_KEY = 'innova_token';

  React.useEffect(() => {
    if (!user) return;
    setFetchError(null);

    const ctrl = new AbortController();
    const params = new URLSearchParams();
    if (selectedCategoryFilter) params.set('category', selectedCategoryFilter);

    // optional search param: use same searchQuery if you wire it
    // if (searchQuery) params.set('q', searchQuery);

    const token = localStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    async function fetchStartups() {
      try {
        setLoadingStartups(true);
        const res = await fetch(`${API_BASE}/api/investor?${params.toString()}`, {
          method: 'GET',
          headers,
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`Startups API ${res.status}`);
        const body = await res.json();
        const fetchedStartups = Array.isArray(body.startups) ? body.startups : mockStartups;
        // Normalize data to ensure 'id' property exists
        const normalizedStartups = fetchedStartups.map(s => ({ ...s, id: s.id || s._id }));
        setStartups(normalizedStartups);
      } catch (err: any) {
        console.warn('Startups fetch failed, using mock data', err);
        // Also normalize mock data on failure
        const normalizedMockStartups = mockStartups.map(s => ({ ...s, id: s.id || s._id }));
        setStartups(normalizedMockStartups);
        setFetchError(String(err.message || err));
      } finally {
       setLoadingStartups(false);
      }
    }

    async function fetchInvestors() {
      try {
        setLoadingInvestors(true);
        const res = await fetch(`${API_BASE}/api/startup?${params.toString()}`, {
          method: 'GET',
          headers,
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`Investors API ${res.status}`);
        const body = await res.json();
        setInvestors(Array.isArray(body.investors) ? body.investors : mockInvestors);
      } catch (err: any) {
        console.warn('Investors fetch failed, using mock data', err);
        setInvestors(mockInvestors);
        setFetchError(String(err.message || err));
      } finally {
        setLoadingInvestors(false);
      }
    }

    if (user.role === 'startup') {
      fetchInvestors();
    } else {
      fetchStartups();
    }

    return () => ctrl.abort();
  }, [user, selectedCategoryFilter]);

  // use fetched investors (filtered) instead of only mockInvestors
  const filteredInvestors = selectedCategoryFilter
    ? investors.filter(inv => (inv as any).investmentPreferences?.sectors?.includes(selectedCategoryFilter))
    : investors;

  // Mock notifications for startups
  const mockNotifications = [
    { id: '1', type: 'connect', investorName: 'Sarah Chen', message: 'Wants to connect with your startup', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', type: 'message', investorName: 'John Smith', message: 'New message in chat', timestamp: new Date(Date.now() - 7200000) },
    { id: '3', type: 'meeting', investorName: 'Emma Wilson', message: 'Requested a meeting', timestamp: new Date(Date.now() - 86400000) },
  ];

  // Mock news for startups
  const mockNews = [
    { id: '1', title: 'New Funding Opportunities in Tech Sector', source: 'TechCrunch', date: '2 hours ago', category: 'Funding' },
    { id: '2', title: 'Top 10 FinTech Startups to Watch in 2025', source: 'Forbes', date: '1 day ago', category: 'Industry' },
    { id: '3', title: 'AI Investments Hit Record High', source: 'Bloomberg', date: '2 days ago', category: 'Market' },
  ];
  
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

  const handleSearch = (query: string, filters: any) => {
    console.log('Search:', query, filters);
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

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const quickActions = [
    {
      label: 'Messages',
      icon: MessageCircle,
    },
    {
      label: 'Schedule',
      icon: Calendar,
    },
    {
      label: 'Resources',
      icon: BookOpen,
    },
    {
      label: 'Settings',
      icon: Settings,
    },
  ];

  if (!user) return null;

  // STARTUP DASHBOARD
  if (user.role === 'startup') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Startup Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with investors interested in {(user as any).category || 'your category'}.
            </p>
          </div>
          <button 
            onClick={() => navigate('/profile/edit')}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Find Investors Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Find Investors</h2>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Category
                </label>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Investors</option>
                  <option value="FinTech">FinTech</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="CleanTech">CleanTech</option>
                  <option value="AI">AI</option>
                  <option value="AgTech">AgTech</option>
                  <option value="LogisticsTech">LogisticsTech</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="SaaS">SaaS</option>
                  <option value="EdTech">EdTech</option>
                </select>
              </div>

              {/* Investor Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInvestors.map(investor => (
                  <div 
                    key={investor.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {investor.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {(investor as any).investmentPreferences?.sectors?.[0] || 'Investor'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        📧 {investor.email}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {(investor as any).investmentPreferences?.sectors?.slice(0, 3).map((sector: string) => (
                          <span key={sector} className="text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full">
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/messages/${investor.id}`)}
                        className="w-full px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-md transition-colors"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* News Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Latest News</h3>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                {mockNews.map(news => (
                  <div 
                    key={news.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {news.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                            {news.category}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {news.source} • {news.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
                <Bell className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-3">
                {mockNotifications.length > 0 ? (
                  mockNotifications.map(notif => (
                    <div 
                      key={notif.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border-l-4 border-teal-500"
                    >
                      <div className="flex items-start gap-2">
                        {notif.type === 'connect' && <MessageCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />}
                        {notif.type === 'message' && <Bell className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />}
                        {notif.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {notif.investorName}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {getTimeAgo(notif.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No notifications yet.</p>
                )}
              </div>
            </div>

            {/* Meeting Scheduler */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Meeting Requests</h3>
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div className="space-y-3">
                {mockMeetingRequests.slice(0, 3).map(meeting => (
                  <div 
                    key={meeting.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {mockInvestors.find(i => i.id === meeting.investorId)?.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(meeting.proposedDate)}
                        </p>
                      </div>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
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
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        "{meeting.message}"
                      </p>
                    )}
                    {meeting.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="flex-1 px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors flex items-center justify-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Accept
                        </button>
                        <button className="flex-1 px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-1">
                          <XCircle className="h-3 w-3" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profile Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
                  <span className="font-semibold text-gray-900 dark:text-white">24</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Connection Requests</span>
                  <span className="font-semibold text-gray-900 dark:text-white">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Messages</span>
                  <span className="font-semibold text-gray-900 dark:text-white">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // INVESTOR DASHBOARD (original)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Investor Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover promising startups and manage your investment opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Search and filtering section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Startups
            </h2>
            <SearchFilters 
              onSearch={handleSearch} 
              entityType="startup" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {startups.map(startup => (
                <StartupCard
                  key={startup.id} 
                  startup={startup} 
                  onWishlist={handleWishlist}
                  isWishlisted={wishlistedStartups.includes(startup.id)}
                />
              ))}
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
                      <div key={id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex justify-between items-center">
                        <div
                          // The key prop should be on the outermost element in the array,
                          // but since we are not mapping over components here, we can just remove it.
                        >
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
              {quickActions.map(action => (
                <button
                  key={action.label}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                >
                  <action.icon className="h-5 w-5 text-teal-600 dark:text-teal-500 mb-1" />
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;