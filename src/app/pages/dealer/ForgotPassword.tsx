import { useState } from 'react';
import { useNavigate } from 'react-router';
import { RetrofitClient } from '../../network/RetrofitClient';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { cn } from '../../components/ui/utils';
import { motion } from 'framer-motion';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError('Dealer identifier required');
      return;
    }
    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.forgotPassword({ 
        identifier: identifier,
        userType: 'dealer' 
      } as any);
      if (response.isSuccessful) {
        navigate('/dealer/verify-otp', { 
           state: { 
             identifier, 
             devCode: response.body?.devCode 
           } 
        });
      } else {
        setError(await response.errorBody?.string() || "Failed to send reset code");
      }
    } catch (err: any) {
       setError(err.message || "Failed to connect");
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col font-sans text-[#1A1C1E] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] -z-10 animate-blob" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[100px] -z-10" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 flex items-center gap-6 relative z-10"
      >
        <button 
          onClick={() => navigate('/dealer/login')}
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
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-none">Enter</span>
              </div>
              <Input 
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                placeholder="Merchant ID or Registered Email"
                className={cn(
                  "h-20 pt-8 pb-2 px-6 bg-white/80 backdrop-blur-sm border-0 rounded-[1.5rem] text-sm font-bold text-[#1A1C1E] placeholder:text-emerald-900/30 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-premium",
                  error && "ring-2 ring-rose-500/10"
                )}
              />
            </div>

            <p className="text-sm font-bold text-gray-400 leading-relaxed px-1">
              Provide your merchant credentials to receive a 6-digit verification code on your registered terminal.
            </p>

            {error && (
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest px-1">
                {error}
              </p>
            )}

            <Button 
              type="submit"
              disabled={isLoading || !identifier}
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 rounded-[1.25rem] text-white font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-500/20 transition-all duration-300 active:scale-[0.98] mt-12 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Send Verification Code'}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
