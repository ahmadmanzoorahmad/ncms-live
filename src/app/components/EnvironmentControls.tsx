// Environment Badge and Role Switcher Component

import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Shield, User, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
export function EnvironmentControls() {
  const { environment, setEnvironment, currentUser, setCurrentUser, canSwitchRoles, users } = useApp();

  const groupedUsers = {
    'Citizens': users.filter(u => u.role === 'Citizen'),
    'Call Center': users.filter(u => u.role === 'Call Center Officer'),
    'Support Agents': users.filter(u => u.role === 'Support Agent'),
    'Field Engineers': users.filter(u => u.role === 'Field Engineer'),
    'Supervisors': users.filter(u => u.role === 'Supervisor'),
    'Department Heads': users.filter(u => u.role === 'Department Head'),
    'Executive': users.filter(u => u.role === 'Executive'),
    'Auditors': users.filter(u => u.role === 'Auditor'),
    'System Admin': users.filter(u => u.role === 'System Admin'),
  };

  return (
    <div className="flex items-center gap-3">
      {/* Environment Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={environment === 'Demo' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setEnvironment('Demo')}
          className={environment === 'Demo' 
            ? 'bg-amber-500 hover:bg-amber-600 text-white' 
            : 'border-amber-300 text-amber-700 hover:bg-amber-50'}
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          Demo
        </Button>
        <Button
          variant={environment === 'Live' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setEnvironment('Live')}
          className={environment === 'Live' 
            ? 'bg-[#01411C] hover:bg-[#0B5D1E] text-white' 
            : 'border-[#01411C]/30 text-[#01411C] hover:bg-[#DFF5E1]'}
        >
          <Shield className="w-4 h-4 mr-1" />
          Live
        </Button>
      </div>

      {/* Environment Badge */}
      <Badge 
        variant="outline" 
        className={environment === 'Demo' 
          ? 'border-amber-400 bg-amber-50 text-amber-700 px-3 py-1' 
          : 'border-[#01411C] bg-[#DFF5E1] text-[#01411C] px-3 py-1'}
      >
        {environment === 'Demo' ? '⚠️ Demo Environment' : '🔒 Live Environment'}
      </Badge>

      {/* Role Switcher - Only in Demo */}
      {canSwitchRoles && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-[#01411C]/30">
              <User className="w-4 h-4 mr-2" />
              {currentUser.role}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 max-h-96 overflow-y-auto">
            <DropdownMenuLabel className="text-[#01411C]">
              Switch Role (Demo Only)
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {Object.entries(groupedUsers).map(([group, users]) => 
              users.length > 0 ? (
                <div key={group}>
                  <DropdownMenuLabel className="text-xs text-gray-500 font-semibold">
                    {group}
                  </DropdownMenuLabel>
                  {users.map(user => (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => setCurrentUser(user)}
                      className={currentUser.id === user.id ? 'bg-[#DFF5E1]' : ''}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                        {user.department && (
                          <span className="text-xs text-[#01411C]">{user.department}</span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </div>
              ) : null
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Current User Display */}
      <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-1.5 border border-[#01411C]/20">
        <div className="w-8 h-8 bg-[#01411C] rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="text-sm">
          <div className="font-semibold text-[#01411C]">{currentUser.name}</div>
          <div className="text-xs text-gray-600">{currentUser.role}</div>
        </div>
      </div>
    </div>
  );
}
