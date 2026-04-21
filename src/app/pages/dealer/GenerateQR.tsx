import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  QrCode, 
  Info,
  Download,
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { RetrofitClient } from '../../network/RetrofitClient';
import { Loader2 } from 'lucide-react';

export function DealerGenerateQR() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(currentUser);
  const dealerId = currentUser.dealer_id || currentUser.id || 0;

  useEffect(() => {
    async function loadProfile() {
      if (profile.dealer_qr_value) return;
      
      setIsLoading(true);
      try {
        const response = await RetrofitClient.apiService.getDealerProfile("", dealerId);
        if (response.isSuccessful && response.body) {
          setProfile(response.body);
          // Sync with local storage for other components
          const updatedUser = { ...currentUser, ...response.body };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (e) {
        console.error("Failed to load dealer profile:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [dealerId]);

  const qrPayload = profile.dealer_qr_value || currentUser.dealer_qr_value || "";

  const DealerGreen = "#047857";

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative flex flex-col items-center">
      {/* Top Gradient Background */}
      <div 
        className="absolute top-0 left-0 right-0 h-[220px] z-0"
        style={{ 
          background: `linear-gradient(to bottom, ${DealerGreen}, #F8F9FA)` 
        }}
      ></div>

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-lg flex items-center px-6 py-8 text-white">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-white/10 text-white mr-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-black tracking-tight uppercase">Kit Distribution QR</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 w-full max-w-md pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <Card className="p-8 rounded-[2.5rem] border-none shadow-2xl shadow-black/10 bg-white space-y-8">
            <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                  <p className="text-sm font-bold text-gray-400 animate-pulse">Fetching QR Data...</p>
                </div>
              ) : qrPayload ? (
                <>
                  <div className="p-8 bg-[#F1F4F4] rounded-[2rem] shadow-inner relative group">
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <QRCodeCanvas 
                        value={qrPayload}
                        size={200}
                        level="H"
                        includeMargin={false}
                        fgColor="#000000"
                      />
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-[#F1F4F4]">
                      <QrCode className="w-6 h-6" style={{ color: DealerGreen }} />
                    </div>
                  </div>
                  <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Payload Signature</span>
                    <p className="text-[10px] font-mono font-bold text-gray-600 break-all text-center leading-relaxed">
                      {qrPayload}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <Info className="w-12 h-12 text-red-400" />
                  <p className="text-sm font-bold text-gray-400">QR Value not found.<br/>Please contact support.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[11px] font-bold text-blue-700/70 leading-relaxed uppercase tracking-wider">
                  This is your unique dealer QR code. Beneficiaries must scan this to confirm they have received their dental kits.
                </p>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-2 font-black tracking-widest uppercase text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all"
                  style={{ borderColor: DealerGreen, color: DealerGreen }}
                >
                  <Download className="w-4 h-4" />
                  Save Image
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-2 font-black tracking-widest uppercase text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all"
                  style={{ borderColor: DealerGreen, color: DealerGreen }}
                >
                  <Share2 className="w-4 h-4" />
                  Share QR
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] text-center"
        >
          Mukh Swasthya • Static Dealer QR
        </motion.p>
      </main>
    </div>
  );
}
