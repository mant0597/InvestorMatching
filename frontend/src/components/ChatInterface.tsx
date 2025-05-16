import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot } from 'lucide-react';
import { Message, User } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  currentUser: User;
  receiverName: string;
  onSendMessage: (content: string) => void;
  onOpenChatbot?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentUser,
  receiverName,
  onSendMessage,
  onOpenChatbot
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {receiverName}
        </h3>
        {onOpenChatbot && (
          <button
            onClick={onOpenChatbot}
            className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30"
            title="Open AI Assistant"
          >
            <Bot className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(message => {
          const isCurrentUser = message.senderId === currentUser.id;
          
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  isCurrentUser ? 'text-teal-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <input
            type="text"
            className="flex-1 mx-3 py-2 px-4 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 dark:text-white"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          
          <button
            type="submit"
            className="p-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;