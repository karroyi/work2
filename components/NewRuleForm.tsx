import React, { useState, useEffect } from 'react';
import { Application } from '../types';
import { AlertCircle, Save, Send, X, Upload, Info } from 'lucide-react';

interface NewRuleFormProps {
  mode?: 'create' | 'iterate';
  initialData?: Partial<Application>;
  onSubmit: (data: Partial<Application>) => void;
  onSaveDraft: (data: Partial<Application>) => void;
  onCancel: () => void;
}

export const NewRuleForm: React.FC<NewRuleFormProps> = ({ 
  mode = 'create', 
  initialData, 
  onSubmit, 
  onSaveDraft, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    ruleId: '', // Track original rule ID for iterations
    type: mode === 'iterate' ? 'Iterate' : '',
    level: '', 
    rewardPenaltyLevel: '',
    dimension: '',
    item1: '',
    item2: '',
    logic: '',
    iterateContent: '', 
    rewardRule: '',
    penaltyRule: '',
    target: '',
    org: '',
    owner: '',
    date: '',
    reason: '',
    itLogic: '',
    isOnline: 'Yes',
    // Traction Goal Fields
    tractionMetric: '',
    tractionCurrent: '',
    tractionTargets: Array(12).fill(''),
    tractionLogic: '',
    tractionTable: '',
    // Calculation Data Fields
    calcAvgReward: '',
    calcAvgPenalty: '',
    calcLimitReward: '',
    calcLimitPenalty: '',
    calcFormula: '',
    calcFile: '',
    // Online Logic Extra Fields
    appliedPosition: '',
    appliedProduct: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ruleId: initialData.ruleId || '',
        level: initialData.level || '',
        rewardPenaltyLevel: initialData.rewardPenaltyLevel || '',
        dimension: initialData.dimension || '',
        item1: initialData.item1 || '',
        item2: initialData.item2 || '',
        logic: initialData.logic || initialData.desc || '', 
        iterateContent: mode === 'iterate' ? (initialData.type === 'Iterate' && initialData.desc ? initialData.desc : '') : '',
        rewardRule: initialData.rewardStd || '',
        penaltyRule: initialData.penaltyStd || '',
        target: initialData.target || '',
        org: initialData.org || '',
        owner: initialData.owner || '',
        type: mode === 'iterate' ? 'Iterate' : (initialData.type || ''),
        reason: initialData.reason || '',
        tractionMetric: initialData.tractionMetric || '',
        tractionCurrent: initialData.tractionCurrent || '',
        tractionTargets: initialData.tractionTargets || Array(12).fill(''),
        tractionLogic: initialData.tractionLogic || '',
        tractionTable: initialData.tractionTable || '',
        calcAvgReward: initialData.calcAvgReward || '',
        calcAvgPenalty: initialData.calcAvgPenalty || '',
        calcLimitReward: initialData.calcLimitReward || '',
        calcLimitPenalty: initialData.calcLimitPenalty || '',
        calcFormula: initialData.calcFormula || '',
        appliedPosition: initialData.appliedPosition || '',
        appliedProduct: initialData.appliedProduct || '',
      }));
    }
  }, [initialData, mode]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTargetChange = (index: number, value: string) => {
    const newTargets = [...formData.tractionTargets];
    newTargets[index] = value;
    setFormData(prev => ({ ...prev, tractionTargets: newTargets }));
  };

  const getCommonData = (): Partial<Application> => ({
    ruleId: formData.ruleId,
    level: formData.level || '全环节',
    rewardPenaltyLevel: formData.rewardPenaltyLevel || '地区',
    dimension: formData.dimension || '风控',
    item1: formData.item1,
    item2: formData.item2,
    type: formData.type === 'Iterate' ? 'Iterate' : 'New',
    desc: mode === 'iterate' ? formData.iterateContent : (formData.logic || '新增规则申请'),
    logic: formData.logic,
    reason: formData.reason,
    createTime: new Date().toISOString().split('T')[0],
    creator: 'Current User',
    version: 1,
    rewardStd: formData.rewardRule,
    penaltyStd: formData.penaltyRule,
    target: formData.target,
    org: formData.org,
    owner: formData.owner,
    tractionMetric: formData.tractionMetric,
    tractionCurrent: formData.tractionCurrent,
    tractionTargets: formData.tractionTargets,
    tractionLogic: formData.tractionLogic,
    tractionTable: formData.tractionTable,
    calcAvgReward: formData.calcAvgReward,
    calcAvgPenalty: formData.calcAvgPenalty,
    calcLimitReward: formData.calcLimitReward,
    calcLimitPenalty: formData.calcLimitPenalty,
    calcFormula: formData.calcFormula,
    calcFile: formData.calcFile,
    appliedPosition: formData.appliedPosition,
    appliedProduct: formData.appliedProduct,
  });

  const handleSubmit = () => {
    // Added validation for rewardPenaltyLevel
    if (!formData.item1 || !formData.item2 || !formData.level || !formData.rewardPenaltyLevel) {
      alert("请填写必填项");
      return;
    }

    if (mode === 'iterate' && !formData.iterateContent) {
        alert("请填写迭代内容说明");
        return;
    }

    const newApp: Partial<Application> = {
      ...getCommonData(),
      status: 'Pending',
    };
    
    onSubmit(newApp);
  };

  const handleSaveDraft = () => {
    const draftApp: Partial<Application> = {
      ...getCommonData(),
      status: 'Draft',
    };
    onSaveDraft(draftApp);
  };

  const InputLabel = ({ label, required = false }: { label: string, required?: boolean }) => (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {required && <span className="text-rose-500 mr-1">*</span>}
      {label}
    </label>
  );

  const inputClass = "block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 text-slate-900 placeholder:text-slate-400 transition-shadow";
  const selectClass = "block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 text-slate-900 transition-shadow";
  const textareaClass = "block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 text-slate-900 placeholder:text-slate-400 min-h-[100px] resize-y transition-shadow";

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 p-6 space-y-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  规则基础信息
              </h2>
              <span className="text-xs text-slate-500 flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  <AlertCircle size={12} />
                  带 * 号为必填项
              </span>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <InputLabel label="类型" required />
              <select 
                className={selectClass}
                onChange={(e) => handleChange('type', e.target.value)}
                value={formData.type}
                disabled={mode === 'iterate'} // Lock type if iterating
              >
                <option value="">请选择申请类型</option>
                <option value="New">新增</option>
                <option value="Iterate">迭代</option>
              </select>
            </div>
            
            <div>
              <InputLabel label="奖罚层级" required />
              <select 
                className={selectClass}
                onChange={(e) => handleChange('rewardPenaltyLevel', e.target.value)}
                value={formData.rewardPenaltyLevel}
              >
                <option value="">请选择层级</option>
                <option value="地区">地区</option>
                <option value="收派岗">收派岗</option>
                <option value="仓管岗">仓管岗</option>
                <option value="小件中转">小件中转</option>
                <option value="大件中转">大件中转</option>
                <option value="司机岗">司机岗</option>
              </select>
            </div>

            <div>
              <InputLabel label="环节" required />
              <select 
                className={selectClass}
                onChange={(e) => handleChange('level', e.target.value)}
                value={formData.level}
              >
                <option value="">请选择环节</option>
                <option value="全环节">全环节</option>
                <option value="收派环节">收派环节</option>
                <option value="中转环节">中转环节</option>
                <option value="运输环节">运输环节</option>
                <option value="规划环节">规划环节</option>
              </select>
            </div>
            <div>
              <InputLabel label="一级事项" required />
              <input type="text" className={inputClass} placeholder="请输入一级事项"
                value={formData.item1} onChange={(e) => handleChange('item1', e.target.value)}
              />
            </div>
            <div>
              <InputLabel label="二级事项" required />
              <input type="text" className={inputClass} placeholder="请输入二级事项"
                value={formData.item2} onChange={(e) => handleChange('item2', e.target.value)}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <InputLabel label="奖罚事项说明及取数逻辑" required />
              <textarea className={textareaClass}
                value={formData.logic} onChange={(e) => handleChange('logic', e.target.value)}
                placeholder="详细描述逻辑..."
              ></textarea>
            </div>

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                  <InputLabel label="新奖励规则" required />
                  <textarea 
                    className={`${textareaClass} bg-white`} 
                    placeholder="描述奖励标准..."
                    value={formData.rewardRule}
                    onChange={(e) => handleChange('rewardRule', e.target.value)}
                  ></textarea>
              </div>
              
              <div>
                  <InputLabel label="新扣罚规则" required />
                  <textarea 
                    className={`${textareaClass} bg-white`} 
                    placeholder="描述扣罚标准..."
                    value={formData.penaltyRule}
                    onChange={(e) => handleChange('penaltyRule', e.target.value)}
                  ></textarea>
              </div>
            </div>

            <div>
              <InputLabel label="应用对象" required />
              <input 
                type="text" className={inputClass} placeholder="如：业务区、中转场" 
                value={formData.target} onChange={(e) => handleChange('target', e.target.value)}
              />
            </div>
            <div>
              <InputLabel label="规则制定组织" required />
              <input 
                type="text" className={inputClass} placeholder="如：小件组织运营处" 
                value={formData.org} onChange={(e) => handleChange('org', e.target.value)}
              />
            </div>
            <div>
              <InputLabel label="规则接口人" required />
              <select 
                className={selectClass}
                value={formData.owner} onChange={(e) => handleChange('owner', e.target.value)}
              >
                <option value="">请选择</option>
                <option value="张三 (Z001)">张三 (Z001)</option>
                <option value="王强">王强</option>
                <option value="邹思琦">邹思琦</option>
                <option value="刘洋">刘洋</option>
                <option value="陈平">陈平</option>
                <option value="周杰">周杰</option>
                <option value="郑爽">郑爽</option>
              </select>
            </div>
            <div>
              <InputLabel label="规则制定人员" required />
              <select className={selectClass}>
                <option>请选择</option>
                <option>李四 (L002)</option>
                <option>当前用户</option>
              </select>
            </div>
            <div>
              <InputLabel label={mode === 'iterate' ? "迭代应用时间" : "首次应用时间"} required />
              <input type="date" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  本次申请说明
              </h2>
          </div>
          <div className="p-8 space-y-6">
            
            {mode === 'iterate' && (
                <div>
                    <InputLabel label="迭代内容说明" required />
                    <textarea 
                      placeholder="请详细描述本次迭代修改的内容..."
                      className={textareaClass}
                      value={formData.iterateContent} 
                      onChange={(e) => handleChange('iterateContent', e.target.value)}
                    ></textarea>
                </div>
            )}

            <div>
                <InputLabel label={mode === 'iterate' ? "迭代原因说明" : "申请原因说明"} required />
                <textarea 
                  placeholder={mode === 'iterate' ? "一、为什么要迭代？\n二、是为了牵引达到什么业务目的？" : "一、为什么要做？当前业务有什么问题？\n二、是为了牵引达到什么业务目的？"}
                  className={`${textareaClass} h-32`}
                  value={formData.reason} onChange={(e) => handleChange('reason', e.target.value)}
                ></textarea>
                <p className="mt-2 text-xs text-slate-400">请清晰描述背景和目的，以便快速通过审批。</p>
            </div>
          </div>
        </div>

        {/* Rule Traction Goal Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  规则牵引目标
              </h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
                <InputLabel label="牵引指标名称" required />
                <input 
                  type="text" 
                  className={inputClass} 
                  placeholder="请设定本场景的直接指标"
                  value={formData.tractionMetric}
                  onChange={(e) => handleChange('tractionMetric', e.target.value)}
                />
            </div>
            <div>
                <InputLabel label="指标当前值" required />
                <input 
                  type="text" 
                  className={inputClass}
                  value={formData.tractionCurrent}
                  onChange={(e) => handleChange('tractionCurrent', e.target.value)}
                />
            </div>
            
            <div className="col-span-1 md:col-span-2">
                <InputLabel label="指标目标值" required />
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mt-2">
                    {formData.tractionTargets.map((val, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                            <span className="text-xs text-slate-500 text-center">{idx + 1}月</span>
                            <input 
                                type="text" 
                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-1 py-1 text-center"
                                value={val}
                                onChange={(e) => handleTargetChange(idx, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-span-1 md:col-span-2">
                <InputLabel label="线上化取数逻辑" required />
                <textarea 
                  className={textareaClass}
                  value={formData.tractionLogic}
                  onChange={(e) => handleChange('tractionLogic', e.target.value)}
                ></textarea>
            </div>

            <div className="col-span-1 md:col-span-2">
                <InputLabel label="取数底表" required />
                <input 
                  type="text" 
                  className={inputClass}
                  value={formData.tractionTable}
                  onChange={(e) => handleChange('tractionTable', e.target.value)}
                />
            </div>
          </div>
        </div>

        {/* Rule Calculation Data Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  规则测算数据
                  <span className="text-xs font-normal text-slate-400 ml-2">取用近12个月的历史实际数据进行测算</span>
              </h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
                <InputLabel label="月均奖励金额" required />
                <input 
                  type="text" 
                  className={inputClass} 
                  value={formData.calcAvgReward}
                  onChange={(e) => handleChange('calcAvgReward', e.target.value)}
                />
            </div>
            <div>
                <InputLabel label="月均扣罚金额" required />
                <input 
                  type="text" 
                  className={inputClass}
                  value={formData.calcAvgPenalty}
                  onChange={(e) => handleChange('calcAvgPenalty', e.target.value)}
                />
            </div>
            <div>
                <InputLabel label="极限奖励金额" required />
                <input 
                  type="text" 
                  className={inputClass} 
                  value={formData.calcLimitReward}
                  onChange={(e) => handleChange('calcLimitReward', e.target.value)}
                />
            </div>
            <div>
                <InputLabel label="极限扣罚金额" required />
                <input 
                  type="text" 
                  className={inputClass}
                  value={formData.calcLimitPenalty}
                  onChange={(e) => handleChange('calcLimitPenalty', e.target.value)}
                />
            </div>

            <div className="col-span-1 md:col-span-2">
                <InputLabel label="金额计算公式或计算逻辑" required />
                <textarea 
                  className={textareaClass}
                  value={formData.calcFormula}
                  onChange={(e) => handleChange('calcFormula', e.target.value)}
                ></textarea>
            </div>

            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2">
                    <InputLabel label="测算数据明细" required />
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline flex items-center gap-1 -mt-1.5 ml-1">
                        点击上传
                    </button>
                    {formData.calcFile && <span className="text-xs text-emerald-600 -mt-1.5">已上传</span>}
                </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  奖罚金额线上化取数逻辑
              </h2>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <span className="text-sm font-medium text-slate-700">是否可以线上化:</span>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition-colors">
                  <input 
                    type="radio" 
                    name="online" 
                    checked={formData.isOnline === 'Yes'}
                    onChange={() => handleChange('isOnline', 'Yes')}
                    className="text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300"
                  /> 
                  <span className="font-medium">是，可以线上化</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition-colors">
                  <input 
                    type="radio" 
                    name="online" 
                    checked={formData.isOnline === 'No'}
                    onChange={() => handleChange('isOnline', 'No')}
                    className="text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300"
                  /> 
                  <span className="font-medium">否，暂需手工处理</span>
                </label>
              </div>
            </div>

            {formData.isOnline === 'Yes' ? (
                <>
                    <div>
                      <InputLabel label="BDP表" required />
                      <input type="text" className={inputClass} placeholder="输入数据表名" />
                    </div>

                    <div>
                      <InputLabel label="取数逻辑" required />
                      <textarea 
                        placeholder="请详细描述取数字段和过滤条件..."
                        className={textareaClass}
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div>
                            <InputLabel label="应用岗位" />
                            <input 
                                type="text" 
                                className={inputClass} 
                                placeholder="请输入应用岗位" 
                                value={formData.appliedPosition}
                                onChange={(e) => handleChange('appliedPosition', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputLabel label="应用产品" />
                            <input 
                                type="text" 
                                className={inputClass} 
                                placeholder="请输入应用产品" 
                                value={formData.appliedProduct}
                                onChange={(e) => handleChange('appliedProduct', e.target.value)}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                    <Info size={20} className="mt-0.5 shrink-0" />
                    <p className="text-sm">请在每月统计好数据后联系张三提供手工数据。</p>
                </div>
            )}
          </div>
        </div>
      </div>

       <div className="flex items-center justify-end gap-3 p-4 bg-white border-t border-slate-200 sticky bottom-0 z-10 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={onCancel}
            className="px-5 py-2.5 bg-white text-slate-600 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm flex items-center gap-2"
          >
            <X size={16} /> 取消
          </button>
          <button 
            onClick={handleSaveDraft}
            className="px-5 py-2.5 bg-white text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Save size={16} /> 保存草稿
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-200 hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Send size={16} /> 确认提交
          </button>
       </div>
    </div>
  );
};