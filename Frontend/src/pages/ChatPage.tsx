import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

/**
 * Interface for chat messages
 */
interface ChatMessage {
  id: string;
  message: string;
  timestamp: Date;
  userId: string;
}

/**
 * WebSocket Chat Page Component
 * Provides real-time chat functionality using WebSockets
 */
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  
  // Auto-scroll reference
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Initialize WebSocket connection on component mount
   */
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:8080');
        wsRef.current = ws;

        /**
         * Handle successful WebSocket connection
         */
        ws.onopen = () => {
          console.log('Connected to chat server');
          setIsConnected(true);
          setConnectionStatus('Connected');
        };

        /**
         * Handle incoming messages from server
         */
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
              case 'chat_history':
                // Load existing chat history
                setMessages(data.messages.map((msg: any) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp)
                })));
                break;
                
              case 'new_message':
                // Add new message to chat, avoiding duplicates
                setMessages(prev => {
                  const messageExists = prev.some(msg => msg.id === data.message.id);
                  if (messageExists) {
                    return prev; // Don't add duplicate
                  }
                  return [...prev, {
                    ...data.message,
                    timestamp: new Date(data.message.timestamp)
                  }];
                });
                break;
                
              case 'user_connected':
                // Store the current user's ID
                if (data.userId) {
                  setCurrentUserId(data.userId);
                }
                break;
                
              case 'system_message':
                // Handle system messages (like welcome message)
                console.log('System:', data.message);
                break;
                
              case 'error':
                console.error('Chat error:', data.message);
                break;
                
              default:
                console.log('Unknown message type:', data.type);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        /**
         * Handle WebSocket connection close
         */
        ws.onclose = () => {
          console.log('Disconnected from chat server');
          setIsConnected(false);
          setConnectionStatus('Disconnected');
          
          // Attempt to reconnect after 3 seconds
          setTimeout(() => {
            setConnectionStatus('Reconnecting...');
            connectWebSocket();
          }, 3000);
        };

        /**
         * Handle WebSocket errors
         */
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('Connection Error');
        };
        
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        setConnectionStatus('Failed to Connect');
      }
    };

    connectWebSocket();

    // Cleanup on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  /**
   * Send message to chat server
   */
  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || !isConnected) {
      return;
    }

    try {
      // Send message to server
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        message: newMessage.trim()
      }));

      // Clear input field
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  /**
   * Handle Enter key press to send message
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Format timestamp for display
   */
  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Chat Room</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600">{connectionStatus}</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-start justify-between">
                <p className="text-gray-800 flex-1">{message.message}</p>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        {/* Auto-scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !newMessage.trim()}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg p-2 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        {!isConnected && (
          <p className="text-sm text-red-500 mt-2">
            Not connected to chat server. Messages cannot be sent.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;