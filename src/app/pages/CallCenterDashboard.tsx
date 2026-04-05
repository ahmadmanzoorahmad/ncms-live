// Call Center Officer Dashboard

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { mockDepartments } from '../data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Plus, Search, FileText, AlertCircle, CheckCircle, Users, Phone, Copy, UserCheck, Send,
} from 'lucide-react';
import { toast } from 'sonner';
import type { TicketPriority } from '../types';

export default function CallCenterDashboard() {
  const { currentUser, tickets, users, updateTicket, addTicket } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('new');

  // Form state
  const [form, setForm] = useState({
    citizenName: '',
    contactNumber: '',
    email: '',
    title: '',
    description: '',
    category: 'Infrastructure',
    priority: 'Medium' as TicketPriority,
    department: 'Technical Support',
  });
  const [submitting, setSubmitting] = useState(false);
  const [validatingId, setValidatingId] = useState<string | null>(null);

  // Assign-to-agent modal state
  const [assignTicketId, setAssignTicketId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');

  // Incoming queue: New + AI Analysis + Pending (CCO-reviewed, awaiting assignment)
  const incomingComplaints = tickets.filter(t =>
    ['New', 'AI Analysis', 'Pending'].includes(t.status) && !t.assignedTo
  );
  const recentComplaints = [...tickets].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 30);

  const filteredNew = searchQuery
    ? incomingComplaints.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : incomingComplaints;

  // Agents / Field Engineers available for assignment
  const assignableAgents = users.filter(u =>
    ['Support Agent', 'Field Engineer'].includes(u.role)
  );

  // Validate steps:
  //   New        → AI Analysis  (trigger AI review; stays in CCO queue)
  //   AI Analysis → Pending     (CCO reviewed; stays in queue for CCO to assign)
  //   Pending    → (no change;  use "Assign to Agent" instead)
  const handleValidate = (ticketId: string) => {
    setValidatingId(ticketId);
    setTimeout(() => {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) { setValidatingId(null); return; }

      if (ticket.status === 'New') {
        updateTicket(ticketId, { status: 'AI Analysis' });
        toast.success(`Ticket ${ticketId} validated — AI analysis triggered`);
      } else if (ticket.status === 'AI Analysis') {
        updateTicket(ticketId, { status: 'Pending' });
        toast.success(`Ticket ${ticketId} reviewed — now awaiting assignment to an agent`);
      }
      setValidatingId(null);
    }, 500);
  };

  // Explicitly assign a ticket to a specific agent
  const handleAssignToAgent = () => {
    if (!assignTicketId || !selectedAgentId) {
      toast.error('Please select an agent to assign this ticket to');
      return;
    }
    const agent = users.find(u => u.id === selectedAgentId);
    if (!agent) return;
    updateTicket(assignTicketId, { status: 'Assigned', assignedTo: agent });
    toast.success(`Ticket ${assignTicketId} assigned to ${agent.name}`);
    setAssignTicketId(null);
    setSelectedAgentId('');
  };

  const handleReject = (ticketId: string) => {
    updateTicket(ticketId, { status: 'Closed', closedAt: new Date() });
    toast.error(`Ticket ${ticketId} has been rejected`);
  };

  const handleMarkDuplicate = (ticketId: string) => {
    updateTicket(ticketId, { status: 'Closed', closedAt: new Date() });
    toast.info(`Ticket ${ticketId} marked as duplicate and closed`);
  };

  const handleSubmitComplaint = () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Please fill in the title and description');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newTicket = {
        id: `TKT-${String(Date.now()).slice(-6)}`,
        title: form.title.trim(),
        description: form.description.trim(),
        status: 'New' as const,
        priority: form.priority,
        category: form.category,
        department: form.department,
        createdAt: new Date(),
        updatedAt: new Date(),
        slaDeadline: new Date(Date.now() + 72 * 60 * 60 * 1000),
        slaStatus: 'On Track' as const,
        createdBy: {
          id: `citizen-${Date.now()}`,
          name: form.citizenName || 'Anonymous Citizen',
          email: form.email || `${form.contactNumber || 'unknown'}@citizen.gov.pk`,
          role: 'Citizen' as const,
        },
        tags: [form.category, form.priority],
        isAIResolved: false,
        attachments: [],
        source: 'Call Center' as const,
      };
      addTicket(newTicket);
      setSubmitting(false);
      setForm({
        citizenName: '', contactNumber: '', email: '',
        title: '', description: '',
        category: 'Infrastructure', priority: 'Medium', department: 'Technical Support',
      });
      setActiveTab('new');
      toast.success(`Complaint submitted! Ticket ID: ${newTicket.id}`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#0B5D1E] text-white rounded-lg p-6 shadow-lg border-l-4 border-[#1F7A3A]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Call Center Dashboard</h1>
            <p className="text-white/90 mt-1">کال سینٹر ڈیش بورڈ • Complaint Intake Management</p>
            <p className="text-sm text-white/70 mt-1">{currentUser.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-white/80">Incoming Queue</p>
              <p className="text-2xl font-bold">{incomingComplaints.length}</p>
            </div>
            <Button
              className="bg-white text-[#01411C] hover:bg-gray-100 font-semibold"
              onClick={() => setActiveTab('create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Complaint
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Incoming Queue', value: incomingComplaints.length, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Total Tickets', value: tickets.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Pending Review', value: incomingComplaints.length, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
          { label: 'Calls Handled', value: 47, icon: Phone, color: 'text-blue-600', bg: 'bg-blue-100' },
        ].map(stat => (
          <Card key={stat.label} className="border-[#01411C]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#01411C]">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-[#DFF5E1]">
          <TabsTrigger value="new" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            Incoming Queue ({incomingComplaints.length})
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            All Tickets
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            <Plus className="w-4 h-4 mr-1" />
            Create New
          </TabsTrigger>
        </TabsList>

        {/* New Complaints Tab */}
        <TabsContent value="new" className="space-y-4">
          <Card className="border-[#01411C]/20">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search complaints by ID, title, or citizen name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#01411C]/20"
                />
              </div>
            </CardContent>
          </Card>
          {filteredNew.length === 0 ? (
            <Card className="border-[#01411C]/20">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">No new complaints pending review.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNew.map(ticket => (
                <Card key={ticket.id} className="border-[#01411C]/20 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge className={`border text-xs ${
                            ticket.status === 'AI Analysis' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                            ticket.status === 'Pending' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>{ticket.status.toUpperCase()}</Badge>
                          <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                          <Badge variant="outline" className={
                            ticket.priority === 'Critical' ? 'border-red-500 text-red-700' :
                            ticket.priority === 'High' ? 'border-orange-500 text-orange-700' :
                            'border-blue-500 text-blue-700'
                          }>{ticket.priority}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg text-[#01411C] mb-1">{ticket.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ticket.createdBy.name}</span>
                          <span>Category: <strong className="text-[#01411C]">{ticket.category}</strong></span>
                          {ticket.department && <span>Dept: <strong className="text-[#01411C]">{ticket.department}</strong></span>}
                          <span>{ticket.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {/* Validate: New → AI Analysis → Pending */}
                        {ticket.status !== 'Pending' && (
                          <Button
                            size="sm"
                            className="bg-[#01411C] hover:bg-[#0B5D1E]"
                            onClick={() => handleValidate(ticket.id)}
                            disabled={validatingId === ticket.id}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {validatingId === ticket.id
                              ? '...'
                              : ticket.status === 'AI Analysis' ? 'Mark Reviewed' : 'Validate'
                            }
                          </Button>
                        )}
                        {/* Assign to Agent: available once AI Analysis done or Pending */}
                        {(ticket.status === 'AI Analysis' || ticket.status === 'Pending') && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => { setAssignTicketId(ticket.id); setSelectedAgentId(''); }}
                          >
                            <UserCheck className="w-3 h-3 mr-1" />
                            Assign to Agent
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#01411C]/30 text-[#01411C]"
                          onClick={() => navigate(`/ticket/${ticket.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => handleMarkDuplicate(ticket.id)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Duplicate
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(ticket.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* All Tickets Tab */}
        <TabsContent value="recent">
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C]">All Complaint Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentComplaints.map(ticket => (
                  <div key={ticket.id} className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-[#DFF5E1]/20 px-2 rounded transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{ticket.id}</span>
                        <Badge variant="outline" className="text-xs">{ticket.status}</Badge>
                        <Badge variant="outline" className="text-xs border-gray-300">{ticket.priority}</Badge>
                      </div>
                      <p className="font-medium text-[#01411C] text-sm">{ticket.title}</p>
                      <p className="text-xs text-gray-500">{ticket.createdBy.name} • {ticket.category} • {ticket.createdAt.toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/ticket/${ticket.id}`)}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create New Complaint Tab */}
        <TabsContent value="create">
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C]">Create Complaint on Behalf of Citizen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {/* Citizen Info */}
                <div>
                  <h4 className="text-sm font-semibold text-[#01411C] mb-3">Citizen Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Citizen Name"
                      value={form.citizenName}
                      onChange={(e) => setForm(f => ({ ...f, citizenName: e.target.value }))}
                      className="border-[#01411C]/20 focus:border-[#01411C]"
                    />
                    <Input
                      placeholder="Contact Number"
                      value={form.contactNumber}
                      onChange={(e) => setForm(f => ({ ...f, contactNumber: e.target.value }))}
                      className="border-[#01411C]/20 focus:border-[#01411C]"
                    />
                    <Input
                      placeholder="Email (Optional)"
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      className="border-[#01411C]/20 focus:border-[#01411C]"
                    />
                  </div>
                </div>

                {/* Complaint Details */}
                <div>
                  <h4 className="text-sm font-semibold text-[#01411C] mb-3">Complaint Details</h4>
                  <Input
                    placeholder="Complaint Title *"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    className="mb-3 border-[#01411C]/20 focus:border-[#01411C]"
                  />
                  <textarea
                    placeholder="Detailed description of the complaint... *"
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full min-h-32 p-3 border-2 border-[#01411C]/20 rounded-lg focus:border-[#01411C] outline-none resize-none text-sm"
                  />
                </div>

                {/* Category / Priority / Department */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full p-2.5 border-2 border-[#01411C]/20 rounded-lg focus:border-[#01411C] outline-none text-sm"
                    >
                      {['Infrastructure', 'Billing', 'Service Request', 'Technical Issue', 'Environmental', 'Public Safety', 'Health Services', 'Education', 'Transport'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm(f => ({ ...f, priority: e.target.value as TicketPriority }))}
                      className="w-full p-2.5 border-2 border-[#01411C]/20 rounded-lg focus:border-[#01411C] outline-none text-sm"
                    >
                      {(['Low', 'Medium', 'High', 'Critical'] as TicketPriority[]).map(p => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))}
                      className="w-full p-2.5 border-2 border-[#01411C]/20 rounded-lg focus:border-[#01411C] outline-none text-sm"
                    >
                      {mockDepartments.map(d => (
                        <option key={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#01411C] hover:bg-[#0B5D1E] py-6 text-base font-semibold"
                  onClick={handleSubmitComplaint}
                  disabled={submitting}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign to Agent Modal */}
      {assignTicketId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-[#01411C] mb-1">Assign to Agent</h2>
            <p className="text-sm text-gray-500 mb-4">
              Ticket <span className="font-mono font-semibold">{assignTicketId}</span> will be sent to the selected agent or field engineer.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-2">Select Agent / Field Engineer</label>
            <select
              value={selectedAgentId}
              onChange={e => setSelectedAgentId(e.target.value)}
              className="w-full p-2.5 border-2 border-[#01411C]/30 rounded-lg focus:border-[#01411C] outline-none text-sm mb-6"
            >
              <option value="">— Choose a staff member —</option>
              {assignableAgents.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role}{u.department ? ` · ${u.department}` : ''})
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-[#01411C] hover:bg-[#0B5D1E]"
                onClick={handleAssignToAgent}
                disabled={!selectedAgentId}
              >
                <Send className="w-4 h-4 mr-2" />
                Assign &amp; Route
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-300"
                onClick={() => { setAssignTicketId(null); setSelectedAgentId(''); }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
