import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Send, Zap, ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import NDAModal from '../components/NDAModal';
import InvestmentModal from '../components/InvestmentModal';
import { smartContractService } from '../services/SmartContractService';

interface Startup {
  _id: string;
  companyName: string;
  name: string; // Founder name
  email: string;
  description: string;
  sector: string;
  fundingStage: string;
  fundingAmount: number;
  currentValuation: number;
  teamSize: number;
  founderExperience: string;
  category?: string; // Backend field
  fundingRound?: string; // Backend field
  foundingYear?: number; // Backend field
}

const StartupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string }>>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isNDAModalOpen, setIsNDAModalOpen] = useState(false);

  // Smart Contract State
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentStatus, setInvestmentStatus] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/investor/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch startup details');
        }
        const data = await response.json();

        // Map backend fields to frontend expectations if needed
        const mappedData: Startup = {
          ...data,
          sector: data.sector || data.category || 'Technology',
          fundingStage: data.fundingStage || data.fundingRound || 'Seed',
          // Ensure numbers are numbers
          currentValuation: Number(data.currentValuation) || 0,
          fundingAmount: Number(data.fundingAmount) || 0,
          teamSize: Number(data.teamSize) || 1,
          name: data.founderName || data.name || 'Founder',
        };

        setStartup(mappedData);
      } catch (err) {
        setError('Failed to load startup details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStartup();
    }
  }, [id]);

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;

    // Add user message to chat
    setChatHistory([...chatHistory, { sender: 'user', text: prompt }]);
    setPrompt('');
    setIsLoadingChat(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const sampleResponses = [
        'Based on the startup description, this company has strong potential in the sector.',
        'The funding history shows steady growth. Current valuation appears reasonable.',
        'Key strengths: experienced founder, clear market opportunity, proven traction.',
        'Consider asking about their go-to-market strategy and competitive advantages.',
        'The team composition suggests strong technical and business expertise.',
      ];
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      setChatHistory((prev) => [...prev, { sender: 'ai', text: randomResponse }]);
      setIsLoadingChat(false);
    }, 500);
  };

  const handleSignNDA = (signatureData: string) => {
    console.log('NDA Signed for', startup?.companyName);
    // In a real app, you would upload the signature image to the backend here
    alert('NDA successfully signed! You can now access confidential documents.');
  };

  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);

  const handleCreateProposal = async (data: any) => {
    try {
      const token = localStorage.getItem('innova_token');
      const res = await fetch(`http://localhost:4000/api/contract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          startupId: startup?._id,
          ...data
        })
      });

      if (res.ok) {
        alert('Investment Proposal Created! Check your Investments page.');
        navigate('/dashboard'); // Or navigate to /investments
      } else {
        alert('Failed to create proposal');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating proposal');
    }
  };

  const handleInvestClick = () => {
    setIsInvestmentModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !startup) return <div className="p-8 text-center text-red-500">{error || 'Startup not found'}</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center gap-4 z-10">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{startup.companyName}</h1>
        {contractAddress && (
          <span className="ml-auto text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">
            Contract: {contractAddress.substring(0, 8)}...
          </span>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content - Left Side */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Startup Details - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{startup.companyName}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{startup.sector} • {startup.fundingStage}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {startup.fundingStage}
                </span>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{startup.description || 'No description available.'}</p>

                <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Valuation</p>
                    <p className="font-semibold">
                      {startup.currentValuation > 0
                        ? `$${(startup.currentValuation / 1000000).toFixed(1)}M`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Funding</p>
                    <p className="font-semibold">
                      {startup.fundingAmount > 0
                        ? `$${(startup.fundingAmount / 1000000).toFixed(1)}M`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Team</p>
                    <p className="font-semibold">{startup.teamSize} Members</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Founder</p>
                    <p className="font-semibold truncate">{startup.name}</p>
                  </div>
                </div>

                {startup.founderExperience && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Founder Experience</h3>
                    <p className="text-gray-700 dark:text-gray-300">{startup.founderExperience}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Left - Invest Button Area (20% height) */}
          <div className="h-[20%] bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between gap-4">
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setIsNDAModalOpen(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="h-5 w-5" /> Sign E-NDA
              </button>
              <button
                onClick={handleInvestClick}
                className="flex-[2] bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Zap className="h-5 w-5" /> Invest Now
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chatbot (20-30% width) */}
        <div className="w-[30%] flex flex-col border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {/* Top Right - Chat Results */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2 mb-4 text-teal-600">
              <Zap className="h-5 w-5" />
              <h3 className="font-semibold">AI Insights</h3>
            </div>

            {chatHistory.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                <p>Ask me anything about {startup.companyName}!</p>
              </div>
            )}

            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm rounded-bl-none'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoadingChat && <div className="text-gray-500 text-sm animate-pulse">AI is analyzing...</div>}
          </div>

          {/* Bottom Right - Chat Prompt (20% height) */}
          <div className="h-[20%] p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendPrompt()}
              placeholder="Ask a question..."
              className="flex-1 w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 dark:text-white mb-2"
            />
            <button
              onClick={handleSendPrompt}
              disabled={!prompt.trim() || isLoadingChat}
              className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Send className="h-4 w-4" /> Send Query
            </button>
          </div>
        </div>
      </div>

      <NDAModal
        isOpen={isNDAModalOpen}
        onClose={() => setIsNDAModalOpen(false)}
        onSign={handleSignNDA}
        companyName={startup.companyName}
      />

      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        onSubmit={handleCreateProposal}
        companyName={startup.companyName}
      />
    </div>
  );
};

export default StartupDetailPage;
