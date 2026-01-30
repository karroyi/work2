import React from 'react';
import { Application } from '../types';
import { X, FileText, Tag, Target, Calculator, Database, User, Calendar } from 'lucide-react';

interface ApplicationDetailViewProps {
  application: Application;
  onClose: () => void;
}

const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-6">
    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-2">
      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
      <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const Field = ({ label, value, fullWidth = false, className = '' }: { label: string, value: React.ReactNode, fullWidth?: boolean, className?: string }) => (
  <div className={`${fullWidth ? 'col-span-full' : ''} ${className}`}>
    <div className="text-sm font-medium text-slate-700 mb-1.5">{label}</div>
    <div className="text-sm text-slate-800 font-medium break-words whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-md px-3 py-2 border border-slate-200 min-h-[42px] flex items-center shadow-sm">
        {value || <span className="text-slate-400 font-normal italic">未填写</span>}
    </div>
  </div>
);

export const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({ application, onClose }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50">
       {/* Header */}
       <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg text-white ${
                 application.type === 'New' ? 'bg-blue-600' : 'bg-purple-600'
             }`}>
                <FileText size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-800">申请详情</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono">ID: {application.id}</span>
                    <span>•</span>
                    <span className={`px-1.5 py-0.5 rounded font-medium ${
                        application.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        application.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                        application.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
                        'bg-orange-100 text-orange-700'
                    }`}>
                        {application.status === 'Pending' && '审批中'}
                        {application.status === 'Approved' && '已通过'}
                        {application.status === 'Rejected' && '已驳回'}
                        {application.status === 'Draft' && '草稿'}
                        {application.status === 'In Dev' && '研发中'}
                        {application.status === 'Ready to Release' && '待发布'}
                        {application.status === 'Released' && '已发布'}
                    </span>
                </div>
             </div>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* 规则基础信息 */}
            <Section title="规则基础信息" icon={Tag}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <Field label="类型" value={application.type === 'New' ? '新增' : '迭代'} />
                    <Field label="奖罚层级" value={application.rewardPenaltyLevel} />
                    <Field label="环节" value={application.level} />
                    {/* Note: Dimension is not in the form UI currently, but is in data. Keeping it hidden to match form or showing it? 
                        Request says "consistent with Iterate Rule page form fields". If form doesn't show it, we might skip or show.
                        Let's show it as it's critical info, but maybe user wants strict visual match. 
                        Given Form code provided earlier, Dimension was missing in Render but present in State. 
                        I will assume we should display Item1/Item2 prominently. */}
                    <Field label="一级事项" value={application.item1} />
                    <Field label="二级事项" value={application.item2} />
                    
                    <Field label="奖罚事项说明及取数逻辑" value={application.logic} fullWidth />
                    
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <Field label="新奖励规则" value={application.rewardStd} className="bg-white" />
                        <Field label="新扣罚规则" value={application.penaltyStd} className="bg-white" />
                    </div>

                    <Field label="应用对象" value={application.target} />
                    <Field label="规则制定组织" value={application.org} />
                    <Field label="规则接口人" value={application.owner} />
                    <Field label="规则制定人员" value={application.creator} />
                    <Field label={application.type === 'New' ? "首次应用时间" : "迭代应用时间"} value={application.createTime} />
                </div>
            </Section>

            {/* 本次申请说明 */}
            <Section title="本次申请说明" icon={User}>
                <div className="space-y-6">
                    {application.type === 'Iterate' && (
                        <Field label="迭代内容说明" value={application.desc} fullWidth />
                    )}
                    <Field label={application.type === 'Iterate' ? "迭代原因说明" : "申请原因说明"} value={application.reason} fullWidth />
                </div>
            </Section>

            {/* 规则牵引目标 */}
            <Section title="规则牵引目标" icon={Target}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <Field label="牵引指标名称" value={application.tractionMetric} />
                    <Field label="指标当前值" value={application.tractionCurrent} />
                    <div className="col-span-full">
                        <div className="text-sm font-medium text-slate-700 mb-1.5">指标目标值</div>
                        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                            {application.tractionTargets?.map((t, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <span className="text-xs text-slate-500 text-center">{i + 1}月</span>
                                    <div className="bg-slate-50 border border-slate-200 rounded-md py-1 px-1 text-center text-sm font-medium text-slate-800 h-[38px] flex items-center justify-center">
                                        {t || '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Field label="线上化取数逻辑" value={application.tractionLogic} fullWidth />
                    <Field label="取数底表" value={application.tractionTable} fullWidth />
                 </div>
            </Section>

             {/* 规则测算数据 */}
            <Section title="规则测算数据" icon={Calculator}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <Field label="月均奖励金额" value={application.calcAvgReward} />
                    <Field label="月均扣罚金额" value={application.calcAvgPenalty} />
                    <Field label="极限奖励金额" value={application.calcLimitReward} />
                    <Field label="极限扣罚金额" value={application.calcLimitPenalty} />
                    <Field label="金额计算公式或计算逻辑" value={application.calcFormula} fullWidth />
                    <Field label="测算数据明细" value={application.calcFile || "未上传"} fullWidth />
                </div>
            </Section>

            {/* 奖罚金额线上化取数逻辑 */}
            <Section title="奖罚金额线上化取数逻辑" icon={Database}>
                <div className="space-y-6">
                    <div className="flex items-center gap-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                      <span className="text-sm font-medium text-slate-700">是否可以线上化:</span>
                      <span className="font-medium text-blue-700">
                          {application.appliedPosition ? '是，可以线上化' : '否，暂需手工处理'}
                      </span>
                    </div>

                    {application.appliedPosition && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <Field label="应用岗位" value={application.appliedPosition} />
                            <Field label="应用产品" value={application.appliedProduct} />
                        </div>
                    )}
                </div>
            </Section>
        </div>
      </div>
    </div>
  );
};