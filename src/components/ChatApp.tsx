
import React, { useEffect, useState } from 'react';
import { Chat, Message, User } from '../types';
import { currentUser, mockChats, generateMoreMockChats } from '../data/mockData';
import ChatSidebar from './ChatSidebar';
import ChatInterface from './ChatInterface';
import { toast } from '@/hooks/use-toast';
import MainSidebar from './MainSidebar';

const ChatApp: React.FC = () => {
  // Add 15 more mock chats
  const allMockChats = [...mockChats, ...generateMoreMockChats(15)];
  
  // Add isPinned and isMuted properties to chats
  const initialChats = allMockChats.map(chat => ({
    ...chat,
    isPinned: false,
    isMuted: false
  }));

  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [user, setUser] = useState<User>(currentUser);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectChat = (chat: Chat) => {
    // Mark all messages as read when selecting a chat
    const updatedChats = chats.map((c) => {
      if (c.id === chat.id) {
        return { 
          ...c, 
          unreadCount: 0, 
          messages: c.messages.map(msg => 
            msg.senderId !== user.id ? { ...msg, read: true } : msg
          )
        };
      }
      return c;
    });
    
    setChats(updatedChats);
    setActiveChat({...chat, unreadCount: 0});
  };

  const handleSendMessage = (chatId: string, text: string) => {
    const now = new Date();
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      senderId: user.id,
      timestamp: now,
      read: false,
    };

    const updatedChats = chats.map((chat) => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessageAt: now,
        };
      }
      return chat;
    });

    setChats(updatedChats);
    
    // Update the active chat if needed
    if (activeChat && activeChat.id === chatId) {
      setActiveChat({
        ...activeChat,
        messages: [...activeChat.messages, newMessage],
        lastMessageAt: now,
      });
    }
    
    // Simulate received message after 2 seconds for demo purposes
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const replyText = `Reply to: ${text}`;
        const replyMessage: Message = {
          id: `msg-${Date.now()}`,
          text: replyText,
          senderId: activeChat?.participants.find(p => p.id !== user.id)?.id || '',
          timestamp: new Date(),
          read: true,
        };
        
        const updatedChatsWithReply = updatedChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, replyMessage],
              lastMessageAt: new Date(),
              unreadCount: activeChat?.id === chatId ? 0 : (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        });
        
        setChats(updatedChatsWithReply);
        
        // Update active chat
        if (activeChat && activeChat.id === chatId) {
          setActiveChat({
            ...activeChat,
            messages: [...activeChat.messages, replyMessage],
            lastMessageAt: new Date(),
          });
        }
      }, 2000);
    }
  };

  const handleVideoCall = () => {
    if (!activeChat) return;
    
    toast({
      title: "Video call initiated",
      description: `Starting video call with ${activeChat.participants.find(p => p.id !== user.id)?.name}`,
    });
  };

  const handlePinChat = (chatId: string) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        const newPinnedState = !chat.isPinned;
        toast({
          title: newPinnedState ? "Chat pinned" : "Chat unpinned",
          description: newPinnedState ? "Chat has been pinned to the top" : "Chat has been removed from pinned",
        });
        return { ...chat, isPinned: newPinnedState };
      }
      return chat;
    });
    
    setChats(updatedChats);
    
    // Update active chat if needed
    if (activeChat && activeChat.id === chatId) {
      setActiveChat({ ...activeChat, isPinned: !activeChat.isPinned });
    }
  };
  
  const handleMuteChat = (chatId: string) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        const newMutedState = !chat.isMuted;
        toast({
          title: newMutedState ? "Chat muted" : "Chat unmuted",
          description: newMutedState ? "You won't receive notifications" : "You will now receive notifications",
        });
        return { ...chat, isMuted: newMutedState };
      }
      return chat;
    });
    
    setChats(updatedChats);
    
    // Update active chat if needed
    if (activeChat && activeChat.id === chatId) {
      setActiveChat({ ...activeChat, isMuted: !activeChat.isMuted });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <MainSidebar />
      <div className="flex flex-1 overflow-hidden">
        {(!isMobile || !activeChat) && (
          <ChatSidebar 
            chats={chats} 
            activeChat={activeChat} 
            currentUser={user}
            onSelectChat={handleSelectChat} 
          />
        )}
        <ChatInterface 
          chat={activeChat} 
          currentUser={user} 
          onSendMessage={handleSendMessage}
          onVideoCall={handleVideoCall}
          onBackClick={isMobile ? () => setActiveChat(null) : undefined}
          onPinChat={handlePinChat}
          onMuteChat={handleMuteChat}
        />
      </div>
    </div>
  );
};

export default ChatApp;
