import React, { useState, useMemo } from 'react';
import { Application } from '../types';
import { Search, PackageCheck, AlertTriangle, X, Filter } from 'lucide-react';

interface PendingReleaseProps {
  applications: Application[];
  onRelease: (id: string) => void;
  onViewDetails: (app: Application) => void;
}

export const PendingRelease: React.FC<PendingReleaseProps> = ({ applications, onRelease, onViewDetails }) => {
  const [confirmingReleaseId, setConfirmingReleaseId] = useState<string | null>(null);
  
  // Filter States
  const [levelFilter, setLevelFilter] = useState('全部层级');
  const [typeFilter, setTypeFilter] = useState('申请类型');
  const [keyword, setKeyword] = useState('');
  const [creatorKeyword, setCreatorKeyword] = useState('');

  // Filter Logic
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Level (Reward Penalty Level)
      const matchLevel = levelFilter === '全部层级' || app.rewardPenaltyLevel === levelFilter;

      // Type
      let matchType = true;
      if (typeFilter === '新增') matchType = app.type === 'New';
      if (typeFilter === '迭代') matchType = app.type === 'Iterate';

      // Keyword (Item2 or Desc or ID)
      const matchKeyword = !keyword || 
          (app.item2 && app.item2.toLowerCase().includes(keyword.toLowerCase())) ||
          (app.desc && app.desc.toLowerCase().includes(keyword.toLowerCase())) ||
          (app.id && app.id.includes(keyword));

      // Creator
      const matchCreator = !creatorKeyword || (app.creator && app.creator.toLowerCase().includes(creatorKeyword.toLowerCase()));

      return matchLevel && matchType && matchKeyword && matchCreator;
    });
  }, [applications, levelFilter, typeFilter, keyword, creatorKeyword]);

  const handleReleaseClick = (id: string) => {
    setConfirmingReleaseId(id);
  };

  const confirmRelease = () => {
    if (confirmingReleaseId) {
      onRelease(confirmingReleaseId);
      setConfirmingReleaseId(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Filter */}
      <div className="flex items-center justify-between gap-4">
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-3 flex-grow">
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>申请类型</option>
              <option>新增</option>
              <option>迭代</option>
            </select>

            <input 
              type="text" 
              placeholder="搜索规则编码 / 内容关键词" 
              className="form-input text-sm border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-3 w-64 hover:border-slate-400 transition-colors"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
             <input 
              type="text" 
              placeholder="创建人工号" 
              className="form-input text-sm border border-slate-300 bg-white rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 px-3 w-40 hover:border-slate-400 transition-colors"
              value={creatorKeyword}
              onChange={(e) => setCreatorKeyword(e.target.value)}
            />
            <button className="bg-white text-slate-700 border border-slate-300 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center gap-2 shadow-sm">
              <Search size={14} /> 查询
            </button>
         </div>
         <div className="flex-shrink-0">
             <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 hover:shadow-lg transition-all flex items-center gap-2">
                <PackageCheck size={18} />
                批量发布选中项
             </button>
         </div>
      </div>

       <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left text-slate-600 whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-semibold tracking-wide">
              <tr>
                <th className="px-6 py-4 w-10 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-4">奖罚层级</th>
                <th className="px-6 py-4">维度</th>
                <th className="px-6 py-4">一级事项</th>
                <th className="px-6 py-4">二级事项</th>
                <th className="px-6 py-4">申请类型</th>
                <th className="px-6 py-4 max-w-xs">更新内容说明</th>
                <th className="px-6 py-4 max-w-xs">更新原因</th>
                <th className="px-6 py-4">规则接口人</th>
                <th className="px-6 py-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </td>
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
                  <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={app.reason}>{app.reason}</td>
                  <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">Z</div>
                        {app.owner ? app.owner.split(' ')[0] : (app.creator ? app.creator.split('(')[0] : '-')}
                      </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <button 
                      onClick={() => handleReleaseClick(app.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                     >
                       发布
                     </button>
                     <span className="mx-2 text-slate-200">|</span>
                     <button 
                        onClick={() => onViewDetails(app)}
                        className="text-slate-500 hover:text-slate-700 text-xs font-medium hover:underline"
                     >
                        详情
                     </button>
                  </td>
                </tr>
              ))}
               {filteredApplications.length === 0 && (
                <tr><td colSpan={10} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                        <PackageCheck size={40} className="text-slate-300 mb-2"/>
                        <span>暂无符合条件的待发布规则</span>
                    </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmingReleaseId && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirmingReleaseId(null)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full animate-in zoom-in-95 duration-200">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10 text-blue-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-slate-900 flex justify-between">
                      确认发布
                      <button onClick={() => setConfirmingReleaseId(null)} className="text-slate-400 hover:text-slate-500">
                        <X size={20} />
                      </button>
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-500">
                        您确定要发布此规则吗？
                        <br/>
                        发布后，规则将正式生效并应用到生产环境。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmRelease}
                >
                  确认发布
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setConfirmingReleaseId(null)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};