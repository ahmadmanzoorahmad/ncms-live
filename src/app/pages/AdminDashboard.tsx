// System Admin Dashboard

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockDepartments } from '../data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Settings, Users, Shield, Database, Activity,
  CheckCircle, AlertCircle, UserPlus, Lock, X
} from 'lucide-react';
import { toast } from 'sonner';
import type { UserRole } from '../types';

export default function AdminDashboard() {
  const { environment, users, addUser } = useApp();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [slaConfig, setSlaConfig] = useState({
    Critical: 4, High: 24, Medium: 72, Low: 168,
  });

  // Add user form
  const [newUser, setNewUser] = useState({
    name: '', email: '', role: 'Support Agent' as UserRole, department: 'Technical Support',
  });
  const [addingUser, setAddingUser] = useState(false);

  const totalUsers = users.length;
  const totalDepts = mockDepartments.length;

  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSaveConfig = () => {
    toast.success('System configuration saved successfully');
  };

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    // Check for duplicate email
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      toast.error('A user with this email already exists');
      return;
    }
    setAddingUser(true);
    const createdUser = {
      id: `USR-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      role: newUser.role,
      department: newUser.department || null,
    };
    setTimeout(() => {
      addUser(createdUser);
      setAddingUser(false);
      setShowAddUserModal(false);
      setNewUser({ name: '', email: '', role: 'Support Agent', department: 'Technical Support' });
      toast.success(`User "${createdUser.name}" added successfully`);
    }, 600);
  };

  const handleDisableUser = (userName: string) => {
    toast.warning(`User "${userName}" has been disabled (Demo Mode)`);
  };

  const handleEditUser = (userName: string) => {
    toast.info(`Editing "${userName}" — feature available in Live Mode`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#0B5D1E] text-white rounded-lg p-6 shadow-lg border-l-4 border-[#1F7A3A]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Admin Dashboard</h1>
            <p className="text-white/90 mt-1">سسٹم ایڈمن ڈیش بورڈ • Complete System Control</p>
            <p className="text-sm text-white/70 mt-1">Full Access • {environment} Mode</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
            <p className="text-xs text-white/80">System Status</p>
            <p className="text-lg font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Departments', value: totalDepts, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Active Roles', value: Object.keys(usersByRole).length, icon: Database, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#01411C]">Add New User</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddUserModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                placeholder="Full Name *"
                value={newUser.name}
                onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))}
                className="border-[#01411C]/20 focus:border-[#01411C]"
              />
              <Input
                placeholder="Email Address *"
                type="email"
                value={newUser.email}
                onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
                className="border-[#01411C]/20 focus:border-[#01411C]"
              />
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser(u => ({ ...u, role: e.target.value as UserRole }))}
                  className="w-full p-2.5 border-2 border-[#01411C]/20 rounded-lg focus:border-[#01411C] outline-none text-sm"
                >
                  {(['Citizen', 'Call Center Officer', 'Support Agent', 'Field Engineer', 'Supervisor', 'Department Head', 'Executive', 'Auditor', 'System Admin'] as UserRole[]).map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Department</label>
                <select
                  value={newUser.department}
                  onChange={e => setNewUser(u => ({ ...u, department: e.target.value }))}
                  className="w-full p-2.5 border-2 border-[#01411C]/20 rounded-lg focus:border-[#01411C] outline-none text-sm"
                >
                  {mockDepartments.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddUserModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#01411C] hover:bg-[#0B5D1E]"
                onClick={handleAddUser}
                disabled={addingUser}
              >
                {addingUser ? 'Adding...' : 'Add User'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="bg-[#DFF5E1]">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            System Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            User Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            Role Matrix
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* System Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-[#01411C]/20">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Environment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#DFF5E1] rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Current Mode</p>
                    <p className="font-semibold text-[#01411C]">{environment}</p>
                  </div>
                  <Badge className={environment === 'Demo' ? 'bg-amber-500' : 'bg-[#01411C]'}>
                    {environment === 'Demo' ? '⚠️ Demo' : '🔒 Live'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Role Switching</p>
                    <p className="font-semibold text-blue-900">{environment === 'Demo' ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  <Lock className={environment === 'Demo' ? 'w-5 h-5 text-amber-600' : 'w-5 h-5 text-green-600'} />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">AI Analysis</p>
                    <p className="font-semibold text-green-800">Active</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Blockchain Audit</p>
                    <p className="font-semibold text-green-800">Ready</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#01411C]/20">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Distribution by Role
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(usersByRole).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{role}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-28 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-[#01411C] rounded-full"
                          style={{ width: `${(count / totalUsers) * 100}%` }}
                        />
                      </div>
                      <Badge variant="outline" className="border-[#01411C]/30 text-[#01411C] text-xs">{count}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C]">Department Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockDepartments.map(dept => {
                  const deptUsers = users.filter(u => u.department === dept.name);
                  return (
                    <div key={dept.id} className="p-4 border border-[#01411C]/20 rounded-xl bg-gradient-to-br from-white to-[#DFF5E1]/20">
                      <h4 className="font-semibold text-[#01411C] mb-3">{dept.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Staff Accounts</span>
                          <Badge variant="outline" className="border-[#01411C]/30 text-xs">{deptUsers.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category</span>
                          <span className="text-[#01411C] font-medium text-xs">{dept.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users">
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#01411C]">All System Users ({totalUsers})</CardTitle>
                <Button
                  className="bg-[#01411C] hover:bg-[#0B5D1E]"
                  onClick={() => setShowAddUserModal(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-[#01411C]/20 rounded-xl hover:bg-[#DFF5E1]/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-[#01411C] rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#01411C]">{user.name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs border-[#01411C]/30 text-[#01411C]">{user.role}</Badge>
                          {user.department && (
                            <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">{user.department}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-[#01411C]/30 text-[#01411C]" onClick={() => handleEditUser(user.name)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDisableUser(user.name)}>
                        Disable
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Matrix */}
        <TabsContent value="roles">
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C]">Role-Based Access Control Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#01411C]">
                      <th className="text-left p-3 font-semibold text-[#01411C]">Role</th>
                      {['Create', 'View', 'Edit', 'Assign', 'Escalate', 'Close'].map(h => (
                        <th key={h} className="text-center p-3 font-semibold text-[#01411C]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: 'Citizen',           create: true,  view: true,  edit: false, assign: false, escalate: false, close: false },
                      { role: 'Call Center Officer',create: true,  view: true,  edit: true,  assign: false, escalate: false, close: false },
                      { role: 'Support Agent',      create: false, view: true,  edit: true,  assign: false, escalate: true,  close: true  },
                      { role: 'Field Engineer',     create: false, view: true,  edit: true,  assign: false, escalate: false, close: false },
                      { role: 'Supervisor',         create: false, view: true,  edit: true,  assign: true,  escalate: true,  close: true  },
                      { role: 'Department Head',    create: false, view: true,  edit: true,  assign: true,  escalate: true,  close: true  },
                      { role: 'Executive',          create: false, view: true,  edit: false, assign: false, escalate: false, close: false },
                      { role: 'Auditor',            create: false, view: true,  edit: false, assign: false, escalate: false, close: false },
                      { role: 'System Admin',       create: true,  view: true,  edit: true,  assign: true,  escalate: true,  close: true  },
                    ].map((row) => (
                      <tr key={row.role} className="border-b border-gray-200 hover:bg-[#DFF5E1]/20">
                        <td className="p-3 font-medium text-[#01411C]">{row.role}</td>
                        {['create', 'view', 'edit', 'assign', 'escalate', 'close'].map(col => (
                          <td key={col} className="text-center p-3">
                            {(row as any)[col]
                              ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                              : <AlertCircle className="w-5 h-5 text-gray-300 mx-auto" />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="settings">
          <Card className="border-[#01411C]/20">
            <CardHeader>
              <CardTitle className="text-[#01411C] flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-[#01411C] mb-3">SLA Configuration (hours)</h4>
                <div className="space-y-3">
                  {(Object.entries(slaConfig) as [string, number][]).map(([priority, hours]) => (
                    <div key={priority} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-800 w-28">{priority} Priority</span>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={hours}
                          onChange={(e) => setSlaConfig(s => ({ ...s, [priority]: parseInt(e.target.value) || hours }))}
                          className="w-24 p-2 border-2 border-[#01411C]/20 rounded-lg text-center text-sm focus:border-[#01411C] outline-none"
                          min={1}
                        />
                        <span className="text-sm text-gray-500">hours</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#01411C] mb-3">Demo Mode Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="text-sm font-medium">Allow Role Switching</span>
                    <Badge className="bg-amber-500">Enabled in Demo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-sm font-medium">Sample / Mock Data</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-sm font-medium">AI Analysis Engine</span>
                    <Badge className="bg-blue-600">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <span className="text-sm font-medium">Blockchain Audit Trail</span>
                    <Badge className="bg-purple-600">Ready</Badge>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-[#01411C] hover:bg-[#0B5D1E] py-6 text-base font-semibold"
                onClick={handleSaveConfig}
              >
                <Settings className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
