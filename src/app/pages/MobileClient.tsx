// Mobile Citizen App Interface - Pakistan Government Style

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { SLATimer } from '../components/SLATimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import logoImage from '@/assets/c673552f7748d800c656a4166ccbeadb19bd4dd2.png';
import {
  Plus,
  Search,
  Bell,
  MessageCircle,
  Home,
  FileText,
  User,
  Bot,
  Mic,
  Send,
  Shield,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function MobileClient() {
  const [activeTab, setActiveTab] = useState('home');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'bot', message: string}>>([
    { role: 'bot', message: 'السلام علیکم! How can I assist you today? میں آپ کی کیسے مدد کر سکتا ہوں؟' }
  ]);

  const { currentUser, tickets, updateTicket } = useApp();
  const userTickets = tickets.filter(t => t.createdBy.id === currentUser.id);
  const openTickets = userTickets.filter(t => !['Closed', 'Auto-Resolved'].includes(t.status));

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory([
      ...chatHistory,
      { role: 'user', message: chatMessage },
      { role: 'bot', message: 'I understand your concern. Let me check the knowledge base for similar issues...' }
    ]);
    setChatMessage('');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#01411C]" style={{ height: '844px' }}>
      {/* Mobile Header - Pakistan Government Style */}
      <div className="bg-gradient-to-r from-[#01411C] via-[#0B5D1E] to-[#01411C] p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="NCC Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#DC3545] rounded-full animate-pulse" />
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
          <Input 
            placeholder="Search complaints... (شکایات تلاش کریں)" 
            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
          />
        </div>
      </div>

      {/* Content */}
      <div className="h-[690px] overflow-y-auto bg-gray-50">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-[#01411C]/20 bg-white">
            <TabsTrigger 
              value="home" 
              className="flex flex-col items-center py-3 space-y-1 data-[state=active]:text-[#01411C] data-[state=active]:border-b-2 data-[state=active]:border-[#01411C]"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tickets" 
              className="flex flex-col items-center py-3 space-y-1 data-[state=active]:text-[#01411C] data-[state=active]:border-b-2 data-[state=active]:border-[#01411C] relative"
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs font-medium">Complaints</span>
              {openTickets.length > 0 && (
                <Badge className="absolute top-1 right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-[#DC3545]">
                  {openTickets.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="flex flex-col items-center py-3 space-y-1 data-[state=active]:text-[#01411C] data-[state=active]:border-b-2 data-[state=active]:border-[#01411C]"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">AI Help</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex flex-col items-center py-3 space-y-1 data-[state=active]:text-[#01411C] data-[state=active]:border-b-2 data-[state=active]:border-[#01411C]"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="flex-1 p-4 space-y-4">
            {/* Stats - Government Style */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-gradient-to-br from-[#DFF5E1] to-white border-[#01411C]/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-[#01411C]">{userTickets.length}</p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">Total</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-white border-[#FFC107]/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-[#FFC107]">{openTickets.length}</p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">Pending</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-white border-[#28A745]/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-[#28A745]">
                    {userTickets.length - openTickets.length}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">Resolved</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Create - Government Style */}
            <Button className="w-full flex items-center justify-center space-x-2 h-12 bg-[#01411C] hover:bg-[#0B5D1E] shadow-lg">
              <Send className="w-5 h-5" />
              <span className="font-semibold">Submit New Complaint</span>
            </Button>

            {/* Government Notice */}
            <Card className="border-2 border-[#01411C] bg-gradient-to-r from-[#DFF5E1] to-white">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-[#01411C]" />
                  <span className="text-xs font-bold text-[#01411C]">Secure & Transparent</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  All complaints are tracked in real-time with blockchain-ready audit trail. Your data is secure.
                </p>
              </CardContent>
            </Card>

            {/* Recent Tickets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#01411C]">Recent Complaints</h3>
                <Badge variant="outline" className="border-[#01411C] text-[#01411C]">
                  {userTickets.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {userTickets.slice(0, 3).map(ticket => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow border-[#01411C]/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{ticket.id}</span>
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-[#DFF5E1] text-[#01411C] border border-[#01411C]/20"
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-2 line-clamp-1 text-[#01411C]">{ticket.title}</h4>
                      {!['Closed', 'Auto-Resolved'].includes(ticket.status) && (
                        <SLATimer 
                          deadline={ticket.slaDeadline} 
                          slaStatus={ticket.slaStatus}
                          compact
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="flex-1 p-4 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#01411C]">My Complaints</h3>
              <Badge className="bg-[#01411C]">{userTickets.length}</Badge>
            </div>
            <div className="space-y-3">
              {userTickets.map(ticket => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow border-[#01411C]/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{ticket.id}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            ticket.priority === 'Critical' ? 'border-[#DC3545] text-[#DC3545]' :
                            ticket.priority === 'High' ? 'border-[#FFC107] text-[#FFC107]' :
                            'border-[#01411C] text-[#01411C]'
                          }`}
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-[#DFF5E1] text-[#01411C] border border-[#01411C]/20"
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm mb-2 text-[#01411C]">{ticket.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{ticket.description}</p>
                    {!['Closed', 'Auto-Resolved'].includes(ticket.status) && (
                      <SLATimer 
                        deadline={ticket.slaDeadline} 
                        slaStatus={ticket.slaStatus}
                        compact
                        showIcon={false}
                      />
                    )}
                    {/* Citizen confirmation prompt */}
                    {ticket.status === 'Client Confirmation' && ticket.createdBy.id === currentUser.id && (
                      <div className="mt-3 bg-green-50 border border-green-300 rounded-lg p-3">
                        <p className="text-xs font-semibold text-green-800 mb-2">
                          ✅ The authorities have resolved your complaint. Please confirm if you're satisfied.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={() => {
                              updateTicket(ticket.id, { status: 'Resolved', resolvedAt: new Date() });
                            }}
                          >
                            Confirm — Satisfied
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-400 text-red-600 hover:bg-red-50 text-xs"
                            onClick={() => {
                              updateTicket(ticket.id, { status: 'Reopened' });
                            }}
                          >
                            Not Resolved
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab - AI Assistant */}
          <TabsContent value="chat" className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b bg-gradient-to-r from-[#DFF5E1] to-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#6F42C1] rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#01411C]">AI Assistant</h3>
                  <p className="text-xs text-gray-600">مصنوعی ذہانت • Always here to help</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
              {chatHistory.map((chat, index) => (
                <div 
                  key={index} 
                  className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                      chat.role === 'user' 
                        ? 'bg-[#01411C] text-white rounded-br-none' 
                        : 'bg-white text-gray-900 rounded-bl-none border border-[#01411C]/20'
                    }`}
                  >
                    <p className="text-sm">{chat.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="border-[#01411C]/20 text-[#01411C]">
                  <Mic className="w-5 h-5" />
                </Button>
                <Input 
                  placeholder="Type a message... (پیغام لکھیں)"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 border-[#01411C]/20 focus:border-[#01411C]"
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage}
                  className="bg-[#01411C] hover:bg-[#0B5D1E]"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="flex-1 p-4 space-y-4">
            <div className="text-center py-6 bg-gradient-to-br from-[#DFF5E1] to-white rounded-lg border border-[#01411C]/20">
              <div className="w-20 h-20 bg-[#01411C] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-lg text-[#01411C]">{currentUser.name}</h3>
              <p className="text-sm text-gray-600">{currentUser.email}</p>
              <Badge className="mt-2 bg-[#DFF5E1] text-[#01411C] border border-[#01411C]/20">
                Citizen
              </Badge>
            </div>

            {/* Profile Stats */}
            <Card className="border-[#01411C]/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm text-gray-600 flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Total Complaints</span>
                  </span>
                  <span className="font-bold text-[#01411C]">{userTickets.length}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm text-gray-600 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Pending</span>
                  </span>
                  <span className="font-bold text-[#FFC107]">{openTickets.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Resolved</span>
                  </span>
                  <span className="font-bold text-[#28A745]">{userTickets.length - openTickets.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Government Info */}
            <Card className="border-2 border-[#01411C] bg-gradient-to-r from-[#DFF5E1] to-white">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="w-5 h-5 text-[#01411C]" />
                  <h3 className="font-semibold text-[#01411C]">Support & Help</h3>
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                  <p>📞 Helpline: <strong>051-9000000</strong></p>
                  <p>📧 Email: <strong>complaints@gov.pk</strong></p>
                  <p>🕐 Available: <strong>24/7</strong></p>
                  <p>🔒 Secure & Confidential</p>
                </div>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <Button 
              variant="outline" 
              className="w-full border-[#DC3545] text-[#DC3545] hover:bg-[#DC3545] hover:text-white"
            >
              Logout
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Government Footer Badge */}
      <div className="bg-[#01411C] text-white text-center py-2">
        <p className="text-xs">Government of Pakistan • حکومتِ پاکستان</p>
      </div>
    </div>
  );
}