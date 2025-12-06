'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  LinearProgress,
  Divider,
  useTheme,
  Button,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  Fade,
  Grow,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Savings,
  Warning,
  CheckCircle,
  Notifications,
  Refresh,
  Timeline,
  PieChart,
  BarChart,
  ArrowForward,
  ShowChart,
  Shield,
  Assessment
} from '@mui/icons-material';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

import HealthScoreCard from '@/components/HealthScoreCard';
import AlertsPanel from '@/components/AlertsPanel';
import { useAuth } from '@/context/AuthContext';

// 🔥 Use token-enabled axios client
import api from "@/utils/axiosClient";

// --------- STYLED COMPONENTS ---------
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: '0.3s ease',
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
    borderColor: theme.palette.primary.main
  }
}));

const MetricCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
});

const AnimatedNumber = ({ value, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setDisplayValue(value), 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Typography variant="h3" fontWeight="800" color="primary">
      {prefix}
      {displayValue}
      {suffix}
    </Typography>
  );
};

const StatusChip: React.FC<{ value: number; maxValue?: number }> = ({ value, maxValue = 100 }) => {
  type StatusKey = 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';

  const percentage = (value / maxValue) * 100;
  const status: StatusKey =
    percentage >= 80
      ? 'Excellent'
      : percentage >= 60
      ? 'Good'
      : percentage >= 40
      ? 'Fair'
      : 'Needs Attention';

  const statusColors: Record<StatusKey, 'success' | 'primary' | 'warning' | 'error'> = {
    Excellent: 'success',
    Good: 'primary',
    Fair: 'warning',
    'Needs Attention': 'error'
  };

  const linearColor = statusColors[status];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          flexGrow: 1,
          height: 10,
          borderRadius: 5
        }}
        color={linearColor}
      />
      <Chip label={status} size="small" color={linearColor} sx={{ fontWeight: 'bold' }} />
    </Box>
  );
};

// --------- DASHBOARD ---------

interface DashboardData {
  healthScore: any;
  survival: any;
  incomeScore: any;
  savings: any;
  insights: any;
}

