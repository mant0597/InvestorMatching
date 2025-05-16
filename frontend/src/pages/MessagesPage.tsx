import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatInterface from '../components/ChatInterface';
import { mockStartups, mockInvestors, mockMessages } from '../data/mockData';
import { Message } from '../types';

const MessagesPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeContact, setActiveContact] = useState<string | null>(id || null);
  const [conversations, setConversations] = useState<Message[]>([]);
  const [messagesByConversation, setMessagesByConversation] = useState<{ [key: string]: Message[] }>({});
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Get all conversations for the current user
  useEffect(() => {
    if (!user) return;

    // Group messages by conversation
    const userMessages = mockMessages.filter(
      msg => msg.senderId === user.id || msg.receiverId === user.id
    );
    
    // Extract unique conversation IDs
    const conversationMap: { [key: string]: Message[] } = {};
    
    userMessages.forEach(msg => {
      const otherPartyId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      
      if (!conversationMap[otherPartyId]) {
        conversationMap[otherPartyId] = [];
      }
      
      conversationMap[otherPartyId].push(msg);
    });
    
    // Sort messages within each conversation by timestamp
    Object.keys(conversationMap).forEach(contactId => {
      conversationMap[contactId].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
    
    setMessagesByConversation(conversationMap);
    setConversations(userMessages);
    
    // If there's no active contact but we have conversations, set the first one as active
    if (!activeContact && Object.keys(conversationMap).length > 0) {
      setActiveContact(Object.keys(conversationMap)[0]);
    }
  }, [user, activeContact]);

  const handleSendMessage = (content: string) => {
    if (!user || !activeContact) return;
    
    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      receiverId: activeContact,
      content,
      timestamp: new Date(),
      read: false
    };
    
    // Update UI optimistically
    setMessagesByConversation(prev => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), newMessage]
    }));
  };

  const getContactDetails = (contactId: string) => {
    if (user?.role === 'investor') {
      return mockStartups.find(startup => startup.id === contactId);
    } else {
      return mockInvestors.find(investor => investor.id === contactId);
    }
  };

  const formatLastMessage = (messages: Message[]) => {
    if (!messages || messages.length === 0) return 'No messages yet';
    const lastMessage = messages[messages.length - 1];
    return lastMessage.content.length > 30 
      ? lastMessage.content.substring(0, 30) + '...' 
      : lastMessage.content;
  };

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleOpenChatbot = () => {
    console.log('Opening chatbot');
    // In a real app, this would open a chatbot interface
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Communicate with startups and investors directly through our secure messaging system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[75vh]">
        {/* Conversation list */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Conversations</h2>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-56px)]">
            {Object.keys(messagesByConversation).length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {Object.keys(messagesByConversation).map(contactId => {
                  const contact = getContactDetails(contactId);
                  const messages = messagesByConversation[contactId];
                  const lastMessage = messages[messages.length - 1];
                  const unreadCount = messages.filter(
                    msg => msg.receiverId === user.id && !msg.read
                  ).length;
                  
                  return contact ? (
                    <button
                      key={contactId}
                      className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        activeContact === contactId ? 'bg-gray-50 dark:bg-gray-700' : ''
                      }`}
                      onClick={() => setActiveContact(contactId)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.role === 'investor' ? contact.companyName : contact.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {formatLastMessage(messages)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimestamp(lastMessage.timestamp)}
                          </span>
                          {unreadCount > 0 && (
                            <span className="mt-1 px-2 py-0.5 bg-teal-500 text-white text-xs rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                No conversations yet. Start by contacting a startup or investor from the dashboard.
              </div>
            )}
          </div>
        </div>
        
        {/* Chat interface */}
        <div className="md:col-span-2 h-full">
          {activeContact ? (
            <ChatInterface 
              messages={messagesByConversation[activeContact] || []}
              currentUser={user}
              receiverName={(() => {
                const contact = getContactDetails(activeContact);
                return user.role === 'investor' 
                  ? contact?.companyName || 'Unknown Startup'
                  : contact?.name || 'Unknown Investor';
              })()}
              onSendMessage={handleSendMessage}
              onOpenChatbot={handleOpenChatbot}
            />
          ) : (
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Select a conversation to start chatting
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md"
                >
                  Find People to Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;