// Support Agent Dashboard

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import type { Ticket } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SLATimer } from '../components/SLATimer';
import {
  Briefcase, CheckCircle2, AlertTriangle,
  Bot, TrendingUp, ExternalLink, ArrowRight, ArrowUpCircle, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { EscalationEngine } from '../services/escalation-engine';

export default function AgentDashboard() {
  const { currentUser, tickets, users, updateTicket, escalateTicket } = useApp();
  const navigate = useNavigate();
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [escalateTicketObj, setEscalateTicketObj] = useState<Ticket | null>(null);
  const [escalateReason, setEscalateReason] = useState('');

  // Agent sees their assigned tickets + department tickets
  const myTickets = tickets.filter(t =>
    t.assignedTo?.id === currentUser.id || t.department === currentUser.department
  );
  const activeTickets = myTickets.filter(t => !['Closed', 'Auto-Resolved', 'Resolved', 'Client Confirmation'].includes(t.status));
  const awaitingConfirmTickets = myTickets.filter(t => t.status === 'Client Confirmation');
  const resolvedTickets = myTickets.filter(t => ['Resolved', 'Closed', 'Auto-Resolved'].includes(t.status));
  const slaAtRisk = myTickets.filter(t => t.slaStatus === 'At Risk' || t.slaStatus === 'Breached');

  const avgResolution = resolvedTickets.length > 0 ?
    Math.round(resolvedTickets.reduce((sum, t) => {
      if (t.resolvedAt) return sum + (t.resolvedAt.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60);
      return sum;
    }, 0) / resolvedTickets.length * 10) / 10 : 0;

  const handleResolve = (ticketId: string) => {
    setResolvingId(ticketId);
    setTimeout(() => {
      updateTicket(ticketId, { status: 'Client Confirmation', resolvedAt: new Date() });
      setResolvingId(null);
      toast.success(`Ticket ${ticketId} marked as resolved — awaiting citizen confirmation`);
    }, 500);
  };

  const handleCloseTicket = (ticketId: string) => {
    updateTicket(ticketId, { status: 'Closed', closedAt: new Date() });
    toast.success(`Ticket ${ticketId} closed successfully`);
  };

  const handleMarkInProgress = (ticketId: string) => {
    updateTicket(ticketId, { status: 'In Progress' });
    toast.info(`Ticket ${ticketId} moved to In Progress`);
  };

  const openEscalateModal = (ticket: Ticket) => {
    setEscalateTicketObj(ticket);
    setEscalateReason('');
  };

  const handleConfirmEscalate = () => {
    if (!escalateTicketObj) return;
    if (!escalateReason.trim()) { toast.error('Please provide a reason for escalation.'); return; }
    const target = EscalationEngine.findTarget(currentUser, users, escalateTicketObj);
    if (!target) { toast.error('No escalation target found for your role.'); return; }
    escalateTicket(escalateTicketObj.id, escalateReason, target);
    toast.warning(`Ticket escalated to ${target.name} (${target.role})`);
    setEscalateTicketObj(null);
    setEscalateReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#0B5D1E] text-white rounded-lg p-6 shadow-lg border-l-4 border-[#1F7A3A]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {currentUser.role === 'Field Engineer' ? 'Field Engineer Dashboard' : 'Agent Dashboard'}
            </h1>
            <p className="text-white/90 mt-1">
              {currentUser.role === 'Field Engineer' ? 'فیلڈ انجینئر ڈیش بورڈ' : 'ایجنٹ ڈیش بورڈ'} • My Assigned Cases
            </p>
            <p className="text-sm text-white/70 mt-1">
              {currentUser.name} • {currentUser.department}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-white/80">Active Cases</p>
              <p className="text-2xl font-bold">{activeTickets.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-white/80">SLA Risk</p>
              <p className="text-2xl font-bold text-yellow-300">{slaAtRisk.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Cases', value: activeTickets.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Resolved', value: resolvedTickets.length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'SLA At Risk', value: slaAtRisk.length, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
          { label: 'Avg Resolution', value: `${avgResolution}h`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
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

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="bg-[#DFF5E1]">
          <TabsTrigger value="active" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            Active Cases ({activeTickets.length})
          </TabsTrigger>
          <TabsTrigger value="awaiting" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white relative">
            Awaiting Citizen
            {awaitingConfirmTickets.length > 0 && (
              <span className="ml-1.5 bg-amber-500 data-[state=active]:bg-white/30 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {awaitingConfirmTickets.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="priority" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            Priority Queue ({slaAtRisk.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            Closed ({resolvedTickets.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Cases */}
        <TabsContent value="active" className="space-y-4">
          {activeTickets.length === 0 ? (
            <Card className="border-[#01411C]/20">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-[#01411C] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#01411C] mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No active cases assigned at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            activeTickets.map(ticket => (
              <Card key={ticket.id} className="border-[#01411C]/20 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{ticket.id}</span>
                        <Badge variant="outline" className={
                          ticket.priority === 'Critical' ? 'border-red-500 text-red-700 bg-red-50' :
                          ticket.priority === 'High' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                          'border-blue-500 text-blue-700 bg-blue-50'
                        }>
                          {ticket.priority}
                        </Badge>
                        <Badge variant="outline" className="border-[#01411C] text-[#01411C] bg-[#DFF5E1]">
                          {ticket.status}
                        </Badge>
                      </div>
                      <h3
                        className="font-semibold text-lg text-[#01411C] mb-1 cursor-pointer hover:underline"
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        {ticket.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
                      {ticket.aiSuggestion && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <Bot className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-purple-700 mb-0.5">
                                AI Suggestion ({Math.round((ticket.aiConfidence || 0) * 100)}% confidence)
                              </p>
                              <p className="text-sm text-purple-900 line-clamp-2">{ticket.aiSuggestion}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <SLATimer deadline={ticket.slaDeadline} slaStatus={ticket.slaStatus} />
                      <p className="text-xs text-gray-500 mt-2">
                        By: {ticket.createdBy.name} • Category: {ticket.category}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-[#01411C] hover:bg-[#0B5D1E] text-white"
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {ticket.status !== 'In Progress' && ticket.status !== 'Escalated' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-700 hover:bg-blue-50"
                          onClick={() => handleMarkInProgress(ticket.id)}
                        >
                          Start
                        </Button>
                      )}
                      {ticket.status !== 'Escalated' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-700 hover:bg-green-50"
                          onClick={() => handleResolve(ticket.id)}
                          disabled={resolvingId === ticket.id}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {resolvingId === ticket.id ? '...' : 'Resolve'}
                        </Button>
                      )}
                      {ticket.status !== 'Escalated' && (ticket.slaStatus === 'At Risk' || ticket.slaStatus === 'Breached') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-500 text-orange-700 hover:bg-orange-50"
                          onClick={() => openEscalateModal(ticket)}
                        >
                          <ArrowUpCircle className="w-3 h-3 mr-1" />
                          Escalate
                        </Button>
                      )}
                      {ticket.status === 'Escalated' && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded text-xs text-orange-700 font-medium border border-orange-300">
                          <ArrowUpCircle className="w-3 h-3" />
                          Escalated
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Awaiting Citizen Confirmation */}
        <TabsContent value="awaiting" className="space-y-4">
          {awaitingConfirmTickets.length === 0 ? (
            <Card className="border-[#01411C]/20">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No tickets awaiting confirmation</h3>
                <p className="text-gray-500">Tickets you resolve will appear here until the citizen confirms.</p>
              </CardContent>
            </Card>
          ) : (
            awaitingConfirmTickets.map(ticket => (
              <Card key={ticket.id} className="border-amber-400 bg-amber-50 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-mono text-gray-500 bg-white px-2 py-0.5 rounded border">{ticket.id}</span>
                        <Badge variant="outline" className={
                          ticket.priority === 'Critical' ? 'border-red-500 text-red-700 bg-red-50' :
                          ticket.priority === 'High' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                          'border-blue-500 text-blue-700 bg-blue-50'
                        }>{ticket.priority}</Badge>
                        <Badge className="bg-amber-500 text-white text-xs">
                          ⏳ Awaiting Citizen Confirmation
                        </Badge>
                      </div>
                      <h3
                        className="font-semibold text-lg text-[#01411C] mb-1 cursor-pointer hover:underline"
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        {ticket.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ticket.description}</p>
                      <p className="text-xs text-gray-500">
                        Reported by: <strong>{ticket.createdBy.name}</strong>
                        {ticket.resolvedAt && ` • Resolved on ${ticket.resolvedAt.toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-[#01411C] hover:bg-[#0B5D1E] text-white"
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <p className="text-xs text-amber-700 text-center max-w-[100px]">
                        Citizen confirmation pending
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Priority Queue */}
        <TabsContent value="priority">
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C]">Priority Cases Requiring Immediate Attention</CardTitle>
            </CardHeader>
            <CardContent>
              {slaAtRisk.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500">No SLA risks at the moment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slaAtRisk
                    .sort((a, b) => a.slaDeadline.getTime() - b.slaDeadline.getTime())
                    .map(ticket => (
                      <div key={ticket.id} className={`p-4 rounded-lg border-2 ${
                        ticket.slaStatus === 'Breached' ? 'border-red-500 bg-red-50' : 'border-orange-400 bg-orange-50'
                      }`}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <AlertTriangle className={`w-4 h-4 ${ticket.slaStatus === 'Breached' ? 'text-red-600' : 'text-orange-600'}`} />
                              <span className="font-mono text-sm text-gray-700">{ticket.id}</span>
                              <Badge variant="outline" className={ticket.slaStatus === 'Breached' ? 'border-red-600 text-red-700 bg-red-100' : 'border-orange-600 text-orange-700 bg-orange-100'}>
                                {ticket.slaStatus}
                              </Badge>
                              <Badge variant="outline" className="border-gray-400 text-gray-700">{ticket.priority}</Badge>
                            </div>
                            <p className="font-semibold text-gray-900">{ticket.title}</p>
                            <SLATimer deadline={ticket.slaDeadline} slaStatus={ticket.slaStatus} compact />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              className={ticket.slaStatus === 'Breached' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}
                              onClick={() => navigate(`/ticket/${ticket.id}`)}
                            >
                              <ArrowRight className="w-3 h-3 mr-1" />
                              Take Action
                            </Button>
                            {ticket.status !== 'Escalated' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-orange-500 text-orange-700 hover:bg-orange-50"
                                onClick={() => openEscalateModal(ticket)}
                              >
                                <ArrowUpCircle className="w-3 h-3 mr-1" />
                                Escalate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resolved / Closed Cases */}
        <TabsContent value="resolved">
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C]">Resolved &amp; Closed Cases</CardTitle>
              <p className="text-sm text-gray-500">Tickets confirmed by citizen can be closed here.</p>
            </CardHeader>
            <CardContent>
              {resolvedTickets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No resolved or closed cases yet.</p>
              ) : (
                <div className="space-y-3">
                  {resolvedTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        ticket.status === 'Resolved'
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                          <Badge className={`border text-xs ${
                            ticket.status === 'Resolved'
                              ? 'bg-green-100 text-green-800 border-green-400'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}>{ticket.status}</Badge>
                          {ticket.status === 'Resolved' && (
                            <Badge className="bg-blue-100 text-blue-700 border border-blue-300 text-xs">
                              ✓ Citizen Confirmed
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium text-[#01411C]">{ticket.title}</p>
                        <p className="text-xs text-gray-500">
                          {ticket.resolvedAt ? `Resolved ${ticket.resolvedAt.toLocaleDateString()}` : 'Recently resolved'}
                          {ticket.closedAt && ` • Closed ${ticket.closedAt.toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        {ticket.status === 'Resolved' && (
                          <Button
                            size="sm"
                            className="bg-gray-800 hover:bg-gray-900 text-white"
                            onClick={() => handleCloseTicket(ticket.id)}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Close Ticket
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/ticket/${ticket.id}`)}>
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Escalation Modal ── */}
      {escalateTicketObj && (() => {
        const target = EscalationEngine.findTarget(currentUser, users, escalateTicketObj);
        const level = EscalationEngine.getLevel(currentUser.role);
        const timeout = target ? EscalationEngine.getTimeoutHours(escalateTicketObj.priority, level || 1) : 0;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border-t-4 border-orange-500">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <ArrowUpCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Escalate Ticket</h2>
                    <p className="text-sm text-gray-500">{EscalationEngine.getMatrixLabel(currentUser.role)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4 border">
                  <p className="text-xs text-gray-500 mb-1">Ticket</p>
                  <p className="font-semibold text-[#01411C]">{escalateTicketObj.id} — {escalateTicketObj.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{escalateTicketObj.priority}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${escalateTicketObj.slaStatus === 'Breached' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      SLA {escalateTicketObj.slaStatus}
                    </span>
                  </div>
                </div>

                {target ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Escalating To</p>
                    <p className="font-semibold text-blue-800">{target.name}</p>
                    <p className="text-xs text-blue-600">{target.role} • {target.department}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <p className="text-xs text-blue-600">{timeout}h resolution window ({escalateTicketObj.priority} priority, Level {level})</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
                    No escalation target found. Contact your administrator.
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Escalation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={3}
                    placeholder="Describe why this ticket needs escalation..."
                    value={escalateReason}
                    onChange={e => setEscalateReason(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => { setEscalateTicketObj(null); setEscalateReason(''); }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={handleConfirmEscalate}
                    disabled={!target || !escalateReason.trim()}
                  >
                    <ArrowUpCircle className="w-4 h-4 mr-1" />
                    Confirm Escalation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
