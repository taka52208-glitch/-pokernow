import { Chip } from '@mui/material';
import type { CongestionLevel } from '../../types';

interface CongestionBadgeProps {
  level: CongestionLevel;
  size?: 'small' | 'medium';
}

const CONGESTION_CONFIG = {
  low: {
    label: '空き',
    color: '#4CAF50',
    bgColor: 'rgba(76, 175, 80, 0.15)',
  },
  medium: {
    label: 'やや混雑',
    color: '#FFC107',
    bgColor: 'rgba(255, 193, 7, 0.15)',
  },
  high: {
    label: '混雑',
    color: '#F44336',
    bgColor: 'rgba(244, 67, 54, 0.15)',
  },
};

export function CongestionBadge({ level, size = 'small' }: CongestionBadgeProps) {
  const config = CONGESTION_CONFIG[level];

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        color: config.color,
        backgroundColor: config.bgColor,
        fontWeight: 600,
        border: `1px solid ${config.color}`,
      }}
    />
  );
}
