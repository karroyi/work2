import React, { useState } from 'react';
import { Rule } from '../types';
import { X, Shield, Save } from 'lucide-react';

interface PermissionModalProps {
  rule: Rule;
  onClose: () => void;
  onSave: (ruleId: string, creator: string, owner: string) => void;
}

const USERS = [
  "张三 (Z001)", "李四 (L002)", "王强", "邹思琦", "刘洋", "陈平", "周杰", "郑爽", "陈杜娟", "当前用户"
];

export const PermissionModal: React.FC<PermissionModalProps> = ({ rule, onClose, onSave }) => {
  const [creator, setCreator] = useState(rule.creator);
  const [owner, setOwner] = useState(rule.owner);

  const handleSubmit = () => {
    onSave(rule.id, creator, owner);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10 text-blue-600">
                <Shield size={20} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-slate-900 flex justify-between items-center">
                  权限管理
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                    <X size={20} />
                  </button>
                </h3>
                <div className="mt-2 text-sm text-slate-500">
                  修改规则 <span className="font-mono bg-slate-100 px-1 rounded">{rule.id}</span> 的相关责任人。
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">规则制定人</label>
                        <select 
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 text-slate-900"
                            value={creator}
                            onChange={(e) => setCreator(e.target.value)}
                        >
                            {USERS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">规则接口人</label>
                        <select 
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 text-slate-900"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                        >
                            {USERS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm items-center gap-2"
              onClick={handleSubmit}
            >
              <Save size={16} /> 保存更改
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};