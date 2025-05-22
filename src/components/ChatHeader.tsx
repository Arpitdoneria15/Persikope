
import React from 'react';
import { Chat, User } from '../types';
import { 
  Phone,
  Video,
  Search,
  MoreVertical,
  Pin,
  VolumeX
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ChatHeaderProps {
  chat: Chat;
  currentUser: User;
  onVideoCall?: () => void;
  onPhoneCall?: () => void;
  onPinChat?: () => void;
  onMuteChat?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  chat, 
  currentUser,
  onVideoCall = () => console.log('Video call initiated'), 
  onPhoneCall = () => console.log('Phone call initiated'),
  onPinChat = () => console.log('Chat pinned'),
  onMuteChat = () => console.log('Chat muted')
}) => {
  const otherParticipants = chat.participants.filter(p => p.id !== currentUser.id);
  const isGroup = chat.isGroup || otherParticipants.length > 1;
  
  const displayName = isGroup 
    ? (chat.name || `Group (${otherParticipants.length + 1})`)
    : otherParticipants[0]?.name || 'Unknown';
  
  // For groups, show all participants
  const participantNames = otherParticipants.map(p => p.name).join(', ');
  
  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <div className="relative mr-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{isGroup ? 'GP' : displayName.charAt(0)}</AvatarFallback>
            <AvatarImage src={isGroup 
              ? `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}&backgroundColor=27ae60` 
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} 
            />
          </Avatar>
          {otherParticipants[0]?.status === 'online' && !isGroup && (
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        <div>
          <h2 className="text-base font-medium text-gray-900">{displayName}</h2>
          <p className="text-xs text-gray-500">
            {isGroup ? participantNames : otherParticipants[0]?.status === 'online' ? 'Online' : 'Last seen today'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                onClick={onPinChat}
                aria-label="Pin chat"
              >
                <Pin className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Pin</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                onClick={onMuteChat}
                aria-label="Mute chat"
              >
                <VolumeX className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Mute</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <button 
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          onClick={onPhoneCall}
          aria-label="Phone call"
        >
          <Phone className="h-5 w-5" />
        </button>
        
        <button 
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          onClick={onVideoCall}
          aria-label="Video call"
        >
          <Video className="h-5 w-5" />
        </button>
        
        <button 
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        
        <button 
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          aria-label="More options"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
