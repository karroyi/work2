import React, { useState } from 'react';
import { FileText, ClipboardList, Send, PackageCheck, Menu, Bell, User, X } from 'lucide-react';
import { MyRules } from './components/MyRules';
import { NewRuleForm } from './components/NewRuleForm';
import { MyApplications } from './components/MyApplications';
import { TechDev } from './components/TechDev';
import { PendingRelease } from './components/PendingRelease';
import { RuleDetailView } from './components/RuleDetailView';
import { ApplicationDetailView } from './components/ApplicationDetailView';
import { PermissionModal } from './components/PermissionModal';
import { OfflineConfirmModal } from './components/OfflineConfirmModal';
import { Rule, Application, DevStatus, RuleStatus } from './types';

// Mock Data
const INITIAL_RULES: Rule[] = [
  {
    id: '1', level: '收派环节', rewardPenaltyLevel: '收派岗', dimension: '风控', item1: '操作失误', item2: '违规计重', 
    logic: '快件经过动态秤/人工复重后，复重重量与揽收重量产生偏差，超出阈值则触发。', 
    rewardStd: '季度返还规则: 业务区改善返还', 
    penaltyStd: '按违规率+违规金额进行分组，A类处罚100元/单', 
    target: '业务区', org: '小件组织运营处', owner: '邹思琦', creator: '陈杜娟',
    firstApplyDate: '2025年1月', updateDate: '', version: 1, status: 'Active'
  },
  {
    id: '2', level: '收派环节', rewardPenaltyLevel: '收派岗', dimension: '服务', item1: '客户投诉', item2: '态度恶劣', 
    logic: '客户通过95338或APP投诉收派员态度问题，经核实为有效投诉。', 
    rewardStd: '无', 
    penaltyStd: '每次扣罚200元，严重者停岗培训', 
    target: '收派员', org: '服务质量处', owner: '张伟', creator: '李娜',
    firstApplyDate: '2024年6月', updateDate: '2025年2月', version: 3, status: 'Active'
  },
  {
    id: '3', level: '中转环节', rewardPenaltyLevel: '仓管岗', dimension: '质量', item1: '货物保管', item2: '货物破损', 
    logic: '库内操作不当导致货物外包装破损或内件损坏。', 
    rewardStd: '连续100天无破损奖励500元', 
    penaltyStd: '按货物价值赔偿，并扣绩效分10分', 
    target: '仓管员', org: '仓储管理部', owner: '王强', creator: '赵敏',
    firstApplyDate: '2024年11月', updateDate: '', version: 1, status: 'Active'
  },
  {
    id: '4', level: '中转环节', rewardPenaltyLevel: '小件中转', dimension: '效率', item1: '操作时效', item2: '中转延误', 
    logic: '快件到达中转场后，未在规定时间内完成分拣扫描。', 
    rewardStd: '时效达成率前三名班组奖励1000元', 
    penaltyStd: '延误每票扣罚50元', 
    target: '分拣班组', org: '中转规划处', owner: '刘洋', creator: '钱七',
    firstApplyDate: '2025年1月', updateDate: '', version: 1, status: 'Inactive'
  },
  {
    id: '5', level: '运输环节', rewardPenaltyLevel: '司机岗', dimension: '安全', item1: '车辆管理', item2: '疲劳驾驶', 
    logic: '车载GPS监测到连续驾驶超过4小时未休息。', 
    rewardStd: '年度安全驾驶员奖励2000元', 
    penaltyStd: '立即强制休息，并扣罚500元', 
    target: '干线司机', org: '运输管理处', owner: '陈平', creator: '孙武',
    firstApplyDate: '2023年5月', updateDate: '2024年12月', version: 5, status: 'Active'
  },
  {
    id: '6', level: '中转环节', rewardPenaltyLevel: '大件中转', dimension: '质量', item1: '错分', item2: '路由错误', 
    logic: '大件货物未按路由规划装车，导致货物发往错误目的地。', 
    rewardStd: '错分率低于0.01%奖励班组长', 
    penaltyStd: '每票错分扣罚责任人100元', 
    target: '装卸组', org: '大件运营部', owner: '周杰', creator: '吴刚',
    firstApplyDate: '2024年9月', updateDate: '', version: 2, status: 'Active'
  },
  {
    id: '7', level: '全环节', rewardPenaltyLevel: '地区', dimension: '成本', item1: '物料管理', item2: '包装浪费', 
    logic: '网点包装材料消耗与发件量比例异常，超出标准值20%。', 
    rewardStd: '成本节约奖', 
    penaltyStd: '超出部分按成本价2倍扣罚', 
    target: '经营分部', org: '成本控制中心', owner: '郑爽', creator: '林峰',
    firstApplyDate: '2025年3月', updateDate: '', version: 1, status: 'Active'
  },
  {
    id: '8', level: '收派环节', rewardPenaltyLevel: '收派岗', dimension: '形象', item1: '着装规范', item2: '未穿工服', 
    logic: '晨会检查或神秘顾客抽查发现未按规定穿着工服。', 
    rewardStd: '无', 
    penaltyStd: '每次扣罚50元', 
    target: '收派员', org: '服务质量处', owner: '张伟', creator: '王五',
    firstApplyDate: '2024年1月', updateDate: '', version: 1, status: 'Active'
  }
];

