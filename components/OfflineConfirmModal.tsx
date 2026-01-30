import React from 'react';
import { Rule } from '../types';
import { AlertTriangle } from 'lucide-react';

interface OfflineConfirmModalProps {
  rule: Rule;
  onClose: () => void;
  onConfirm: (ruleId: string) => void;
}

export const OfflineConfirmModal: React.FC<OfflineConfirmModalProps> = ({ rule, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10 text-rose-600">
                <AlertTriangle size={20} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-slate-900">
                  确定要下线该规则吗？
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-slate-500">
                    您正在操作下线规则 <span className="font-semibold text-slate-700">[{rule.item2}]</span>。
                    <br/><br/>
                    下线后，该规则将<span className="text-rose-600 font-medium">不再生效</span>，且不会参与后续的计算。此操作可以被后续的重新上线操作撤销（需重新走流程）。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => {
                  onConfirm(rule.id);
                  onClose();
              }}
            >
              确认下线
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