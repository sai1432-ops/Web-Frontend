import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Lock, Mail, Eye, EyeOff, Shield, ChevronLeft, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { RetrofitClient } from '../network/RetrofitClient';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await RetrofitClient.apiService.adminLogin({ email, password });
      if (response.isSuccessful && response.body) {
        localStorage.setItem('access_token', response.body.access_token);
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('admin_name', response.body.name || 'Administrator');
        navigate('/admin/dashboard');
      } else {
        setError(response.errorBody?.string() || "Invalid admin credentials");
      }
    } catch (err: any) {
      setError(err.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FBFF] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-full h-[60vh] bg-gradient-to-b from-rose-50 to-transparent -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-100/30 rounded-full blur-[120px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] mb-8 shadow-premium border border-white p-5">
           <div className="w-full h-full bg-rose-600 rounded-[1.2rem] flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
           </div>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight">Admin Console</h1>
        <p className="text-rose-600 font-black mt-3 tracking-[0.2em] uppercase text-[10px]">Secure Infrastructure Access</p>
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
                className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Terminal ID</label>
              <div className="relative group">
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.id@mukhswasthya.gov.in"
                  className="h-16 pl-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:border-rose-500/50 text-sm font-bold placeholder:text-gray-300 transition-all shadow-inner-premium"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Secure Passkey</label>
                <button type="button" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline">Support</button>
              </div>
              <div className="relative group">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-16 pl-14 pr-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:border-rose-500/50 text-sm font-bold placeholder:text-gray-300 transition-all shadow-inner-premium"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-gray-900 hover:bg-black rounded-2xl text-white font-black tracking-[0.25em] uppercase text-[10px] shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In to Console
                    <ChevronRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full border border-rose-100 mb-4 font-black text-[9px] text-rose-700 tracking-wider uppercase">
                <Zap className="w-3 h-3 fill-current" />
                Live Hub Command Overide
             </div>
             <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] leading-relaxed">
                National Security Grid Authorization Required <br />
                Protocol v4.2 Enabled
             </p>
          </div>
        </Card>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/role-selection')}
        className="mt-12 flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-rose-600 transition-all uppercase tracking-[0.2em] group"
      >
        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-rose-50 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </div>
        Exit Admin Gateway
      </motion.button>
    </div>
  );
}