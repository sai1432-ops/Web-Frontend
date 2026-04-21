import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { RetrofitClient } from '../../network/RetrofitClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Shield } from 'lucide-react';
import { cn } from '../../components/ui/utils';
import { motion } from 'framer-motion';

export function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordValid = newPassword.length >= 6;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('All fields are mandatory');
      return;
    }
    if (!isPasswordValid) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const locationState = location.state || {};
      const otp = locationState.otp || '';
      const identifier = locationState.identifier || '';

      const response = await RetrofitClient.apiService.resetPassword({
        identifier,
        otp,
        newPassword,
        userType: 'dealer'
      });

      if (!response.isSuccessful) {
         throw new Error(await response.errorBody?.string() || 'Failed to update password');
      }

      navigate('/dealer/login', { 
        state: { message: 'Security credentials updated. Re-authentication required.' } 
      });
    } catch (err: any) {
      let msg = err.message || 'Error occurred while resetting password';
      if (msg.includes('<!DOCTYPE HTML>') || msg.includes('<html>')) {
        msg = 'Endpoint not found or Server error (404/500). Please check your backend connection.';
      }
      setError(msg);
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
          onClick={() => navigate('/dealer/verify-otp')}
          className="p-2 -ml-2 rounded-full hover:bg-white/80 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-6 h-6 text-[#1A1C1E]" />
        </button>
        <h1 className="text-2xl font-black tracking-tight">Reset Password</h1>
      </motion.header>

      <main className="flex-1 px-6 pt-4 flex flex-col max-w-lg mx-auto w-full relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute top-4 left-6 z-10">
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-none">Enter</span>
                </div>
                <Input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="New Password"
                  className={cn(
                    "h-20 pt-8 pb-2 px-6 bg-white/80 backdrop-blur-sm border-0 rounded-[1.5rem] text-sm font-bold text-[#1A1C1E] placeholder:text-emerald-900/30 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-premium",
                    error && "ring-2 ring-rose-500/10"
                  )}
                />
              </div>

              <div className="relative group">
                <div className="absolute top-4 left-6 z-10">
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-none">Confirm</span>
                </div>
                <Input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="New Password"
                  className={cn(
                    "h-20 pt-8 pb-2 px-6 bg-white/80 backdrop-blur-sm border-0 rounded-[1.5rem] text-sm font-bold text-[#1A1C1E] placeholder:text-emerald-900/30 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-premium",
                    error && "ring-2 ring-rose-500/10"
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-emerald-100/50 shadow-sm">
               <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                  <Shield className="w-6 h-6" />
               </div>
               <p className="text-sm font-bold text-gray-700">
                 Your password should be at least 6 characters
               </p>
            </div>

            {error && (
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest px-1">
                {error}
              </p>
            )}

            <Button 
              type="submit"
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 rounded-[1.25rem] text-white font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-500/20 transition-all duration-300 active:scale-[0.98] mt-12 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Save New Password'}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
