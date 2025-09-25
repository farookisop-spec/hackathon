import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { 
  MessageCircle,
  Plus,
  Send,
  Search,
  Users,
  Smile,
  Paperclip,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Mock data for now - in real implementation, this would come from API
  useEffect(() => {
    // Mock conversations
    setConversations([
      {
        id: '1',
        type: 'direct',
        participants: [user?.id, 'user2'],
        participantNames: ['Ahmad Hassan'],
        lastMessage: 'Assalamu alaikum brother, how are you?',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 2,
        avatar: null
      },
      {
        id: '2', 
        type: 'group',
        participants: [user?.id, 'user3', 'user4', 'user5'],
        participantNames: ['Quran Study Group'],
        lastMessage: 'Tonight we will discuss Surah Al-Baqarah',
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 0,
        avatar: null
      },
      {
        id: '3',
        type: 'direct',
        participants: [user?.id, 'user6'],
        participantNames: ['Fatima Ali'],
        lastMessage: 'JazakAllahu khair for the Islamic finance advice',
        lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
        unreadCount: 1,
        avatar: null
      }
    ]);
  }, [user]);

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    setShowMobileChat(true);
    
    // Mock messages for the conversation
    const mockMessages = [
      {
        id: '1',
        content: 'Assalamu alaikum! How are you doing?',
        senderId: conversation.participants.find(p => p !== user?.id),
        senderName: conversation.participantNames[0],
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'text'
      },
      {
        id: '2',
        content: 'Wa alaykum assalam! Alhamdulillah, I\'m doing well. How about you?',
        senderId: user?.id,
        senderName: user?.full_name,
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        type: 'text'
      },
      {
        id: '3',
        content: 'Alhamdulillah, all good. Did you have a chance to read that article I shared?',
        senderId: conversation.participants.find(p => p !== user?.id),
        senderName: conversation.participantNames[0],
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: 'text'
      },
      {
        id: '4',
        content: 'Yes, MashAllah it was very insightful! Thank you for sharing.',
        senderId: user?.id,
        senderName: user?.full_name,
        timestamp: new Date(Date.now() - 900000).toISOString(),
        type: 'text'
      }
    ];
    setMessages(mockMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: user?.id,
      senderName: user?.full_name,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Update conversation's last message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation.id 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: message.timestamp }
        : conv
    ));
  };

  const formatMessageTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return messageTime.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantNames.some(name => 
      name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const ConversationList = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="conversation-search-input"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation)}
                className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800
                  ${activeConversation?.id === conversation.id ? 'bg-emerald-50 dark:bg-emerald-900' : ''}
                `}
                data-testid={`conversation-${conversation.id}`}
              >
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    {conversation.type === 'group' 
                      ? <Users className="h-6 w-6" />
                      : conversation.participantNames[0]?.split(' ').map(n => n[0]).join('') || 'U'
                    }
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">
                      {conversation.participantNames[0]}
                    </p>
                    <span className="text-xs text-muted">
                      {formatMessageTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-emerald-600 text-white text-xs ml-2">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );

  const ChatWindow = () => {
    if (!activeConversation) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileChat(false)}
              className="lg:hidden mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={activeConversation.avatar} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                {activeConversation.type === 'group' 
                  ? <Users className="h-5 w-5" />
                  : activeConversation.participantNames[0]?.split(' ').map(n => n[0]).join('') || 'U'
                }
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-semibold">{activeConversation.participantNames[0]}</h3>
              <p className="text-sm text-muted">
                {activeConversation.type === 'group' 
                  ? `${activeConversation.participants.length} members`
                  : 'Online'
                }
              </p>
            </div>
            
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-xs lg:max-w-md px-4 py-2 rounded-lg
                    ${message.senderId === user?.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }
                  `}
                >
                  {activeConversation.type === 'group' && message.senderId !== user?.id && (
                    <p className="text-xs font-medium mb-1 opacity-70">
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === user?.id ? 'text-emerald-100' : 'text-gray-500'
                  }`}>
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
              data-testid="message-input"
            />
            
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={handleSendMessage}
              className="bg-emerald-600 hover:bg-emerald-700"
              size="sm"
              data-testid="send-message-button"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          <Card className="h-[calc(100vh-120px)]">
            <CardContent className="p-0 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                {/* Conversation List */}
                <div className={`border-r border-gray-200 dark:border-gray-700 ${
                  showMobileChat ? 'hidden lg:block' : 'block'
                }`}>
                  <ConversationList />
                </div>

                {/* Chat Window */}
                <div className={`lg:col-span-2 ${
                  showMobileChat ? 'block' : 'hidden lg:block'
                }`}>
                  <ChatWindow />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;