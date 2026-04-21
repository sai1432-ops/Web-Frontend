import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';

export function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier || 'Merchant Terminal';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('6-digit merchant token required');
      return;
    }
    
    // Check devCode if it was passed by the API simulation
    const devCode = location.state?.devCode;
    if (devCode && otpString !== devCode) {
      setError('Invalid verification code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dealer/reset-password', { state: { otp: otpString, identifier } });
    }, 400); // reduced timeout for snappiness
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setResendTimer(59);
    setError('');
    inputRefs.current[0]?.focus();
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
          onClick={() => navigate('/dealer/forgot-password')}
          className="p-2 -ml-2 rounded-full hover:bg-white/80 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-6 h-6 text-[#1A1C1E]" />
        </button>
        <h1 className="text-2xl font-black tracking-tight">Verify Identity</h1>
      </motion.header>

      <main className="flex-1 px-6 pt-4 flex flex-col max-w-lg mx-auto w-full relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-2.5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoComplete="one-time-code"
                  className="w-full aspect-square text-center text-2xl font-black bg-white/80 backdrop-blur-sm border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-[#1A1C1E] shadow-premium"
                />
              ))}
            </div>

            <p className="text-sm font-bold text-gray-400 leading-relaxed px-1">
              Enter the 6-digit verification code sent to your registered merchant number
            </p>

            <div className="px-1">
              {resendTimer > 0 ? (
                <p className="text-sm font-bold text-emerald-600/60 tracking-tight">
                  Resend Token in 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm font-black text-emerald-600 tracking-tight hover:underline transition-all"
                >
                  Resend Token Now
                </button>
              )}
            </div>

            {error && (
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest px-1">
                {error}
              </p>
            )}

            <Button 
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 rounded-[1.25rem] text-white font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-500/20 transition-all duration-300 active:scale-[0.98] mt-12 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
