import { Router } from "express";
import {
  calculateFinance,
  getHealthScore,
  getSurvival,
  getIncomeScore,
} from "../controllers/financeController";
import {
  sendAlert,
  sendAchievementNotification,
} from "../services/notificationService";
import { generateComprehensiveInsights } from "../services/insightsService";
import { AssetAllocationService } from "../services/assetAllocationService";
import { EmergencyFundService } from "../services/emergencyFundService";
import { DatabaseService } from "../services/databaseService";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/* -------------------------------------------
   AUTH MUST BE FIRST for all finance routes
-------------------------------------------- */
router.use(authMiddleware);

/* -------------------------------------------
   Existing finance routes
-------------------------------------------- */
router.post("/calculate", calculateFinance);
router.get("/healthscore", getHealthScore);
router.get("/survival", getSurvival);
router.get("/incomescore", getIncomeScore);

router.get("/insights", async (req, res) => {
  const userId = (req as any).userId;
  const result = await generateComprehensiveInsights(userId);
  res.json(result);
});

/* -------------------------------------------
   Asset Allocation Route
-------------------------------------------- */
router.get("/asset-allocation", async (req, res) => {
  try {
    const userId = (req as any).userId;

    const existingAllocation = await DatabaseService.getAssetAllocation(userId);

    if (existingAllocation) {
      const formulas = {
        sipCagr: AssetAllocationService.calculateSipCagr(
          existingAllocation.sipAmount,
          10,
          12
        ),
        emergencyMonths:
          existingAllocation.emergencyAmount /
          (existingAllocation.emergencyAmount /
            existingAllocation.emergencyFundPercentage /
            100),
        debtToIncome: 0,
        savingsRate: 0,
        investmentRiskScore:
          AssetAllocationService.calculateInvestmentRiskScore({
            sipPercentage: existingAllocation.sipPercentage,
            stocksPercentage: existingAllocation.stocksPercentage,
            bondsPercentage: existingAllocation.bondsPercentage,
            lifestylePercentage: existingAllocation.lifestylePercentage,
            emergencyFundPercentage: existingAllocation.emergencyFundPercentage,
            allocatedAmounts: {
              sip: existingAllocation.sipAmount,
              stocks: existingAllocation.stocksAmount,
              bonds: existingAllocation.bondsAmount,
              lifestyle: existingAllocation.lifestyleAmount,
              emergency: existingAllocation.emergencyAmount,
            },
            reasoning: existingAllocation.reasoning,
          }),
        stabilityIndex: 0,
      };

      return res.json({
        allocation: {
          sipPercentage: existingAllocation.sipPercentage,
          stocksPercentage: existingAllocation.stocksPercentage,
          bondsPercentage: existingAllocation.bondsPercentage,
          lifestylePercentage: existingAllocation.lifestylePercentage,
          emergencyFundPercentage: existingAllocation.emergencyFundPercentage,
          allocatedAmounts: {
            sip: existingAllocation.sipAmount,
            stocks: existingAllocation.stocksAmount,
            bonds: existingAllocation.bondsAmount,
            lifestyle: existingAllocation.lifestyleAmount,
            emergency: existingAllocation.emergencyAmount,
          },
          reasoning: existingAllocation.reasoning,
        },
        formulas,
      });
    }

    const userData = await DatabaseService.getUserFinancialData(userId);
    if (!userData) {
      return res.status(404).json({
        error: "User financial data not found. Please complete your profile.",
      });
    }

    const allocation =
      await AssetAllocationService.calculateOptimalAllocation(userData);

    const allocationData = {
      userId,
      sipPercentage: allocation.sipPercentage,
      stocksPercentage: allocation.stocksPercentage,
      bondsPercentage: allocation.bondsPercentage,
      lifestylePercentage: allocation.lifestylePercentage,
      emergencyFundPercentage: allocation.emergencyFundPercentage,
      sipAmount: allocation.allocatedAmounts.sip,
      stocksAmount: allocation.allocatedAmounts.stocks,
      bondsAmount: allocation.allocatedAmounts.bonds,
      lifestyleAmount: allocation.allocatedAmounts.lifestyle,
      emergencyAmount: allocation.allocatedAmounts.emergency,
      reasoning: allocation.reasoning,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await DatabaseService.saveAssetAllocation(allocationData);

    res.json({
      allocation,
      formulas: {
        sipCagr: AssetAllocationService.calculateSipCagr(
          allocation.allocatedAmounts.sip,
          10,
          12
        ),
        emergencyMonths:
          AssetAllocationService.calculateEmergencyFundMonths(
            userData.emergencyFund,
            userData.monthlyExpenses
          ),
        debtToIncome:
          AssetAllocationService.calculateDebtToIncomeRatio(
            userData.debtAmount,
            userData.monthlyIncome * 12
          ),
        savingsRate: AssetAllocationService.calculateSavingsRate(
          userData.monthlyIncome,
          userData.monthlyExpenses
        ),
        investmentRiskScore:
          AssetAllocationService.calculateInvestmentRiskScore(allocation),
        stabilityIndex: AssetAllocationService.calculateStabilityIndex(
          userData.emergencyFund / userData.monthlyExpenses,
          AssetAllocationService.calculateSavingsRate(
            userData.monthlyIncome,
            userData.monthlyExpenses
          ),
          AssetAllocationService.calculateDebtToIncomeRatio(
            userData.debtAmount,
            userData.monthlyIncome * 12
          ),
          userData.jobStability
        ),
      },
    });
  } catch (error) {
    console.error("Asset allocation error:", error);
    res.status(500).json({ error: "Failed to calculate asset allocation" });
  }
});

/* -------------------------------------------
   Update Asset Allocation
-------------------------------------------- */
router.post("/asset-allocation/update", async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { allocation } = req.body;

    const existing = await DatabaseService.getAssetAllocation(userId);
    const createdAt = existing ? existing.createdAt : new Date();

    const allocationData = {
      userId,
      sipPercentage: allocation.sipPercentage,
      stocksPercentage: allocation.stocksPercentage,
      bondsPercentage: allocation.bondsPercentage,
      lifestylePercentage: allocation.lifestylePercentage,
      emergencyFundPercentage: allocation.emergencyFundPercentage,
      sipAmount: allocation.allocatedAmounts.sip,
      stocksAmount: allocation.allocatedAmounts.stocks,
      bondsAmount: allocation.allocatedAmounts.bonds,
      lifestyleAmount: allocation.allocatedAmounts.lifestyle,
      emergencyAmount: allocation.allocatedAmounts.emergency,
      reasoning: allocation.reasoning || [],
      createdAt,
      updatedAt: new Date(),
    };

    const success = await DatabaseService.saveAssetAllocation(allocationData);

    if (!success) {
      return res
        .status(500)
        .json({ error: "Failed to save asset allocation to database" });
    }

    res.json({
      success: true,
      message: "Asset allocation updated successfully",
      allocation,
    });
  } catch (error) {
    console.error("Asset allocation update error:", error);
    res.status(500).json({ error: "Failed to update asset allocation" });
  }
});

