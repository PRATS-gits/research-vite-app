export type StatusCardType = 'library' | 'agents' | 'connections' | 'status';

export interface StatusCard {
  id: string;
  type: StatusCardType;
  title: string;
  value: string | number;
  description: string;
  icon: string;
  navigateTo: string;
  status: 'operational' | 'warning' | 'error';
  color: 'blue' | 'green' | 'yellow' | 'red';
}

export interface ConnectionStatus {
  service: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
}

export interface StatusCardProps {
  card: StatusCard;
  onClick: (navigateTo: string) => void;
}

export interface StatusGridProps {
  cards: StatusCard[];
  onCardClick: (navigateTo: string) => void;
}

export interface WelcomeMessageProps {
  userName?: string;
  showWaveEmoji?: boolean;
  className?: string;
}