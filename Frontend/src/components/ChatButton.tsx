import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Floating Chat Button Component
 * Provides quick access to the chat functionality from any page
 */
const ChatButton: React.FC = () => {
  const navigate = useNavigate();

  /**
   * Navigate to chat page when button is clicked
   */
  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <button
      onClick={handleChatClick}
      className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
      title="Open Chat"
      aria-label="Open Chat"
    >
      <MessageSquare className="h-6 w-6" />
    </button>
  );
};

export default ChatButton;