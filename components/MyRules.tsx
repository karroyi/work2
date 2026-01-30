import React, { useMemo, useState, useRef } from 'react';
import { Rule } from '../types';
import { StatsCard } from './StatsCard';
import { Search, Plus, Filter, MoreHorizontal, Shield, Power } from 'lucide-react';

interface MyRulesProps {
  rules: Rule[];
  onNavigateToNew: () => void;
  onIterate: (rule: Rule) => void;
  onViewDetails: (rule: Rule) => void;
  onManagePermissions: (rule: Rule) => void;
  onOffline: (rule: Rule) => void;
}

export const MyRules: React.FC<MyRulesProps> = ({ 
  rules, 
  onNavigateToNew, 
  onIterate, 
  onViewDetails,
  onManagePermissions,
  onOffline
}) => {
  
  // Filter States
  const [levelFilter, setLevelFilter] = useState('全部层级');
  const [dimensionFilter, setDimensionFilter] = useState('全部维度');
  const [itemKeyword, setItemKeyword] = useState('');
  const [stdKeyword, setStdKeyword] = useState('');
  const [creatorKeyword, setCreatorKeyword] = useState('');

  // State for the floating menu
  const [activeMenu, setActiveMenu] = useState<{rule: Rule, top: number, left: number} | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Dynamic stats calculation (Global stats based on total rules)
  const stats = useMemo(() => {
    return {
        total: rules.length,
        region: rules.filter(r => r.rewardPenaltyLevel === '地区').length,
        courier: rules.filter(r => r.rewardPenaltyLevel === '收派岗').length,
        warehouse: rules.filter(r => r.rewardPenaltyLevel === '仓管岗').length,
        smallTransfer: rules.filter(r => r.rewardPenaltyLevel === '小件中转').length,
        bigTransfer: rules.filter(r => r.rewardPenaltyLevel === '大件中转').length,
        driver: rules.filter(r => r.rewardPenaltyLevel === '司机岗').length,
    };
  }, [rules]);

  // Filter Logic
  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchLevel = levelFilter === '全部层级' || rule.rewardPenaltyLevel === levelFilter;
      const matchDimension = dimensionFilter === '全部维度' || rule.dimension === dimensionFilter;
      const matchItem = !itemKeyword || (rule.item2 && rule.item2.toLowerCase().includes(itemKeyword.toLowerCase()));
      const matchStd = !stdKeyword || 
          ((rule.rewardStd && rule.rewardStd.toLowerCase().includes(stdKeyword.toLowerCase())) || 
           (rule.penaltyStd && rule.penaltyStd.toLowerCase().includes(stdKeyword.toLowerCase())));
      const matchCreator = !creatorKeyword || (rule.creator && rule.creator.toLowerCase().includes(creatorKeyword.toLowerCase()));

      return matchLevel && matchDimension && matchItem && matchStd && matchCreator;
    });
  }, [rules, levelFilter, dimensionFilter, itemKeyword, stdKeyword, creatorKeyword]);

  // Handlers for menu interaction
  const handleMenuTriggerEnter = (e: React.MouseEvent, rule: Rule) => {
    if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    // Position menu: Align right edge with button right edge, top with button bottom
    // Menu width is w-32 (128px)
    setActiveMenu({
        rule,
        top: rect.bottom + 4, // 4px gap
        left: rect.right - 128
    });
  };

  const handleMenuTriggerLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
        setActiveMenu(null);
    }, 200); // 200ms delay to allow moving to the menu
  };

  const handleMenuEnter = () => {
      if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
      }
  };

  return (
    <div className="space-y-6 relative">
      {/* Stats Row */}
      <div className="flex flex-wrap gap-4 pb-2">
        <StatsCard title="规则总数" current={stats.total} total={stats.total} />
        <StatsCard title="地区" current={stats.region} total={stats.total} />
        <StatsCard title="收派岗" current={stats.courier} total={stats.total} />
        <StatsCard title="仓管岗" current={stats.warehouse} total={stats.total} />
        <StatsCard title="小件中转" current={stats.smallTransfer} total={stats.total} />
        <StatsCard title="大件中转" current={stats.bigTransfer} total={stats.total} />
        <StatsCard title="司机岗" current={stats.driver} total={stats.total} />
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500 mr-2">
                <Filter size={16} />
                <span className="text-sm font-medium">筛选</span>
            </div>
            
            <select 
              className="form-select text-sm border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 pl-3 pr-8 hover:border-slate-400 transition-colors"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option>全部层级</option>
              <option>地区</option>
              <option>收派岗</option>
              <option>仓管岗</option>
              <option>小件中转</option>
              <option>大件中转</option>
              <option>司机岗</option>
            </select>
            <select 
              className="form-select text-sm border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 pl-3 pr-8 hover:border-slate-400 transition-colors"
              value={dimensionFilter}
              onChange={(e) => setDimensionFilter(e.target.value)}
            >
              <option>全部维度</option>
              <option>风控</option>
              <option>效率</option>
              <option>质量</option>
              <option>成本</option>
              <option>服务</option>
              <option>安全</option>
            </select>
            <input 
              type="text" 
              placeholder="二级事项关键词" 
              className="form-input text-sm border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-3 w-40 hover:border-slate-400 transition-colors"
              value={itemKeyword}
              onChange={(e) => setItemKeyword(e.target.value)}
            />
             <input 
              type="text" 
              placeholder="标准关键词" 
              className="form-input text-sm border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-3 w-48 hover:border-slate-400 transition-colors"
              value={stdKeyword}
              onChange={(e) => setStdKeyword(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="制定人" 
              className="form-input text-sm border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-3 w-32 hover:border-slate-400 transition-colors"
              value={creatorKeyword}
              onChange={(e) => setCreatorKeyword(e.target.value)}
            />
            <button className="bg-white text-slate-700 border border-slate-300 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center gap-2 shadow-sm ml-2">
              <Search size={14} /> 查询
            </button>
            <div className="flex-grow"></div>
            <button 
              onClick={onNavigateToNew}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center gap-2 shadow-sm shadow-blue-200"
            >
              <Plus size={16} /> 新增奖罚规则
            </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left text-slate-600 whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-semibold tracking-wide">
              <tr>
                <th className="px-6 py-4">奖罚层级</th>
                <th className="px-6 py-4">维度</th>
                <th className="px-6 py-4">一级事项</th>
                <th className="px-6 py-4">二级事项</th>
                <th className="px-6 py-4 w-64">奖罚事项说明及取数逻辑</th>
                <th className="px-6 py-4 w-48">奖励标准</th>
                <th className="px-6 py-4 w-48">处罚标准</th>
                <th className="px-6 py-4">应用对象</th>
                <th className="px-6 py-4">规则制定组织</th>
                <th className="px-6 py-4">规则制定人</th>
                <th className="px-6 py-4">首次应用</th>
                <th className="px-6 py-4 text-center">版本</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4 text-center sticky right-0 bg-slate-50 z-10 shadow-[rgba(0,0,0,0.05)_0px_0px_10px_-5px_inset] border-l border-slate-100">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRules.map((rule, idx) => (
                <tr key={rule.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-700">{rule.rewardPenaltyLevel || '-'}</td>
                  <td className="px-6 py-4">{rule.dimension}</td>
                  <td className="px-6 py-4">{rule.item1}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{rule.item2}</td>
                  <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={rule.logic}>{rule.logic}</td>
                  <td className="px-6 py-4 max-w-[200px] truncate text-slate-500" title={rule.rewardStd}>{rule.rewardStd}</td>
                  <td className="px-6 py-4 max-w-[200px] truncate text-slate-500" title={rule.penaltyStd}>{rule.penaltyStd}</td>
                  <td className="px-6 py-4">{rule.target}</td>
                  <td className="px-6 py-4">{rule.org}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-medium">
                            {rule.creator.charAt(0)}
                        </div>
                        {rule.creator}
                     </div>
                  </td>
                  <td className="px-6 py-4">{rule.firstApplyDate}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                        v{rule.version}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      rule.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      rule.status === 'Inactive' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                          rule.status === 'Active' ? 'bg-emerald-500' : 
                          rule.status === 'Inactive' ? 'bg-rose-500' : 'bg-slate-400'
                      }`}></span>
                      {rule.status === 'Active' ? '应用中' : '已下线'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right sticky right-0 bg-white group-hover:bg-[#f8fafc] border-l border-slate-100 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                     <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity relative">
                       <button 
                         onClick={() => onViewDetails(rule)}
                         className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1"
                        >
                           详情
                        </button>
                       <button 
                         onClick={() => onIterate(rule)}
                         className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1"
                        >
                         迭代
                       </button>
                       
                       {/* Dropdown Menu Trigger Button */}
                       <div className="relative inline-block">
                           <button 
                              className={`text-slate-400 p-1 rounded transition-colors ${activeMenu?.rule.id === rule.id ? 'bg-slate-100 text-slate-600' : 'hover:text-slate-600 hover:bg-slate-100'}`}
                              onMouseEnter={(e) => handleMenuTriggerEnter(e, rule)}
                              onMouseLeave={handleMenuTriggerLeave}
                           >
                             <MoreHorizontal size={16} />
                           </button>
                       </div>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRules.length === 0 && (
            <div className="p-12 text-center text-slate-500">
                <div className="flex flex-col items-center">
                    <Filter size={40} className="text-slate-300 mb-2"/>
                    <span>暂无符合条件的规则</span>
                </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating Menu */}
      {activeMenu && (
        <div 
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-100 py-1 w-32 animate-in fade-in zoom-in-95 duration-100 origin-top-right"
            style={{ top: activeMenu.top, left: activeMenu.left }}
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuTriggerLeave}
        >
            <button 
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                onClick={() => {
                    onManagePermissions(activeMenu.rule);
                    setActiveMenu(null);
                }}
            >
                <Shield size={14} />
                权限管理
            </button>
            <button 
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition-colors flex items-center gap-2"
                onClick={() => {
                    onOffline(activeMenu.rule);
                    setActiveMenu(null);
                }}
            >
                <Power size={14} />
                下线规则
            </button>
        </div>
      )}
    </div>
  );
};