/* -------------------------------------------
   Emergency Fund Routes
-------------------------------------------- */
router.get("/emergency-status", async (req, res) => {
  try {
    const userId = (req as any).userId;

    const existingData = await DatabaseService.getEmergencyFundData(userId);

    if (existingData) {
      const userData = await DatabaseService.getUserFinancialData(userId);

      const monthlyExpenses = userData
        ? userData.monthlyExpenses
        : existingData.monthlyBurnRate;
      const monthlyIncome = userData
        ? userData.monthlyIncome
        : existingData.monthlyBurnRate * 2;

      const simulations = EmergencyFundService.simulateEmergencyScenarios(
        existingData.currentBalance,
        monthlyExpenses,
        monthlyIncome
      );

      const optimalContribution =
        EmergencyFundService.calculateOptimalContribution(
          existingData.currentBalance,
          monthlyExpenses,
          monthlyIncome
        );

      const depletionRisk = EmergencyFundService.monitorDepletionRisk(
        existingData.currentBalance,
        monthlyExpenses,
        monthlyIncome,
        7
      );

      return res.json({
        status: {
          currentBalance: existingData.currentBalance,
          targetMonths: existingData.targetMonths,
          monthlyBurnRate: existingData.monthlyBurnRate,
          monthsCoverage: existingData.monthsCoverage,
          status: existingData.status,
          recommendedAction: existingData.recommendedAction,
          alerts: existingData.alerts,
        },
        simulations,
        optimalContribution,
        depletionRisk,
        recommendations: [
          "Maintain emergency fund at 6 months of expenses",
          "Contribute monthly to build fund gradually",
          "Review and adjust based on life changes",
        ],
      });
    }

    const userData = await DatabaseService.getUserFinancialData(userId);

    if (!userData) {
      return res.status(404).json({
        error: "User financial data not found. Please complete your profile.",
      });
    }

    const status = EmergencyFundService.calculateEmergencyFundStatus(
      userData.emergencyFund,
      userData.monthlyExpenses
    );

    const simulations = EmergencyFundService.simulateEmergencyScenarios(
      userData.emergencyFund,
      userData.monthlyExpenses,
      userData.monthlyIncome
    );

    const optimalContribution =
      EmergencyFundService.calculateOptimalContribution(
        userData.emergencyFund,
        userData.monthlyExpenses,
        userData.monthlyIncome
      );

    const depletionRisk = EmergencyFundService.monitorDepletionRisk(
      userData.emergencyFund,
      userData.monthlyExpenses,
      userData.monthlyIncome,
      userData.jobStability
    );

    const emergencyData = {
      userId,
      currentBalance: userData.emergencyFund,
      targetMonths: 6,
      monthlyBurnRate: userData.monthlyExpenses,
      monthsCoverage: status.monthsCoverage,
      status: status.status,
      recommendedAction: status.recommendedAction,
      alerts: status.alerts,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await DatabaseService.saveEmergencyFundData(emergencyData);

    res.json({
      status,
      simulations,
      optimalContribution,
      depletionRisk,
      recommendations: [
        "Maintain emergency fund at 6 months of expenses",
        "Contribute monthly to build fund gradually",
        "Review and adjust based on life changes",
      ],
    });
  } catch (error) {
    console.error("Emergency fund status error:", error);
    res.status(500).json({ error: "Failed to get emergency fund status" });
  }
});

router.post("/emergency-simulation", async (req, res) => {
  try {
    const { scenario, currentBalance, monthlyExpenses, monthlyIncome } =
      req.body;

    const simulations = EmergencyFundService.simulateEmergencyScenarios(
      currentBalance,
      monthlyExpenses,
      monthlyIncome
    );

    const specificSimulation =
      simulations.find((s) => s.scenario === scenario) || simulations[0];

    res.json({
      simulation: specificSimulation,
      allScenarios: simulations,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to run emergency simulation" });
  }
});

/* -------------------------------------------
   Trend Analysis
-------------------------------------------- */
router.get("/trends/:period", async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { period } = req.params;

    const trends = {
      spendingTrend: "stable",
      savingsTrend: "improving",
      incomeTrend: "stable",
      emergencyFundTrend: "growing",
      investmentTrend: "stable",
      period,
      data: {
        spending: { current: 31000, previous: 30500, change: 1.6 },
        savings: { current: 21000, previous: 19500, change: 7.7 },
        income: { current: 52000, previous: 52000, change: 0 },
        emergencyFund: { current: 45000, previous: 40000, change: 12.5 },
      },
    };

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: "Failed to get trend analysis" });
  }
});

