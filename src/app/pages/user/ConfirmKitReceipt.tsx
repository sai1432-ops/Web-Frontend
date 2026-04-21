import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { RetrofitClient } from '../../network/RetrofitClient';
import { SessionManager } from '../../utils/SessionManager';
import { useFamilyHealth } from '../../hooks/useFamilyHealth';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Brush, 
  Waves, 
  BookOpen, 
  QrCode, 
  ScanLine, 
  CheckCircle2, 
  AlertCircle,
  PackageCheck,
  History,
  Info
} from 'lucide-react';
import { cn } from '../../components/ui/utils';

function normalizeDealerQrInput(raw: string): string {
  return raw.trim();
}

export function ConfirmKitReceipt() {
  const navigate = useNavigate();
  const [oldKitReturned, setOldKitReturned] = useState<boolean | null>(null);
  const [dealerQrValue, setDealerQrValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { familyMembers, fetchFamilyMembers } = useFamilyHealth();
  const userId = SessionManager.getUserId();

  useEffect(() => {
    if (userId > 0) {
      fetchFamilyMembers(userId);
    }
  }, [userId, fetchFamilyMembers]);

  const totalFamilyMembers = familyMembers.length + 1;
  const brushQuantity = totalFamilyMembers;
  const pasteQuantity = totalFamilyMembers;
  const iecQuantity = totalFamilyMembers;

  const buildReceiptData = (
    qrValue: string,
    responseBody: any
  ) => {
    const data = responseBody?.data ?? responseBody ?? {};

    return {
      brushReceived: data.brush_received ?? brushQuantity,
      pasteReceived: data.paste_received ?? pasteQuantity,
      iecReceived: data.iec_received ?? iecQuantity,
      returnedOldKit:
        data.old_kit_returned === true
          ? 'yes'
          : oldKitReturned === true
            ? 'yes'
            : 'no',
      timestamp: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      totalKits: totalFamilyMembers,
      dealerQrValue: qrValue,
      show_red_alert: data.show_red_alert ?? (oldKitReturned === false),
      red_alert_message: data.red_alert_message ?? (oldKitReturned === false ? 'Old kit pending return' : undefined),
      isConfirmed: true,
    };
  };

  const handleManualConfirm = async () => {
    if (oldKitReturned === null) {
      toast.error('Please select old kit return status');
      return;
    }

    const qrValue = normalizeDealerQrInput(dealerQrValue);
    if (!qrValue) {
      toast.error('Please enter Dealer QR value');
      return;
    }

    setIsLoading(true);
    try {
      const verifyResponse = await RetrofitClient.apiService.confirmKitByDealerQR(
        userId,
        qrValue,
        brushQuantity,
        pasteQuantity,
        iecQuantity,
        oldKitReturned === true
      );

      if (!verifyResponse?.isSuccessful) {
        throw new Error(verifyResponse?.errorBody?.string() || 'Dealer QR verification failed');
      }

      const responseData = verifyResponse.body?.data || verifyResponse.body || {};
      const kitUniqueId = responseData.kit_unique_id;

      if (!kitUniqueId) {
        throw new Error('Failed to retrieve kit unique ID for confirmation');
      }

      const confirmResponse = await RetrofitClient.apiService.confirmKitReceipt(
        userId,
        qrValue,
        kitUniqueId,
        brushQuantity,
        pasteQuantity,
        iecQuantity,
        oldKitReturned === true
      );

      if (!confirmResponse?.isSuccessful) {
        throw new Error(confirmResponse?.errorBody?.string() || 'Final confirmation failed');
      }

      const receiptData = buildReceiptData(qrValue, confirmResponse.body);
      localStorage.setItem('pendingKitReceipt', JSON.stringify(receiptData));

      toast.success(confirmResponse.body?.message || 'Kit confirmed successfully');
      navigate('/user/kit-received');
    } catch (e: any) {
      toast.error(e?.message || 'Confirmation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanClick = () => {
    if (oldKitReturned === null) {
      toast.error('Please select old kit return status');
      return;
    }

    localStorage.setItem(
      'preliminaryKitData',
      JSON.stringify({
        oldKitReturned: oldKitReturned ? 'yes' : 'no',
        brushQuantity,
        pasteQuantity,
        iecQuantity,
        totalFamilyMembers,
      })
    );

    navigate('/user/scan-dealer-qr');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <DashboardLayout role="user" title="">
      <div className="min-h-screen bg-[#F8FAFC] pb-24 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-xl lg:rounded-tl-2xl overflow-hidden">
        
        {/* Immersive Premium Header */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white p-8 sm:p-12 pb-20 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-[80px]" />
          
          <div className="relative z-10 space-y-8">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Abort Process</span>
            </button>

            <div className="flex justify-between items-end">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-4">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/80">Inventory Procurement</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Confirmation</h1>
                <p className="text-blue-100/60 font-bold text-sm tracking-tight mt-1">
                  Validating distribution for {totalFamilyMembers} individual{totalFamilyMembers > 1 ? 's' : ''}
                </p>
              </div>
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-2xl">
                <PackageCheck className="w-10 h-10 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 sm:px-10 -mt-10 space-y-10 max-w-4xl mx-auto w-full"
        >
          {/* Quantity Micro-Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <QuantityCard 
              icon={<Brush className="w-6 h-6" />} 
              label="Oral Brushes" 
              value={brushQuantity} 
              color="blue" 
              variants={itemVariants}
            />
            <QuantityCard 
              icon={<Waves className="w-6 h-6" />} 
              label="Toothpastes" 
              value={pasteQuantity} 
              color="emerald" 
              variants={itemVariants}
            />
            <QuantityCard 
              icon={<BookOpen className="w-6 h-6" />} 
              label="IEC Materials" 
              value={iecQuantity} 
              color="amber" 
              variants={itemVariants}
            />
          </div>

          {/* Return Selection Protocol */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Old Kit Return Protocol</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectionCard 
                selected={oldKitReturned === true}
                onClick={() => setOldKitReturned(true)}
                icon={<CheckCircle2 className="w-6 h-6" />}
                title="Returned Successfully"
                description="The previous health kit has been handed back to the dealer."
                activeColor="border-emerald-500 bg-emerald-50/50"
                iconColor="text-emerald-500"
              />
              <SelectionCard 
                selected={oldKitReturned === false}
                onClick={() => setOldKitReturned(false)}
                icon={<AlertCircle className="w-6 h-6" />}
                title="Pending Return"
                description="I haven't returned the old kit yet and will do so soon."
                activeColor="border-rose-500 bg-rose-50/50"
                iconColor="text-rose-500"
              />
            </div>
          </motion.div>

          {/* Validation Terminal */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-[2.5rem] border-none shadow-2xl p-8 bg-white space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-black text-gray-900 tracking-tight">Manual ID Validation</h3>
              </div>
              <div className="space-y-4">
                <Input
                  value={dealerQrValue}
                  onChange={(e) => setDealerQrValue(e.target.value)}
                  placeholder="Enter Dealer Identification Number"
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 font-black text-sm tracking-tight placeholder:text-gray-300 focus:bg-white transition-all shadow-inner"
                />
                <Button
                  onClick={handleManualConfirm}
                  disabled={isLoading || oldKitReturned === null || !dealerQrValue.trim()}
                  className="w-full h-16 rounded-[1.5rem] bg-blue-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
                >
                  {isLoading ? 'Verifying...' : 'Finalize Distribution'}
                </Button>
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-2xl p-8 bg-gradient-to-br from-gray-900 to-black text-white space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                    <History className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-black tracking-tight">Scan QR to Finalize</h3>
                </div>
                <p className="text-white/40 text-[10px] font-bold leading-relaxed tracking-wider uppercase">
                  Use your device camera to authenticate the dealer's secure identification code instantly.
                </p>
                <Button
                  onClick={handleScanClick}
                  disabled={oldKitReturned === null}
                  className="w-full h-16 rounded-[1.5rem] bg-white text-black hover:bg-blue-400 hover:text-white font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-2xl"
                >
                  <ScanLine className="mr-3 h-5 w-5" />
                  Initialize Scanner
                </Button>
              </div>
            </Card>
          </motion.div>

          <div className="flex items-center justify-center gap-3 py-6 opacity-30">
            <Info className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest italic">Encrypted Procurement Service Protocol</span>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

function QuantityCard({ icon, label, value, color, variants }: any) {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50/50",
    emerald: "text-emerald-600 bg-emerald-50/50",
    amber: "text-amber-600 bg-amber-50/50"
  };

  return (
    <motion.div variants={variants}>
      <Card className="rounded-[2rem] p-6 border-none shadow-xl bg-white transition-all hover:translate-y-[-4px] group">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner", colorMap[color])}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function SelectionCard({ selected, onClick, icon, title, description, activeColor, iconColor }: any) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[2rem] border-2 p-6 transition-all duration-300 text-left relative overflow-hidden group",
        selected ? activeColor : "border-gray-100 bg-white hover:border-blue-200"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 shadow-inner",
        selected ? "bg-white" : "bg-gray-50 group-hover:bg-blue-50",
        selected ? iconColor : "text-gray-300 group-hover:text-blue-400"
      )}>
        {icon}
      </div>
      <h4 className={cn("font-black text-sm tracking-tight mb-2", selected ? "text-gray-900" : "text-gray-400")}>{title}</h4>
      <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">{description}</p>
      
      {selected && (
        <div className="absolute top-4 right-4 animate-in fade-in zoom-in-95">
          <CheckCircle2 className={cn("w-5 h-5", iconColor)} />
        </div>
      )}
    </button>
  );
}