import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Send, Zap } from 'lucide-react';
import { mockStartups } from '../data/mockData';

const StartupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string }>>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const startup = mockStartups.find((s: any) => s.id === id);

  if (!startup) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">Startup not found</div>
      </div>
    );
  }

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-teal-600 hover:text-teal-700 dark:text-teal-500">
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{startup.companyName}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{startup.sector} • {startup.fundingStage}</p>
              </div>
              {startup.fundingStage !== 'Pre-seed' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm font-medium">
                  {startup.fundingStage}
                </span>
              )}
            </div>
            <a href={`mailto:${startup.email}`} className="text-teal-600 hover:text-teal-700 dark:text-teal-500 text-sm">
              {startup.email}
            </a>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{startup.description}</p>
          </div>

          {/* Founder Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{startup.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">CEO / Founder</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{startup.founderExperience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Team Size</p>
                <p className="text-sm text-gray-900 dark:text-white">{startup.teamSize} people</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Current Valuation</p>
                <p className="text-sm text-gray-900 dark:text-white">${(startup.currentValuation / 1000000).toFixed(1)}M</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Last Funding</p>
                <p className="text-sm text-gray-900 dark:text-white">${(startup.fundingAmount / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Chatbot */}
        <div className="space-y-6">
          {/* AI Chat Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-96 flex flex-col">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Insights</h3>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!chatHistory.length && (
                <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-md">
                  <p className="text-sm text-teal-900 dark:text-teal-200 font-medium mb-1">AI Assistant Ready</p>
                  <p className="text-sm text-teal-800 dark:text-teal-300">Ask questions about this startup to get insights from the AI.</p>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs p-2 rounded-md text-sm ${
                      msg.sender === 'user'
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoadingChat && <div className="text-gray-500 dark:text-gray-400 text-sm">AI is thinking...</div>}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendPrompt()}
                  placeholder="Ask about startup..."
                  className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleSendPrompt}
                  disabled={!prompt.trim() || isLoadingChat}
                  className="p-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions - Bottom Left */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2">
            <button className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-2">
              <FileText className="h-4 w-4" /> Create Contract
            </button>
            <button className="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium text-sm flex items-center justify-center gap-2">
              <FileText className="h-4 w-4" /> E-NDA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetailPage;
