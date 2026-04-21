import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Package, 
  Camera, 
  QrCode, 
  Loader2,
  CheckCircle2,
  Archive,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { DealerDashboardStats } from '../../network/RetrofitClient';
import { cn } from '../../components/ui/utils';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import QRScanner from '../user/QRScanner';
import { getDealerSession } from '../../utils/dealerSession';

export function DealerDashboard() {
  const navigate = useNavigate();
  const { dealerId } = getDealerSession();
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [stats, setStats] = useState<DealerDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError("");

      if (!dealerId) {
        throw new Error("Dealer login not found. Please login again.");
      }

      const response = await RetrofitClient.apiService.getDealerDashboardStats(dealerId);

      if (!response.isSuccessful || !response.body) {
        throw new Error(response.errorBody?.string() || "Failed to load dashboard data");
      }

      const data = response.body;

      setStats({
        todayDistributions: data?.todayDistributions ?? "0",
        performancePercentage: data?.performancePercentage ?? 0,
        totalKits: data?.totalKits ?? "0",
        distributedKits: data?.distributedKits ?? "0",
        remainingKits: data?.remainingKits ?? "0",
        returnedKits: data?.returnedKits ?? "0",
        recentTransactions: Array.isArray(data?.recentTransactions) ? data.recentTransactions : []
      });
    } catch (error: any) {
      console.error("Failed to fetch dashboard stats", error);
      setError(error?.response?.data?.error || error?.message || "Failed to load dashboard metrics");
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const [isValidating, setIsValidating] = useState(false);

  const handleProceed = async () => {
    if (!beneficiaryId.trim()) {
      toast.error("Please enter a card number");
      return;
    }

    setIsValidating(true);
    try {
      const response = await RetrofitClient.apiService.verifyBeneficiary(beneficiaryId.trim(), dealerId);
      
      if (response.isSuccessful && response.body?.valid) {
        toast.success("Identity Verified");
        navigate('/dealer/household-eligibility', {
          state: { 
            beneficiaryId: beneficiaryId.trim(),
            beneficiary: response.body.beneficiary 
          }
        });
      } else {
        const msg = response.body?.message || "INVALID IDENTIFICATION";
        toast.error(msg);
      }
    } catch (e) {
      toast.error("System verification failed");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <DashboardLayout role="dealer" title="Dealer Hub">
      {isScanning && (
        <QRScanner 
          themeColor="#10B981"
          scanModeLabel="Scan PDS Card"
          onClose={() => setIsScanning(false)}
          onResult={(result) => {
            setBeneficiaryId(result);
            setIsScanning(false);
            toast.success("Card Scanned Successfully");
          }}
        />
      )}
      <div className="space-y-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <p className="mt-4 text-gray-400 font-black uppercase tracking-widest text-[10px]">
              Synchronizing Hub Data...
            </p>
          </div>
        ) : error ? (
          <Card className="card-premium p-6">
            <p className="text-red-600 font-bold">{error}</p>
          </Card>
        ) : !stats ? (
          <Card className="card-premium p-6">
            <p className="text-gray-500 font-bold">No dashboard data available.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-10">
                {/* Performance Banner */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-8 sm:p-10 overflow-hidden shadow-premium"
                >
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest text-xs">Daily Distribution Count</span>
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-5xl font-black text-white tracking-tighter">{stats.todayDistributions} Units</h2>
                                    <p className="text-emerald-100/60 font-bold text-sm tracking-tight capitalize">Total units dispatched today</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                </motion.div>

                {/* Quick Distribution Card */}
                <section className="space-y-4">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight px-2">Rapid Distribution</h3>
                  <Card className="card-premium p-8 space-y-6">
                    <div className="relative group">
                      <Input 
                        value={beneficiaryId}
                        onChange={(e) => setBeneficiaryId(e.target.value)}
                        placeholder="Scan or Enter Card Number"
                        className="h-16 pl-6 pr-16 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:border-emerald-500/50 text-base font-black placeholder:text-gray-300 transition-all shadow-inner-premium"
                      />
                      <button 
                        onClick={() => setIsScanning(true)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl hover:bg-emerald-50 transition-colors group"
                      >
                        <Camera className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={handleProceed}
                        disabled={isValidating}
                        className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black tracking-widest uppercase text-xs rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                      >
                        {isValidating ? "VERIFYING..." : "Proceed"}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/dealer/generate-qr')}
                        className="flex-1 h-14 border-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50 font-black tracking-widest uppercase text-xs rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <QrCode className="w-4 h-4" />
                        Generate QR
                      </Button>
                    </div>
                  </Card>
                </section>

                {/* Detailed Inventory Metrics */}
                <div className="grid grid-cols-2 gap-6">
                  <InventoryCard 
                    title="Total Kits" 
                    value={stats.totalKits} 
                    icon={<Package className="w-5 h-5" />}
                    color="emerald"
                  />
                  <InventoryCard 
                    title="Distributed" 
                    value={stats.distributedKits} 
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    color="blue"
                  />
                  <InventoryCard 
                    title="Remaining" 
                    value={stats.remainingKits} 
                    icon={<Archive className="w-5 h-5" />}
                    onClick={() => navigate('/dealer/stock-list')}
                    color="amber"
                  />
                  <InventoryCard 
                    title="System Returns" 
                    value={stats.returnedKits} 
                    icon={<Package className="w-5 h-5" />}
                    color="rose"
                  />
                </div>
            </div>

            {/* Sidebar View Area */}
            <div className="space-y-10">
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent History</h3>

                    </div>
                    <Card className="card-premium overflow-hidden">
                        <div className="flex flex-col">
                        {Array.isArray(stats?.recentTransactions) && stats.recentTransactions.length > 0 ? (
                          stats.recentTransactions.map((tx, idx) => (
                            <div
                              key={tx.id ?? idx}
                              className={cn(
                                "p-6 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer group active:scale-[0.98]",
                                idx !== stats.recentTransactions.length - 1 && "border-b border-gray-50"
                              )}
                              onClick={() => navigate('/dealer/distribution-activity')}
                            >
                              <div className="space-y-1">
                                    <h4 className="text-base font-black text-gray-900 tracking-tight leading-none">{tx.name ?? "Unknown Transaction"}</h4>
                                    <p className="text-xs font-medium text-gray-500 leading-tight">Items: {tx.details ?? "No details"}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">ID #{tx.id ?? "N/A"}</p>
                                </div>
                              <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end gap-0.5">
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                            {tx.quantity ?? "0"} Units
                                        </span>
                                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{tx.timestamp ?? ""}</p>
                                    </div>
                                    <Check className="w-5 h-5 text-gray-700 stroke-[3px]" />
                                </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-sm text-gray-500 font-medium">
                            No recent transactions found.
                          </div>
                        )}
                        </div>
                        <div className="p-4 border-t border-gray-50 flex justify-center">
                            <button 
                                onClick={() => navigate('/dealer/distribution-activity')}
                                className="text-xs font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest transition-colors flex items-center gap-2"
                            >
                                View Full History
                            </button>
                        </div>
                    </Card>
                </section>

                <div className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                        <Archive className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-lg font-black text-gray-900 tracking-tight leading-tight">System Message</h4>
                        <p className="text-xs font-medium text-emerald-900/60 leading-relaxed">
                            Low stock alert for <span className="font-black text-emerald-800 tracking-tight">Standard Distribution Kits</span>. Please initiate a restock request soon.
                        </p>
                    </div>
                    <Button 
                        onClick={() => navigate('/dealer/request-new-stock')}
                        className="w-full bg-emerald-600 text-white rounded-xl h-11 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/10"
                    >
                        Request Restock
                    </Button>
                </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function InventoryCard({ title, value, icon, onClick, color }: { 
    title: string, value: string, icon: React.ReactNode, onClick?: () => void, color: 'emerald' | 'blue' | 'amber' | 'rose' 
}) {
    const colorMap = {
        emerald: "bg-emerald-50 text-emerald-600",
        blue: "bg-blue-50 text-blue-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600"
    };

    return (
        <Card 
            onClick={onClick}
            className={cn(
                "card-premium p-6 space-y-4",
                onClick ? "cursor-pointer active:scale-95" : ""
            )}
        >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorMap[color])}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{value}</h3>
            </div>
        </Card>
    );
}