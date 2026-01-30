import React, { useState, useMemo } from 'react';
import { Application, DevStatus } from '../types';
import { Search, Code2, Filter } from 'lucide-react';

interface TechDevProps {
  applications: Application[]; // Passed in filtered for 'Approved' or 'In Dev'
  onUpdateStatus: (id: string, status: DevStatus, owner: string) => void;
  onViewDetails: (app: Application) => void;
}

export const TechDev: React.FC<TechDevProps> = ({ applications, onUpdateStatus, onViewDetails }) => {
  // Filter States
  const [levelFilter, setLevelFilter] = useState('全部层级');
  const [typeFilter, setTypeFilter] = useState('申请类型');
  const [onlineFilter, setOnlineFilter] = useState('是否线上化');
  const [devStatusFilter, setDevStatusFilter] = useState('研发状态');
  const [devOwnerKeyword, setDevOwnerKeyword] = useState('');
  const [keyword, setKeyword] = useState('');

  // Filter Logic
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Level (Reward Penalty Level)
      const matchLevel = levelFilter === '全部层级' || app.rewardPenaltyLevel === levelFilter;

      // Type
      let matchType = true;
      if (typeFilter === '新增') matchType = app.type === 'New';
      if (typeFilter === '迭代') matchType = app.type === 'Iterate';

      // Online (Check appliedPosition existence)
      let matchOnline = true;
      if (onlineFilter === '是') matchOnline = !!app.appliedPosition;
      if (onlineFilter === '否') matchOnline = !app.appliedPosition;

      // Dev Status
      let matchDevStatus = true;
      const currentStatus = app.devStatus || 'Pending';
      if (devStatusFilter !== '研发状态') {
          if (devStatusFilter === '待研发') matchDevStatus = currentStatus === 'Pending';
          if (devStatusFilter === '研发中') matchDevStatus = currentStatus === 'In Progress';
          if (devStatusFilter === '测试中') matchDevStatus = currentStatus === 'Testing';
          if (devStatusFilter === '已完成') matchDevStatus = currentStatus === 'Done';
      }

      // Dev Owner
      const matchDevOwner = !devOwnerKeyword || (app.devOwner && app.devOwner.toLowerCase().includes(devOwnerKeyword.toLowerCase()));

      // Keyword (Item2 or Desc)
      const matchKeyword = !keyword || 
          (app.item2 && app.item2.toLowerCase().includes(keyword.toLowerCase())) ||
          (app.desc && app.desc.toLowerCase().includes(keyword.toLowerCase()));

      return matchLevel && matchType && matchOnline && matchDevStatus && matchDevOwner && matchKeyword;
    });
  }, [applications, levelFilter, typeFilter, onlineFilter, devStatusFilter, devOwnerKeyword, keyword]);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-500 mr-2">
            <Filter size={16} />
            <span className="text-sm font-medium">筛选</span>
        </div>

        {/* Level Filter */}
        <select 
          className="form-select text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 pl-3 pr-8"
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

        {/* Type Filter */}
        <select 
          className="form-select text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 pl-3 pr-8"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>申请类型</option>
          <option>新增</option>
          <option>迭代</option>
        </select>

        {/* Online Filter */}
        <select 
          className="form-select text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 pl-3 pr-8"
          value={onlineFilter}
          onChange={(e) => setOnlineFilter(e.target.value)}
        >
          <option>是否线上化</option>
          <option>是</option>
          <option>否</option>
        </select>

        {/* Dev Status Filter */}
        <select 
          className="form-select text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 pl-3 pr-8"
          value={devStatusFilter}
          onChange={(e) => setDevStatusFilter(e.target.value)}
        >
          <option>研发状态</option>
          <option>待研发</option>
          <option>研发中</option>
          <option>测试中</option>
          <option>已完成</option>
        </select>

        {/* Dev Owner Input */}
        <input 
          type="text" 
          placeholder="研发人" 
          className="form-input text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 px-3 w-32"
          value={devOwnerKeyword}
          onChange={(e) => setDevOwnerKeyword(e.target.value)}
        />

        {/* Keyword Input */}
        <input 
          type="text" 
          placeholder="二级事项 / 需求描述" 
          className="form-input text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 px-3 w-48"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        
        <button className="bg-white text-slate-700 border border-slate-300 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center gap-2 shadow-sm ml-auto">
          <Search size={14} /> 查询
        </button>
      </div>

       <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left text-slate-600 whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-semibold tracking-wide">
              <tr>
                <th className="px-6 py-4">奖罚层级</th>
                <th className="px-6 py-4">维度</th>
                <th className="px-6 py-4">一级事项</th>
                <th className="px-6 py-4">二级事项</th>
                <th className="px-6 py-4">申请类型</th>
                <th className="px-6 py-4 max-w-xs">内容说明</th>
                <th className="px-6 py-4">规则接口人</th>
                <th className="px-6 py-4">是否线上化</th>
                <th className="px-6 py-4 w-40">研发人</th>
                <th className="px-6 py-4 w-40">研发状态</th>
                <th className="px-6 py-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{app.rewardPenaltyLevel || '-'}</td>
                  <td className="px-6 py-4">{app.dimension}</td>
                  <td className="px-6 py-4">{app.item1}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{app.item2}</td>
                  <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs border ${
                          app.type === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                      }`}>
                          {app.type === 'New' ? '新增' : '迭代'}
                      </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={app.desc}>{app.desc}</td>
                  <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">Z</div>
                        {app.owner ? app.owner.split(' ')[0] : (app.creator ? app.creator.split('(')[0] : '-')}
                      </div>
                  </td>
                  <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs border ${
                          app.appliedPosition 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                          {app.appliedPosition ? '是' : '否'}
                      </span>
                  </td>
                  <td className="px-6 py-4">
                     <select 
                      className="form-select text-xs border-slate-200 rounded bg-slate-50/50 py-1 pl-2 pr-6 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full hover:bg-white transition-colors"
                      value={app.devOwner || ''}
                      onChange={(e) => onUpdateStatus(app.id, app.devStatus || 'Pending', e.target.value)}
                     >
                       <option value="">分配开发</option>
                       <option value="LiSi">李四 (Dev)</option>
                       <option value="WangWu">王五 (Dev)</option>
                     </select>
                  </td>
                  <td className="px-6 py-4">
                     <select 
                       className={`form-select text-xs border-0 rounded py-1 pl-2 pr-6 focus:ring-2 focus:ring-offset-1 w-full font-medium transition-all ${
                         app.devStatus === 'Done' ? 'bg-emerald-100 text-emerald-800 focus:ring-emerald-500' :
                         app.devStatus === 'In Progress' ? 'bg-blue-100 text-blue-800 focus:ring-blue-500' : 
                         app.devStatus === 'Testing' ? 'bg-indigo-100 text-indigo-800 focus:ring-indigo-500' : 
                         'bg-slate-100 text-slate-600 focus:ring-slate-400'
                       }`}
                       value={app.devStatus || 'Pending'}
                       onChange={(e) => onUpdateStatus(app.id, e.target.value as DevStatus, app.devOwner || '')}
                     >
                       <option value="Pending">待研发</option>
                       <option value="In Progress">研发中</option>
                       <option value="Testing">测试中</option>
                       <option value="Done">已完成</option>
                     </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <button 
                       onClick={() => onViewDetails(app)}
                       className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                     >
                        详情
                     </button>
                  </td>
                </tr>
              ))}
               {filteredApplications.length === 0 && (
                <tr><td colSpan={11} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                        <Code2 size={40} className="text-slate-300 mb-2"/>
                        <span>暂无符合条件的研发任务</span>
                    </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};