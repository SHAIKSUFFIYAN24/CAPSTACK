import { query } from '../config/db';
import { logger } from '../utils/logger';

// In-memory storage for demo purposes
interface InMemoryUser {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

let inMemoryUsers: InMemoryUser[] = [];
let nextUserId = 1;
let useInMemory = false;

export interface UserFinancialData {
  userId: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  emergencyFund: number;
  debtAmount: number;
  age: number;
  riskTolerance: 'low' | 'medium' | 'high';
  jobStability: number;
  marketConditions: 'bull' | 'bear' | 'neutral';
  inflationRate: number;
}

export interface AssetAllocationData {
  userId: number;
  sipPercentage: number;
  stocksPercentage: number;
  bondsPercentage: number;
  lifestylePercentage: number;
  emergencyFundPercentage: number;
  sipAmount: number;
  stocksAmount: number;
  bondsAmount: number;
  lifestyleAmount: number;
  emergencyAmount: number;
  reasoning: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyFundData {
  userId: number;
  currentBalance: number;
  targetMonths: number;
  monthlyBurnRate: number;
  monthsCoverage: number;
  status: 'excellent' | 'good' | 'adequate' | 'insufficient' | 'critical';
  recommendedAction: string;
  alerts: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class DatabaseService {
  /**
   * Get user financial data from database
   */
  static async getUserFinancialData(userId: number): Promise<UserFinancialData | null> {
    // For demo user (userId 1), return mock data
    if (userId === 1) {
      return {
        userId: 1,
        monthlyIncome: 52000,
        monthlyExpenses: 31000,
        emergencyFund: 186000,
        debtAmount: 50000,
        age: 30,
        riskTolerance: 'medium',
        jobStability: 7,
        marketConditions: 'neutral',
        inflationRate: 6.0
      };
    }

    try {
        // Note: align selected columns with current DB schema (user_profiles columns)
        const result = await query(`
          SELECT
            u.id as user_id,
            COALESCE(up.monthly_income, 0) as monthly_income,
            COALESCE(up.monthly_expenses, 0) as monthly_expenses,
            COALESCE(up.emergency_fund, 0) as emergency_fund,
            -- total debt aggregated from debts table if present
            COALESCE((SELECT SUM(outstanding_amount) FROM debts WHERE user_id = $1), 0) as debt_amount,
            COALESCE(up.experience_years, 30) as age,
            COALESCE(up.savings_rate, 0.0) as risk_tolerance,
            COALESCE(5, 5) as job_stability,
            'neutral' as market_conditions,
            6.0 as inflation_rate
          FROM users u
          LEFT JOIN user_profiles up ON u.id = up.user_id
          WHERE u.id = $1
        `, [userId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        userId: row.user_id,
        monthlyIncome: parseFloat(row.monthly_income),
        monthlyExpenses: parseFloat(row.monthly_expenses),
        emergencyFund: parseFloat(row.emergency_fund),
        debtAmount: parseFloat(row.debt_amount),
        age: parseInt(row.age),
        riskTolerance: row.risk_tolerance,
        jobStability: parseInt(row.job_stability),
        marketConditions: row.market_conditions,
        inflationRate: parseFloat(row.inflation_rate)
      };
    } catch (error) {
      logger.error(`Failed to get user financial data for user ${userId}: ${error}`);
      return null;
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<{ id: number; email: string; name: string } | null> {
    try {
      const result = await query(`SELECT id, email, name FROM users WHERE email = $1 LIMIT 1`, [email]);
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      return null;
    } catch (error) {
      logger.error(`Failed to get user by email ${email}: ${error}`);
      // Fallback to in-memory
      if (useInMemory) {
        const user = inMemoryUsers.find(u => u.email === email);
        return user ? { id: user.id, email: user.email, name: user.name } : null;
      }
      return null;
    }
  }

  /**
   * Get user by email and pin for authentication
   */
  static async getUserByEmailAndPin(email: string, pin: string): Promise<{ id: number; email: string; name: string } | null> {
    try {
      const result = await query(`SELECT id, email, name FROM users WHERE email = $1 AND pin = $2 LIMIT 1`, [email, pin]);
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      return null;
    } catch (error) {
      logger.error(`Failed to get user by email and pin ${email}: ${error}`);
      // Fallback to in-memory
      if (useInMemory) {
        const user = inMemoryUsers.find(u => u.email === email && u.password === pin);
        return user ? { id: user.id, email: user.email, name: user.name } : null;
      }
      return null;
    }
  }

  /**
   * Verify user PIN
   */
  static async verifyUserPin(userId: number, pin: string): Promise<boolean> {
    try {
      const result = await query(`SELECT pin FROM users WHERE id = $1 LIMIT 1`, [userId]);
      if (result.rows.length > 0) {
        return result.rows[0].pin === pin;
      }
      return false;
    } catch (error) {
      logger.error(`Failed to verify PIN for user ${userId}: ${error}`);
      return false;
    }
  }

  /**
   * Create user with PIN
   */
  static async createUserWithPin(email: string, name: string, pin: string): Promise<number> {
    try {
      logger.info(`Creating user with email: ${email}, name: ${name}, pin length: ${pin.length}`);

      const result = await query(
        `INSERT INTO users (email, name, pin, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         RETURNING id`,
        [email, name, pin]
      );

      if (result.rows.length > 0) {
        const userId = result.rows[0].id;
        logger.info(`User created successfully with id: ${userId}`);

        // Create default user profile
        try {
          await query(
            `INSERT INTO user_profiles (user_id, monthly_income, monthly_expenses, emergency_fund, savings_rate, experience_years, created_at, updated_at)
             VALUES ($1, 0, 0, 0, 0.0, 30, NOW(), NOW())
             ON CONFLICT (user_id) DO NOTHING`,
            [userId]
          );
          logger.info(`User profile created for user ${userId}`);
        } catch (e) {
          logger.error(`Failed to create user_profile for user ${userId}: ${e}`);
          // Don't fail the registration if profile creation fails
        }
        return userId;
      }
      logger.error('No rows returned after user insert');
      return 0;
    } catch (error: any) {
      logger.error(`Failed to create user with PIN for email ${email}: ${error.message || error}`);
      console.error('Full error:', error);

      // Fallback to in-memory storage
      logger.info('Falling back to in-memory storage');
      useInMemory = true;
      const existingUser = inMemoryUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      const newUser: InMemoryUser = {
        id: nextUserId++,
        email,
        password: pin,
        name,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryUsers.push(newUser);
      logger.info(`User created in memory with id: ${newUser.id}`);
      return newUser.id;
    }
  }


  /**
   * Save asset allocation data
   */
  static async saveAssetAllocation(data: AssetAllocationData): Promise<boolean> {
    try {
      await query(`
        INSERT INTO asset_allocations (
          user_id, sip_percentage, stocks_percentage, bonds_percentage,
          lifestyle_percentage, emergency_fund_percentage, sip_amount,
          stocks_amount, bonds_amount, lifestyle_amount, emergency_amount,
          reasoning, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (user_id)
        DO UPDATE SET
          sip_percentage = EXCLUDED.sip_percentage,
          stocks_percentage = EXCLUDED.stocks_percentage,
          bonds_percentage = EXCLUDED.bonds_percentage,
          lifestyle_percentage = EXCLUDED.lifestyle_percentage,
          emergency_fund_percentage = EXCLUDED.emergency_fund_percentage,
          sip_amount = EXCLUDED.sip_amount,
          stocks_amount = EXCLUDED.stocks_amount,
          bonds_amount = EXCLUDED.bonds_amount,
          lifestyle_amount = EXCLUDED.lifestyle_amount,
          emergency_amount = EXCLUDED.emergency_amount,
          reasoning = EXCLUDED.reasoning,
          updated_at = EXCLUDED.updated_at
      `, [
        data.userId,
        data.sipPercentage,
        data.stocksPercentage,
        data.bondsPercentage,
        data.lifestylePercentage,
        data.emergencyFundPercentage,
        data.sipAmount,
        data.stocksAmount,
        data.bondsAmount,
        data.lifestyleAmount,
        data.emergencyAmount,
        JSON.stringify(data.reasoning),
        data.createdAt,
        data.updatedAt
      ]);

      logger.info(`Saved asset allocation for user ${data.userId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to save asset allocation for user ${data.userId}: ${error}`);
      return false;
    }
  }

  /**
   * Get asset allocation data
   */
  static async getAssetAllocation(userId: number): Promise<AssetAllocationData | null> {
    try {
      const result = await query(`
        SELECT * FROM asset_allocations WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1
      `, [userId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        userId: row.user_id,
        sipPercentage: parseFloat(row.sip_percentage),
        stocksPercentage: parseFloat(row.stocks_percentage),
        bondsPercentage: parseFloat(row.bonds_percentage),
        lifestylePercentage: parseFloat(row.lifestyle_percentage),
        emergencyFundPercentage: parseFloat(row.emergency_fund_percentage),
        sipAmount: parseFloat(row.sip_amount),
        stocksAmount: parseFloat(row.stocks_amount),
        bondsAmount: parseFloat(row.bonds_amount),
        lifestyleAmount: parseFloat(row.lifestyle_amount),
        emergencyAmount: parseFloat(row.emergency_amount),
        reasoning: JSON.parse(row.reasoning || '[]'),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      logger.error(`Failed to get asset allocation for user ${userId}: ${error}`);
      return null;
    }
  }

  /**
   * Save emergency fund data
   */
  static async saveEmergencyFundData(data: EmergencyFundData): Promise<boolean> {
    try {
      await query(`
        INSERT INTO emergency_fund_monitoring (
          user_id, current_balance, target_months, monthly_burn_rate,
          months_coverage, status, recommended_action, alerts,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (user_id)
        DO UPDATE SET
          current_balance = EXCLUDED.current_balance,
          target_months = EXCLUDED.target_months,
          monthly_burn_rate = EXCLUDED.monthly_burn_rate,
          months_coverage = EXCLUDED.months_coverage,
          status = EXCLUDED.status,
          recommended_action = EXCLUDED.recommended_action,
          alerts = EXCLUDED.alerts,
          updated_at = EXCLUDED.updated_at
      `, [
        data.userId,
        data.currentBalance,
        data.targetMonths,
        data.monthlyBurnRate,
        data.monthsCoverage,
        data.status,
        data.recommendedAction,
        JSON.stringify(data.alerts),
        data.createdAt,
        data.updatedAt
      ]);

      logger.info(`Saved emergency fund data for user ${data.userId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to save emergency fund data for user ${data.userId}: ${error}`);
      return false;
    }
  }

  /**
   * Get emergency fund data
   */
  static async getEmergencyFundData(userId: number): Promise<EmergencyFundData | null> {
    try {
      const result = await query(`
        SELECT * FROM emergency_fund_monitoring WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1
      `, [userId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        userId: row.user_id,
        currentBalance: parseFloat(row.current_balance),
        targetMonths: parseInt(row.target_months),
        monthlyBurnRate: parseFloat(row.monthly_burn_rate),
        monthsCoverage: parseFloat(row.months_coverage),
        status: row.status,
        recommendedAction: row.recommended_action,
        alerts: JSON.parse(row.alerts || '[]'),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      logger.error(`Failed to get emergency fund data for user ${userId}: ${error}`);
      return null;
    }
  }

  /**
   * Update user financial profile
   */
  static async updateUserFinancialProfile(userId: number, data: Partial<UserFinancialData>): Promise<boolean> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (data.monthlyIncome !== undefined) {
        updates.push(`monthly_income = $${paramIndex++}`);
        values.push(data.monthlyIncome);
      }
      if (data.monthlyExpenses !== undefined) {
        updates.push(`monthly_expenses = $${paramIndex++}`);
        values.push(data.monthlyExpenses);
      }
      if (data.emergencyFund !== undefined) {
        updates.push(`emergency_fund_balance = $${paramIndex++}`);
        values.push(data.emergencyFund);
      }
      if (data.debtAmount !== undefined) {
        updates.push(`total_debt = $${paramIndex++}`);
        values.push(data.debtAmount);
      }
      if (data.age !== undefined) {
        updates.push(`age = $${paramIndex++}`);
        values.push(data.age);
      }
      if (data.riskTolerance !== undefined) {
        updates.push(`risk_tolerance = $${paramIndex++}`);
        values.push(data.riskTolerance);
      }
      if (data.jobStability !== undefined) {
        updates.push(`job_stability_score = $${paramIndex++}`);
        values.push(data.jobStability);
      }

      if (updates.length === 0) {
        return true; // Nothing to update
      }

      updates.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      values.push(userId); // Add userId at the end

      const queryText = `
        UPDATE user_profiles
        SET ${updates.join(', ')}
        WHERE user_id = $${paramIndex}
      `;

      await query(queryText, values);
      logger.info(`Updated financial profile for user ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to update financial profile for user ${userId}: ${error}`);
      return false;
    }
  }
}