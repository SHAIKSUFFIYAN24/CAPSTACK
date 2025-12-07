'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Typography, 
  Button, 
  Container, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Chip,
  useTheme,
  Avatar,
  alpha,
  keyframes,
} from '@mui/material';
import { 
  Security, 
  TrendingDown, 
  AccountBalanceWallet, 
  Psychology,
  ArrowForward,
  Shield,
  BarChart,
  Bolt,
  Check,
  Star
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const StyledFeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 248, 255, 0.5) 100%)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${slideInUp} 0.6s ease-out forwards`,
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: `0 25px 50px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: theme.palette.primary.main,
  },
}));

const HeroGradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #007AF7 0%, #6C63FF 100%)',
  borderRadius: 24,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    animation: `${float} 20s ease-in-out infinite`,
  },
}));

const FeatureCard = ({ icon, title, description, index }: { icon: React.ReactNode, title: string, description: string, index?: number }) => (
  <StyledFeatureCard elevation={0} sx={{ animationDelay: `${(index || 0) * 0.1}s` }}>
    <CardContent sx={{ p: 4 }}>
      <Box sx={{
        width: 56,
        height: 56,
        borderRadius: 12,
        background: 'linear-gradient(135deg, rgba(0, 122, 247, 0.1), rgba(108, 99, 255, 0.1))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'primary.main',
        mb: 2,
        fontSize: 28
      }}>
        {icon}
      </Box>
      <Typography variant="h6" fontWeight="700" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {description}
      </Typography>
    </CardContent>
  </StyledFeatureCard>
);

const StatBox = ({ number, label, icon }: { number: string, label: string, icon?: React.ReactNode }) => (
  <Box sx={{ textAlign: 'center', p: 3 }}>
    <Box sx={{ fontSize: 32, mb: 1, color: 'primary.main' }}>
      {icon}
    </Box>
    <Typography variant="h5" fontWeight="800" sx={{
      background: 'linear-gradient(135deg, #007AF7 0%, #6C63FF 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}>
      {number}
    </Typography>
    <Typography variant="caption" fontWeight="600" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.5 }}>
      {label}
    </Typography>
  </Box>
);