export default function Dashboard() {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [healthRes, survivalRes, incomeRes, savingsRes, insightsRes] = await Promise.all([
        api.get("/finance/healthscore"),
        api.get("/finance/survival"),
        api.get("/finance/incomescore"),
        api.get("/savings/status"),
        api.get("/finance/insights")
      ]);

      setData({
        healthScore: healthRes.data,
        survival: survivalRes.data,
        incomeScore: incomeRes.data,
        savings: savingsRes.data,
        insights: insightsRes.data
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please check backend and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 800);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6">Loading your financial dashboard...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="h6">Connection Error</Typography>
          {error}
        </Alert>
        <Box textAlign="center">
          <Button variant="contained" onClick={fetchDashboardData}>Retry</Button>
        </Box>
      </Container>
    );
  }

  if (!data) return null;

  // Transform alerts for AlertsPanel
  const alerts = data.insights.alerts.map(alert => ({
    id: Number(alert.id),
    message: alert.message,
    type: alert.type,
    timestamp: alert.timestamp
  }));

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.grey[100]})`,
          minHeight: "100vh"
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: "white",
              position: "relative"
            }}
          >
            <Box sx={{ position: "absolute", top: -40, right: -40, opacity: 0.1 }}>
              <Timeline sx={{ fontSize: 180 }} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h3" fontWeight="800">
                  Financial Command Center
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  AI-Powered Financial Intelligence at Your Fingertips
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Tooltip title="Refresh Data">
                  <IconButton onClick={handleRefresh} sx={{ color: "white" }}>
                    <Refresh sx={{ transform: refreshing ? "rotate(360deg)" : "none", transition: "0.5s" }} />
                  </IconButton>
                </Tooltip>
                <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }}>
                  <AccountBalance />
                </Avatar>
              </Stack>
            </Box>
          </Paper>
        </Box>

        {/* ---- TOP METRICS GRID ---- */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Health Score */}
          <Grid item xs={12} md={6} lg={3}>
            <Grow in timeout={500}>
              <StyledCard>
                <MetricCardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Financial Health Score
                  </Typography>
                  <AnimatedNumber value={data.healthScore.score} suffix="/100" />
                  <StatusChip value={data.healthScore.score} />
                </MetricCardContent>
              </StyledCard>
            </Grow>
          </Grid>

          {/* Emergency Months */}
          <Grid item xs={12} md={6} lg={3}>
            <Grow in timeout={700}>
              <StyledCard>
                <MetricCardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Emergency Fund Coverage
                  </Typography>
                  <AnimatedNumber value={data.survival.months} suffix=" Months" />
                  <StatusChip value={data.survival.months} maxValue={12} />
                </MetricCardContent>
              </StyledCard>
            </Grow>
          </Grid>

          {/* Auto Saved */}
          <Grid item xs={12} md={6} lg={3}>
            <Grow in timeout={900}>
              <StyledCard>
                <MetricCardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Auto-Saved This Month
                  </Typography>
                  <AnimatedNumber value={data.savings.monthlyAutoSave} prefix="₹" />
                  <StatusChip value={data.savings.monthlyAutoSave} maxValue={5000} />
                </MetricCardContent>
              </StyledCard>
            </Grow>
          </Grid>

          {/* Risk Score */}
          <Grid item xs={12} md={6} lg={3}>
            <Grow in timeout={1100}>
              <StyledCard>
                <MetricCardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Risk Mitigation Score
                  </Typography>
                  <AnimatedNumber
                    value={Math.round(data.incomeScore.categoryScores.growth)}
                    suffix="%"
                  />
                  <StatusChip value={Math.round(data.incomeScore.categoryScores.growth)} />
                </MetricCardContent>
              </StyledCard>
            </Grow>
          </Grid>
        </Grid>

        {/* ----- DETAILS + ALERTS ----- */}
        <Grid container spacing={4}>
          {/* Detailed Health Score */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={1300}>
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                  Detailed Health Analysis
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <HealthScoreCard
                      score={Math.round(data.healthScore.categoryScores.stability)}
                      category="Income Stability"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <HealthScoreCard
                      score={Math.round(data.healthScore.categoryScores.expenseManagement)}
                      category="Expense Control"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <HealthScoreCard
                      score={Math.round(data.healthScore.categoryScores.savings)}
                      category="Savings Discipline"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <HealthScoreCard
                      score={Math.round(data.healthScore.categoryScores.emergencyPreparedness)}
                      category="Emergency Preparedness"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          </Grid>

          {/* AI Alerts */}
          <Grid item xs={12} lg={4}>
            <Fade in timeout={1500}>
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                  AI Alerts & Insights
                </Typography>
                <AlertsPanel alerts={alerts} />
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* ----- CHARTS SECTION ----- */}
        <Box sx={{ mt: 8, mb: 6 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 4 }}>
            Financial Visualization
          </Typography>

          <Grid container spacing={4}>
            {/* Health Score Breakdown - Pie Chart */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1700}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Health Score Breakdown
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={[
                            { name: 'Stability', value: Math.round(data.healthScore.categoryScores.stability) },
                            { name: 'Expense Mgmt', value: Math.round(data.healthScore.categoryScores.expenseManagement) },
                            { name: 'Savings', value: Math.round(data.healthScore.categoryScores.savings) },
                            { name: 'Emergency Prep', value: Math.round(data.healthScore.categoryScores.emergencyPreparedness) }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                        >
                          <Cell fill={theme.palette.primary.main} />
                          <Cell fill={theme.palette.success.main} />
                          <Cell fill={theme.palette.warning.main} />
                          <Cell fill={theme.palette.error.main} />
                        </Pie>
                      </RechartsPie>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Income vs Expenses - Bar Chart */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1900}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Income vs Expenses
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsBar data={[
                        {
                          name: 'Monthly',
                          income: data.healthScore.categoryScores.stability * 100,
                          expenses: (100 - data.healthScore.categoryScores.expenseManagement) * 100
                        }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="income" fill={theme.palette.success.main} />
                        <Bar dataKey="expenses" fill={theme.palette.error.main} />
                      </RechartsBar>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Savings Progress - Line Chart */}
            <Grid item xs={12}>
              <Fade in timeout={2100}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Savings Progress Trend
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={[
                        { month: 'Month 1', savings: data.savings.monthlyAutoSave * 0.8 },
                        { month: 'Month 2', savings: data.savings.monthlyAutoSave * 0.9 },
                        { month: 'Month 3', savings: data.savings.monthlyAutoSave }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                        <Legend />
                        <Line type="monotone" dataKey="savings" stroke={theme.palette.primary.main} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Box>

        {/* ----- Navigation Quick Actions ----- */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 4 }}>
            Quick Actions & Navigation
          </Typography>

          <Grid container spacing={3}>
            {/* Assessment Button */}
            <Grid item xs={12} sm={6} md={3}>
              <Fade in timeout={200}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: '0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}
                  onClick={() => router.push('/assessment')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Assessment sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Financial Assessment
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Evaluate your financial stability
                    </Typography>
                    <Stack direction="row" justifyContent="center">
                      <ArrowForward sx={{ fontSize: 20, color: 'info.main' }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Allocation Button */}
            <Grid item xs={12} sm={6} md={3}>
              <Fade in timeout={300}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: '0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}
                  onClick={() => router.push('/allocation')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <PieChart sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Asset Allocation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      AI-powered portfolio optimization
                    </Typography>
                    <Stack direction="row" justifyContent="center">
                      <ArrowForward sx={{ fontSize: 20, color: 'secondary.main' }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Emergency Fund Button */}
            <Grid item xs={12} sm={6} md={3}>
              <Fade in timeout={500}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: '0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}
                  onClick={() => router.push('/emergency')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Shield sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Emergency Fund
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Monitor your safety net
                    </Typography>
                    <Stack direction="row" justifyContent="center">
                      <ArrowForward sx={{ fontSize: 20, color: 'warning.main' }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Savings Button */}
            <Grid item xs={12} sm={6} md={3}>
              <Fade in timeout={700}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: '0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}
                  onClick={() => router.push('/savings')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Savings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Savings Plans
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Manage and lock your savings
                    </Typography>
                    <Stack direction="row" justifyContent="center">
                      <ArrowForward sx={{ fontSize: 20, color: 'primary.main' }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Insights Button */}
            <Grid item xs={12} sm={6} md={3}>
              <Fade in timeout={700}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: '0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}
                  onClick={() => router.push('/insights')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <BarChart sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Insights & Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Deep dive into your finances
                    </Typography>
                    <Stack direction="row" justifyContent="center">
                      <ArrowForward sx={{ fontSize: 20, color: 'success.main' }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Emergency Fund Button */}
            <Grid item xs={12} sm={6} md={3}>
              <Fade in timeout={900}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: '0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}
                  onClick={() => router.push('/dashboard')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Notifications sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Emergency Fund
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {data.survival.months} months coverage
                    </Typography>
                    <Stack direction="row" justifyContent="center">
                      <ArrowForward sx={{ fontSize: 20, color: 'warning.main' }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Export / Download Button */}
            <Grid item xs={12} sm={6} md={3}>
              <Fade in timeout={1100}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: '0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}
                  onClick={handleRefresh}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Refresh sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Refresh Data
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Update all metrics
                    </Typography>
                    <Stack direction="row" justifyContent="center">
                      <CheckCircle sx={{ fontSize: 20, color: 'info.main' }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
