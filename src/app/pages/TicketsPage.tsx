// Tickets Page - Role-based filtering

import { useState } from 'react';
import { Link } from 'react-router';
import { TicketCard } from '../components/TicketCard';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Plus,
  Search,
  Filter,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, tickets } = useApp();

  // Role-based ticket filtering
  const getRoleTickets = () => {
    switch (currentUser.role) {
      case 'Citizen':
        return tickets.filter(t => t.createdBy.id === currentUser.id);
      case 'Support Agent':
      case 'Field Engineer':
        return tickets.filter(t =>
          t.assignedTo?.id === currentUser.id ||
          t.department === currentUser.department
        );
      case 'Supervisor':
      case 'Department Head':
        return tickets.filter(t => t.department === currentUser.department);
      case 'Call Center Officer':
        return tickets;
      case 'Executive':
      case 'Auditor':
      case 'System Admin':
        return tickets;
      default:
        return tickets.filter(t => t.createdBy.id === currentUser.id);
    }
  };

  const roleTickets = getRoleTickets();

  const newTickets = roleTickets.filter(t => t.status === 'New');
  const inProgressTickets = roleTickets.filter(t => ['Assigned', 'In Progress', 'AI Analysis', 'Pending', 'Client Confirmation'].includes(t.status));
  const resolvedTickets = roleTickets.filter(t => ['Resolved', 'Auto-Resolved', 'Closed'].includes(t.status));
  const escalatedTickets = roleTickets.filter(t => t.status === 'Escalated');

  const filterTickets = (ticketList: typeof roleTickets) => {
    if (!searchQuery) return ticketList;
    const q = searchQuery.toLowerCase();
    return ticketList.filter(ticket =>
      ticket.title.toLowerCase().includes(q) ||
      ticket.id.toLowerCase().includes(q) ||
      ticket.description.toLowerCase().includes(q) ||
      ticket.category.toLowerCase().includes(q) ||
      (ticket.assignedTo?.name?.toLowerCase().includes(q) ?? false)
    );
  };

  const isStaff = currentUser.role !== 'Citizen';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#0B5D1E] text-white rounded-lg p-6 shadow-lg border-l-4 border-[#1F7A3A]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">
              {isStaff ? 'Tickets Management' : 'My Complaints'}
            </h1>
            <p className="text-white/90 mt-1">
              {isStaff ? 'شکایات مینجمنٹ • Manage all complaints' : 'میری شکایات • Track your complaints'}
            </p>
          </div>
          {!isStaff && (
            <Link to="/create-ticket">
              <Button size="lg" className="flex items-center space-x-2 bg-white text-[#01411C] hover:bg-white/90 font-semibold shadow-lg">
                <Send className="w-5 h-5" />
                <span>Submit New Complaint</span>
              </Button>
            </Link>
          )}
          {isStaff && (
            <Link to="/create-ticket">
              <Button size="lg" className="flex items-center space-x-2 bg-white text-[#01411C] hover:bg-white/90 font-semibold shadow-lg">
                <Plus className="w-5 h-5" />
                <span>Create Ticket</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search */}
      <Card className="border-[#01411C]/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <Input
              placeholder="Search by ID, title, category, or assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-[#01411C]/20 focus:border-[#01411C]"
            />
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-[#01411C]/20">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white text-xs">
            All ({roleTickets.length})
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white text-xs">
            <Clock className="w-3 h-3 mr-1" />
            New ({newTickets.length})
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Active ({inProgressTickets.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved ({resolvedTickets.length})
          </TabsTrigger>
          <TabsTrigger value="escalated" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Escalated ({escalatedTickets.length})
          </TabsTrigger>
        </TabsList>

        {(['all', 'new', 'progress', 'resolved', 'escalated'] as const).map(tab => {
          const list = tab === 'all' ? roleTickets : tab === 'new' ? newTickets : tab === 'progress' ? inProgressTickets : tab === 'resolved' ? resolvedTickets : escalatedTickets;
          const filtered = filterTickets(list);
          return (
            <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
              {filtered.length === 0 ? (
                <Card className="border-[#01411C]/20">
                  <CardContent className="p-12 text-center">
                    <Filter className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-lg font-semibold text-gray-500">No tickets found</p>
                    {tab === 'all' && !isStaff && (
                      <Link to="/create-ticket">
                        <Button className="mt-4 bg-[#01411C] hover:bg-[#0B5D1E]">
                          <Plus className="w-4 h-4 mr-2" />
                          Submit First Complaint
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filtered.map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} showAssignee={isStaff} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