/* -------------------------------------------
   SIP Calculator Route
-------------------------------------------- */
router.post("/sip-plan", async (req, res) => {
  try {
    const { monthlyInvestment, years, expectedReturn } = req.body;

    const futureValue = AssetAllocationService.calculateSipCagr(
      monthlyInvestment,
      years,
      expectedReturn
    );

    const totalInvested = monthlyInvestment * years * 12;
    const wealthGained = (futureValue * totalInvested) / 100 - totalInvested;

    res.json({
      monthlyInvestment,
      years,
      expectedReturn,
      futureValue: Math.round(futureValue),
      totalInvested,
      wealthGained: Math.round(wealthGained),
      cagr: futureValue.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate SIP plan" });
  }
});

/* -------------------------------------------
   Notification Routes
-------------------------------------------- */
router.post("/notify/alert", async (req, res) => {
  try {
    const { email, message, type } = req.body;
    const userId = (req as any).userId;

    const result = await sendAlert(userId, email, message, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to send alert" });
  }
});

router.post("/notify/achievement", async (req, res) => {
  try {
    const { email, achievement, details } = req.body;
    const userId = (req as any).userId;

    const result = await sendAchievementNotification(
      userId,
      email,
      achievement,
      details
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to send achievement notification" });
  }
});

export default router;
