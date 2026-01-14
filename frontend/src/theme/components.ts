import type { Components, Theme } from '@mui/material/styles';

// Modern Luxury テーマ - コンポーネントカスタマイズ

export const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: '#0A0A0A',
        color: '#FFFFFF',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 600,
        padding: '10px 24px',
        transition: 'all 0.2s ease-in-out',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        color: '#0A0A0A',
        '&:hover': {
          background: 'linear-gradient(135deg, #FFE44D 0%, #FFB733 100%)',
        },
      },
      outlined: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
          backgroundColor: 'rgba(255, 215, 0, 0.08)',
        },
      },
      outlinedPrimary: {
        borderColor: '#FFD700',
        color: '#FFD700',
        '&:hover': {
          borderColor: '#FFE44D',
          backgroundColor: 'rgba(255, 215, 0, 0.08)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: '#141414',
        borderRadius: 12,
        border: '1px solid rgba(255, 215, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'rgba(255, 215, 0, 0.3)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: '#141414',
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
      elevation2: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 8,
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#FFD700',
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-root': {
          color: '#B0B0B0',
          '&.Mui-focused': {
            color: '#FFD700',
          },
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: '#0A0A0A',
        borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
        boxShadow: 'none',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: '#0A0A0A',
        borderRight: '1px solid rgba(255, 215, 0, 0.1)',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        margin: '4px 8px',
        '&:hover': {
          backgroundColor: 'rgba(255, 215, 0, 0.08)',
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(255, 215, 0, 0.15)',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
          },
          '& .MuiListItemIcon-root': {
            color: '#FFD700',
          },
          '& .MuiListItemText-primary': {
            color: '#FFD700',
            fontWeight: 600,
          },
        },
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        color: '#B0B0B0',
        minWidth: 40,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 600,
      },
      filled: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        color: '#FFD700',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: 'rgba(255, 215, 0, 0.1)',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        color: '#B0B0B0',
        '&:hover': {
          backgroundColor: 'rgba(255, 215, 0, 0.08)',
          color: '#FFD700',
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: '#1E1E1E',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        borderRadius: 6,
        fontSize: '0.75rem',
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        color: '#FFD700',
      },
    },
  },
  MuiBadge: {
    styleOverrides: {
      colorPrimary: {
        backgroundColor: '#FFD700',
        color: '#0A0A0A',
      },
    },
  },
};
