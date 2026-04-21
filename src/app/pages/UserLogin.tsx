import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Mail, Lock, User, Eye, EyeOff, ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { RetrofitClient } from '../network/RetrofitClient';
import { SessionManager } from '../utils/SessionManager';

export function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await RetrofitClient.apiService.userLogin({ email, password });
      if (response.isSuccessful && response.body) {
        SessionManager.saveSession(
          response.body.user_id,
          response.body.name,
          response.body.email,
          "", 
          "user",
          response.body.pds_verified,
          response.body.access_token
        );
        navigate('/user/dashboard', { replace: true });
      } else {
        const errorText = await response.errorBody?.string?.();
        console.error("LOGIN ERROR", {
          code: response.code,
          errorBody: errorText,
          body: response.body,
        });

        let message = "Login failed";

        try {
          const parsed = errorText ? JSON.parse(errorText) : null;
          message =
            parsed?.error ||
            parsed?.message ||
            response.body?.error ||
            response.body?.message ||
            errorText ||
            "Login failed";
        } catch {
          message =
            response.body?.error ||
            response.body?.message ||
            errorText ||
            "Login failed";
        }

        throw new Error(message);
      }
    } catch (err: any) {
        console.error("LOGIN_CRITICAL_FAILURE:", err);
        setError(err?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FBFF] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-50 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] mb-8 shadow-premium border border-white p-5">
           <div className="w-full h-full bg-blue-900 rounded-[1.2rem] flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
           </div>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight uppercase">User Login</h1>
        <p className="text-blue-600 font-black mt-3 tracking-[0.2em] uppercase text-[10px]">User Gateway</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="card-premium p-10 rounded-[3rem] border-none bg-white/80 backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-black text-center uppercase tracking-tighter"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                   <div className="w-1 h-1 bg-rose-600 rounded-full animate-pulse" />
                   <span className="opacity-70">Security Protocol Violation</span>
                </div>
                {error}
              </motion.div>
            )}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email or Mobile Number</label>
              <div className="relative group">
                <Input 
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., name@example.com or 10-digit mobile"
                  className="h-16 pl-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500/50 text-sm font-bold placeholder:text-gray-300 transition-all shadow-inner-premium"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-900 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Secure Password</label>
                <button 
                  type="button" 
                  onClick={() => navigate('/user/forgot-password')}
                  className="text-[10px] font-black text-blue-900 uppercase tracking-widest hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-16 pl-14 pr-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500/50 text-sm font-bold placeholder:text-gray-300 transition-all shadow-inner-premium"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-900 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                    <input 
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 bg-gray-100 border border-gray-200 rounded-[6px] peer-checked:bg-blue-900 peer-checked:border-blue-900 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <div className="w-1.5 h-3 border-r-2 border-b-2 border-white rotate-45 mb-1" />
                    </div>
                </div>
                <span className="text-[11px] font-black text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-widest">Stay Authorized</span>
              </label>
            </div>

            <div className="pt-4">
              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-blue-900 hover:bg-black rounded-2xl text-white font-black tracking-[0.25em] uppercase text-[10px] shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In to Portal
                    <ChevronRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 mb-4 font-black text-[9px] text-blue-700 tracking-wider uppercase">
                <CheckCircle2 className="w-3 h-3 fill-current" />
                Verified Citizen Access
             </div>
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                New to the platform? <span onClick={() => navigate('/user/register')} className="text-blue-900 cursor-pointer hover:underline underline-offset-4">Sign Up</span>
             </p>
          </div>
        </Card>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/role-selection')}
        className="mt-12 flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-blue-900 transition-all uppercase tracking-[0.2em] group"
      >
        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </div>
        Change System Role
      </motion.button>
    </div>
  );
}