
import React, { useEffect, useRef } from 'react';
import { Chat, User, Message } from '../types';
import { format } from 'date-fns';
import { AiOutlineCheck } from 'react-icons/ai';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface MessageListProps {
  chat: Chat;
  currentUser: User;
}

const MessageList: React.FC<MessageListProps> = ({ chat, currentUser }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  
  chat.messages.forEach((message) => {
    const dateStr = format(message.timestamp, 'yyyy-MM-dd');
    if (!groupedMessages[dateStr]) {
      groupedMessages[dateStr] = [];
    }
    groupedMessages[dateStr].push(message);
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2" style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gcHDgkjN+pZeQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAWUlEQVQ4y2NgGAWjgEbg/8cX/0l1jJLzbv+j89E5/z+++P//44v/pLiHgVTDSHI9ugFkGUqWgTgNI8cgkgwlZBA2w0g2EC9ANoSoZINuENGGURzLo2CIAwDF2UoVsolhQQAAAABJRU5ErkJggg==")', backgroundRepeat: 'repeat' }}>
      {Object.entries(groupedMessages).map(([dateStr, messages]) => (
        <div key={dateStr} className="mb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <span className="px-2 text-xs font-medium text-gray-500 bg-white rounded-full shadow-sm mx-2">
              {format(new Date(dateStr), 'MMMM d, yyyy')}
            </span>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>
          
          {messages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const sender = chat.participants.find(p => p.id === message.senderId);
            const showAvatar = !isCurrentUser && (index === 0 || messages[index - 1]?.senderId !== message.senderId);
            
            return (
              <div 
                key={message.id} 
                className={`flex mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isCurrentUser && showAvatar && (
                  <div className="mr-2 flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-600 text-white text-xs">
                        {sender?.name.charAt(0) || '?'}
                      </AvatarFallback>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.name || 'unknown'}`} />
                    </Avatar>
                  </div>
                )}
                {!isCurrentUser && !showAvatar && <div className="w-8 mr-2"></div>}
                <div 
                  className={`max-w-[75%] px-4 py-2 rounded-lg ${
                    isCurrentUser 
                      ? 'bg-green-500 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${isCurrentUser ? 'text-green-100' : 'text-gray-500'}`}>
                    <span>{format(message.timestamp, 'HH:mm')}</span>
                    {isCurrentUser && (
                      <AiOutlineCheck className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {chat.messages.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
