import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  Package, 
  BookOpen, 
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { useState } from 'react';
import { RetrofitClient } from '../../network/RetrofitClient';
import { toast } from 'sonner';

export default function FinalDistribution() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Passed from previous screening state
  const { 
    beneficiaryId = 'PDS-1001', 
    headName = 'Rajesh Kumar', 
    memberCount = 3, 
    oldKitReturned = true,
    beneficiaryDbId
  } = location.state || {};

  const DealerGreen = "#10B981";
  const DarkEmerald = "#064E3B";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const dealerId = currentUser.dealer_id || currentUser.id || 1;

  // Include the Family Head in the total calculation
  const totalBeneficiaries = memberCount + 1;

  const brushes = totalBeneficiaries;
  const fluoridePaste = totalBeneficiaries;
  const iecPamphlets = totalBeneficiaries;

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      const parsedDbId = parseInt(beneficiaryDbId) || 0;
      const finalBeneficiaryId = parsedDbId > 0 ? parsedDbId : beneficiaryId;

      const response = await RetrofitClient.apiService.dealerConfirmDistribution({
        dealerId,
        beneficiaryId: finalBeneficiaryId,
        brushReceived: brushes,
        pasteReceived: fluoridePaste,
        iecReceived: iecPamphlets,
        oldKitReturned: !!oldKitReturned
      });

      if (response.isSuccessful) {
        toast.success("Distribution Recorded Successfully");
        navigate('/dealer/distribution-success', { 
          state: { 
            beneficiaryId,
            headName,
            oldKitReturned,
            brushes,
            fluoridePaste,
            iecPamphlets
          } 
        });
      } else {
        const errorMsg = response.errorBody?.string();
        toast.error(errorMsg || "Failed to record distribution");
      }
    } catch (e) {
      toast.error("Network synchronization error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="dealer">
      <div className="min-h-[calc(100vh-80px)] bg-[#F4F7FB] relative overflow-hidden -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-xl lg:rounded-tl-2xl border border-gray-100/50 shadow-sm">
      {/* Dark Emerald Gradient Banner */}
      <div 
        className="absolute top-0 left-0 right-0 h-[260px] z-0 rounded-t-xl lg:rounded-tl-2xl"
        style={{ 
          background: `linear-gradient(to bottom, ${DealerGreen}, ${DarkEmerald})` 
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6">
        {/* Top App Bar */}
        <header className="flex items-center h-20 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="ml-4 text-xl font-black text-white tracking-tight">Final Handover</h1>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="space-y-8"
        >
          {/* Household Summary Card */}
          <Card className="rounded-[2.5rem] border-none shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] bg-white p-8 overflow-hidden text-center space-y-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-1">Household: {beneficiaryId}</h2>
              <p className="text-sm font-bold text-gray-400">Head: {headName}</p>
            </div>

            {/* Verification Badge */}
            <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-2xl font-black text-sm tracking-wide ${
              oldKitReturned 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'bg-red-50 text-red-600'
            }`}>
              {oldKitReturned ? (
                <>
                  <CheckCircle className="w-4.5 h-4.5" />
                  Kit Return: Verified
                </>
              ) : (
                <>
                  <XCircle className="w-4.5 h-4.5" />
                  Kit Not Returned
                </>
              )}
            </div>
          </Card>

          {/* Distribution Items Section */}
          <div className="space-y-6 px-2">
            <h2 className="text-xl font-black text-gray-900">Distribute Kits</h2>
            
            <div className="space-y-3">
              <HandoverItemRow 
                name="Brushes" 
                count={brushes} 
                icon={<Package className="w-5 h-5" />}
                color={DealerGreen} 
              />
              <HandoverItemRow 
                name="Fluoride Paste" 
                count={fluoridePaste} 
                icon={<ShieldCheck className="w-5 h-5" />}
                color={DealerGreen} 
              />
              <HandoverItemRow 
                name="IEC Pamphlets" 
                count={iecPamphlets} 
                icon={<BookOpen className="w-5 h-5" />}
                color={DealerGreen} 
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 pb-2">
            <Button 
              onClick={handleComplete}
              disabled={isSubmitting}
              className="w-full h-16 bg-[#10B981] hover:bg-[#059669] text-white rounded-[1.25rem] shadow-[0_12px_24px_-8px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 border-none"
            >
              {isSubmitting ? (
                <span className="text-base font-black tracking-widest uppercase">Recording...</span>
              ) : (
                <>
                  <span className="text-base font-black tracking-widest uppercase">Complete Distribution</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
      </div>
    </DashboardLayout>
  );
}

function HandoverItemRow({ name, count, icon, color }: { name: string, count: number, icon: React.ReactNode, color: string }) {
  return (
    <Card className="rounded-[1.5rem] border-none shadow-sm p-4 flex items-center justify-between group hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${color}10`, color: color }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900">{name}</h3>
          <p className="text-[10px] font-black text-emerald-600 opacity-60 uppercase tracking-widest">
            Auto-calculated
          </p>
        </div>
      </div>
      
      <div 
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-black"
        style={{ backgroundColor: `${color}10`, color: color }}
      >
        {count}
      </div>
    </Card>
  );
}
