import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function VerificationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center animate-in fade-in duration-700">
      <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-8 border border-emerald-100 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg transition-transform duration-500 hover:scale-110">
          <Check className="w-10 h-10 stroke-[3px]" />
        </div>
      </div>

      <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-4">
        Verification Successful!
      </h1>

      <p className="text-[15px] font-bold text-gray-500 leading-relaxed max-w-[280px] mb-12">
        Your identity has been verified successfully. You can now continue using the application.
      </p>

      <Button
        onClick={() => navigate('/user/dashboard')}
        className="w-full max-w-sm h-14 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-black text-[14px] uppercase tracking-widest shadow-xl transition-all active:scale-95"
      >
        Continue
      </Button>
    </div>
  );
}
