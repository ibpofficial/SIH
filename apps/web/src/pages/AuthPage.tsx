import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { ArrowRight, Zap } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('manager@freightiq.io');
  const [password, setPassword] = useState('Password123!');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('PROCUREMENT_MANAGER');
  const [organizationId, setOrganizationId] = useState('');
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();

  React.useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await api.get('/organizations');
        setOrganizations(res.data);
        if (res.data.length > 0) {
          setOrganizationId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch orgs:', err);
      }
    };
    fetchOrgs();
  }, []);

  const executeLogin = async (targetEmail: string, targetPass: string = 'Password123!') => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: targetEmail, password: targetPass });
      setAuth(res.data.user, res.data.accessToken);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      executeLogin(email, password);
    } else {
      setError(null);
      setLoading(true);
      try {
        const res = await api.post('/auth/register', {
          email,
          password,
          fullName,
          role,
          organizationId
        });
        setAuth(res.data.user, res.data.accessToken);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F1B2E] flex flex-col justify-between font-sans selection:bg-[#7b57ff]/20 selection:text-[#0F1B2E]">
      <div className="h-1.5 w-full bg-[#7b57ff]" />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg card-theme border border-slate-100 rounded-2xl shadow-card-soft overflow-hidden space-y-0">
          {/* Header */}
          <div className="p-6 bg-[#FAFAF8] border-b border-[#0F1B2E]/10 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#7b57ff] text-white font-serif font-extrabold text-lg flex items-center justify-center shadow-card-soft mx-auto">
              FIQ
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F1B2E] font-serif">FreightIQ Platform Access</h1>
            <p className="text-xs text-[#3E5871] font-mono">
              SIH26006 • Smart India Bulk Chartering Platform
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* 1-CLICK INSTANT DEMO LOGIN BUTTONS */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#7b57ff] font-mono uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#7b57ff]" />
                <span>Instant 1-Click Demo Logins (No Password Required)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                {/* 1-Click Manager */}
                <button
                  type="button"
                  onClick={() => executeLogin('manager@freightiq.io')}
                  disabled={loading}
                  className="p-3.5 bg-[#7b57ff]/10 hover:bg-[#7b57ff]/20 border border-[#7b57ff]/30 rounded-2xl text-left transition-all cursor-pointer group shadow-card-soft"
                >
                  <div className="flex items-center justify-between font-sans font-bold text-[#0F1B2E]">
                    <span>Chartering Director</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#7b57ff] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-[10px] text-[#3E5871] mt-0.5">SAIL Procurement Head</div>
                </button>

                {/* 1-Click Admin */}
                <button
                  type="button"
                  onClick={() => executeLogin('admin@freightiq.io')}
                  disabled={loading}
                  className="p-3.5 bg-[#FAFAF8] hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-left transition-all cursor-pointer group shadow-card-soft"
                >
                  <div className="flex items-center justify-between font-sans font-bold text-[#0F1B2E]">
                    <span>Chief Admin</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#3E5871] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-[10px] text-[#3E5871] mt-0.5">Full System Access</div>
                </button>

                {/* 1-Click Analyst */}
                <button
                  type="button"
                  onClick={() => executeLogin('analyst@freightiq.io')}
                  disabled={loading}
                  className="p-3.5 bg-[#FAFAF8] hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-left transition-all cursor-pointer group shadow-card-soft"
                >
                  <div className="flex items-center justify-between font-sans font-bold text-[#0F1B2E]">
                    <span>Freight Analyst</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#3E5871] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-[10px] text-[#3E5871] mt-0.5">ML Data & Ingestion</div>
                </button>

                {/* 1-Click Auditor */}
                <button
                  type="button"
                  onClick={() => executeLogin('viewer@freightiq.io')}
                  disabled={loading}
                  className="p-3.5 bg-[#FAFAF8] hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-left transition-all cursor-pointer group shadow-card-soft"
                >
                  <div className="flex items-center justify-between font-sans font-bold text-[#0F1B2E]">
                    <span>Auditor Observer</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#3E5871] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-[10px] text-[#3E5871] mt-0.5">Read-Only Observer</div>
                </button>
              </div>
            </div>

            {/* Separator */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#0F1B2E]/10"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono uppercase text-[#3E5871] font-bold">Or Standard Credentials Login</span>
              <div className="flex-grow border-t border-[#0F1B2E]/10"></div>
            </div>

            {/* Standard Login / Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {error && (
                <div className="p-3 bg-[#FDF2F2] border border-[#A32D2D]/30 rounded-xl text-[#A32D2D] font-medium text-xs">
                  {error}
                </div>
              )}

              {/* Mode Selector Toggle */}
              <div className="flex rounded-full bg-[#DADADA]/60 p-1 font-mono text-[11px] border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-1.5 rounded-full font-bold transition-all cursor-pointer ${isLogin ? 'bg-[#7b57ff] text-white shadow-xs' : 'text-[#2E2E2E] hover:text-black'
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-1.5 rounded-full font-bold transition-all cursor-pointer ${!isLogin ? 'bg-[#7b57ff] text-white shadow-xs' : 'text-[#2E2E2E] hover:text-black'
                    }`}
                >
                  Create Account
                </button>
              </div>

              <div>
                <label className="block text-[#0F1B2E] font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@freightiq.io"
                  className="w-full bg-[#FAFAF8] border border-slate-200 rounded-xl px-3.5 py-2 text-[#0F1B2E] focus:outline-none focus:border-[#7b57ff] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#0F1B2E] font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAFAF8] border border-slate-200 rounded-xl px-3.5 py-2 text-[#0F1B2E] focus:outline-none focus:border-[#7b57ff] font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="accept-button-theme w-full py-3 font-bold rounded-full uppercase tracking-wider shadow-card-soft cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Logging In...' : isLogin ? 'Sign In' : 'Create Demo Account'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-[#3E5871] text-xs font-mono border-t border-[#0F1B2E]/10 bg-white">
        FreightIQ • Smart India Hackathon PS SIH26006 • East Coast Indian Ports Chartering Decision Platform
      </footer>
    </div>
  );
};
