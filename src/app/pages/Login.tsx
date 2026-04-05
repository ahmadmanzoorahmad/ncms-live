// Login Page - Pakistan Government Style

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, User, Mail, AlertCircle, Shield, FlaskConical, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { liveUsers, liveCredentials } from '../data/mock-data';
import type { UserRole } from '../types';
import logoImage from '@/assets/c673552f7748d800c656a4166ccbeadb19bd4dd2.png';

export default function Login() {
  const navigate = useNavigate();
  const { login, environment, setEnvironment } = useApp();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoUsers = [
    { email: 'citizen@gov.pk', role: 'Citizen' as UserRole, name: 'Ahmed Khan', id: 'U001', department: null },
    { email: 'callcenter@gov.pk', role: 'Call Center Officer' as UserRole, name: 'Fatima Ali', id: 'U002', department: 'Call Center' },
    { email: 'agent@gov.pk', role: 'Support Agent' as UserRole, name: 'Hassan Raza', id: 'U003', department: 'Technical Support' },
    { email: 'engineer@gov.pk', role: 'Field Engineer' as UserRole, name: 'Zainab Sheikh', id: 'U004', department: 'Field Operations' },
    { email: 'supervisor@gov.pk', role: 'Supervisor' as UserRole, name: 'Imran Malik', id: 'U005', department: 'Technical Support' },
    { email: 'depthead@gov.pk', role: 'Department Head' as UserRole, name: 'Sara Ahmad', id: 'U006', department: 'Operations' },
    { email: 'executive@gov.pk', role: 'Executive' as UserRole, name: 'Kamran Hussain', id: 'U007', department: 'Executive' },
    { email: 'auditor@gov.pk', role: 'Auditor' as UserRole, name: 'Ayesha Nasir', id: 'U008', department: 'Audit & Compliance' },
    { email: 'admin@gov.pk', role: 'System Admin' as UserRole, name: 'Bilal Khan', id: 'U009', department: 'IT Administration' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      if (environment === 'Live') {
        // Live mode: authenticate against live credentials
        const liveUser = liveUsers.find(u => u.email === email);
        const expectedPassword = liveCredentials[email];
        if (liveUser && expectedPassword && password === expectedPassword) {
          login(liveUser);
          navigate('/');
        } else {
          setError('Invalid credentials. Please use your official gov.pk email and correct password.');
        }
      } else {
        // Demo mode: authenticate against demo users
        const user = demoUsers.find(u => u.email === email);
        if (user && password === 'demo123') {
          login(user);
          navigate('/');
        } else {
          setError(t('login.error'));
        }
      }
      setIsLoading(false);
    }, 800);
  };

  const quickLogin = (user: typeof demoUsers[0]) => {
    login(user);
    navigate('/');
  };

  const isDemo = environment === 'Demo';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01411C] via-[#0B5D1E] to-[#1F7A3A] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center">
            <img
              src={logoImage}
              alt="National Complaint Center Logo"
              className="h-28 w-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Environment Toggle — choose before login */}
        <div className="mb-4 flex items-center justify-center gap-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1.5 border border-white/20">
          <button
            onClick={() => setEnvironment('Demo')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isDemo
                ? 'bg-amber-400 text-amber-900 shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Demo Mode
            {isDemo && <span className="text-xs bg-amber-600/30 text-amber-900 px-1.5 py-0.5 rounded-full">Active</span>}
          </button>
          <button
            onClick={() => setEnvironment('Live')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              !isDemo
                ? 'bg-white text-[#01411C] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            Live Mode
            {!isDemo && <span className="text-xs bg-[#DFF5E1] text-[#01411C] px-1.5 py-0.5 rounded-full">Active</span>}
          </button>
        </div>

        {/* Mode description banner */}
        <div className={`mb-4 rounded-xl px-4 py-2.5 text-center text-xs font-medium border ${
          isDemo
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-[#DFF5E1] border-[#01411C]/20 text-[#01411C]'
        }`}>
          {isDemo
            ? '⚠️ Demo Mode — Sample data, quick-login available. No real data is stored.'
            : '🔒 Live Mode — Official government system. Login with your registered credentials.'}
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-white/20">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-[#01411C]" />
              <h2 className="text-2xl font-bold text-[#01411C]">Secure Sign In</h2>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#01411C] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0B5D1E]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#01411C]/20 rounded-lg focus:border-[#01411C] focus:ring-2 focus:ring-[#01411C]/20 outline-none transition-all"
                  placeholder="your.email@gov.pk"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#01411C] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0B5D1E]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#01411C]/20 rounded-lg focus:border-[#01411C] focus:ring-2 focus:ring-[#01411C]/20 outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#01411C] hover:bg-[#0B5D1E] text-white py-6 text-lg font-semibold"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Live Mode — credentials reference */}
          {!isDemo && (
            <div className="mt-6 pt-6 border-t border-[#01411C]/10">
              <p className="text-xs text-center font-semibold text-[#01411C] mb-3">Live Testing Credentials</p>
              <div className="space-y-1.5 text-xs">
                {[
                  { role: 'Citizen',             email: 'ctlive@gov.pk',  pass: 'ct12345' },
                  { role: 'Call Center Officer', email: 'ccolive@gov.pk', pass: 'cco12345' },
                  { role: 'Support Agent',       email: 'salive@gov.pk',  pass: 'sa12345' },
                  { role: 'Field Engineer',      email: 'felive@gov.pk',  pass: 'fe12345' },
                  { role: 'Supervisor',          email: 'suplive@gov.pk', pass: 'sup12345' },
                  { role: 'Department Head',     email: 'dhlive@gov.pk',  pass: 'dh12345' },
                  { role: 'Executive',           email: 'exelive@gov.pk', pass: 'exe12345' },
                  { role: 'Auditor',             email: 'audlive@gov.pk', pass: 'aud12345' },
                  { role: 'System Admin',        email: 'adlive@gov.pk',  pass: 'ad12345' },
                ].map(c => (
                  <div
                    key={c.email}
                    className="flex items-center justify-between bg-[#DFF5E1]/60 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-[#DFF5E1] transition-colors"
                    onClick={() => { setEmail(c.email); setPassword(c.pass); }}
                  >
                    <span className="font-medium text-[#01411C] w-36">{c.role}</span>
                    <span className="text-gray-500">{c.email}</span>
                    <span className="font-mono text-[#0B5D1E] font-semibold">{c.pass}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-gray-400 mt-2">Click any row to auto-fill credentials</p>
            </div>
          )}

          {/* Demo Mode — quick-login buttons */}
          {isDemo && (
            <div className="mt-6 pt-6 border-t border-[#01411C]/10">
              <p className="text-xs text-center text-[#0B5D1E] font-medium mb-3">
                Click any role to quick login
              </p>
              <div className="grid grid-cols-3 gap-2">
                {demoUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    onClick={() => quickLogin(user)}
                    className="text-[#01411C] border-[#01411C]/30 hover:bg-[#DFF5E1] text-xs py-2 h-auto flex-col gap-0.5"
                  >
                    <User className="w-3 h-3" />
                    <span className="leading-tight text-center">{user.role}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-center text-gray-500 mt-3">
                Password for manual login: <span className="font-semibold text-[#01411C]">demo123</span>
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-white/70 text-sm">
          <p>🔒 Secure • 🛡️ Protected • ✓ Government Verified</p>
          <p className="mt-1 text-xs">© 2026 Government of Pakistan</p>
        </div>
      </div>
    </div>
  );
}
