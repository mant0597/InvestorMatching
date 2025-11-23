import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatInterface from '../components/ChatInterface';
import { Message, User } from '../types';
import { getSocket, disconnectSocket } from '../utils/socket';

type RoomParticipant = Pick<User, 'id' | 'name' | 'companyName' | 'role'>;
type Conversation = {
  _id: string;
  participants: RoomParticipant[];
  lastMessage?: string;
  updatedAt: string;
};

const MessagesPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(id || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const socketRef = useRef<any>(null);
  const previousRoomRef = useRef<string | null>(null);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  // Establish socket connection and handle cleanup
  useEffect(() => {
    const token = localStorage.getItem('innova_token') || '';
    const socket = getSocket(token);
    socketRef.current = socket;

    if (!socket.connected) {
      console.log('🔌 Connecting socket...');
      socket.connect();
    }

    const handleNewMessage = (msg: any) => {
      console.log('📨 Received socket message:', msg);
      console.log('   Current roomId:', roomId);
      console.log('   Message roomId:', msg.roomId);
      
      // Normalize the message ID
      const messageId = msg.id || msg._id;
      const normalizedRoomId = String(msg.roomId);
      
      setMessages(prev => {
        // Check if message is for current room
        if (roomId && normalizedRoomId === String(roomId)) {
          // Avoid duplicates by checking both id and _id
          const isDuplicate = prev.some(p => {
            const existingId = (p as any).id || (p as any)._id;
            return String(existingId) === String(messageId);
          });
          
          if (isDuplicate) {
            console.log('⚠️  Duplicate message detected, skipping');
            return prev;
          }
          
          console.log('✅ Adding new message to state');
          return [...prev, {
            ...msg,
            id: messageId,
            _id: messageId
          }];
        } else {
          console.log('⚠️  Message not for current room, skipping');
        }
        return prev;
      });
      
      // Refresh conversation list to update lastMessage
      fetchConversations();
    };

    socket.on('message', handleNewMessage);

    return () => {
      socket.off('message', handleNewMessage);
    };
  }, [roomId]); // Re-run when roomId changes

  // Handle room joining/leaving when roomId changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected) return;

    // Leave previous room if exists
    if (previousRoomRef.current && previousRoomRef.current !== roomId) {
      console.log('Leaving room:', previousRoomRef.current);
      socket.emit('leaveRoom', previousRoomRef.current);
    }

    // Join new room if exists
    if (roomId) {
      console.log('Joining room:', roomId);
      socket.emit('joinRoom', roomId);
      previousRoomRef.current = roomId;
    }

    return () => {
      if (roomId) {
        socket.emit('leaveRoom', roomId);
      }
    };
  }, [roomId]);

  const fetchConversations = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('innova_token') || '';
      const res = await fetch(`${API_BASE}/api/rooms`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const body = await res.json();
        setConversations(body.rooms || []);
      }
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  // If route has roomId param, fetch room + messages and set active contact
  useEffect(() => {
    if (!id || !user) return;
    
    (async () => {
      try {
        const token = localStorage.getItem('innova_token') || '';
        const res = await fetch(`${API_BASE}/api/rooms/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        
        if (!res.ok) {
          console.warn('room fetch failed', await res.text());
          return;
        }
        
        const body = await res.json();
        const room = body.room;
        const msgs = body.messages || [];
        
        setRoomId(room._id || room.id);
        setMessages(msgs);
        
        // Determine other participant
        const other = (room.participants || []).find((p: string) => String(p) !== String(user.id));
        setActiveContact(other || null);
        
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id, user?.id, API_BASE]);

  // Fetch all conversations for the user
  useEffect(() => {
    if (!user) return;
    fetchConversations();
  }, [user?.id]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    try {
      let currentRoomId = roomId;

      // Create room if doesn't exist
      if (!currentRoomId) {
        if (!activeContact) return;
        
        const token = localStorage.getItem('innova_token') || '';
        const res = await fetch(`${API_BASE}/api/rooms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ participants: [user.id, activeContact] })
        });
        
        const body = await res.json();
        currentRoomId = body.room && (body.room._id || body.room.id);
        setRoomId(currentRoomId);
        
        // Join room via socket
        if (socketRef.current?.connected) {
          socketRef.current.emit('joinRoom', currentRoomId);
        }
      }

      // Post message
      const token = localStorage.getItem('innova_token') || '';
      const resMsg = await fetch(`${API_BASE}/api/rooms/${currentRoomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ senderId: user.id, content })
      });

      if (!resMsg.ok) {
        console.error('post message failed', await resMsg.text());
        return;
      }

      // Don't add message here - let the socket event handle it
      // This prevents duplicates
      console.log('Message sent, waiting for socket event');
      
    } catch (err) {
      console.error('send message error', err);
    }
  };

  const handleConversationClick = async (conv: Conversation) => {
    navigate(`/messages/${conv._id}`);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Communicate with startups and investors directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[75vh]">
        {/* Conversation list */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Conversations</h2>
          </div>

          <div className="overflow-y-auto h-[calc(100%-56px)]">
            {conversations.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {conversations.map(conv => {
                  const otherUser = conv.participants.find(p => String(p.id) !== String(user.id));
                  if (!otherUser) return null;

                  return (
                    <button
                      key={conv._id}
                      className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        roomId === conv._id ? 'bg-gray-50 dark:bg-gray-700' : ''
                      }`}
                      onClick={() => handleConversationClick(conv)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {otherUser.role === 'startup' ? otherUser.companyName : otherUser.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                            {conv.lastMessage
                              ? (conv.lastMessage.length > 30 ? conv.lastMessage.slice(0,30)+'...' : conv.lastMessage)
                              : 'No messages yet'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end ml-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour:'2-digit', minute: '2-digit'}) : ''}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                No conversations yet. Find people to message.
              </div>
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="md:col-span-2 h-full">
          {activeContact ? (
            <ChatInterface
              messages={messages}
              currentUser={user}
              receiverName={(() => {
                const conv = conversations.find(c => c._id === roomId);
                const other = conv?.participants.find(p => String(p.id) !== String(user.id));
                return other?.role === 'startup' ? other.companyName : other?.name || '...';
              })()}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Select a conversation or connect from a profile to start chatting.
                </p>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  Find People
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