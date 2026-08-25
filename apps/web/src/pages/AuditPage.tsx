import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { AuditLogItem } from '@freightiq/shared-types';
import { ShieldCheck, Search, Clock, FileJson } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/audit-logs');
        setLogs(res.data);
        if (res.data.length > 0) {
          setSelectedLog(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Governance & Immutable Audit Log Trail</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Immutable log of all user mutations, procurement decisions & data commits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Logs List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] text-slate-500">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`cursor-pointer transition-colors ${
                      selectedLog?.id === log.id ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">{log.userEmail}</td>
                    <td className="py-3 px-4 font-bold text-indigo-700">{log.action}</td>
                    <td className="py-3 px-4 text-slate-600">{log.entityType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON Diff Inspector */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 font-mono">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 font-sans border-b border-slate-100 pb-2">
            <FileJson className="w-4 h-4 text-indigo-600" />
            <span>Mutation Payload Inspector</span>
          </h3>

          {selectedLog ? (
            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Changes After</div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[10px] overflow-x-auto">
                  {JSON.stringify(selectedLog.changesAfter, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">Select an audit log entry to view JSON diff</div>
          )}
        </div>
      </div>
    </div>
  );
};
