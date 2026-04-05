// SLA Timer Component - Real-time countdown

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { SLAEngine } from '../services/sla-engine';
import { SLAStatus } from '../types';
import { Badge } from './ui/badge';

interface SLATimerProps {
  deadline: Date;
  slaStatus: SLAStatus;
  showIcon?: boolean;
  compact?: boolean;
}

export function SLATimer({ deadline, slaStatus, showIcon = true, compact = false }: SLATimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(SLAEngine.getTimeRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(SLAEngine.getTimeRemaining(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  const getStatusColor = () => {
    switch (slaStatus) {
      case 'On Track':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Breached':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTime = () => {
    const { hours, minutes, seconds, isOverdue } = timeRemaining;
    if (compact) {
      return isOverdue 
        ? `Overdue by ${hours}h ${minutes}m`
        : `${hours}h ${minutes}m`;
    }
    return isOverdue 
      ? `Overdue by ${hours}h ${minutes}m ${seconds}s`
      : `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className={`flex items-center space-x-2 ${compact ? 'text-sm' : ''}`}>
      {showIcon && (
        <div className={`${slaStatus === 'Breached' || slaStatus === 'At Risk' ? 'text-red-500' : 'text-gray-400'}`}>
          {slaStatus === 'Breached' || slaStatus === 'At Risk' ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Clock className="w-4 h-4" />
          )}
        </div>
      )}
      <Badge className={`${getStatusColor()} border font-mono`}>
        {formatTime()}
      </Badge>
      <Badge variant="outline" className="text-xs">
        {slaStatus}
      </Badge>
    </div>
  );
}