const INITIAL_APPS: Application[] = [
  {
    id: '101', level: '运输环节', rewardPenaltyLevel: '司机岗', dimension: '成本', item1: '油耗管理', item2: '油耗超标',
    type: 'New', desc: '新增百公里油耗考核标准，区分车型设定阈值。', reason: '降低运输成本，响应节能减排号召。',
    creator: '张三(012345)', createTime: '2025年3月10日', version: 1, status: 'Pending'
  },
  {
    id: '102', level: '中转环节', rewardPenaltyLevel: '大件中转', dimension: '效率', item1: '装车效率', item2: '装载率不足',
    type: 'New', desc: '车辆装载率低于80%且无报备，触发预警和扣罚。', reason: '提升干线运输车辆利用率。',
    creator: '李四(55555)', createTime: '2025年3月08日', version: 1, status: 'Approved', devStatus: 'Pending'
  },
  {
    id: '103', level: '中转环节', rewardPenaltyLevel: '仓管岗', dimension: '安全', item1: '消防安全', item2: '通道占用',
    type: 'Iterate', desc: '调整处罚金额，从50元/次上调至200元/次。', reason: '加强安全红线意识。',
    creator: '王五(66666)', createTime: '2025年2月20日', version: 2, status: 'Ready to Release', devStatus: 'Done', devOwner: 'LiSi'
  },
  {
    id: '104', level: '中转环节', rewardPenaltyLevel: '小件中转', dimension: '质量', item1: '破损', item2: '暴力分拣',
    type: 'New', desc: '通过AI监控识别暴力分拣行为，自动生成罚单。', reason: '利用科技手段降低破损率。',
    creator: '赵六(77777)', createTime: '2025年3月01日', version: 1, status: 'In Dev', devStatus: 'In Progress', devOwner: 'WangWu'
  },
  {
    id: '105', level: '收派环节', rewardPenaltyLevel: '收派岗', dimension: '业务', item1: '拓客', item2: '新签客户',
    type: 'Iterate', desc: '新增月结客户奖励阶梯。', reason: '激励全员营销。',
    creator: '钱七(88888)', createTime: '2025年3月12日', version: 3, status: 'Pending'
  },
  {
    id: '106', level: '收派环节', rewardPenaltyLevel: '收派岗', dimension: '服务', item1: '投诉', item2: '虚假签收',
    type: 'Iterate', desc: '新增虚假签收的判定逻辑，增加GPS围栏校验。', reason: '客户投诉率上升。',
    creator: '周八(99999)', createTime: '2025年3月14日', version: 2, status: 'Rejected'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('my-rules');
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPS);
  
  // Drawer States
  const [isNewRuleDrawerOpen, setIsNewRuleDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isAppDetailDrawerOpen, setIsAppDetailDrawerOpen] = useState(false);
  
  // Modal States
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [selectedRuleForAction, setSelectedRuleForAction] = useState<Rule | null>(null);
  
  // Form/Detail Data States
  const [formMode, setFormMode] = useState<'create' | 'iterate'>('create');
  const [iteratingRuleData, setIteratingRuleData] = useState<Partial<Application> | undefined>(undefined);
  const [selectedRuleForDetail, setSelectedRuleForDetail] = useState<Rule | null>(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<Application | null>(null);

  // Open New Rule Drawer (Standard)
  const openNewRuleDrawer = () => {
    setFormMode('create');
    setIteratingRuleData(undefined);
    setIsNewRuleDrawerOpen(true);
  };

  // Open Iterate Rule Drawer
  const handleIterateRule = (rule: Rule) => {
    // Convert Rule to Partial<Application> for form pre-filling
    const appData: Partial<Application> = {
      ruleId: rule.id, // Store original rule ID to track iteration
      level: rule.level,
      rewardPenaltyLevel: rule.rewardPenaltyLevel,
      dimension: rule.dimension,
      item1: rule.item1,
      item2: rule.item2,
      logic: rule.logic, // Map rule logic to Application logic field
      desc: '', // Clear desc so user can enter iteration content
      rewardStd: rule.rewardStd,
      penaltyStd: rule.penaltyStd,
      target: rule.target,
      org: rule.org,
      owner: rule.owner,
      type: 'Iterate' // Force type to Iterate
    };
    
    setFormMode('iterate');
    setIteratingRuleData(appData);
    setIsNewRuleDrawerOpen(true);
  };

  const handleEditApplication = (app: Application) => {
    // If New, mode='create', if Iterate, mode='iterate'
    const mode = app.type === 'Iterate' ? 'iterate' : 'create';
    setFormMode(mode);
    setIteratingRuleData(app);
    setIsNewRuleDrawerOpen(true);
  };

  const handleViewApplicationDetails = (app: Application) => {
    setSelectedAppForDetail(app);
    setIsAppDetailDrawerOpen(true);
  };

  // Handle View Details
  const handleViewDetails = (rule: Rule) => {
    setSelectedRuleForDetail(rule);
    setIsDetailDrawerOpen(true);
  };

  // Handle Permission Manage
  const handleManagePermissions = (rule: Rule) => {
      setSelectedRuleForAction(rule);
      setIsPermissionModalOpen(true);
  };
  
  // Handle Offline
  const handleOfflineRule = (rule: Rule) => {
      setSelectedRuleForAction(rule);
      setIsOfflineModalOpen(true);
  };

  const handleUpdatePermissions = (ruleId: string, creator: string, owner: string) => {
      setRules(prev => prev.map(r => 
          r.id === ruleId ? { ...r, creator, owner } : r
      ));
      alert("权限更新成功");
  };

  const handleConfirmOffline = (ruleId: string) => {
      setRules(prev => prev.map(r => 
          r.id === ruleId ? { ...r, status: 'Inactive' } : r
      ));
  };

  // Handle new rule submission (Confirm Submit)
  const handleCreateSubmit = (data: Partial<Application>) => {
    const newApp: Application = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      creator: '当前用户',
      status: 'Pending',
    } as Application;
    
    // Check if we are updating an existing application (re-submitting a rejected/draft one)
    if (iteratingRuleData && iteratingRuleData.id) {
         setApplications(prev => prev.map(app => 
             app.id === iteratingRuleData.id ? { ...newApp, id: app.id } : app
         ));
    } else {
         setApplications([newApp, ...applications]);
    }

    setIsNewRuleDrawerOpen(false); // Close drawer
    setActiveTab('my-applications'); // Redirect to list
    
    // Simulate auto-approval for demo purposes after 2 seconds (only for fresh submits)
    if (!iteratingRuleData?.id) {
        setTimeout(() => {
            setApplications(prev => prev.map(app => 
                app.id === newApp.id ? { ...app, status: 'Approved', devStatus: 'Pending' } : app
            ));
        }, 2000);
    }
  };

  // Handle draft save
  const handleSaveDraft = (data: Partial<Application>) => {
    const newApp: Application = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      creator: '当前用户',
      status: 'Draft',
    } as Application;
    
    if (iteratingRuleData && iteratingRuleData.id) {
         setApplications(prev => prev.map(app => 
             app.id === iteratingRuleData.id ? { ...newApp, id: app.id } : app
         ));
    } else {
         setApplications([newApp, ...applications]);
    }
    
    setIsNewRuleDrawerOpen(false); // Close drawer
    setActiveTab('my-applications'); // Redirect to list
    // Drafts do not auto-approve
  };

  // Handle tech dev status update
  const handleDevUpdate = (id: string, devStatus: DevStatus, owner: string) => {
    setApplications(prev => prev.map(app => {
        if (app.id !== id) return app;
        const newStatus = devStatus === 'Done' ? 'Ready to Release' : 'In Dev';
        return {
            ...app,
            devStatus,
            devOwner: owner,
            status: newStatus as any
        };
    }));
  };

  // Handle release
  const handleRelease = (id: string) => {
    const app = applications.find(a => a.id === id);
    if(app) {
        // 1. Mark app as Released
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'Released' } : a));
        
        // 2. Create new active rule
        const newRule: Rule = {
            id: Math.random().toString(),
            level: app.level,
            rewardPenaltyLevel: app.rewardPenaltyLevel || '未定义',
            dimension: app.dimension,
            item1: app.item1,
            item2: app.item2,
            logic: app.logic || app.desc || '', // Prefer logic
            rewardStd: app.rewardStd || '参考详情',
            penaltyStd: app.penaltyStd || '参考详情',
            target: app.target || '全网',
            org: app.org || '运营部',
            owner: app.owner || app.creator,
            creator: app.creator,
            firstApplyDate: new Date().toISOString().split('T')[0],
            updateDate: '',
            version: app.version + 1,
            status: 'Active'
        };

        // 3. Update rules list (Deprecate old rule if iteration)
        setRules(prevRules => {
            let updatedRules = prevRules;
            if (app.type === 'Iterate' && app.ruleId) {
                updatedRules = prevRules.map(r => 
                   r.id === app.ruleId ? { ...r, status: 'Inactive' as RuleStatus } : r
                );
            }
            return [newRule, ...updatedRules];
        });

        alert("发布成功！已加入规则库。");
        setActiveTab('my-rules');
    }
  };

  const menuItems = [
    { id: 'my-rules', label: '我管理的规则', icon: <FileText size={16} /> },
    { id: 'my-applications', label: '我的申请', icon: <ClipboardList size={16} /> },
    { id: 'tech-dev', label: '科技研发', icon: <Send size={16} /> },
    { id: 'pending-release', label: '待发布规则', icon: <PackageCheck size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
             {/* Logo / Brand */}
             <div className="flex items-center gap-3">
               <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
                 <Menu size={20} /> 
               </div>
               <div className="flex flex-col">
                 <span className="font-bold text-xl text-slate-800 leading-none tracking-tight">激活经营</span>
               </div>
               <div className="h-6 w-px bg-slate-200 mx-2"></div>
               <span className="text-slate-500 font-medium text-lg">奖罚机制管理平台</span>
             </div>

             {/* Right Actions */}
             <div className="flex items-center gap-6">
                <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
               <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                 <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-slate-700">邹思琦</p>
                    <p className="text-xs text-slate-400">运营部 / 经理</p>
                 </div>
                 <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 border border-blue-200 shadow-inner">
                    <User size={18} />
                 </div>
               </div>
             </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 -mb-px pt-2 overflow-x-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap pb-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ease-in-out
                  ${activeTab === item.id 
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
                  }`}
              >
                {item.icon}
                {item.label}
                {activeTab === item.id && (
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-6 md:p-8">
         <div className="fade-in">
             {activeTab === 'my-rules' && (
               <MyRules 
                 rules={rules} 
                 onNavigateToNew={openNewRuleDrawer} 
                 onIterate={handleIterateRule}
                 onViewDetails={handleViewDetails}
                 onManagePermissions={handleManagePermissions}
                 onOffline={handleOfflineRule}
               />
             )}
             {/* New Rule Form is no longer a tab */}
             {activeTab === 'my-applications' && (
               <MyApplications 
                 applications={applications} 
                 onEdit={handleEditApplication} 
                 onViewDetails={handleViewApplicationDetails}
               />
             )}
             {activeTab === 'tech-dev' && (
               <TechDev 
                 applications={applications.filter(a => ['Approved', 'In Dev', 'Ready to Release'].includes(a.status))} 
                 onUpdateStatus={handleDevUpdate}
                 onViewDetails={handleViewApplicationDetails}
               />
             )}
             {activeTab === 'pending-release' && (
               <PendingRelease 
                 applications={applications.filter(a => a.status === 'Ready to Release')} 
                 onRelease={handleRelease}
                 onViewDetails={handleViewApplicationDetails}
               />
             )}
         </div>
      </main>

      {/* New Rule Drawer */}
      {isNewRuleDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setIsNewRuleDrawerOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
            <div className="w-screen max-w-4xl pointer-events-auto bg-slate-50 shadow-2xl flex flex-col h-full transform transition-transform animate-slide-in-right">
               {/* Drawer Header */}
               <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                  <h2 className="text-lg font-bold text-slate-800">
                    {formMode === 'iterate' ? '迭代奖罚规则' : '新增奖罚规则'}
                  </h2>
                  <button 
                    onClick={() => setIsNewRuleDrawerOpen(false)}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
               </div>
               
               {/* Drawer Content - Pass onCancel to close the drawer */}
               <div className="flex-1 overflow-y-auto">
                  <NewRuleForm 
                    mode={formMode}
                    initialData={iteratingRuleData}
                    onSubmit={handleCreateSubmit} 
                    onSaveDraft={handleSaveDraft}
                    onCancel={() => setIsNewRuleDrawerOpen(false)} 
                  />
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Drawer */}
      {isAppDetailDrawerOpen && selectedAppForDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setIsAppDetailDrawerOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
            <div className="w-screen max-w-4xl pointer-events-auto bg-slate-50 shadow-2xl flex flex-col h-full transform transition-transform animate-slide-in-right">
               <ApplicationDetailView 
                  application={selectedAppForDetail}
                  onClose={() => setIsAppDetailDrawerOpen(false)}
               />
            </div>
          </div>
        </div>
      )}

      {/* Rule Details Drawer */}
      {isDetailDrawerOpen && selectedRuleForDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setIsDetailDrawerOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
            <div className="w-screen max-w-6xl pointer-events-auto bg-slate-50 shadow-2xl flex flex-col h-full transform transition-transform animate-slide-in-right">
               {/* Detail View Component handles its own header and body */}
               <RuleDetailView 
                  currentRule={selectedRuleForDetail}
                  onClose={() => setIsDetailDrawerOpen(false)}
               />
            </div>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {isPermissionModalOpen && selectedRuleForAction && (
          <PermissionModal 
            rule={selectedRuleForAction}
            onClose={() => setIsPermissionModalOpen(false)}
            onSave={handleUpdatePermissions}
          />
      )}

      {/* Offline Confirm Modal */}
      {isOfflineModalOpen && selectedRuleForAction && (
          <OfflineConfirmModal 
            rule={selectedRuleForAction}
            onClose={() => setIsOfflineModalOpen(false)}
            onConfirm={handleConfirmOffline}
          />
      )}
    </div>
  );
}

export default App;