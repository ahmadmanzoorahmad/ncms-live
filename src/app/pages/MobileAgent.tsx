// Mobile Agent App Interface

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { SLATimer } from '../components/SLATimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Search,
  Bell,
  Filter,
  Home,
  Ticket,
  BarChart3,
  User,
  AlertTriangle,
  Clock,
  CheckCircle,
  Camera,
  FileText,
  Bot
} from 'lucide-react';

export default function MobileAgent() {
  const [activeTab, setActiveTab] = useState('home');
  const { currentUser: currentAgent, tickets } = useApp();
  
  const assignedTickets = tickets.filter(t =>
    t.assignedTo?.id === currentAgent.id || t.department === currentAgent.department
  );
  const pendingTickets = assignedTickets.filter(t => 
    ['Assigned', 'In Progress', 'Pending'].includes(t.status)
  );
  const criticalTickets = assignedTickets.filter(t => 
    t.priority === 'Critical' && !['Closed', 'Auto-Resolved'].includes(t.status)
  );
  const slaAtRisk = assignedTickets.filter(t => t.slaStatus === 'At Risk');

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ height: '844px' }}>
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">SmartTicket</h2>
            <p className="text-xs text-green-100">Agent App</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Filter className="w-5 h-5" />
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Bell className="w-5 h-5" />
              </Button>
              {slaAtRisk.length > 0 && (
                <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                  {slaAtRisk.length}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-300" />
          <Input 
            placeholder="Search tickets..." 
            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-green-200"
          />
        </div>
      </div>

      {/* Content */}
      <div className="h-[690px] overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
            <TabsTrigger value="home" className="flex flex-col items-center py-3 space-y-1">
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex flex-col items-center py-3 space-y-1">
              <Ticket className="w-5 h-5" />
              <span className="text-xs">Queue</span>
              {pendingTickets.length > 0 && (
                <Badge className="absolute top-1 right-3 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  {pendingTickets.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex flex-col items-center py-3 space-y-1">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col items-center py-3 space-y-1">
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="flex-1 p-4 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-blue-50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{assignedTickets.length}</p>
                  <p className="text-xs text-gray-600 mt-1">Assigned</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">{pendingTickets.length}</p>
                  <p className="text-xs text-gray-600 mt-1">Pending</p>
                </CardContent>
              </Card>
              <Card className="bg-red-50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{criticalTickets.length}</p>
                  <p className="text-xs text-gray-600 mt-1">Critical</p>
                </CardContent>
              </Card>
            </div>

            {/* SLA Alerts */}
            {slaAtRisk.length > 0 && (
              <Card className="border-2 border-yellow-300 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-900">SLA Alert</h3>
                    <Badge className="bg-yellow-600">{slaAtRisk.length}</Badge>
                  </div>
                  <p className="text-xs text-yellow-800 mb-3">
                    These tickets need immediate attention!
                  </p>
                  <div className="space-y-2">
                    {slaAtRisk.slice(0, 2).map(ticket => (
                      <div key={ticket.id} className="bg-white p-2 rounded border border-yellow-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono">{ticket.id}</span>
                          <Badge variant="destructive" className="text-xs">{ticket.priority}</Badge>
                        </div>
                        <p className="text-xs font-medium mt-1 line-clamp-1">{ticket.title}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Priority Queue */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Priority Queue</h3>
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </div>
              <div className="space-y-3">
                {pendingTickets.slice(0, 3).map(ticket => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                          <Badge variant="outline" className="text-xs">{ticket.priority}</Badge>
                        </div>
                        <Badge variant="secondary" className="text-xs">{ticket.status}</Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-2">{ticket.title}</h4>
                      <SLATimer 
                        deadline={ticket.slaDeadline} 
                        slaStatus={ticket.slaStatus}
                        compact
                        showIcon={false}
                      />
                      {ticket.aiSuggestion && (
                        <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded flex items-start space-x-2">
                          <Bot className="w-4 h-4 text-purple-600 mt-0.5" />
                          <p className="text-xs text-purple-800 line-clamp-2">{ticket.aiSuggestion}</p>
                        </div>
                      )}
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" className="flex-1">View</Button>
                        <Button size="sm" variant="outline">Update</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Queue Tab */}
          <TabsContent value="queue" className="flex-1 p-4 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Work Queue</h3>
              <Badge>{assignedTickets.length}</Badge>
            </div>
            <div className="space-y-3">
              {assignedTickets.map(ticket => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                        <Badge variant="outline" className="text-xs">{ticket.priority}</Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">{ticket.status}</Badge>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">{ticket.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{ticket.createdBy.name}</p>
                    {!['Closed', 'Auto-Resolved'].includes(ticket.status) && (
                      <SLATimer 
                        deadline={ticket.slaDeadline} 
                        slaStatus={ticket.slaStatus}
                        compact
                        showIcon={false}
                      />
                    )}
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" className="flex-1">View Details</Button>
                      <Button size="sm" variant="outline">
                        <Camera className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="flex-1 p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">My Performance</h3>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold mb-3">Today's Progress</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Ticket className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Assigned</span>
                    </div>
                    <span className="font-semibold">{assignedTickets.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-600">In Progress</span>
                    </div>
                    <span className="font-semibold">{pendingTickets.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Resolved</span>
                    </div>
                    <span className="font-semibold">
                      {assignedTickets.filter(t => t.status === 'Resolved').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold mb-3">SLA Performance</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Compliance Rate</span>
                      <span className="font-semibold text-green-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {assignedTickets.filter(t => t.slaStatus === 'On Track').length}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">On Track</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{slaAtRisk.length}</p>
                      <p className="text-xs text-gray-600 mt-1">At Risk</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  <h4 className="text-sm font-semibold text-purple-900">AI Insights</h4>
                </div>
                <p className="text-xs text-purple-800 mb-3">
                  You're performing 15% better than your average this week! Keep it up!
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-purple-700">
                    <CheckCircle className="w-3 h-3" />
                    <span>Fast response time on critical tickets</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-700">
                    <CheckCircle className="w-3 h-3" />
                    <span>High customer satisfaction ratings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="flex-1 p-4 space-y-4">
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-lg">{currentAgent.name}</h3>
              <p className="text-sm text-gray-600">{currentAgent.email}</p>
              <Badge className="mt-2 bg-green-600">{currentAgent.role}</Badge>
            </div>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Toggle Availability
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    View Knowledge Base
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Report an Issue
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-3">Settings</h4>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Notifications
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Preferences
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Help & Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              Sign Out
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
