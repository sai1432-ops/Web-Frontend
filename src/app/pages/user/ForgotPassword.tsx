import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { cn } from '../../components/ui/utils';
import { RetrofitClient } from '../../network/RetrofitClient';
import { motion } from 'framer-motion';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please provide your identity');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await RetrofitClient.apiService.forgotPassword({ 
        identifier: identifier,
        userType: 'user' 
      } as any);

      if (response.isSuccessful) {
        navigate('/user/verify-otp', { 
           state: { 
             identifier, 
             devCode: response.body?.devCode 
           } 
        });
      } else {
        setError(await response.errorBody?.string() || "Verification request failed");
      }
    } catch (err: any) {
       setError(err.message || "Network error. Gateway unreachable.");
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col font-sans text-[#1A1C1E] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-50 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-50/50 rounded-full blur-[100px] -z-10" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 flex items-center gap-6 relative z-10"
      >
        <button 
          onClick={() => navigate('/user/login')}
          className="p-2 -ml-2 rounded-full hover:bg-white/80 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-6 h-6 text-[#1A1C1E]" />
        </button>
        <h1 className="text-2xl font-black tracking-tight">Account Recovery</h1>
      </motion.header>

      <main className="flex-1 px-6 pt-4 flex flex-col max-w-lg mx-auto w-full relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSendCode} className="space-y-8">
            <div className="relative group">
              <div className="absolute top-4 left-6 z-10">
                <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest leading-none">Enter</span>
              </div>
              <Input 
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                placeholder="Mobile Number or User ID"
                className={cn(
                  "h-20 pt-8 pb-2 px-6 bg-white/80 backdrop-blur-sm border-0 rounded-[1.5rem] text-sm font-bold text-[#1A1C1E] placeholder:text-blue-900/30 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-premium",
                  error && "ring-2 ring-rose-500/10"
                )}
              />
            </div>

            <p className="text-sm font-bold text-gray-400 leading-relaxed px-1">
              Provide your details to receive a 6-digit verification code on your registered device.
            </p>

            {error && (
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest px-1">
                {error}
              </p>
            )}

            <Button 
              type="submit"
              disabled={isLoading || !identifier}
              className="w-full h-16 bg-[#1E88E5] hover:bg-blue-600 rounded-[1.25rem] text-white font-black text-sm tracking-widest uppercase shadow-xl shadow-blue-500/20 transition-all duration-300 active:scale-[0.98] mt-12 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Send Verification Code'}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
