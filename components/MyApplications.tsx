import React, { useState, useMemo } from 'react';
import { Application } from '../types';
import { Search, Filter, Clock } from 'lucide-react';

interface MyApplicationsProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onViewDetails: (app: Application) => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({ applications, onEdit, onViewDetails }) => {
  // Filter States
  const [levelFilter, setLevelFilter] = useState('全部层级');
  const [dimensionFilter, setDimensionFilter] = useState('全部维度');
  const [itemKeyword, setItemKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('申请类型');
  const [statusFilter, setStatusFilter] = useState('状态');

  // Filter Logic
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchLevel = levelFilter === '全部层级' || app.rewardPenaltyLevel === levelFilter;
      const matchDimension = dimensionFilter === '全部维度' || app.dimension === dimensionFilter;
      const matchItem = !itemKeyword || (app.item2 && app.item2.toLowerCase().includes(itemKeyword.toLowerCase()));
      
      let matchType = true;
      if (typeFilter === '新增') matchType = app.type === 'New';
      if (typeFilter === '迭代') matchType = app.type === 'Iterate';

      let matchStatus = true;
      if (statusFilter !== '状态') {
          switch (statusFilter) {
              case '草稿': matchStatus = app.status === 'Draft'; break;
              case '审批中': matchStatus = app.status === 'Pending'; break;
              case '已驳回': matchStatus = app.status === 'Rejected'; break;
              case '待研发': matchStatus = app.status === 'Approved'; break;
              case '研发中': matchStatus = app.status === 'In Dev'; break;
              case '待发布': matchStatus = app.status === 'Ready to Release'; break;
              case '已发布': matchStatus = app.status === 'Released'; break;
              default: matchStatus = true;
          }
      }

      return matchLevel && matchDimension && matchItem && matchType && matchStatus;
    });
  }, [applications, levelFilter, dimensionFilter, itemKeyword, typeFilter, statusFilter]);

  return (
    <div className="space-y-6">
       {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-500 mr-2">
            <Filter size={16} />
            <span className="text-sm font-medium">筛选</span>
        </div>
        
        {/* Changed from '全部环节' to '全部层级' (Reward Penalty Level) */}
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
          placeholder="二级事项" 
          className="form-input text-sm border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-3 w-40 hover:border-slate-400 transition-colors"
          value={itemKeyword}
          onChange={(e) => setItemKeyword(e.target.value)}
        />

        <select 
          className="form-select text-sm border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 pl-3 pr-8 hover:border-slate-400 transition-colors"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>申请类型</option>
          <option>新增</option>
          <option>迭代</option>
        </select>

        <select 
          className="form-select text-sm border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 pl-3 pr-8 hover:border-slate-400 transition-colors"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>状态</option>
          <option>草稿</option>
          <option>审批中</option>
          <option>已驳回</option>
          <option>待研发</option>
          <option>研发中</option>
          <option>待发布</option>
          <option>已发布</option>
        </select>

        <button className="bg-white text-slate-700 border border-slate-300 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center gap-2 shadow-sm ml-auto">
          <Search size={14} /> 查询
        </button>
      </div>

      {/* Table */}
       <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-semibold tracking-wide">
              <tr>
                <th className="px-6 py-4">奖罚层级</th>
                <th className="px-6 py-4">维度</th>
                <th className="px-6 py-4">一级事项</th>
                <th className="px-6 py-4">二级事项</th>
                <th className="px-6 py-4">申请类型</th>
                <th className="px-6 py-4 max-w-xs">更新内容说明</th>
                <th className="px-6 py-4 max-w-xs">更新原因</th>
                <th className="px-6 py-4">创建人</th>
                <th className="px-6 py-4">创建时间</th>
                <th className="px-6 py-4 text-center">版本</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4 text-center sticky right-0 bg-slate-50 z-10 border-l border-slate-100 shadow-[rgba(0,0,0,0.05)_0px_0px_10px_-5px_inset]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-700">{app.rewardPenaltyLevel || '-'}</td>
                  <td className="px-6 py-4">{app.dimension}</td>
                  <td className="px-6 py-4">{app.item1}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{app.item2}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        app.type === 'New' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                     }`}>
                        {app.type === 'New' ? '新增' : '迭代'}
                     </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={app.desc}>{app.desc}</td>
                  <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={app.reason}>{app.reason}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-bold">
                            {app.creator.charAt(0)}
                        </div>
                        {app.creator.split('(')[0]}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{app.createTime}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">v{app.version}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      app.status === 'In Dev' ? 'bg-violet-50 text-violet-700 border-violet-200' : 
                      app.status === 'Ready to Release' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 
                      app.status === 'Released' ? 'bg-slate-50 text-slate-700 border-slate-200' : 
                      app.status === 'Draft' ? 'bg-slate-100 text-slate-500 border-slate-300' :
                      'bg-orange-50 text-orange-700 border-orange-200' // Pending
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                          app.status === 'Approved' ? 'bg-emerald-500' : 
                          app.status === 'Rejected' ? 'bg-rose-500' :
                          app.status === 'In Dev' ? 'bg-violet-500' : 
                          app.status === 'Ready to Release' ? 'bg-cyan-500' :
                          app.status === 'Released' ? 'bg-slate-500' :
                          app.status === 'Draft' ? 'bg-slate-400' :
                          'bg-orange-500'
                      }`}></span>
                      {app.status === 'Draft' && '草稿'}
                      {app.status === 'Pending' && '审批中'}
                      {app.status === 'Rejected' && '已驳回'}
                      {app.status === 'Approved' && '待研发'}
                      {app.status === 'In Dev' && '研发中'}
                      {app.status === 'Ready to Release' && '待发布'}
                      {app.status === 'Released' && '已发布'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right sticky right-0 bg-white group-hover:bg-slate-50 border-l border-slate-100 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                     <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100">
                       {(app.status === 'Draft' || app.status === 'Rejected') ? (
                           <button 
                             onClick={() => onEdit(app)}
                             className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                           >
                              编辑
                           </button>
                       ) : (
                           <button 
                             onClick={() => onViewDetails(app)}
                             className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                           >
                              详情
                           </button>
                       )}
                       {(app.status === 'Pending' || app.status === 'Draft' || app.status === 'Rejected') && 
                       <button className="text-rose-600 hover:text-rose-800 font-medium text-xs">
                          {app.status === 'Draft' || app.status === 'Rejected' ? '删除' : '撤回'}
                       </button>}
                     </div>
                  </td>
                </tr>
              ))}
               {filteredApplications.length === 0 && (
                <tr><td colSpan={12} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                        <Clock size={48} strokeWidth={1} className="mb-3"/>
                        <p className="text-sm font-medium text-slate-900">暂无符合条件的申请记录</p>
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