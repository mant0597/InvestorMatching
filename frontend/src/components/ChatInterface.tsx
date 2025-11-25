import React, { useState, useRef, useEffect } from 'react';
import { Message as MessageType, User as UserType } from '../types';

interface Props {
  messages: MessageType[];
  currentUser: any;
  receiverName?: string;
  onSendMessage: (text: string) => Promise<void> | void;
}

const ChatInterface: React.FC<Props> = ({ messages, currentUser, receiverName, onSendMessage }) => {
  const [text, setText] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    await onSendMessage(text.trim());
    setText('');
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{receiverName || 'Chat'}</h3>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages && messages.length > 0 ? (
          messages.map(msg => (
            <div key={(msg as any).id || (msg as any)._id} className={`max-w-[80%] ${msg.senderId === currentUser.id ? 'ml-auto bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'} p-3 rounded-md`}>
              <div className="text-sm">{msg.content}</div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {new Date((msg as any).createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No messages yet</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-900 text-sm"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a message..."
        />
        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;