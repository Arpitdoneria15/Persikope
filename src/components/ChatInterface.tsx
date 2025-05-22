
import React, { useState } from 'react';
import { Chat, Message, User } from '../types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  chat: Chat | null;
  currentUser: User;
  onSendMessage: (chatId: string, text: string) => void;
  onVideoCall?: () => void;
  onBackClick?: () => void;
  onPinChat?: (chatId: string) => void;
  onMuteChat?: (chatId: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  chat, 
  currentUser, 
  onSendMessage,
  onVideoCall,
  onBackClick,
  onPinChat,
  onMuteChat
}) => {
  const handlePinChat = () => {
    if (!chat) return;
    
    if (onPinChat) {
      onPinChat(chat.id);
    } else {
      toast({
        title: chat.isPinned ? "Chat unpinned" : "Chat pinned",
        description: chat.isPinned ? "Chat has been removed from pinned" : "Chat has been pinned to the top",
      });
    }
  };
  
  const handleMuteChat = () => {
    if (!chat) return;
    
    if (onMuteChat) {
      onMuteChat(chat.id);
    } else {
      toast({
        title: chat.isMuted ? "Chat unmuted" : "Chat muted",
        description: chat.isMuted ? "You will now receive notifications" : "You won't receive notifications",
      });
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col h-full items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="bg-green-100 h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">WhatsApp Web</h3>
          <p className="mt-2 text-gray-600 max-w-md">
            Select a conversation from the sidebar to begin messaging.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {onBackClick && (
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center">
          <button onClick={onBackClick} className="mr-2 p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-sm font-medium">Back to chats</span>
        </div>
      )}
      <ChatHeader 
        chat={chat} 
        currentUser={currentUser} 
        onVideoCall={onVideoCall}
        onPinChat={handlePinChat}
        onMuteChat={handleMuteChat}
      />
      <MessageList chat={chat} currentUser={currentUser} />
      <MessageInput onSendMessage={(text) => onSendMessage(chat.id, text)} />
    </div>
  );
};

export default ChatInterface;
