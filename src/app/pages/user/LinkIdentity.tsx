import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  Hash
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { RetrofitClient } from '../../network/RetrofitClient';
import { SessionManager } from '../../utils/SessionManager';

export function LinkIdentity() {
  const navigate = useNavigate();
  const [cardNo, setCardNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleLink = async () => {
    if (!cardNo.trim()) {
      toast.error('Please enter or scan card number');
      return;
    }

    setIsLoading(true);
    try {
      const storedUserId = localStorage.getItem('user_id');
      if (!storedUserId) {
        toast.error('Session expired. Please log in again.');
        navigate('/user/login');
        return;
      }

      const response = await RetrofitClient.apiService.linkIdentityCard({
        userId: parseInt(storedUserId), 
        identityCardNo: cardNo
      });

      if (response.isSuccessful) {
        toast.success(response.body?.message || 'Identity linked successfully');
        
        // Update local session state
        SessionManager.setIdentityVerified(true);
        SessionManager.setUserPdsCard(cardNo);

        // Navigate to dealer selection
        navigate('/user/select-location');
      } else {
        const errMsg = response.errorBody?.string() || 'Failed to link PDS card';
        toast.error(errMsg);
      }
    } catch (e: any) {
      toast.error(e.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col font-sans">
      {/* Blue Header Section */}
      <div className="bg-[#1E88E5] pt-12 pb-24 px-6 relative overflow-hidden rounded-b-[3rem] shadow-lg">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-20 -mb-20 blur-2xl opacity-40" />

        <div className="relative z-10 max-w-md mx-auto">
          <button 
             onClick={() => navigate(-1)}
             className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-90"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-8 space-y-2"
          >
            <h1 className="text-3xl font-black text-white tracking-tight">Link PDS Card</h1>
            <p className="text-blue-100 font-medium">Scan your card QR to link your identity</p>
          </motion.div>
        </div>
      </div>

      {/* Overlapping Identity Preview Card */}
      <div className="px-6 -mt-16 relative z-20 max-w-md mx-auto w-full">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-blue-900/10 border border-white/50"
        >
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block">PDS Identity</span>
              <h3 className="text-sm font-bold text-gray-400">Smart Card System</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
               <CreditCard className="w-6 h-6" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-1 bg-blue-500/10 rounded-full" />
            <div className="pl-6 py-1">
              <p className="text-2xl font-black text-gray-200 tracking-wider">
                {cardNo || "Card ID will appear here"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scanner Interaction Section */}
        <div className="mt-12 space-y-12">
          <div className="flex flex-col items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsScanning(!isScanning)}
              className="w-24 h-24 rounded-full bg-[#1E88E5] flex items-center justify-center text-white shadow-xl shadow-blue-500/30 relative"
            >
              <QrCode className="w-10 h-10" />
              {isScanning && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 rounded-full border-4 border-blue-400"
                />
              )}
            </motion.button>
            <div className="text-center">
               <p className="text-blue-500 font-black text-sm uppercase tracking-widest">Tap to Scan</p>
            </div>
          </div>

          {/* Manual Entry Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-blue-100" />
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Or enter manually</span>
              <div className="h-px flex-1 bg-blue-100" />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                 <Hash className="w-5 h-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
               </div>
               <Input 
                 value={cardNo}
                 onChange={(e) => setCardNo(e.target.value)}
                 placeholder="PDS-123456"
                 className="h-16 rounded-2xl border-none bg-white px-14 font-black text-gray-900 shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all text-lg placeholder:text-gray-200"
               />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 pb-12">
            <Button 
               onClick={handleLink}
               disabled={isLoading || !cardNo.trim()}
               className="w-full h-16 rounded-2xl bg-[#1E88E5] hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-900/10 active:scale-95 transition-all border-none disabled:opacity-50"
            >
              {isLoading ? "Connecting..." : "Connect Identity"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
