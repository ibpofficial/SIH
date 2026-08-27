import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { AuditLogItem } from '@freightiq/shared-types';
import { ShieldCheck, Search, Clock, FileJson, AlertCircle, RefreshCw, Filter } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      log.action?.toLowerCase().includes(q) ||
      log.entityType?.toLowerCase().includes(q) ||
      log.userEmail?.toLowerCase().includes(q) ||
      log.entityId?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      <Breadcrumbs activePath="/audit" onNavigate={() => {}} />

      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 font-display">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Governance & Immutable Audit Log Trail</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Immutable log of all user mutations, procurement decisions & data commits
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:border-indigo-500 w-52"
            />
          </div>

          <button
            onClick={fetchLogs}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-300 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs glass-card rounded-2xl">
          Streaming immutable audit trail records...
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-12 text-center space-y-3 glass-card rounded-2xl">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="text-slate-900 font-bold text-sm font-sans">No Matching Audit Entries Found</div>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-sans">
            Audit logs are recorded automatically whenever a chartering decision analysis is executed or data is committed. Run an analysis on the Procurement page to generate your first audit record!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          {/* Logs List */}
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 uppercase text-[10px] text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4">Entity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`cursor-pointer transition-colors ${
                        selectedLog?.id === log.id ? 'bg-indigo-50/80 border-l-4 border-indigo-600 font-semibold' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-900">{log.userEmail || 'system'}</td>
                      <td className="py-3.5 px-4 font-bold text-indigo-700">
                        <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{log.entityType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* JSON Diff Inspector */}
          <div className="glass-card rounded-2xl p-5 shadow-sm space-y-3 font-mono">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 font-sans border-b border-slate-100 pb-3">
              <FileJson className="w-4 h-4 text-indigo-600" />
              <span>Mutation Payload Inspector</span>
            </h3>

            {selectedLog ? (
              <div className="space-y-3">
                <div className="space-y-1 text-[11px] font-sans">
                  <div className="text-slate-500">Entity ID: <strong className="text-slate-800 font-mono">{selectedLog.entityId}</strong></div>
                  <div className="text-slate-500">Recorded At: <strong className="text-slate-800 font-mono">{new Date(selectedLog.timestamp).toISOString()}</strong></div>
                </div>

                <div>
                  <div className="text-[10px] text-indigo-600 font-bold uppercase mb-1 font-sans">Audit Snapshot (Changes After)</div>
                  <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-xl text-[10px] overflow-x-auto leading-relaxed max-h-96 shadow-inner font-mono">
                    {typeof selectedLog.changesAfter === 'string'
                      ? selectedLog.changesAfter
                      : JSON.stringify(selectedLog.changesAfter, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs font-sans">Select an audit log entry to view JSON diff payload</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


