import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  CheckCircle, 
  ArrowLeft 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';

export default function DistributionSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extraction of distribution details from navigation state
  const brushes = location.state?.brushes || 0;
  const fluoridePaste = location.state?.fluoridePaste || 0;
  const iecPamphlets = location.state?.iecPamphlets || 0;
  const headName = location.state?.headName || "Unknown Beneficiary";
  const pdsCardNo = location.state?.beneficiaryId || "N/A";

  const receiptId = useMemo(() => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return `REC-${today}-5612-${randomCode}`;
  }, []);

  const DealerGreen = "#047857";

  return (
    <DashboardLayout role="dealer">
      <div className="min-h-[calc(100vh-80px)] bg-[#F4F7FB] relative overflow-x-hidden -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-xl lg:rounded-tl-2xl border border-gray-100/50 shadow-sm">
      {/* Immersive Header Graphic */}
      <div 
        className="absolute top-0 left-0 right-0 h-[380px] z-0 flex items-center justify-center p-6 rounded-t-xl lg:rounded-tl-2xl"
        style={{ 
          background: `linear-gradient(to bottom, ${DealerGreen}, #003322)` 
        }}
      >
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)]"
        >
          <CheckCircle className="w-16 h-16" style={{ color: DealerGreen }} strokeWidth={2.5} />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 pt-12">
        {/* Navigation Header */}
        <header className="flex items-center justify-between mb-32 h-14">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Receipt Ticket Card */}
          <Card className="rounded-[2rem] border-none shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] bg-white overflow-hidden mb-10">
            <div className="p-8 sm:p-10 flex flex-col items-center">
              <h1 className="text-2xl font-black text-gray-900 text-center mb-2">
                Distribution Successful!
              </h1>
              <p className="text-sm font-medium text-gray-400 text-center max-w-[240px] leading-relaxed mb-6">
                Kits have been successfully allocated to the household.
              </p>

              {/* Prominent Beneficiary Details */}
              <div className="w-full bg-[#E6F4EA] rounded-2xl p-5 mb-8 text-center border-t border-b border-[#047857]/20 shadow-inner">
                <p className="text-[10px] font-black text-[#047857] uppercase tracking-widest mb-1">Head of Family</p>
                <h2 className="text-xl font-black text-gray-900 mb-2">{headName}</h2>
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-[#047857]/10">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PDS CARD</span>
                  <span className="text-xs font-black text-[#047857] tracking-wider">{pdsCardNo}</span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 mb-8" />

              <div className="w-full flex items-center justify-between mb-8">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Receipt ID</span>
                <span className="text-sm font-black tracking-tight text-gray-900">
                  {receiptId}
                </span>
              </div>

              {/* Items Summary */}
              <div className="w-full space-y-4">
                {brushes > 0 && <ReceiptItemRow name="Brushes" count={brushes} />}
                {fluoridePaste > 0 && <ReceiptItemRow name="Fluoride Paste" count={fluoridePaste} />}
                {iecPamphlets > 0 && <ReceiptItemRow name="IEC Pamphlets" count={iecPamphlets} />}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4 pb-12">

            <Button 
              onClick={() => navigate('/dealer/dashboard')}
              style={{ backgroundColor: DealerGreen }}
              className="w-full h-14 rounded-2xl text-white font-black tracking-widest uppercase text-xs shadow-[0_12px_24px_-8px_rgba(4,120,87,0.4)] hover:shadow-none transition-all"
            >
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
      </div>
    </DashboardLayout>
  );
}

function ReceiptItemRow({ name, count }: { name: string, count: number }) {
  const DealerGreen = "#047857";
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xs font-black group-hover:bg-[#E6F4EA] transition-colors" style={{ color: DealerGreen }}>
        {count}x
      </div>
      <span className="text-sm font-bold text-gray-700">{name}</span>
    </div>
  );
}
