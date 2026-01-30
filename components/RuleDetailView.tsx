import React, { useState, useEffect } from 'react';
import { Rule } from '../types';
import { X, Clock, User, FileText, ChevronRight, ArrowRightLeft, Target, Calculator, Database, Tag, MessageSquare } from 'lucide-react';

interface RuleDetailViewProps {
  currentRule: Rule;
  onClose: () => void;
}

// Helper component for consistent field display
const Field = ({ label, value, className = "" }: { label: string, value: React.ReactNode, className?: string }) => (
  <div className={`space-y-1.5 ${className}`}>
    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</div>
    <div className="text-sm text-slate-800 font-medium break-words whitespace-pre-wrap leading-relaxed bg-slate-50/50 rounded p-2 border border-slate-100 min-h-[38px] flex items-center">
        {value || <span className="text-slate-300 italic">未填写</span>}
    </div>
  </div>
);

const SectionHeader = ({ title, icon: Icon }: { title: string, icon?: any }) => (
  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4 mt-8 first:mt-0">
    {Icon && <Icon size={16} className="text-blue-600" />}
    <h3 className="text-sm font-bold text-slate-800">
      {title}
    </h3>
  </div>
);

// Helper to generate consistent mock data based on rule
const getMockExtendedData = (rule: Rule) => {
    // Generate deterministic mock data based on rule properties
    const isQuality = rule.dimension === '质量';
    const isEfficiency = rule.dimension === '效率';
    
    return {
        // Application Description
        iterateContent: rule.version > 1 
            ? `1. 调整了${rule.item2}的考核阈值，由原来的98%提升至98.5%。\n2. 优化了取数逻辑，排除了不可抗力因素导致的异常。` 
            : '首次创建该规则，旨在规范业务操作标准。',
        reason: rule.version > 1 
            ? '原标准在实际执行中发现过于宽松，无法有效起到牵引作用，且业务场景发生了变化。' 
            : '当前业务环节缺乏明确的管理标准，导致经常出现纠纷，急需制定规则进行管控。',
        
        // Traction
        tractionMetric: isQuality ? '破损率' : (isEfficiency ? '及时率' : '违规率'),
        tractionCurrent: isQuality ? '0.05%' : '92.3%',
        tractionTargets: Array(12).fill(0).map((_, i) => isQuality ? `${(0.05 - (i * 0.002)).toFixed(3)}%` : `${(92.5 + (i * 0.2)).toFixed(1)}%`),
        tractionLogic: `取自DWS层dws_ops_${isQuality ? 'quality' : 'perf'}_metric_day表，过滤条件：inc_day = T-1 AND org_id IN (相关组织) AND type = '${rule.item2}'`,
        tractionTable: `dws_ops_${isQuality ? 'quality' : 'perf'}_metric_day`,
        
        // Calculation
        calcAvgReward: '1,500',
        calcAvgPenalty: '800',
        calcLimitReward: '5,000',
        calcLimitPenalty: '2,000',
        calcFormula: 'IF(指标值 > 目标值, (指标值 - 目标值) * 100 * 系数, 0)',
        calcFile: `2024年Q${Math.floor(Math.random() * 4) + 1}测算数据.xlsx`,
        
        // Online Logic
        isOnline: true,
        bdpTable: 'ads_award_penalty_detail_day',
        onlineLogic: '1. 根据工号关联花名册获取岗位信息。\n2. 根据运单号关联产品类型。\n3. 剔除豁免名单中的记录。',
        appliedPosition: rule.target.includes('收派') ? '收派员' : (rule.target.includes('司机') ? '干线司机' : '仓管员'),
        appliedProduct: '标快, 特快, 电商标快',
    };
};

