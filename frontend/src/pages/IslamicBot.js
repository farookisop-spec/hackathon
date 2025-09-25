import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useToast } from '../hooks/use-toast';
import { 
  Bot, 
  Send, 
  RefreshCw, 
  Copy, 
  Trash2, 
  Image as ImageIcon,
  BookOpen,
  Heart,
  MessageCircle,
  Lightbulb,
  Sparkles
} from 'lucide-react';

const IslamicBot = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load initial greeting
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'As-salamu alaikum wa rahmatullahi wa barakatuh! 🌙\n\nI am your Islamic AI assistant, here to help you with:\n\n• Quran and Hadith knowledge\n• Islamic jurisprudence (Fiqh)\n• Prayer times and worship guidance\n• Islamic finance questions\n• Community and spiritual advice\n\nHow may I assist you today?',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !imageFile) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      imageFile: imageFile,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post('/bot/chat', {
        message: newMessage,
        image_url: imageFile ? URL.createObjectURL(imageFile) : null
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.data.response,
        timestamp: response.data.timestamp
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Bot chat error:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I\'m experiencing technical difficulties right now. Please try again later, or feel free to explore our Quran, Hadith, and learning sections for authentic Islamic knowledge.',
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setNewMessage('');
      setImageFile(null);
    }
  };

  const handleRegenerateResponse = async (messageIndex) => {
    if (messageIndex < 1) return;
    
    const userMessage = messages[messageIndex - 1];
    if (userMessage.type !== 'user') return;

    setLoading(true);

    try {
      const response = await axios.post('/bot/chat', {
        message: userMessage.content + ' (Please provide an alternative response)'
      });

      const newBotMessage = {
        ...messages[messageIndex],
        content: response.data.response,
        timestamp: response.data.timestamp
      };

      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = newBotMessage;
      setMessages(updatedMessages);

      toast({
        title: "Response regenerated",
        description: "I've provided an alternative answer for you.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    });
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'As-salamu alaikum! How can I help you with Islamic knowledge today?',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const formatMessageContent = (content) => {
    // Convert line breaks to paragraphs
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      return (
        <p key={index} className="mb-2 last:mb-0">
          {paragraph}
        </p>
      );
    }).filter(Boolean);
  };

  const quickQuestions = [
    {
      icon: BookOpen,
      question: "What are the five pillars of Islam?",
      category: "Basics"
    },
    {
      icon: Heart,
      question: "How to calculate Zakat?",
      category: "Finance"
    },
    {
      icon: MessageCircle,
      question: "What are the conditions for valid prayer?",
      category: "Worship"
    },
    {
      icon: Lightbulb,
      question: "What does the Quran say about patience?",
      category: "Guidance"
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Chat Area */}
            <div className="lg:col-span-3">
              <Card className="h-[calc(100vh-200px)] flex flex-col">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center mr-3">
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Islamic AI Scholar</h2>
                        <p className="text-sm text-muted">Your guide to authentic Islamic knowledge</p>
                      </div>
                    </div>
                    <Button
                      onClick={clearChat}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Chat
                    </Button>
                  </CardTitle>
                </CardHeader>

                {/* Messages Area */}
                <CardContent className="flex-1 overflow-y-auto p-0">
                  <div className="space-y-4 p-6">
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <Avatar className="h-8 w-8 mx-2">
                            {message.type === 'user' ? (
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                              </AvatarFallback>
                            ) : (
                              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <div className={`rounded-lg px-4 py-2 ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : message.isError 
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}>
                            {message.imageFile && (
                              <img
                                src={URL.createObjectURL(message.imageFile)}
                                alt="User uploaded"
                                className="max-w-xs rounded mb-2"
                              />
                            )}
                            
                            <div className="text-sm leading-relaxed">
                              {formatMessageContent(message.content)}
                            </div>

                            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                              <span>
                                {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>

                              {message.type === 'bot' && !message.isError && (
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(message.content)}
                                    className="h-6 w-6 p-1 hover:bg-white hover:bg-opacity-20"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRegenerateResponse(index)}
                                    className="h-6 w-6 p-1 hover:bg-white hover:bg-opacity-20"
                                  >
                                    <RefreshCw className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="flex">
                          <Avatar className="h-8 w-8 mx-2">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                {/* Input Area */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Ask me about Islamic knowledge, Quran, Hadith, or any Islamic question..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                        className="min-h-[40px] resize-none"
                        disabled={loading}
                        data-testid="bot-message-input"
                      />
                      {imageFile && (
                        <div className="mt-2 relative inline-block">
                          <img
                            src={URL.createObjectURL(imageFile)}
                            alt="Upload preview"
                            className="max-w-xs max-h-20 rounded border"
                          />
                          <Button
                            onClick={() => setImageFile(null)}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="hidden"
                      id="image-upload"
                    />
                    
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('image-upload').click()}
                      disabled={loading}
                      className="p-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>

                    <Button 
                      onClick={handleSendMessage}
                      disabled={loading || (!newMessage.trim() && !imageFile)}
                      className="bg-emerald-600 hover:bg-emerald-700 p-2"
                      data-testid="send-message-button"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Questions */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Quick Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {quickQuestions.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => setNewMessage(item.question)}
                        >
                          <div className="flex items-start">
                            <Icon className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                            <div>
                              <p className="text-sm font-medium">{item.question}</p>
                              <p className="text-xs text-muted">{item.category}</p>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">AI Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Quran & Hadith Knowledge</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-600" />
                      <span>Islamic Jurisprudence</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span>Spiritual Guidance</span>
                    </div>
                    <div className="flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                      <span>Daily Islamic Questions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted space-y-2">
                    <p className="font-medium">Important Note:</p>
                    <p>
                      This AI provides general Islamic guidance based on Quran and authentic Hadith. 
                      For specific religious rulings, please consult qualified Islamic scholars.
                    </p>
                    <p>
                      Always verify information and seek multiple sources for important religious matters.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslamicBot;