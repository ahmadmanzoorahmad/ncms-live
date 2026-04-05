// Audit Dashboard - Full audit trail and blockchain readiness

import { useState, useEffect } from 'react';
import { mockTickets } from '../data/mock-data';
import { AuditService } from '../services/audit-service';
import { BlockchainAdapter } from '../services/blockchain-adapter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Database,
  Lock,
  Activity,
  FileText,
  Link2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function AuditDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  
  // Initialize audit events
  useEffect(() => {
    AuditService.initializeSampleEvents(mockTickets);
  }, []);

  const allEvents = AuditService.getAllEvents();
  const slaBreaches = AuditService.getSLABreachEvents();
  const eventStats = AuditService.getEventStats();
  const blockchainStatus = BlockchainAdapter.getStatus();

  // Filter events
  let filteredEvents = allEvents.filter(event =>
    event.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (eventTypeFilter !== 'all') {
    filteredEvents = filteredEvents.filter(e => e.eventType === eventTypeFilter);
  }

  const stats = [
    {
      title: 'Total Events',
      value: eventStats.totalEvents,
      icon: Activity,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'SLA Breaches',
      value: slaBreaches.length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      title: 'Recent Activity',
      value: eventStats.recentActivity,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      title: 'Blockchain Status',
      value: blockchainStatus.enabled ? 'Active' : 'Ready',
      icon: Shield,
      color: blockchainStatus.enabled ? 'text-green-600' : 'text-gray-600',
      bg: blockchainStatus.enabled ? 'bg-green-100' : 'bg-gray-100',
    },
  ];

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'TicketCreated':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'TicketAssigned':
        return <Activity className="w-4 h-4 text-purple-600" />;
      case 'TicketResolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'TicketClosed':
        return <Lock className="w-4 h-4 text-gray-600" />;
      case 'SLABreached':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Dashboard</h1>
          <p className="text-gray-600 mt-1">Complete audit trail and verification</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center space-x-2 border-[#01411C]/30 text-[#01411C] hover:bg-[#DFF5E1]"
          onClick={() => {
            const headers = ['ID', 'Ticket ID', 'Event Type', 'User', 'Timestamp', 'Metadata', 'Blockchain'];
            const rows = allEvents.map(e => [
              e.id,
              e.ticketId,
              e.eventType,
              e.userName,
              e.timestamp.toISOString(),
              JSON.stringify(e.metadata),
              e.blockchainVerified ? 'Verified' : 'Pending',
            ]);
            const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            import('sonner').then(({ toast }) => toast.success(`Exported ${allEvents.length} audit events to CSV`));
          }}
        >
          <FileText className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
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

      {/* Blockchain Status Banner */}
      <Card className={`border-2 ${blockchainStatus.enabled ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className={`w-6 h-6 ${blockchainStatus.enabled ? 'text-green-600' : 'text-blue-600'}`} />
                <h3 className={`text-lg font-semibold ${blockchainStatus.enabled ? 'text-green-900' : 'text-blue-900'}`}>
                  Blockchain Verification Layer
                </h3>
                <Badge className={blockchainStatus.enabled ? 'bg-green-600' : 'bg-blue-600'}>
                  {blockchainStatus.enabled ? 'Active' : 'Ready for Integration'}
                </Badge>
              </div>
              <p className={`text-sm ${blockchainStatus.enabled ? 'text-green-800' : 'text-blue-800'}`}>
                {blockchainStatus.enabled 
                  ? 'All audit events are being recorded on the blockchain for immutable verification.'
                  : 'System is blockchain-ready. Enable blockchain integration to record all audit events for immutable verification and compliance.'
                }
              </p>
              {!blockchainStatus.enabled && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-blue-900">Future Integration Features:</p>
                  <ul className="text-xs text-blue-700 space-y-1 ml-4">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Immutable audit trail with cryptographic verification</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Timestamped proof of all system events</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Third-party verification capability</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Compliance and regulatory reporting</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {!blockchainStatus.enabled && (
              <Button className="ml-4 flex items-center space-x-2">
                <Link2 className="w-4 h-4" />
                <span>Enable Blockchain</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by ticket ID or user..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="TicketCreated">Ticket Created</SelectItem>
                <SelectItem value="TicketAssigned">Ticket Assigned</SelectItem>
                <SelectItem value="TicketResolved">Ticket Resolved</SelectItem>
                <SelectItem value="TicketClosed">Ticket Closed</SelectItem>
                <SelectItem value="SLABreached">SLA Breached</SelectItem>
                <SelectItem value="StatusChanged">Status Changed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Events ({allEvents.length})</TabsTrigger>
          <TabsTrigger value="breaches">SLA Breaches ({slaBreaches.length})</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Event Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredEvents.slice(0, 50).map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="mt-1">{getEventIcon(event.eventType)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="font-mono text-xs">
                          {event.ticketId}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {event.eventType}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{event.userName}</p>
                      {Object.keys(event.metadata).length > 0 && (
                        <p className="text-xs text-gray-600 mt-1">
                          {JSON.stringify(event.metadata)}
                        </p>
                      )}
                    </div>
                    {event.blockchainVerified && (
                      <Badge className="bg-green-600 flex items-center space-x-1">
                        <Shield className="w-3 h-3" />
                        <span>Verified</span>
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breaches">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-900">
                <AlertTriangle className="w-5 h-5" />
                <span>SLA Breach Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {slaBreaches.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-600">No SLA breaches recorded</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slaBreaches.map((event) => (
                    <div 
                      key={event.id} 
                      className="p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="destructive">{event.ticketId}</Badge>
                            <span className="text-sm text-gray-600">{formatTimestamp(event.timestamp)}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">User: {event.userName}</p>
                          <p className="text-sm text-gray-700 mt-1">{JSON.stringify(event.metadata)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(eventStats.eventsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {getEventIcon(type)}
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                      <Badge>{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Audit Log Status</span>
                  </div>
                  <p className="text-sm text-green-700">All events are being recorded successfully</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Recent Activity</span>
                  </div>
                  <p className="text-sm text-blue-700">{eventStats.recentActivity} events in the last hour</p>
                </div>
                <div className={`p-4 border rounded-lg ${blockchainStatus.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className={`w-5 h-5 ${blockchainStatus.enabled ? 'text-green-600' : 'text-gray-600'}`} />
                    <span className={`font-medium ${blockchainStatus.enabled ? 'text-green-900' : 'text-gray-900'}`}>
                      Blockchain Integration
                    </span>
                  </div>
                  <p className={`text-sm ${blockchainStatus.enabled ? 'text-green-700' : 'text-gray-700'}`}>
                    {blockchainStatus.enabled ? 'Connected and operational' : 'Ready for activation'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
