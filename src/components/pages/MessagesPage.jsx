import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleStartConversation = () => {
    console.log("Start new conversation");
  };

  if (conversations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Messages</h1>
          <p className="text-gray-400">
            Connect with people through direct messages
          </p>
        </motion.div>

        <div className="flex items-center justify-center h-[60vh]">
          <Empty 
            type="notifications"
            onAction={handleStartConversation}
            actionText="Start Conversation"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Messages</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="glass-morphism rounded-xl h-full overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={cn(
                    "w-full flex items-center space-x-3 p-4 hover:bg-gray-700 transition-colors duration-200 border-b border-gray-700/50",
                    selectedConversation?.id === conversation.id && "bg-gray-700"
                  )}
                >
                  <Avatar 
                    src={conversation.avatar} 
                    alt={conversation.name}
                    fallback={conversation.name.charAt(0)}
                    size="md"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white">{conversation.name}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {conversation.timestamp}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="glass-morphism rounded-xl h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    src={selectedConversation.avatar} 
                    alt={selectedConversation.name}
                    fallback={selectedConversation.name.charAt(0)}
                    size="md"
                  />
                  <div>
                    <h3 className="font-semibold text-white">
                      {selectedConversation.name}
                    </h3>
                    <p className="text-sm text-gray-400">Active now</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                        message.sender === "me"
                          ? "bg-gradient-to-r from-primary to-secondary text-white"
                          : "bg-gray-700 text-white"
                      )}
                    >
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-gradient-to-r from-primary to-secondary rounded-full text-white hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ApperIcon name="Send" size={20} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass-morphism rounded-xl h-full flex items-center justify-center">
              <div className="text-center">
                <ApperIcon name="MessageCircle" size={64} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-400">
                  Choose a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;