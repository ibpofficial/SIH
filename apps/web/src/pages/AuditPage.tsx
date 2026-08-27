import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { AuditLogItem } from '@freightiq/shared-types';
import { ShieldCheck, Search, Clock, FileJson, AlertCircle, RefreshCw } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/audit-logs');
      setLogs(res.data);
      if (res.data.length > 0) {
        setSelectedLog(res.data[0]);
      }
    } catch (err: any) {
      console.error('Failed to fetch audit logs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to connect to audit log service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <Breadcrumbs activePath="/audit" onNavigate={() => {}} />

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

        <button
          onClick={fetchLogs}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-300 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs bg-white border border-slate-200 rounded-xl">
          Loading audit trail records...
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-white border border-slate-200 rounded-xl">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="text-slate-900 font-bold text-sm">No Audit Log Entries Recorded Yet</div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Audit logs are recorded automatically whenever a chartering decision analysis is executed or data is committed. Run an analysis on the Procurement page to generate your first audit record!
          </p>
        </div>
      ) : (
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
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">{log.userEmail || 'system'}</td>
                      <td className="py-3 px-4 font-bold text-indigo-700">
                        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-[10px]">
                          {log.action}
                        </span>
                      </td>
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
                <div className="space-y-1 text-[11px]">
                  <div className="text-slate-500">Entity ID: <strong className="text-slate-800">{selectedLog.entityId}</strong></div>
                  <div className="text-slate-500">Recorded At: <strong className="text-slate-800">{new Date(selectedLog.timestamp).toISOString()}</strong></div>
                </div>

                <div>
                  <div className="text-[10px] text-indigo-600 font-bold uppercase mb-1">Audit Payload (Changes After)</div>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[10px] overflow-x-auto leading-relaxed max-h-96">
                    {typeof selectedLog.changesAfter === 'string'
                      ? selectedLog.changesAfter
                      : JSON.stringify(selectedLog.changesAfter, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">Select an audit log entry to view JSON diff payload</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

