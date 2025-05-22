
import { Chat, Message, User } from '../types';

export const currentUser: User = {
  id: 'current-user',
  name: 'Me',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
  status: 'online',
};

const createMockChat = (id: string, participantName: string, messages: Message[] = [], isGroup = false, participantCount = 1): Chat => {
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  
  return {
    id,
    name: isGroup ? `${participantName} Group` : '',
    lastMessageAt: lastMessage?.timestamp || new Date(),
    messages,
    participants: [
      currentUser,
      ...Array(participantCount).fill(null).map((_, i) => ({
        id: `user-${id}-${i}`,
        name: isGroup ? `${participantName} ${i + 1}` : participantName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${participantName}${i}`,
        status: Math.random() > 0.7 ? 'online' : 'offline',
      })),
    ],
    unreadCount: Math.floor(Math.random() * 5),
    isGroup,
    isPinned: false,
    isMuted: false,
  };
};

const createMockMessage = (id: string, text: string, senderId: string, timestamp: Date): Message => ({
  id,
  text,
  senderId,
  timestamp,
  read: Math.random() > 0.3,
});

// Create mock messages for a chat
const createMockMessages = (chatId: string, count: number): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 3600000 - Math.random() * 3600000);
    const senderId = Math.random() > 0.5 ? 'current-user' : `user-${chatId}-0`;
    messages.push(
      createMockMessage(
        `msg-${chatId}-${i}`,
        `This is message #${i + 1} in chat ${chatId}`,
        senderId,
        timestamp
      )
    );
  }
  
  return messages;
};

// Initial mock chats
export const mockChats: Chat[] = [
  createMockChat('1', 'Team Periskope', createMockMessages('1', 10), true, 5),
  createMockChat('2', 'John', createMockMessages('2', 8)),
  createMockChat('3', 'Marketing', createMockMessages('3', 15), true, 3),
  createMockChat('4', 'Sarah', createMockMessages('4', 5)),
  createMockChat('5', 'Development', createMockMessages('5', 20), true, 4),
];

// Function to generate more mock chats
export const generateMoreMockChats = (count: number): Chat[] => {
  const names = [
    'Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 
    'Henry', 'Isabel', 'James', 'Kate', 'Liam', 'Mia', 'Noah',
    'Olivia', 'Peter', 'Quinn', 'Ryan', 'Sophia', 'Thomas'
  ];
  
  const groupNames = [
    'Sales', 'Product', 'Design', 'Support', 'Operations',
    'Finance', 'HR', 'Legal', 'Research', 'Quality'
  ];
  
  return Array(count).fill(null).map((_, index) => {
    const isGroup = Math.random() > 0.7;
    const id = `${mockChats.length + index + 1}`;
    const name = isGroup 
      ? groupNames[Math.floor(Math.random() * groupNames.length)]
      : names[Math.floor(Math.random() * names.length)];
    const participantCount = isGroup ? Math.floor(Math.random() * 5) + 2 : 1;
    const messageCount = Math.floor(Math.random() * 20) + 1;
    
    return createMockChat(
      id,
      name,
      createMockMessages(id, messageCount),
      isGroup,
      participantCount
    );
  });
};
