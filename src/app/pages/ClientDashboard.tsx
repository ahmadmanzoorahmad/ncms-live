// Client Dashboard - For end users to track their tickets

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { TicketCard } from '../components/TicketCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Plus, 
  Search, 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Send,
  Info
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';

export default function ClientDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, tickets } = useApp();
  
  // Get client's tickets
  const userTickets = tickets.filter(t => t.createdBy.id === currentUser.id);
  
  const openTickets = userTickets.filter(t => !['Closed', 'Auto-Resolved'].includes(t.status));
  const resolvedTickets = userTickets.filter(t => ['Closed', 'Auto-Resolved', 'Resolved'].includes(t.status));
  const criticalTickets = userTickets.filter(t => t.priority === 'Critical' && !['Closed', 'Auto-Resolved'].includes(t.status));
  
  // Filter tickets based on search
  const filteredTickets = userTickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      title: 'Total Complaints',
      value: userTickets.length,
      icon: FileText,
      color: 'text-[#01411C]',
      bg: 'bg-[#DFF5E1]',
    },
    {
      title: 'Pending',
      value: openTickets.length,
      icon: Clock,
      color: 'text-[#FFC107]',
      bg: 'bg-amber-50',
    },
    {
      title: 'Resolved',
      value: resolvedTickets.length,
      icon: CheckCircle,
      color: 'text-[#28A745]',
      bg: 'bg-green-50',
    },
    {
      title: 'Critical',
      value: criticalTickets.length,
      icon: AlertCircle,
      color: 'text-[#DC3545]',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Government Header */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#0B5D1E] text-white rounded-lg p-6 shadow-lg border-l-4 border-[#1F7A3A]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Citizen Portal</h1>
            <p className="text-white/90 mt-1">شہری پورٹل • Welcome to National Complaint Center</p>
          </div>
          <Link to="/create-ticket">
            <Button 
              size="lg" 
              className="flex items-center space-x-2 bg-white text-[#01411C] hover:bg-white/90 font-semibold shadow-lg"
            >
              <Send className="w-5 h-5" />
              <span>Submit New Complaint</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid - Government Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-[#01411C]/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2 text-[#01411C]">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search Bar - Government Style */}
      <Card className="border-[#01411C]/20">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0B5D1E]" />
            <Input
              placeholder="Search complaints by ID, title, or description... (شکایات تلاش کریں)"
              className="pl-10 border-[#01411C]/20 focus:border-[#01411C] focus:ring-[#01411C]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tickets Tabs - Government Style */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-[#DFF5E1]">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
          >
            All ({userTickets.length})
          </TabsTrigger>
          <TabsTrigger 
            value="open"
            className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
          >
            Pending ({openTickets.length})
          </TabsTrigger>
          <TabsTrigger 
            value="resolved"
            className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
          >
            Resolved ({resolvedTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTickets.length === 0 ? (
            <Card className="border-[#01411C]/20">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-[#DFF5E1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-[#01411C]" />
                </div>
                <h3 className="text-lg font-semibold text-[#01411C] mb-2">No complaints found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Submit your first complaint to get started'}
                </p>
                <Link to="/create-ticket">
                  <Button className="bg-[#01411C] hover:bg-[#0B5D1E]">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Complaint
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} showAssignee />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="open" className="space-y-4">
          {openTickets.length === 0 ? (
            <Card className="border-[#28A745]/20 bg-gradient-to-br from-white to-green-50">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-[#28A745]" />
                </div>
                <h3 className="text-lg font-semibold text-[#01411C] mb-2">All caught up!</h3>
                <p className="text-gray-600">You have no pending complaints.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {openTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} showAssignee />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedTickets.length === 0 ? (
            <Card className="border-[#01411C]/20">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-[#DFF5E1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-[#0B5D1E]" />
                </div>
                <h3 className="text-lg font-semibold text-[#01411C] mb-2">No resolved complaints</h3>
                <p className="text-gray-600">Resolved complaints will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {resolvedTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} showAssignee />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Government Information Card */}
      <Card className="border-2 border-[#01411C] bg-gradient-to-r from-[#DFF5E1] to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#01411C]">
            <Info className="w-5 h-5" />
            <span>How to Use This Portal • پورٹل استعمال کرنے کا طریقہ</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start space-x-3">
              <span className="text-[#01411C] font-bold mt-0.5">1.</span>
              <span><strong>Submit Complaint:</strong> Click "Submit New Complaint" to register your complaint with detailed information</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-[#01411C] font-bold mt-0.5">2.</span>
              <span><strong>Track Progress:</strong> Monitor real-time status updates and SLA countdown timers</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-[#01411C] font-bold mt-0.5">3.</span>
              <span><strong>AI Assistance:</strong> Get instant AI-powered responses for common issues</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-[#01411C] font-bold mt-0.5">4.</span>
              <span><strong>Secure & Transparent:</strong> All actions are logged in blockchain-ready audit trail</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-[#01411C]/20">
            <p className="text-xs text-gray-600">
              <strong className="text-[#01411C]">Helpline:</strong> 051-9000000 | <strong className="text-[#01411C]">Email:</strong> complaints@gov.pk | <strong className="text-[#01411C]">Available:</strong> 24/7
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}