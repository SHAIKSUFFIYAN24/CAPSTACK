import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Savings,
  Insights,
  AccountBalance,
  Assessment,
  PieChart,
  Shield,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(240, 248, 255, 0.5) 100%)',
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  color: theme.palette.text.primary,
}));

const NavButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -4,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 2,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: 'width 0.3s ease',
    borderRadius: '2px',
  },
  '&:hover::after': {
    width: '80%',
  },
  '&.active': {
    color: theme.palette.primary.main,
    fontWeight: 600,
    '&::after': {
      width: '80%',
    },
  },
}));

const UserMenuButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  padding: '6px 12px',
  borderRadius: 8,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.text.primary,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
  },
}));

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUserMenuAnchor(null);
    router.push('/auth/login');
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <Dashboard sx={{ fontSize: 20 }} /> },
    { label: 'Assessment', href: '/assessment', icon: <Assessment sx={{ fontSize: 20 }} /> },
    { label: 'Allocation', href: '/allocation', icon: <PieChart sx={{ fontSize: 20 }} /> },
    { label: 'Emergency', href: '/emergency', icon: <Shield sx={{ fontSize: 20 }} /> },
    { label: 'Savings', href: '/savings', icon: <Savings sx={{ fontSize: 20 }} /> },
    { label: 'Insights', href: '/insights', icon: <Insights sx={{ fontSize: 20 }} /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'primary.main',
            fontWeight: 800,
          }}
        >
          <AccountBalance />
          CapStack
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 2 }}>
        {isAuthenticated && navItems.map((item) => (
          <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={router.pathname === item.href}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 1,
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.16),
                  },
                },
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', color: 'inherit' }}>
                {item.icon}
              </Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {!isAuthenticated && (
          <>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href="/auth/login"
                onClick={handleDrawerToggle}
                sx={{ borderRadius: 1, mx: 1 }}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href="/auth/register"
                onClick={handleDrawerToggle}
                sx={{ borderRadius: 1, mx: 1 }}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      {isAuthenticated && (
        <>
          <Divider sx={{ my: 2 }} />
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleDrawerToggle();
                handleLogout();
              }}
              sx={{ borderRadius: 1, mx: 1, color: 'error.main' }}
            >
              <LogoutIcon sx={{ mr: 2 }} />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </Box>
  );

  return (
    <>
      <StyledAppBar position="sticky" elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 0,
              mr: { xs: 2, md: 4 },
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #007AF7 0%, #6C63FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '1.4rem',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <AccountBalance sx={{ fontSize: 28, background: 'linear-gradient(135deg, #007AF7 0%, #6C63FF 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
            CapStack
          </Typography>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ transition: 'transform 0.2s ease', '&:hover': { transform: 'rotate(90deg)' } }}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <>
              {isAuthenticated && (
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 0.5 }}>
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                      <NavButton
                        startIcon={item.icon}
                        className={router.pathname === item.href ? 'active' : ''}
                        sx={{
                          color: router.pathname === item.href ? 'primary.main' : 'text.primary',
                          fontWeight: router.pathname === item.href ? 600 : 500,
                        }}
                      >
                        {item.label}
                      </NavButton>
                    </Link>
                  ))}
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {isAuthenticated ? (
                  <>
                    <UserMenuButton
                      onClick={handleUserMenuOpen}
                      endIcon={<KeyboardArrowDown sx={{ fontSize: 18 }} />}
                    >
                      <Avatar sx={{ width: 28, height: 28, mr: 1, fontSize: '0.9rem', background: 'linear-gradient(135deg, #007AF7 0%, #6C63FF 100%)' }}>
                        {user?.email?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email || 'User'}
                      </Typography>
                    </UserMenuButton>
                    <Menu
                      anchorEl={userMenuAnchor}
                      open={Boolean(userMenuAnchor)}
                      onClose={handleUserMenuClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      slotProps={{
                        paper: {
                          sx: {
                            mt: 1,
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                            borderRadius: 2,
                          },
                        },
                      }}
                    >
                      <MenuItem disabled sx={{ py: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {user?.email}
                        </Typography>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleUserMenuClose} component={Link} href="/dashboard">
                        <Dashboard sx={{ mr: 1, fontSize: 20 }} />
                        Dashboard
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1, fontSize: 20, color: 'error.main' }} />
                        <Typography color="error.main">Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      variant="text"
                      component={Link}
                      href="/auth/login"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      component={Link}
                      href="/auth/register"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(240, 248, 255, 0.5) 100%)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;