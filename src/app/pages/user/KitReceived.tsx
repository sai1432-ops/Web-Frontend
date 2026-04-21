import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  CheckCircle2, 
  Brush, 
  Waves, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
  Package
} from 'lucide-react';
import { cn } from '../../components/ui/utils';

interface KitReceiptData {
  returnedOldKit: string;
  timestamp: string;
  brushReceived?: number;
  pasteReceived?: number;
  iecReceived?: number;
  totalKits?: number;
  dealerQrValue?: string;
  show_red_alert?: boolean;
  red_alert_message?: string;
  isConfirmed?: boolean;
}

export function KitReceived() {
  const navigate = useNavigate();
  const [receiptData, setReceiptData] = useState<KitReceiptData | null>(null);

  useEffect(() => {
    const pendingData = localStorage.getItem('pendingKitReceipt');
    if (pendingData) {
      try {
        setReceiptData(JSON.parse(pendingData));
      } catch (e) {
        console.error('Failed to parse receipt data', e);
      }
    }
  }, []);

  const handleDashboardClick = () => {
    if (receiptData) {
      const kitHistory = JSON.parse(localStorage.getItem('kitHistory') || '[]');
      const newReceipt = {
        id: `KIT-${Date.now()}`,
        kit_unique_id: receiptData.dealerQrValue || `DPDS-${Date.now()}`,
        date: receiptData.timestamp || new Date().toISOString(),
        brushReceived: receiptData.brushReceived ?? 0,
        pasteReceived: receiptData.paste_received ?? 0,
        iecReceived: receiptData.iecReceived ?? 0,
        returnedOldKit: receiptData.returnedOldKit === 'yes',
        status: 'CONFIRMED',
      };

      kitHistory.unshift(newReceipt);
      localStorage.setItem('kitHistory', JSON.stringify(kitHistory));
      localStorage.removeItem('pendingKitReceipt');
    }

    navigate('/user/dashboard');
  };

  if (!receiptData) {
    return (
      <DashboardLayout role="user" title="">
        <div className="flex min-h-[70vh] items-center justify-center p-6">
          <Card className="rounded-[2.5rem] p-12 text-center shadow-premium border-none bg-white/50 backdrop-blur-xl max-w-sm w-full">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Null State Detected</h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-8">No active procurement receipt found in local cache.</p>
            <Button 
                onClick={() => navigate('/user/confirm-kit-receipt')}
                className="w-full h-14 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-xs"
            >
              Re-initialize Flow
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <DashboardLayout role="user" title="">
      <div className="min-h-screen bg-[#F1F5F9] pb-24 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-xl lg:rounded-tl-2xl overflow-hidden flex flex-col items-center">
        
        {/* Animated Celebration Header */}
        <div className="w-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white pt-20 pb-32 px-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/20"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tighter uppercase italic"
          >
            Distribution Secured
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] mt-3"
          >
            Terminal ID: {receiptData.dealerQrValue || "GENERIC-SYSTEM"}
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-xl px-6 -mt-16 z-10 space-y-6"
        >
          {/* Digital Receipt Card */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-[3rem] shadow-premium border-none bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
              
              <div className="p-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Digital Receipt</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Official Procurement Log</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Confirmed</p>
                    <p className="text-xs font-bold text-gray-400 mt-1">{receiptData.timestamp}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <ReceiptRow 
                    icon={<Brush className="w-5 h-5" />} 
                    label="Hygienic Oral Brushes" 
                    value={`${receiptData.brushReceived ?? 0} Units`} 
                  />
                  <ReceiptRow 
                    icon={<Waves className="w-5 h-5" />} 
                    label="Essential Toothpastes" 
                    value={`${receiptData.pasteReceived ?? 0} Units`} 
                  />
                  <ReceiptRow 
                    icon={<BookOpen className="w-5 h-5" />} 
                    label="IEC Informational Guides" 
                    value={`${receiptData.iecReceived ?? 0} Sets`} 
                  />
                  
                  <div className="pt-8 border-t border-dashed border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-emerald-600">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Return Status</p>
                        <p className="text-sm font-black text-gray-900">
                          {receiptData.returnedOldKit === 'yes' ? 'Verified Returned' : 'Pending Fulfillment'}
                        </p>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center opacity-10">
                       <ExternalLink className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Receipt Visual Footer */}
              <div className="bg-gray-50 px-10 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-gray-300" />
                   <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Auto-Archived in History</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                   <MapPin className="w-4 h-4" />
                   <span className="text-[9px] font-bold uppercase tracking-widest">Global Terminal</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Red Alert Section for pending return */}
          {receiptData.show_red_alert && (
            <motion.div variants={itemVariants}>
              <Card className="rounded-[2rem] border-none bg-rose-50 p-6 flex items-center gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm transition-transform hover:scale-110">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none mb-1">Administrative Alert</p>
                   <p className="text-sm font-black text-rose-900 tracking-tight leading-snug">
                     {receiptData.red_alert_message || 'The previous kit is still pending return. Please visit the dealer portal.'}
                   </p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Final Actions */}
          <motion.div variants={itemVariants} className="pt-4 pb-12">
            <Button 
                onClick={handleDashboardClick} 
                className="w-full h-20 rounded-[2.5rem] bg-blue-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-900/40 group flex items-center justify-center gap-4 transition-all active:scale-95"
            >
              Back to Command Station
              <ArrowRight className="w-5 h-5 opacity-30 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

function ReceiptRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-300 shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-lg font-black text-gray-900 tracking-tighter italic">Secured</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-black text-gray-900 tracking-tight">{value}</span>
      </div>
    </div>
  );
}