// Analytics Page - Personal analytics for the current user

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Badge } from '../components/ui/badge';

export default function AnalyticsPage() {
  const { currentUser, tickets } = useApp();
  const { t } = useLanguage();
  
  // Filter user's tickets
  const userTickets = tickets.filter(t => t.createdBy.id === currentUser.id);
  
  // Calculate statistics
  const totalTickets = userTickets.length;
  const resolvedTickets = userTickets.filter(t => ['Resolved', 'Auto-Resolved', 'Closed'].includes(t.status)).length;
  const pendingTickets = userTickets.filter(t => !['Resolved', 'Auto-Resolved', 'Closed'].includes(t.status)).length;
  const criticalTickets = userTickets.filter(t => t.priority === 'Critical').length;
  
  // Resolution rate
  const resolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;
  
  // Average resolution time (mock data)
  const avgResolutionDays = 3.2;
  
  // Category breakdown
  const categoryStats = userTickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  // Priority breakdown
  const priorityStats = {
    Critical: userTickets.filter(t => t.priority === 'Critical').length,
    High: userTickets.filter(t => t.priority === 'High').length,
    Medium: userTickets.filter(t => t.priority === 'Medium').length,
    Low: userTickets.filter(t => t.priority === 'Low').length,
  };
  
  // Status breakdown
  const statusStats = userTickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      title: 'Total Tickets',
      value: totalTickets,
      icon: FileText,
      color: 'text-[#01411C]',
      bg: 'bg-[#DFF5E1]',
      change: '+12%',
      changeType: 'increase' as const,
    },
    {
      title: 'Resolution Rate',
      value: `${resolutionRate}%`,
      icon: CheckCircle,
      color: 'text-[#28A745]',
      bg: 'bg-green-50',
      change: '+5%',
      changeType: 'increase' as const,
    },
    {
      title: 'Pending',
      value: pendingTickets,
      icon: Clock,
      color: 'text-[#FFC107]',
      bg: 'bg-amber-50',
      change: '-3%',
      changeType: 'decrease' as const,
    },
    {
      title: 'Avg. Resolution',
      value: `${avgResolutionDays}d`,
      icon: TrendingUp,
      color: 'text-[#007BFF]',
      bg: 'bg-blue-50',
      change: '-0.5d',
      changeType: 'decrease' as const,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#0B5D1E] text-white rounded-lg p-6 shadow-lg border-l-4 border-[#1F7A3A]">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">My Analytics</h1>
            <p className="text-white/90 mt-1">میرے اعدادوشمار • Personal complaint analytics and insights</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-[#01411C]/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-[#01411C] mb-2">{stat.value}</p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className={`w-3 h-3 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`text-xs font-semibold ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500">vs last month</span>
                    </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="border-[#01411C]/20">
          <CardHeader className="border-b border-[#01411C]/10 bg-[#DFF5E1]/30">
            <CardTitle className="text-[#01411C] flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Top Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {topCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topCategories.map(([category, count]) => {
                  const percentage = Math.round((count / totalTickets) * 100);
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-sm font-bold text-[#01411C]">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#01411C] h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="border-[#01411C]/20">
          <CardHeader className="border-b border-[#01411C]/10 bg-[#DFF5E1]/30">
            <CardTitle className="text-[#01411C] flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Priority Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {Object.entries(priorityStats).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Badge className={getPriorityColor(priority)}>
                      {priority}
                    </Badge>
                    <span className="text-sm text-gray-600">tickets</span>
                  </div>
                  <span className="text-xl font-bold text-[#01411C]">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="border-[#01411C]/20">
          <CardHeader className="border-b border-[#01411C]/10 bg-[#DFF5E1]/30">
            <CardTitle className="text-[#01411C] flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Status Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {Object.keys(statusStats).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(statusStats).map(([status, count]) => {
                  const percentage = Math.round((count / totalTickets) * 100);
                  return (
                    <div key={status} className="flex items-center justify-between p-3 rounded-lg border border-[#01411C]/10 hover:bg-[#DFF5E1]/20 transition-colors">
                      <span className="text-sm font-medium text-gray-700">{status}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{percentage}%</span>
                        <span className="text-lg font-bold text-[#01411C]">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Score */}
        <Card className="border-[#01411C]/20 bg-gradient-to-br from-[#DFF5E1]/30 to-white">
          <CardHeader className="border-b border-[#01411C]/10">
            <CardTitle className="text-[#01411C] flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Engagement Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#01411C] text-white mb-4">
                <div>
                  <div className="text-4xl font-bold">{resolutionRate}</div>
                  <div className="text-sm opacity-90">Score</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Your complaint engagement and resolution tracking score
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-white rounded-lg border border-[#01411C]/10">
                  <div className="text-2xl font-bold text-[#01411C]">{resolvedTickets}</div>
                  <div className="text-xs text-gray-600">Resolved</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#01411C]/10">
                  <div className="text-2xl font-bold text-[#FFC107]">{pendingTickets}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}