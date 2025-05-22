
import React from 'react';
import { Chat, User } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { Check, Pin, VolumeX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  currentUser: User;
  onClick: () => void;
  showDivider?: boolean;
  badgeText?: string;
  badgeColor?: string;
  isPinned?: boolean;
  isMuted?: boolean;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ 
  chat, 
  isActive, 
  currentUser, 
  onClick,
  showDivider = true,
  badgeText = "",
  badgeColor = "bg-gray-100 text-gray-800",
  isPinned = false,
  isMuted = false
}) => {
  const otherParticipants = chat.participants.filter(p => p.id !== currentUser.id);
  const isGroup = chat.isGroup || otherParticipants.length > 1;
  
  const displayName = chat.name || (isGroup 
    ? `Group (${otherParticipants.length + 1})`
    : otherParticipants[0]?.name || 'Unknown');
  
  const lastMessage = chat.messages[chat.messages.length - 1];
  const lastMessageText = lastMessage ? lastMessage.text : 'No messages yet';
  
  const formattedDate = lastMessage 
    ? lastMessage.timestamp.getDate() === new Date().getDate()
      ? format(lastMessage.timestamp, 'HH:mm')
      : format(lastMessage.timestamp, 'dd-MMM-yy')
    : '';
  
  // Determine who sent the last message
  const isLastMessageFromCurrentUser = lastMessage?.senderId === currentUser.id;
  const senderPrefix = isLastMessageFromCurrentUser ? 'You: ' : '';

  const getInitials = () => {
    if (displayName === 'Periskope Team Chat') return 'P';
    
    if (isGroup) {
      if (displayName.startsWith('Group')) return 'G';
      // Extract first letter of first two words
      const words = displayName.split(' ');
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return displayName.slice(0, 2).toUpperCase();
    }
    
    // For non-group chats, check if the name looks like a phone number
    if (displayName.match(/^\+?[0-9\s]+$/)) {
      return '+'; 
    }
    
    // For normal contacts, use first letter of name
    return displayName.charAt(0).toUpperCase();
  };

  // Check if message is read
  const showCheckmark = lastMessage && isLastMessageFromCurrentUser;

  // Determine if this is the Periskope Team chat
  const isPeriskopeTeam = displayName === 'Periskope Team Chat';
  
  return (
    <div 
      onClick={onClick}
      className={`px-3 py-2.5 cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-gray-100' : ''}`}
    >
      <div className="flex">
        <div className="relative mr-3 flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={`${isPeriskopeTeam ? 'bg-green-600' : 'bg-gray-500'} text-white`}>
              {getInitials()}
            </AvatarFallback>
            <AvatarImage src={isPeriskopeTeam 
              ? `https://api.dicebear.com/7.x/initials/svg?seed=P&backgroundColor=25D366` 
              : `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`} 
            />
          </Avatar>
          {otherParticipants[0]?.status === 'online' && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-900 truncate">{displayName}</span>
            <div className="flex items-center">
              {isPinned && (
                <Pin className="h-3.5 w-3.5 text-gray-500 mr-1" />
              )}
              {isMuted && (
                <VolumeX className="h-3.5 w-3.5 text-gray-500 mr-1" />
              )}
              <span className="text-xs text-gray-500 whitespace-nowrap ml-1">{formattedDate}</span>
            </div>
          </div>
          <div className="flex mt-1 items-center">
            <p className="text-xs text-gray-500 truncate flex-1">
              {isPeriskopeTeam && !lastMessageText.includes('periskope') && !lastMessageText.includes('Periskope')
                ? 'Periskope: Test message' 
                : `${senderPrefix}${lastMessageText}`}
            </p>
            {badgeText && (
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-sm ${badgeColor}`}>
                {badgeText}
              </span>
            )}
            {showCheckmark && (
              <span className="ml-1">
                <Check className="h-3.5 w-3.5 text-green-500" />
              </span>
            )}
          </div>
        </div>
      </div>
      {showDivider && <div className="h-px bg-gray-100 mt-2" />}
    </div>
  );
};

export default ChatListItem;
