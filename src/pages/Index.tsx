
import React, { useState } from 'react';
import ChatApp from '@/components/ChatApp';
import LoginScreen from '@/components/LoginScreen';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Demo purposes only - in a real app would validate with backend
    if (email && password) {
      setIsLoggedIn(true);
      toast({
        title: "Logged in successfully",
        description: "Welcome to the chat application",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Please enter valid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoggedIn ? <ChatApp /> : <LoginScreen onLogin={handleLogin} />}
    </div>
  );
};

export default Index;