export const RuleDetailView: React.FC<RuleDetailViewProps> = ({ currentRule, onClose }) => {
  const [historyRules, setHistoryRules] = useState<Rule[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  
  // Mock history generation based on current rule
  useEffect(() => {
    if (!currentRule) return;

    // Generate fake history versions strictly less than current version
    const history: Rule[] = [];
    for (let v = currentRule.version - 1; v >= 1; v--) {
        history.push({
            ...currentRule,
            id: `${currentRule.id}_v${v}`,
            version: v,
            // Simulate some changes for demo purposes
            updateDate: '2024-01-15', // Mock date
            item1: v === 1 ? '旧一级事项' : currentRule.item1,
            rewardStd: v === 1 ? '旧奖励标准: 无' : currentRule.rewardStd,
            penaltyStd: v === 1 ? '旧处罚标准: 50元/次' : currentRule.penaltyStd,
            logic: v === 1 ? '这是旧版本的逻辑说明...' : currentRule.logic,
            creator: '张三(历史)',
        });
    }
    setHistoryRules(history);
    if (history.length > 0) {
        setSelectedVersionId(history[0].id);
    }
  }, [currentRule]);

  const selectedHistoryRule = historyRules.find(r => r.id === selectedVersionId);

  // Render a single column of rule details
  const renderRuleColumn = (rule: Rule | undefined, isCurrent: boolean) => {
    if (!rule) return (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 p-8">
            <Clock size={48} className="mb-4 opacity-20" />
            <p className="text-sm">暂无历史版本信息</p>
        </div>
    );

    const extendedData = getMockExtendedData(rule);

    return (
        <div className={`bg-white p-6 rounded-xl border ${isCurrent ? 'border-blue-100 shadow-sm ring-1 ring-blue-50' : 'border-slate-200 bg-slate-50/30'}`}>
            {/* Meta Info Header inside the card */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold mb-1 ${
                        isCurrent ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                    }`}>
                        v{rule.version}.0
                    </span>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>{rule.firstApplyDate || rule.updateDate || '2024-01-01'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><User size={10} /> {rule.creator}</span>
                    </div>
                </div>
                {isCurrent && <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">当前生效版本</span>}
            </div>

            {/* 1. 规则基础信息 */}
            <SectionHeader title="规则基础信息" icon={Tag} />
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Field label="奖罚层级" value={rule.rewardPenaltyLevel} />
                <Field label="环节" value={rule.level} />
                <Field label="一级事项" value={rule.item1} />
                <Field label="二级事项" value={rule.item2} />
                
                <div className="col-span-2">
                    <Field label="奖罚事项说明及取数逻辑" value={rule.logic} />
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded border border-slate-100">
                    <Field label="新奖励规则" value={rule.rewardStd} className="bg-white" />
                    <Field label="新扣罚规则" value={rule.penaltyStd} className="bg-white" />
                </div>

                <Field label="应用对象" value={rule.target} />
                <Field label="规则制定组织" value={rule.org} />
                <Field label="规则接口人" value={rule.owner} />
                <Field label="规则制定人员" value={rule.creator} />
                <Field label="首次应用时间" value={rule.firstApplyDate} />
            </div>

            {/* 2. 本次申请说明 */}
            <SectionHeader title="本次申请说明" icon={MessageSquare} />
            <div className="space-y-4 mb-6">
                <Field label="迭代内容说明" value={extendedData.iterateContent} />
                <Field label="迭代原因说明" value={extendedData.reason} />
            </div>

            {/* 3. 规则牵引目标 */}
            <SectionHeader title="规则牵引目标" icon={Target} />
            <div className="grid grid-cols-2 gap-4 mb-6">
                 <Field label="牵引指标名称" value={extendedData.tractionMetric} />
                 <Field label="指标当前值" value={extendedData.tractionCurrent} />
                 
                 <div className="col-span-2">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">指标目标值 (1-12月)</div>
                    <div className="grid grid-cols-6 gap-1">
                        {extendedData.tractionTargets.map((val, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-100 rounded text-[10px] text-center py-1 text-slate-600 font-medium">
                                {val}
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="col-span-2">
                    <Field label="线上化取数逻辑" value={extendedData.tractionLogic} />
                 </div>
                 <div className="col-span-2">
                    <Field label="取数底表" value={extendedData.tractionTable} />
                 </div>
            </div>

            {/* 4. 规则测算数据 */}
            <SectionHeader title="规则测算数据" icon={Calculator} />
             <div className="grid grid-cols-2 gap-4 mb-6">
                 <Field label="月均奖励金额" value={extendedData.calcAvgReward} />
                 <Field label="月均扣罚金额" value={extendedData.calcAvgPenalty} />
                 <Field label="极限奖励金额" value={extendedData.calcLimitReward} />
                 <Field label="极限扣罚金额" value={extendedData.calcLimitPenalty} />
                 <div className="col-span-2">
                    <Field label="金额计算公式或计算逻辑" value={extendedData.calcFormula} />
                 </div>
                 <div className="col-span-2">
                    <Field label="测算数据明细" value={extendedData.calcFile} />
                 </div>
            </div>

            {/* 5. 奖罚金额线上化取数逻辑 */}
            <SectionHeader title="奖罚金额线上化取数逻辑" icon={Database} />
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded border border-blue-100">
                    <span className="text-xs font-bold text-slate-600">是否可以线上化:</span>
                    <span className="text-xs font-medium text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                        {extendedData.isOnline ? '是' : '否'}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <Field label="BDP表" value={extendedData.bdpTable} />
                    </div>
                    <div className="col-span-2">
                        <Field label="取数逻辑" value={extendedData.onlineLogic} />
                    </div>
                    <Field label="应用岗位" value={extendedData.appliedPosition} />
                    <Field label="应用产品" value={extendedData.appliedProduct} />
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Drawer Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-800">奖罚规则详情</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                    规则ID: <span className="font-mono text-slate-700">{currentRule.id}</span>
                </p>
             </div>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
         <div className="max-w-[1600px] mx-auto">
             {/* Comparison Header Controls */}
             <div className="flex items-center mb-6">
                 <div className="flex-1">
                     <h3 className="text-sm font-semibold text-slate-700">最新版本 (Current)</h3>
                 </div>
                 <div className="flex-none px-4 text-slate-300">
                     <ArrowRightLeft size={20} />
                 </div>
                 <div className="flex-1 flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-slate-700">历史版本对比</h3>
                     <select 
                        className="form-select text-xs border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 pl-2 pr-8 w-40 hover:border-slate-400 transition-colors"
                        value={selectedVersionId}
                        onChange={(e) => setSelectedVersionId(e.target.value)}
                        disabled={historyRules.length === 0}
                     >
                         {historyRules.length === 0 ? (
                             <option>无历史版本</option>
                         ) : (
                             historyRules.map(r => (
                                 <option key={r.id} value={r.id}>v{r.version}.0 ({r.updateDate})</option>
                             ))
                         )}
                     </select>
                 </div>
             </div>

             {/* Split View Grid */}
             <div className="grid grid-cols-2 gap-8 relative">
                 {/* Left: Current Rule */}
                 <div className="relative">
                     {renderRuleColumn(currentRule, true)}
                 </div>

                 {/* Right: History Rule */}
                 <div className="relative">
                     {renderRuleColumn(selectedHistoryRule, false)}
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};