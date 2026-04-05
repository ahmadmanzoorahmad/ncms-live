// Mobile Management App Interface - For Government Staff (All Roles except Citizen)

import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { SLATimer } from '../components/SLATimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useApp } from '../context/AppContext';
import logoImage from '@/assets/c673552f7748d800c656a4166ccbeadb19bd4dd2.png';
import {
  Search,
  Bell,
  Home,
  FileText,
  BarChart3,
  User,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Activity,
  Zap,
  Award
} from 'lucide-react';

export default function MobileManagement() {
  const [activeTab, setActiveTab] = useState('home');
  const { currentUser, tickets } = useApp();
  
  // Filter tickets based on role
  const getRelevantTickets = () => {
    switch (currentUser.role) {
      case 'Call Center Officer':
        return tickets.filter(t => t.status === 'New' || !t.assignedTo);
      case 'Support Agent':
      case 'Field Engineer':
        return tickets.filter(t => t.assignedTo?.id === currentUser.id);
      case 'Supervisor':
        return tickets.filter(t => t.department === currentUser.department);
      case 'Department Head':
        return tickets.filter(t => t.department === currentUser.department);
      case 'Executive':
      case 'Auditor':
      case 'System Admin':
        return tickets;
      default:
        return [];
    }
  };

  const relevantTickets = getRelevantTickets();
  const pendingTickets = relevantTickets.filter(t => !['Closed', 'Auto-Resolved'].includes(t.status));
  const criticalTickets = relevantTickets.filter(t => t.priority === 'Critical' && !['Closed', 'Auto-Resolved'].includes(t.status));
  const todayTickets = relevantTickets.filter(t => {
    const today = new Date().toDateString();
    return new Date(t.createdAt).toDateString() === today;
  });

  const stats = [
    {
      label: 'Total Tickets',
      value: relevantTickets.length,
      icon: FileText,
      color: 'bg-[#01411C] text-white',
    },
    {
      label: 'Pending',
      value: pendingTickets.length,
      icon: Clock,
      color: 'bg-[#FFC107] text-white',
    },
    {
      label: 'Critical',
      value: criticalTickets.length,
      icon: AlertTriangle,
      color: 'bg-[#DC3545] text-white',
    },
    {
      label: 'Today',
      value: todayTickets.length,
      icon: TrendingUp,
      color: 'bg-[#007BFF] text-white',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      case 'Escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#01411C]" style={{ height: '844px' }}>
      {/* Mobile Header - Pakistan Government Management Style */}
      <div className="bg-gradient-to-r from-[#01411C] via-[#0B5D1E] to-[#01411C] p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="NCC Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-white/20 text-white border-white/30 text-xs">
              {currentUser.role}
            </Badge>
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#DC3545] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
          <Input 
            placeholder="Search tickets... (ٹکٹ تلاش کریں)" 
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
              <span className="text-xs font-medium">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tickets" 
              className="flex flex-col items-center py-3 space-y-1 data-[state=active]:text-[#01411C] data-[state=active]:border-b-2 data-[state=active]:border-[#01411C] relative"
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs font-medium">Tickets</span>
              {pendingTickets.length > 0 && (
                <Badge className="absolute top-1 right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-[#DC3545]">
                  {pendingTickets.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex flex-col items-center py-3 space-y-1 data-[state=active]:text-[#01411C] data-[state=active]:border-b-2 data-[state=active]:border-[#01411C]"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-medium">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex flex-col items-center py-3 space-y-1 data-[state=active]:text-[#01411C] data-[state=active]:border-b-2 data-[state=active]:border-[#01411C]"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="home" className="flex-1 p-4 space-y-4">
            {/* User Greeting */}
            <Card className="border-[#01411C]/20 bg-gradient-to-r from-[#DFF5E1] to-white">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#01411C] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#01411C]">{currentUser.name}</h3>
                    <p className="text-sm text-gray-600">{currentUser.role}</p>
                    <p className="text-xs text-gray-500">{currentUser.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="border-[#01411C]/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`${stat.color} p-2 rounded-lg`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-[#01411C]">{stat.value}</p>
                      <p className="text-xs text-gray-600">{stat.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card className="border-[#01411C]/20">
              <CardContent className="p-4">
                <h3 className="font-bold text-[#01411C] mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-[#01411C] hover:bg-[#0B5D1E] text-white text-sm h-auto py-3">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Assign Ticket
                  </Button>
                  <Button variant="outline" className="border-[#01411C] text-[#01411C] text-sm h-auto py-3">
                    <Users className="w-4 h-4 mr-2" />
                    Team View
                  </Button>
                  <Button variant="outline" className="border-[#01411C] text-[#01411C] text-sm h-auto py-3">
                    <Activity className="w-4 h-4 mr-2" />
                    SLA Monitor
                  </Button>
                  <Button variant="outline" className="border-[#01411C] text-[#01411C] text-sm h-auto py-3">
                    <Award className="w-4 h-4 mr-2" />
                    Reports
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Critical Tickets */}
            <Card className="border-[#01411C]/20">
              <CardContent className="p-4">
                <h3 className="font-bold text-[#DC3545] mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Critical Tickets ({criticalTickets.length})
                </h3>
                <div className="space-y-2">
                  {criticalTickets.slice(0, 3).map((ticket) => (
                    <div key={ticket.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className="bg-red-600 text-white text-xs">
                          {ticket.id}
                        </Badge>
                        <SLATimer ticket={ticket} compact />
                      </div>
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{ticket.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{ticket.category}</p>
                    </div>
                  ))}
                  {criticalTickets.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No critical tickets</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="flex-1 p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#01411C]">My Tickets</h3>
              <Badge className="bg-[#01411C] text-white">{relevantTickets.length}</Badge>
            </div>

            {relevantTickets.length === 0 ? (
              <Card className="border-[#01411C]/20">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">No tickets assigned</p>
                </CardContent>
              </Card>
            ) : (
              relevantTickets.map((ticket) => (
                <Card key={ticket.id} className="border-[#01411C]/20 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-[#01411C] mb-1 line-clamp-1">{ticket.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {ticket.createdBy.name}
                      </span>
                      <SLATimer ticket={ticket} compact />
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{ticket.category}</span>
                        <Button size="sm" className="bg-[#01411C] hover:bg-[#0B5D1E] text-white h-7 text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="flex-1 p-4 space-y-4">
            <Card className="border-[#01411C]/20">
              <CardContent className="p-4">
                <h3 className="font-bold text-[#01411C] mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Performance Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Resolution Rate</span>
                      <span className="text-sm font-bold text-[#01411C]">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#28A745] h-2 rounded-full" style={{ width: '87%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">SLA Compliance</span>
                      <span className="text-sm font-bold text-[#01411C]">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#007BFF] h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Avg Response Time</span>
                      <span className="text-sm font-bold text-[#01411C]">2.3h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#FFC107] h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#01411C]/20">
              <CardContent className="p-4">
                <h3 className="font-bold text-[#01411C] mb-3">Ticket Distribution</h3>
                <div className="space-y-2">
                  {['New', 'In Progress', 'Resolved', 'Escalated'].map((status) => {
                    const count = relevantTickets.filter(t => t.status === status).length;
                    const percentage = relevantTickets.length > 0 ? Math.round((count / relevantTickets.length) * 100) : 0;
                    return (
                      <div key={status} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{status}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{percentage}%</span>
                          <Badge className="bg-[#01411C] text-white">{count}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="flex-1 p-4 space-y-4">
            <Card className="border-[#01411C]/20">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-[#01411C] rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3">
                  {currentUser.name.charAt(0)}
                </div>
                <h3 className="font-bold text-[#01411C] text-lg">{currentUser.name}</h3>
                <p className="text-gray-600">{currentUser.role}</p>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
                <Badge className="mt-2 bg-[#01411C] text-white">{currentUser.department}</Badge>
              </CardContent>
            </Card>

            <Card className="border-[#01411C]/20">
              <CardContent className="p-4">
                <h3 className="font-bold text-[#01411C] mb-3">Access Level</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-700">Ticket Management</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-700">View Analytics</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-700">SLA Monitoring</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  {['Executive', 'System Admin', 'Auditor'].includes(currentUser.role) && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-700">System Administration</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#01411C]/20 bg-gradient-to-r from-[#DFF5E1] to-white">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-[#01411C]" />
                  <div>
                    <p className="text-sm font-semibold text-[#01411C]">Government of Pakistan</p>
                    <p className="text-xs text-gray-600">Public Development Authority</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}