export default function Home() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>CapStack | The Smart Financial Safety Net</title>
        <meta name="description" content="AI-powered financial safety net for unstable markets. Automate savings, monitor spending, survive financially with AI insights." />
        <meta property="og:image" content="/capstack-og.png" />
      </Head>

      {/* 1. HERO SECTION */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(240, 248, 255, 0.7) 100%)',
        pt: { xs: 8, md: 16 }, 
        pb: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -150,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.08)}, transparent)`,
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            
            {/* Hero Text */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Chip 
                    icon={<Bolt sx={{ fontSize: 16 }} />}
                    label="AI-Powered Financial Defense" 
                    sx={{
                      mb: 3,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  />
                </Box>

                <Box>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    fontWeight="900" 
                    sx={{
                      mb: 2,
                      lineHeight: 1.2,
                      fontSize: { xs: '2.2rem', md: '3.5rem' },
                    }}
                  >
                    Build Your Safety Net
                    <Box component="span" sx={{
                      display: 'block',
                      background: 'linear-gradient(135deg, #007AF7 0%, #6C63FF 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Before the Market Shifts
                    </Box>
                  </Typography>
                </Box>

                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{
                    mb: 2,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    maxWidth: 550,
                  }}
                >
                  In an era of layoffs and inflation, CapStack acts as your personal <strong>Financial Data Scientist</strong>. We automate your emergency funds, block risky spending, and stabilize your future.
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    component={Link} 
                    href="/onboarding"
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 1.75,
                      px: 4,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #007AF7 0%, #6C63FF 100%)',
                    }}
                  >
                    Start My Audit
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    href="#how-it-works"
                    sx={{
                      py: 1.75,
                      px: 4,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 700,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    How It Works
                  </Button>
                </Stack>
              </Stack>

              {/* Trust Indicators */}
              <Stack 
                direction="row" 
                spacing={4} 
                sx={{
                  mt: 8,
                  pt: 6,
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                }}
              >
                <StatBox number="4k+" label="Jobs Tracked" icon={<BarChart />} />
                <StatBox number="24/7" label="AI Monitoring" icon={<Shield />} />
                <StatBox number="100%" label="Transparent" icon={<Check />} />
              </Stack>
            </Grid>

            {/* Hero Visual */}
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <HeroGradientBox sx={{ width: '100%', height: 500, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  {/* Floating Cards for effect */}
                  <Card 
                    sx={{
                      position: 'absolute',
                      top: '15%',
                      right: '10%',
                      maxWidth: 240,
                      boxShadow: `0 25px 50px ${alpha('#000', 0.15)}`,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha('#fff', 0.3)}`,
                      animation: `${float} 6s ease-in-out infinite`,
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'success.main',
                        }}>
                          <Security fontSize="small" />
                        </Box>
                        <Typography variant="subtitle2" fontWeight="700">Emergency Fund</Typography>
                      </Stack>
                      <Typography variant="h6" fontWeight="800" sx={{ mb: 0.5 }}>₹ 1,50,000</Typography>
                      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>↑ 12% this month</Typography>
                    </CardContent>
                  </Card>

                  {/* Second floating card */}
                  <Card 
                    sx={{
                      position: 'absolute',
                      bottom: '20%',
                      left: '5%',
                      maxWidth: 240,
                      boxShadow: `0 25px 50px ${alpha('#000', 0.15)}`,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha('#fff', 0.3)}`,
                      animation: `${float} 8s ease-in-out infinite 0.5s`,
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(0, 122, 247, 0.1), rgba(0, 122, 247, 0.05))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.main',
                        }}>
                          <BarChart fontSize="small" />
                        </Box>
                        <Typography variant="subtitle2" fontWeight="700">Health Score</Typography>
                      </Stack>
                      <Typography variant="h6" fontWeight="800" sx={{ mb: 0.5 }}>87/100</Typography>
                      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>Secure</Typography>
                    </CardContent>
                  </Card>
                </Box>
              </HeroGradientBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. FEATURES SECTION */}
      <Box sx={{ py: 12, bgcolor: 'background.default', position: 'relative' }} id="how-it-works">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Chip 
              label="Why CapStack" 
              size="small"
              sx={{
                mb: 3,
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            />
            <Typography 
              variant="h3" 
              fontWeight="900"
              sx={{
                mt: 2,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.8rem' },
                lineHeight: 1.2,
              }}
            >
              Survive the Unstable Market Reality
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{
                maxWidth: 600,
                mx: 'auto',
                fontSize: '1.05rem',
                lineHeight: 1.8,
              }}
            >
              Traditional banking is scattered. We bring your data together to enforce discipline and build a fortress around your income.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={<TrendingDown />}
                title="Automated Spending Blocks"
                description="Our algorithms detect weak control over money flow and automatically block discretionary spending when your safety score drops."
                index={0}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={<Psychology />}
                title="AI Financial Scientist"
                description="We analyze global layoff trends and inflation data to adjust your 'Survival Ratio'—balancing SIPs, stocks, and cash daily."
                index={1}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={<AccountBalanceWallet />}
                title="Full Traceability"
                description="End-to-end tracking of every rupee. No scattered platforms. Just one integrated dashboard for your total financial health."
                index={2}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. CTA SECTION */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <HeroGradientBox sx={{
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            color: 'white',
            boxShadow: `0 25px 50px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}>
            <Typography 
              variant="h3" 
              fontWeight="900" 
              gutterBottom
              sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
            >
              Ready to Secure Your Future?
            </Typography>
            <Typography 
              variant="body1" 
              sx={{
                mb: 4,
                opacity: 0.95,
                maxWidth: 500,
                mx: 'auto',
                fontSize: '1.05rem',
                lineHeight: 1.8,
              }}
            >
              Join thousands of young professionals building their safety net today. Start your free financial audit now.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              component={Link}
              href="/onboarding"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 800,
                py: 1.5,
                px: 5,
                fontSize: '1rem',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: alpha('#fff', 0.9),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 15px 30px ${alpha('#000', 0.1)}`,
                }
              }}
            >
              Create Free Account
            </Button>
          </HeroGradientBox>
        </Container>
      </Box>
    </>
  );
}