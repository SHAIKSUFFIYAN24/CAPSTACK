import { logger } from '../utils/logger';
import { DatabaseService } from './databaseService';
import { query } from '../config/db';

interface SavingsPlan {
  id: number;
  userId: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  lockPercentage: number; // 0-1, how much to auto-lock
  unlockConditions: string[];
  createdAt: Date;
  targetDate?: Date;
}

interface DisciplineProtocol {
  spendingLimits: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  categoryBlocks: string[]; // Categories to block spending on
  autoSavePercentage: number; // Percentage of income to auto-save
  emergencyBuffer: number; // Minimum emergency fund before allowing discretionary spending
  rewardSystem: boolean; // Enable rewards for good behavior
}

interface Transaction {
  id: number;
  userId: number;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  timestamp: Date;
}

export const createDisciplineProtocol = (userId: number, protocol: DisciplineProtocol) => {
  // TODO: Store protocol in database
  logger.info(`Created discipline protocol for user ${userId}`);
  return { success: true, protocolId: Date.now() };
};

export const checkSpendingLimit = (userId: number, transaction: Transaction): { allowed: boolean; reason?: string } => {
  // TODO: In production, fetch real user data and protocol
  const mockProtocol: DisciplineProtocol = {
    spendingLimits: { daily: 2000, weekly: 10000, monthly: 35000 },
    categoryBlocks: ['entertainment', 'dining_out'],
    autoSavePercentage: 0.25,
    emergencyBuffer: 200000,
    rewardSystem: true
  };

  // Check category blocks
  if (mockProtocol.categoryBlocks.includes(transaction.category)) {
    return { allowed: false, reason: `Spending blocked on ${transaction.category} category due to discipline protocol` };
  }

  // Check spending limits (simplified - would need real transaction history)
  if (transaction.amount > mockProtocol.spendingLimits.daily) {
    return { allowed: false, reason: `Transaction exceeds daily spending limit of ₹${mockProtocol.spendingLimits.daily}` };
  }

  return { allowed: true };
};

export const autoSaveIncome = (userId: number, incomeAmount: number) => {
  const autoSavePercentage = 0.25; // 25% auto-save
  const saveAmount = Math.floor(incomeAmount * autoSavePercentage);

  // TODO: Transfer to locked savings account
  logger.info(`Auto-saving ₹${saveAmount} from income of ₹${incomeAmount} for user ${userId}`);

  return {
    success: true,
    savedAmount: saveAmount,
    lockedAmount: Math.floor(saveAmount * 0.8), // 80% locked
    availableAmount: Math.floor(saveAmount * 0.2)  // 20% available
  };
};

export const lockSavings = (userId: number, amount: number, reason: string = 'auto_lock') => {
  // TODO: Implement actual locking mechanism (banking integration)
  logger.info(`Locking ₹${amount} for user ${userId}, reason: ${reason}`);
  return {
    success: true,
    lockedAmount: amount,
    lockId: Date.now(),
    unlockDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  };
};

export const unlockSavings = (userId: number, lockId: number, reason: string = 'goal_achieved') => {
  // TODO: Check unlock conditions and release funds
  const unlockAmount = 5000; // Mock amount
  logger.info(`Unlocking ₹${unlockAmount} for user ${userId}, lock ${lockId}, reason: ${reason}`);
  return {
    success: true,
    unlockedAmount: unlockAmount,
    remainingLocked: 15000
  };
};

export const getSavingsStatus = async (userId: number) => {
  try {
    // Get user financial data for monthly income
    const userData = await DatabaseService.getUserFinancialData(userId);
    const monthlyIncome = userData?.monthlyIncome || 0;
    const monthlyAutoSave = Math.floor(monthlyIncome * 0.25); // 25% auto-save

    // Get savings plans data
    const plansResult = await query(`
      SELECT
        COALESCE(SUM(current_amount), 0) as total_current,
        COALESCE(SUM(target_amount), 0) as total_target,
        COUNT(*) as plan_count
      FROM savings_plans
      WHERE user_id = $1
    `, [userId]);

    const plansData = plansResult.rows[0];
    const totalSaved = parseFloat(plansData.total_current) || 0;

    // Assume 70% is locked, 30% available (simplified)
    const locked = Math.floor(totalSaved * 0.7);
    const available = totalSaved - locked;

    // Get last transaction date for lastAutoSave
    const lastTransactionResult = await query(`
      SELECT MAX(date) as last_date
      FROM savings_transactions
      WHERE user_id = $1 AND type = 'deposit'
    `, [userId]);

    const lastAutoSave = lastTransactionResult.rows[0]?.last_date
      ? new Date(lastTransactionResult.rows[0].last_date)
      : new Date();

    // Mock discipline score and next unlock date for now
    const disciplineScore = 85;
    const nextUnlockDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return {
      totalSaved,
      locked,
      available,
      monthlyAutoSave,
      disciplineScore,
      lastAutoSave,
      nextUnlockDate
    };
  } catch (error) {
    logger.error(`Failed to get savings status for user ${userId}: ${error}`);
    // Fallback to mock data
    return {
      totalSaved: 25000,
      locked: 18000,
      available: 7000,
      monthlyAutoSave: 6250,
      disciplineScore: 85,
      lastAutoSave: new Date(),
      nextUnlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
  }
};

export const createSavingsPlan = (userId: number, plan: Omit<SavingsPlan, 'id' | 'userId' | 'createdAt'>) => {
  const newPlan: SavingsPlan = {
    ...plan,
    id: Date.now(),
    userId,
    createdAt: new Date()
  };

  // TODO: Save to database
  logger.info(`Created savings plan "${plan.name}" for user ${userId}`);

  return {
    success: true,
    plan: newPlan,
    autoLockScheduled: plan.lockPercentage > 0
  };
};

export const getDisciplineInsights = (userId: number) => {
  // TODO: Analyze spending patterns and provide insights
  return {
    insights: [
      'You saved 15% more this month compared to last month',
      'Entertainment spending is 30% below your limit',
      'Auto-save feature prevented ₹2,500 in impulse spending'
    ],
    recommendations: [
      'Consider increasing auto-save percentage to 30%',
      'Your discipline score improved by 5 points this month',
      'Next milestone: 6 months emergency fund in 45 days'
    ],
    achievements: [
      'Discipline Champion: 30 days of perfect savings',
      'Impulse Blocker: Prevented 15 unnecessary transactions'
    ]
  };
};

export const enforceDisciplineProtocol = (userId: number, transaction: Transaction) => {
  const check = checkSpendingLimit(userId, transaction);

  if (!check.allowed) {
    // Send alert about blocked transaction
    logger.warn(`Transaction blocked for user ${userId}: ${check.reason}`);

    // TODO: Send email notification
    // await sendAlert(userId, 'transaction_blocked', check.reason);

    return {
      blocked: true,
      reason: check.reason,
      alternativeActions: [
        'Use available savings instead',
        'Wait until next pay cycle',
        'Review and adjust spending limits'
      ]
    };
  }

  // If transaction is income, trigger auto-save
  if (transaction.type === 'income') {
    const saveResult = autoSaveIncome(userId, transaction.amount);
    return {
      blocked: false,
      autoSaved: saveResult.savedAmount,
      message: `Transaction approved. ₹${saveResult.savedAmount} automatically saved.`
    };
  }

  return { blocked: false, message: 'Transaction approved' };
};