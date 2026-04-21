import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';

export function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier || 'Your Device';
  
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
      setError('Complete 6-digit identity token required');
      return;
    }
    
    // Support devCode for development / testing environments
    const devCode = location.state?.devCode;
    if (devCode && otpString !== devCode) {
      setError('Invalid verification code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/user/reset-password', { state: { otp: otpString, identifier } });
    }, 800);
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
          onClick={() => navigate('/user/forgot-password')}
          className="p-2 -ml-2 rounded-full hover:bg-white/80 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-6 h-6 text-[#1A1C1E]" />
        </button>
        <h1 className="text-2xl font-black tracking-tight">Verify Your Identity</h1>
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
                  className="w-full aspect-square text-center text-2xl font-black bg-white/80 backdrop-blur-sm border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1C1E] shadow-premium"
                />
              ))}
            </div>

            <p className="text-sm font-bold text-gray-400 leading-relaxed px-1">
              Enter the 6-digit code sent to your registered mobile number
            </p>

            <div className="px-1">
              {resendTimer > 0 ? (
                <p className="text-sm font-bold text-[#1E88E5]/60 tracking-tight">
                  Resend Code in 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm font-black text-[#1E88E5] tracking-tight hover:underline transition-all"
                >
                  Resend Code Now
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
              className="w-full h-16 bg-[#1E88E5] hover:bg-blue-600 rounded-[1.25rem] text-white font-black text-sm tracking-widest uppercase shadow-xl shadow-blue-500/20 transition-all duration-300 active:scale-[0.98] mt-12 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
