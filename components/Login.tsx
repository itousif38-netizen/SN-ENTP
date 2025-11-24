import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, CreditCard, BadgeCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
  notification?: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, notification }) => {
  const [view, setView] = useState<'login' | 'recovery'>('login');
  
  // Login State
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Recovery State
  const [pan, setPan] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [recoveryResult, setRecoveryResult] = useState<{success: boolean; message: string; credentials?: {u: string, p: string}} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a brief network delay for better UX
    setTimeout(() => {
      if (userId === 'rejatousifsne' && password === 'Tousifreja09@') {
        onLogin(true);
      } else {
        setError('Invalid User ID or Password. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (pan === 'GRCPB9138K' && customerId === '959671593') {
        setRecoveryResult({
          success: true,
          message: 'Identity Verified Successfully',
          credentials: { u: 'rejatousifsne', p: 'Tousifreja09@' }
        });
      } else {
        setRecoveryResult({
          success: false,
          message: 'Invalid Company PAN or Customer ID.'
        });
      }
      setLoading(false);
    }, 600);
  };

  const switchView = (newView: 'login' | 'recovery') => {
    setView(newView);
    setError('');
    setRecoveryResult(null);
    setPan('');
    setCustomerId('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
         <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{animationDuration: '3s'}}></div>
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
      </div>

      {/* Logout Notification Toast */}
      {notification && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
           <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-green-400">
               <CheckCircle2 size={24} className="text-white" />
               <span className="font-bold text-lg">{notification}</span>
           </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-fade-in-up duration-500">
        {/* Header / Logo Area */}
        <div className="bg-slate-50 p-8 text-center border-b border-slate-100 relative overflow-hidden flex flex-col items-center">
          <div className="w-28 h-28 mb-4 relative z-10 hover:scale-105 transition-transform duration-500">
             <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 180 V 60 L 70 40 V 180" fill="#0ea5e9" />
                  <path d="M75 180 V 20 L 125 10 V 180" fill="#0284c7" />
                  <path d="M130 180 V 50 L 160 70 V 180" fill="#0ea5e9" />
                  <circle cx="100" cy="100" r="70" stroke="#0f172a" strokeWidth="8" fill="none" />
                  <text x="100" y="125" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="70" fill="#0f172a">SN</text>
                  <path d="M 20 160 Q 100 220 180 140" stroke="#f97316" strokeWidth="10" fill="none" strokeLinecap="round" />
             </svg>
          </div>
          <h1 className="text-5xl font-['Oswald'] font-black text-slate-900 tracking-tight relative z-10">SN <span className="text-orange-600">ENTERPRISE</span></h1>
          <p className="text-slate-500 text-sm mt-3 font-medium relative z-10">Construction Management System</p>
        </div>

        {/* --- LOGIN VIEW --- */}
        {view === 'login' && (
          <div className="p-8 pt-6 animate-slide-in-right">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">User ID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                    placeholder="Enter your user ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <button 
                    type="button" 
                    onClick={() => switchView('recovery')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-center font-medium animate-scale-in border border-red-100">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98]
                  ${loading ? 'opacity-80 cursor-wait' : ''}
                `}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                      Sign In to Dashboard <ArrowRight size={16} />
                  </div>
                )}
              </button>
            </form>
          </div>
        )}

        {/* --- RECOVERY VIEW --- */}
        {view === 'recovery' && (
           <div className="p-8 pt-6 animate-slide-in-right">
              <div className="mb-6 flex items-center gap-2 text-slate-800">
                <button onClick={() => switchView('login')} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold">Account Recovery</h2>
              </div>
              
              {!recoveryResult?.success ? (
                <form onSubmit={handleRecovery} className="space-y-5">
                  <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm mb-4 animate-scale-in">
                    Please verify your company identity to retrieve your administrator credentials.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company PAN</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white uppercase"
                        placeholder="GRCPBXXXXK"
                        value={pan}
                        onChange={(e) => setPan(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Customer ID</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BadgeCheck className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                        placeholder="959XXXXXX"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                      />
                    </div>
                  </div>

                  {recoveryResult && !recoveryResult.success && (
                    <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-center font-medium animate-scale-in border border-red-100">
                      <ShieldCheck className="w-5 h-5 mr-2 flex-shrink-0" />
                      {recoveryResult.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98]
                      ${loading ? 'opacity-80 cursor-wait' : ''}
                    `}
                  >
                    {loading ? 'Verifying Identity...' : 'Verify & Recover'}
                  </button>
                </form>
              ) : (
                <div className="animate-scale-in">
                  <div className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center mb-6">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                      <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-green-800 font-bold text-lg mb-1">Identity Verified!</h3>
                    <p className="text-green-700 text-sm">Here are your account credentials.</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <label className="text-xs text-slate-400 font-bold uppercase">User ID</label>
                       <div className="text-slate-900 font-mono font-bold text-lg">{recoveryResult.credentials?.u}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <label className="text-xs text-slate-400 font-bold uppercase">Password</label>
                       <div className="text-orange-600 font-mono font-bold text-lg">{recoveryResult.credentials?.p}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                        // Prefill login
                        setUserId(recoveryResult.credentials?.u || '');
                        setPassword(recoveryResult.credentials?.p || '');
                        switchView('login');
                    }}
                    className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all hover:scale-105"
                  >
                    Back to Login
                  </button>
                </div>
              )}
           </div>
        )}
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium">© 2025 SN Enterprise • Secure Access</p>
        </div>
      </div>
    </div>
  );
};

export default Login;