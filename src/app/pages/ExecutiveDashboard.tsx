// Executive Dashboard - High-level analytics and KPIs

import { calculateKPIMetrics } from '../data/mock-data';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Activity, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Target,
  Bot,
  FileText,
  Users,
  Shield
} from 'lucide-react';

export default function ExecutiveDashboard() {
  const { tickets } = useApp();
  const metrics = calculateKPIMetrics(tickets);

  // Calculate trends (simulated)
  const trends = {
    totalTickets: '+12%',
    avgResolutionTime: '-8%',
    slaCompliance: '+5%',
    aiResolutionRate: '+15%',
  };

  const stats = [
    {
      title: 'Total Complaints',
      value: metrics.totalTickets,
      trend: trends.totalTickets,
      trendUp: true,
      icon: FileText,
      color: 'text-[#01411C]',
      bg: 'bg-[#DFF5E1]',
    },
    {
      title: 'Avg Resolution Time',
      value: `${metrics.avgResolutionTime}h`,
      trend: trends.avgResolutionTime,
      trendUp: false,
      icon: Clock,
      color: 'text-[#0B5D1E]',
      bg: 'bg-[#DFF5E1]',
    },
    {
      title: 'SLA Compliance',
      value: `${metrics.slaCompliance}%`,
      trend: trends.slaCompliance,
      trendUp: true,
      icon: Target,
      color: 'text-[#28A745]',
      bg: 'bg-green-50',
    },
    {
      title: 'AI Resolution Rate',
      value: `${metrics.aiResolutionRate}%`,
      trend: trends.aiResolutionRate,
      trendUp: true,
      icon: Bot,
      color: 'text-[#6F42C1]',
      bg: 'bg-purple-50',
    },
  ];

  // Chart data - Government Colors
  const statusData = [
    { name: 'Open', value: metrics.openTickets, color: '#FFC107' },
    { name: 'Closed', value: metrics.closedTickets, color: '#28A745' },
  ];

  const priorityData = [
    { name: 'Critical', value: tickets.filter(t => t.priority === 'Critical').length, color: '#DC3545' },
    { name: 'High', value: tickets.filter(t => t.priority === 'High').length, color: '#FFC107' },
    { name: 'Medium', value: tickets.filter(t => t.priority === 'Medium').length, color: '#0B5D1E' },
    { name: 'Low', value: tickets.filter(t => t.priority === 'Low').length, color: '#1F7A3A' },
  ];

  const categoryData = [
    { name: 'Technical', value: tickets.filter(t => t.category === 'Technical Issue').length },
    { name: 'Billing', value: tickets.filter(t => t.category === 'Billing').length },
    { name: 'Account', value: tickets.filter(t => t.category === 'Account Issue').length },
    { name: 'Bug', value: tickets.filter(t => t.category === 'Bug Report').length },
    { name: 'Feature', value: tickets.filter(t => t.category === 'Feature Request').length },
    { name: 'Other', value: tickets.filter(t => t.category === 'General Inquiry' || t.category === 'Other').length },
  ];

  // Trend data (simulated weekly)
  const trendData = [
    { week: 'Week 1', tickets: 15, resolved: 12, aiResolved: 3 },
    { week: 'Week 2', tickets: 18, resolved: 15, aiResolved: 4 },
    { week: 'Week 3', tickets: 22, resolved: 19, aiResolved: 6 },
    { week: 'Week 4', tickets: 20, resolved: 18, aiResolved: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Government Header */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#0B5D1E] text-white rounded-lg p-6 shadow-lg border-l-4 border-[#1F7A3A]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Executive Dashboard</h1>
            <p className="text-white/90 mt-1">ایگزیکٹو ڈیش بورڈ • National Complaint Center</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-xs text-white/80">Last Updated</p>
              <p className="font-semibold">April 2, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards - Government Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
          return (
            <Card key={stat.title} className="border-[#01411C]/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`flex items-center space-x-1 ${stat.trendUp ? 'text-[#28A745] border-[#28A745]' : 'text-[#DC3545] border-[#DC3545]'}`}
                  >
                    <TrendIcon className="w-3 h-3" />
                    <span>{stat.trend}</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold mt-2 text-[#01411C]">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Status */}
        <Card className="border-[#01411C]/20">
          <CardHeader className="bg-gradient-to-r from-[#DFF5E1] to-white border-b border-[#01411C]/10">
            <CardTitle className="text-[#01411C] flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Complaint Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center space-x-6 mt-4">
              {statusData.map(item => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="border-[#01411C]/20">
          <CardHeader className="bg-gradient-to-r from-[#DFF5E1] to-white border-b border-[#01411C]/10">
            <CardTitle className="text-[#01411C] flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Priority Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#01411C20" />
                <XAxis dataKey="name" stroke="#01411C" />
                <YAxis stroke="#01411C" />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="border-[#01411C]/20">
          <CardHeader className="bg-gradient-to-r from-[#DFF5E1] to-white border-b border-[#01411C]/10">
            <CardTitle className="text-[#01411C] flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Complaints by Department</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#01411C20" />
                <XAxis type="number" stroke="#01411C" />
                <YAxis dataKey="name" type="category" width={80} stroke="#01411C" />
                <Tooltip />
                <Bar dataKey="value" fill="#0B5D1E" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Over Time */}
        <Card className="border-[#01411C]/20">
          <CardHeader className="bg-gradient-to-r from-[#DFF5E1] to-white border-b border-[#01411C]/10">
            <CardTitle className="text-[#01411C] flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Complaint Trends (4 Weeks)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#01411C20" />
                <XAxis dataKey="week" stroke="#01411C" />
                <YAxis stroke="#01411C" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#FFC107" 
                  strokeWidth={3}
                  name="Created"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#28A745" 
                  strokeWidth={3}
                  name="Resolved"
                />
                <Line 
                  type="monotone" 
                  dataKey="aiResolved" 
                  stroke="#6F42C1" 
                  strokeWidth={3}
                  name="AI Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Summary - Government Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-[#28A745] bg-gradient-to-br from-white to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#01411C]">
              <CheckCircle className="w-5 h-5 text-[#28A745]" />
              <span>Resolution Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Resolved</span>
              <span className="font-bold text-[#01411C]">{metrics.closedTickets}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Resolution Time</span>
              <span className="font-bold text-[#01411C]">{metrics.avgResolutionTime}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AI Resolution Rate</span>
              <Badge className="bg-[#6F42C1]">{metrics.aiResolutionRate}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-[#0B5D1E] bg-gradient-to-br from-white to-[#DFF5E1]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#01411C]">
              <Target className="w-5 h-5 text-[#0B5D1E]" />
              <span>SLA Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">SLA Compliance</span>
              <Badge className="bg-[#28A745]">{metrics.slaCompliance}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Breaches</span>
              <span className="font-bold text-[#DC3545]">{metrics.breachCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Escalation Rate</span>
              <span className="font-bold text-[#01411C]">{metrics.escalationRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-[#DC3545] bg-gradient-to-br from-white to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#01411C]">
              <AlertTriangle className="w-5 h-5 text-[#DC3545]" />
              <span>Critical Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Open Critical</span>
              <Badge variant="destructive">
                {tickets.filter(t => t.priority === 'Critical' && !['Closed', 'Auto-Resolved'].includes(t.status)).length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">At Risk SLA</span>
              <Badge className="bg-[#FFC107] text-black">
                {tickets.filter(t => t.slaStatus === 'At Risk').length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Escalated</span>
              <Badge className="bg-[#FFC107] text-black">
                {tickets.filter(t => t.status === 'Escalated').length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Impact - Government Style */}
      <Card className="bg-gradient-to-r from-[#6F42C1] to-[#9333ea] text-white border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Bot className="w-6 h-6" />
            <span>AI Automation Impact (مصنوعی ذہانت)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-4xl font-bold">{metrics.aiResolutionRate}%</p>
              <p className="text-sm text-white/90 mt-2">Complaints Auto-Resolved by AI</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-4xl font-bold">
                {tickets.filter(t => t.isAIResolved).length}
              </p>
              <p className="text-sm text-white/90 mt-2">Total AI Resolutions</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-4xl font-bold">
                ~{(tickets.filter(t => t.isAIResolved).length * 2).toFixed(0)}h
              </p>
              <p className="text-sm text-white/90 mt-2">Estimated Time Saved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Government Notice */}
      <Card className="border-2 border-[#01411C] bg-gradient-to-r from-[#DFF5E1] to-white">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-[#01411C] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-[#01411C] mb-2">Blockchain-Ready Audit Trail</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                All complaint data and actions are logged in a secure, blockchain-ready architecture ensuring complete transparency and tamper-proof record keeping. This system maintains ISO 27001 compliance and follows Government of Pakistan data protection standards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}