import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  className?: string;
  notificationCount?: number;
  onClick?: () => void;
}

export function NotificationBell({ 
  className, 
  notificationCount = 0, 
  onClick 
}: NotificationBellProps) {
  const hasNotifications = notificationCount > 0;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        'relative h-9 w-9 p-0 hover:bg-accent/50 transition-colors duration-200',
        className
      )}
      aria-label={`Notifications${hasNotifications ? ` (${notificationCount} unread)` : ''}`}
    >
      <Bell className="h-4 w-4" />
      {hasNotifications && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-medium min-w-[1.25rem]"
        >
          {notificationCount > 99 ? '99+' : notificationCount}
        </Badge>
      )}
    </Button>
  );
}