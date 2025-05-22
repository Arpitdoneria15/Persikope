
import React from 'react';
import { 
  Home, 
  MessageSquare, 
  Users,
  FolderOpen,
  Settings,
  BarChart,
  Phone,
  HelpCircle,
  Clock,
  File,
  Star,
  Plus
} from 'lucide-react';

const MainSidebar: React.FC = () => {
  const icons = [
    { icon: Home, label: 'Home' },
    { icon: MessageSquare, label: 'Chats', active: true },
    { icon: Users, label: 'Contacts' },
    { icon: BarChart, label: 'Analytics' },
    { icon: FolderOpen, label: 'Files' },
    { icon: File, label: 'Documents' },
    { icon: Star, label: 'Favorites' },
    { icon: Clock, label: 'Recent' },
    { icon: Phone, label: 'Calls' }
  ];
  
  const bottomIcons = [
    { icon: HelpCircle, label: 'Help' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="w-14 border-r border-gray-200 bg-gray-50 flex flex-col items-center py-4">
      <div className="flex-1 flex flex-col items-center space-y-6 mt-6">
        {icons.map((item, index) => (
          <button 
            key={index}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              item.active ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-200'
            }`} 
            title={item.label}
          >
            <item.icon className="h-5 w-5" />
          </button>
        ))}
      </div>
      
      <button 
        className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 text-white mb-6"
        title="New Chat"
      >
        <Plus className="h-5 w-5" />
      </button>
      
      <div className="flex flex-col items-center space-y-6 mb-6">
        {bottomIcons.map((item, index) => (
          <button 
            key={index}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200" 
            title={item.label}
          >
            <item.icon className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainSidebar;
