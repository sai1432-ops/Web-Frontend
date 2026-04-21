import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Store, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { RetrofitClient } from '../../network/RetrofitClient';
import { cn } from '../../components/ui/utils';
import { toast } from 'sonner';

export function DealerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {email?: string, password?: string} = {};
    if (!email) newErrors.email = "Dealer email is required";
    if (!password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await RetrofitClient.apiService.dealerLogin({ email, password });
      
      if (response.isSuccessful && response.body) {
        toast.success("Login successful!");
        
        localStorage.setItem("token", response.body.access_token);
        localStorage.setItem("access_token", response.body.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            dealer_id: response.body.dealer_id,
            name: response.body.name,
            email: response.body.email,
            phone: response.body.phone,
          })
        );
        
        navigate('/dealer/dashboard');
      } else {
        toast.error(response.errorBody?.string() || "Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FBFF] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-emerald-50 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] mb-8 shadow-premium border border-white p-5">
           <div className="w-full h-full bg-emerald-600 rounded-[1.2rem] flex items-center justify-center shadow-lg">
              <Store className="w-8 h-8 text-white" />
           </div>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight">Dealer Portal</h1>
        <p className="text-emerald-600 font-black mt-3 tracking-[0.2em] uppercase text-[10px]">Secure Authentication Gateway</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="card-premium p-10 rounded-[3rem] border-none bg-white/80 backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Identity Access</label>
              <div className="relative group">
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Dealer Credential (Email)"
                  className={cn(
                    "h-16 pl-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:border-emerald-500/50 text-sm font-bold placeholder:text-gray-300 transition-all shadow-inner-premium",
                    errors.email && "border-rose-200 bg-rose-50/30"
                  )}
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
              {errors.email && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Secret Key</label>
                <button 
                  type="button" 
                  onClick={() => navigate('/dealer/forgot-password')}
                  className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Access Token"
                  className={cn(
                    "h-16 pl-14 pr-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:border-emerald-500/50 text-sm font-bold placeholder:text-gray-300 transition-all shadow-inner-premium",
                    errors.password && "border-rose-200 bg-rose-50/30"
                  )}
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-1">{errors.password}</p>}
            </div>

            <div className="pt-4">
              <Button 
                disabled={isLoading}
                className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white font-black tracking-[0.25em] uppercase text-[10px] shadow-lg shadow-emerald-600/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Login
                    <ChevronRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/role-selection')}
        className="mt-12 flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-emerald-600 transition-all uppercase tracking-[0.2em] group"
      >
        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Change System Role
      </motion.button>
    </div>
  );
}
