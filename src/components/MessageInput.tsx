
import React, { useState, useRef, useEffect } from 'react';
import { 
  Smile,
  Paperclip,
  Mic,
  Send,
  StopCircle,
  Image as ImageIcon,
  X,
  Clock,
  Camera
} from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPrivateNoteToggle, setShowPrivateNoteToggle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFile) {
      // In a real app, we would upload the file to a server
      onSendMessage(`[Image: ${selectedFile.name}]`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    
    if (message.trim()) {
      const messagePrefix = isPrivateNote ? "[Private Note] " : "";
      onSendMessage(messagePrefix + message);
      setMessage('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // In a real app, we would stop recording and process the audio
      setIsRecording(false);
      setRecordingTime(0);
      onSendMessage('[Voice message]');
    } else {
      setIsRecording(true);
      // Start the recording timer
      const intervalId = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Save the interval ID to clear it when stopping
      return () => clearInterval(intervalId);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleHeaderClick = (type: string) => {
    if (type === 'WhatsApp') {
      setIsPrivateNote(false);
      setShowPrivateNoteToggle(false);
    } else if (type === 'Private Note') {
      setIsPrivateNote(true);
      setShowPrivateNoteToggle(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200">
      {/* Header toggle between WhatsApp and Private Note */}
      <div className="flex items-center border-b border-gray-100">
        <button
          onClick={() => handleHeaderClick('WhatsApp')}
          className={`flex-1 py-2 text-sm font-medium ${!isPrivateNote ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
        >
          WhatsApp
        </button>
        <button
          onClick={() => handleHeaderClick('Private Note')}
          className={`flex-1 py-2 text-sm font-medium ${isPrivateNote ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-500'}`}
        >
          Private Note
        </button>
      </div>
      
      {/* Image Preview */}
      {previewUrl && (
        <div className="p-2 relative">
          <div className="relative inline-block">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-40 rounded-lg" 
            />
            <button 
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}
      
      {/* Recording UI */}
      {isRecording && (
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
            <span className="text-sm">{formatRecordingTime(recordingTime)}</span>
          </div>
          <button 
            type="button" 
            onClick={toggleRecording}
            className="text-red-500"
          >
            <StopCircle className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Input area */}
      {!isRecording && (
        <div className="flex items-center p-2">
          <div className="flex-1 flex items-center bg-gray-50 rounded-full px-3 py-2">
            <Smile className="h-5 w-5 text-gray-500 mr-2" />
            
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none"
              placeholder={isPrivateNote ? "Type a private note..." : "Message..."}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button 
              type="button" 
              className="p-1 text-gray-500"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5 rotate-45" />
            </button>
            
            <button 
              type="button" 
              className="p-1 text-gray-500 ml-2"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach photo"
            >
              <ImageIcon className="h-5 w-5" />
            </button>

            <button 
              type="button" 
              className="p-1 text-gray-500 ml-2"
              aria-label="Timer"
            >
              <Clock className="h-5 w-5" />
            </button>

            <button 
              type="button" 
              className="p-1 text-gray-500 ml-2"
              aria-label="Camera"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>
          
          <button
            type="button"
            onClick={message.trim() || selectedFile ? handleSubmit : toggleRecording}
            className="bg-green-500 text-white rounded-full p-2 ml-2"
          >
            {message.trim() || selectedFile ? (
              <Send className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
      
      {/* Periskope badge - smaller padding */}
      <div className="flex items-center justify-end border-t border-gray-100 py-0.5 px-2">
        <div className="flex items-center text-xs text-gray-500">
          <span className="text-green-500 font-medium">Periskope</span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
