import React, { useState, useEffect } from 'react';
import { Rule } from '../types';
import { X, Clock, User, FileText, ChevronRight, ArrowRightLeft } from 'lucide-react';

interface RuleDetailViewProps {
  currentRule: Rule;
  onClose: () => void;
}

// Helper component for consistent field display
const Field = ({ label, value, className = "" }: { label: string, value: React.ReactNode, className?: string }) => (
  <div className={`space-y-1 ${className}`}>
    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</div>
    <div className="text-sm text-slate-800 font-medium break-words whitespace-pre-wrap leading-relaxed">
        {value || <span className="text-slate-300 italic">未填写</span>}
    </div>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="pb-2 border-b border-slate-100 mb-4 mt-6 first:mt-0">
    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
      <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
      {title}
    </h3>
  </div>
);

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

    return (
        <div className={`bg-white p-6 rounded-xl border ${isCurrent ? 'border-blue-100 shadow-sm' : 'border-slate-200 bg-slate-50/30'}`}>
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

            <SectionHeader title="基础信息" />
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Field label="奖罚层级" value={rule.rewardPenaltyLevel} />
                <Field label="环节" value={rule.level} />
                <Field label="维度" value={rule.dimension} />
                <Field label="规则制定组织" value={rule.org} />
                <Field label="一级事项" value={rule.item1} />
                <Field label="二级事项" value={rule.item2} />
                <Field label="应用对象" value={rule.target} />
                <Field label="规则接口人" value={rule.owner} />
            </div>

            <SectionHeader title="逻辑与标准" />
            <div className="space-y-4 mb-6">
                <Field label="奖罚事项说明及取数逻辑" value={rule.logic} />
                <Field label="奖励标准" value={rule.rewardStd} />
                <Field label="扣罚标准" value={rule.penaltyStd} />
            </div>

            <SectionHeader title="牵引目标" />
            <div className="grid grid-cols-2 gap-4 mb-6">
                 <Field label="牵引指标名称" value="全网遗失率(Mock)" />
                 <Field label="指标当前值" value="0.01%" />
                 <div className="col-span-2">
                    <Field label="线上化取数逻辑" value="基于DWS_001表统计..." />
                 </div>
            </div>

            <SectionHeader title="测算数据" />
             <div className="grid grid-cols-2 gap-4">
                 <Field label="月均奖励" value="¥12,000" />
                 <Field label="月均扣罚" value="¥3,500" />
                 <div className="col-span-2">
                    <Field label="计算公式" value="Rewards = Base * (1 + Rate)..." />
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
         <div className="max-w-7xl mx-auto">
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
                        className="form-select text-xs border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-1.5 pl-2 pr-8 w-40"
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