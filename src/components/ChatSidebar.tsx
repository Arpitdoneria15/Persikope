
import React, { useState } from 'react';
import { Chat, User } from '../types';
import { Search, RefreshCcw, HelpCircle } from 'lucide-react';
import ChatListItem from './ChatListItem';

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  currentUser: User;
  onSelectChat: (chat: Chat) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  currentUser,
  onSelectChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredView, setFilteredView] = useState(false);

  // Handle pinned chats
  const pinnedChats = chats.filter(chat => chat.isPinned);
  const unpinnedChats = chats.filter(chat => !chat.isPinned);
  
  // Sort chats by lastMessageAt
  const sortedUnpinnedChats = [...unpinnedChats].sort((a, b) => 
    b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
  );
  
  const sortedPinnedChats = [...pinnedChats].sort((a, b) => 
    b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
  );
  
  // Combine pinned and unpinned chats
  let sortedChats = [...sortedPinnedChats, ...sortedUnpinnedChats];
  
  const filteredChats = searchQuery 
    ? sortedChats.filter(chat => {
        const otherParticipants = chat.participants.filter(p => p.id !== currentUser.id);
        const displayName = chat.isGroup
          ? chat.name || `Group (${otherParticipants.length + 1})`
          : otherParticipants[0]?.name || 'Unknown';
        return displayName.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : sortedChats;

  // Add the Periskope Team chat to the top
  const periskopeChatIndex = filteredChats.findIndex(chat => 
    chat.name === 'Periskope Team' || 
    (chat.isGroup && chat.participants.length > 3)
  );
  
  if (periskopeChatIndex !== -1) {
    const periskopeChat = {...filteredChats[periskopeChatIndex], name: 'Periskope Team Chat'};
    filteredChats.splice(periskopeChatIndex, 1);
    filteredChats.unshift(periskopeChat);
  }

  return (
    <div className="w-72 h-full border-r border-gray-200 flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-base font-medium text-gray-800">Chats</h2>
        </div>
        <div className="flex space-x-3">
          <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <RefreshCcw className="h-4.5 w-4.5" aria-label="Refresh" />
          </button>
          <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <HelpCircle className="h-4.5 w-4.5" aria-label="Help" />
          </button>
        </div>
      </div>

      {/* Connected phones status */}
      <div className="px-4 py-1 border-b border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
          5/6 phones connected
        </span>
        <div className="flex space-x-1">
          <button className="text-xs text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h.01" />
              <path d="M12 7h.01" />
              <path d="M17 7h.01" />
              <path d="M7 12h.01" />
              <path d="M12 12h.01" />
              <path d="M17 12h.01" />
              <path d="M7 17h.01" />
              <path d="M12 17h.01" />
              <path d="M17 17h.01" />
            </svg>
          </button>
          <button className="text-xs text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm flex-1"
          />
        </div>
        
        <div className="flex items-center mt-2 text-sm">
          <div className="flex items-center text-green-600 mr-4">
            <button 
              className={`flex items-center ${filteredView ? 'text-green-600' : 'text-gray-600'}`}
              onClick={() => setFilteredView(!filteredView)}
            >
              <span className="flex items-center space-x-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Custom filter</span>
              </span>
            </button>
          </div>
          <div className="text-gray-500">
            <button className="text-gray-500 hover:text-gray-700">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Chats list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat, index) => {
            // Determine badge type based on index
            let badgeText = "";
            let badgeColor = "bg-gray-100 text-gray-800";
            
            if (index === 0) {
              badgeText = "Internal";
              badgeColor = "bg-green-100 text-green-800";
            }
            else if (index % 5 === 0) badgeText = "Demo";
            else if (index % 7 === 0) badgeText = "Internal";
            else if (index % 9 === 0) badgeText = "Demo";
            
            return (
              <ChatListItem
                key={`${chat.id}-${index}`}
                chat={index === 0 ? {...chat, name: 'Periskope Team Chat'} : chat}
                isActive={activeChat?.id === chat.id}
                currentUser={currentUser}
                onClick={() => onSelectChat(chat)}
                showDivider={true}
                badgeText={badgeText}
                badgeColor={badgeColor}
                isPinned={chat.isPinned}
                isMuted={chat.isMuted}
              />
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "No chats match your search" : "No chats yet"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
