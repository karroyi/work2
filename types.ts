export type RuleStatus = 'Active' | 'Inactive' | 'Deprecated';
export type AppStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'In Dev' | 'Ready to Release' | 'Released';
export type DevStatus = 'Pending' | 'In Progress' | 'Testing' | 'Done';

export interface Rule {
  id: string;
  level: string; // 环节
  rewardPenaltyLevel: string; // 奖罚层级
  dimension: string;
  item1: string;
  item2: string;
  logic: string;
  rewardStd: string;
  penaltyStd: string;
  target: string;
  org: string;
  owner: string;
  creator: string;
  firstApplyDate: string;
  updateDate: string;
  version: number;
  status: RuleStatus;
}

export interface Application {
  id: string;
  ruleId?: string; // If modifying existing
  level: string;
  rewardPenaltyLevel?: string; // 奖罚层级
  dimension: string;
  item1: string;
  item2: string;
  type: 'New' | 'Iterate' | 'Delete'; // Changed Modify to Iterate
  desc: string; // 规则逻辑/变更说明
  logic?: string; // 具体规则逻辑 (Explicitly store logic separately from desc for iterations)
  reason: string;
  creator: string;
  createTime: string;
  version: number;
  status: AppStatus;
  
  // Rule Detail fields (Synced with Rule)
  rewardStd?: string;
  penaltyStd?: string;
  target?: string;
  org?: string;
  owner?: string;

  // Dev fields
  devOwner?: string;
  devStatus?: DevStatus;

  // Traction Goal fields
  tractionMetric?: string;
  tractionCurrent?: string;
  tractionTargets?: string[];
  tractionLogic?: string;
  tractionTable?: string;

  // Calculation Data fields
  calcAvgReward?: string;
  calcAvgPenalty?: string;
  calcLimitReward?: string;
  calcLimitPenalty?: string;
  calcFormula?: string;
  calcFile?: string;

  // Online Logic Extra fields
  appliedPosition?: string;
  appliedProduct?: string;
}