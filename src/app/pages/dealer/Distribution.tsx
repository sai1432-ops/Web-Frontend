import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Plus, QrCode, ArrowLeft, 
  Search, Package, TrendingUp, 
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBeneficiaryViewModel } from '../../hooks/useBeneficiaryViewModel';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { DealerDashboardStats } from '../../network/RetrofitClient';
import { toast } from 'sonner';

export function Distribution() {
  const navigate = useNavigate();
  const { 
    errorMessage, 
  } = useBeneficiaryViewModel();


  const [qrValue, setQrValue] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [distributions, setDistributions] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const dealerId = currentUser.dealer_id || currentUser.id || 1;


  const [stats, setStats] = useState<DealerDashboardStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    fetchRecentDistributions();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsStatsLoading(true);
      const res = await RetrofitClient.apiService.getDealerDashboardStats(dealerId);
      if (res.isSuccessful && res.body) {
        setStats(res.body);
      }
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const fetchRecentDistributions = async () => {
    try {
      setIsHistoryLoading(true);
      const res = await RetrofitClient.apiService.getDealerDistributionHistory(dealerId);
      if (res.isSuccessful && res.body) {
        // Only show latest 4 for the recent list
        setDistributions(res.body.slice(0, 4));
      }
    } catch (e) {
      console.error("Failed to fetch distributions:", e);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleConfirmKit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrValue && !beneficiaryId) {
      toast.error("Enter PDS ID or Scan QR");
      return;
    }

    setIsValidating(true);
    setValidationError(null);
    
    try {
      // For mock, we'll treat QR scan or manual ID as the Ration ID
      const rationId = qrValue || beneficiaryId;
      const response = await RetrofitClient.apiService.verifyBeneficiary(rationId, dealerId);
      
      if (response.isSuccessful && response.body?.valid) {
        toast.success("Identity Verified");
        setIsDialogOpen(false);
        navigate('/dealer/household-eligibility', {
          state: { 
            beneficiaryId: rationId,
            beneficiary: response.body.beneficiary 
          }
        });
      } else {
        const msg = response.body?.message || "INVALID IDENTIFICATION";
        setValidationError(msg);
        toast.error(msg);
      }
    } catch (e) {
      toast.error("System verification failed");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <DashboardLayout role="dealer" title="">
      <div className="min-h-[calc(100vh-80px)] bg-[#F8F9FA] pb-24 lg:pb-12 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-xl lg:rounded-tl-2xl border border-gray-100/50 shadow-sm overflow-hidden">
        {/* Top Green Gradient Header */}
        <div 
          className="relative w-full h-[240px] flex flex-col items-center justify-start p-8 overflow-hidden rounded-t-xl lg:rounded-tl-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#10b981]" />
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
          <div className="absolute bottom-[-100px] left-[-10px] w-80 h-80 bg-[#022c22]/40 rounded-full blur-3xl mix-blend-overlay" />
          <div className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-4">
            <div className="flex items-center gap-4 text-white">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/10 rounded-full transition-all">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-2xl font-black uppercase tracking-tight">Distribution Hub</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 px-6 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-black text-xs tracking-widest gap-3 transition-all active:scale-95 shadow-lg shadow-black/10">
                  <Plus className="w-4 h-4 stroke-[3px]" />
                  NEW RECORD
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-[2.5rem] border-0 p-8 shadow-2xl">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-2xl font-black text-gray-900 uppercase tracking-tight">Record Distribution</DialogTitle>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Verify QR & Kit ID</p>
                </DialogHeader>
                <form onSubmit={handleConfirmKit} className="mt-8 space-y-6">
                  {(errorMessage || validationError) && (
                    <div className="flex flex-col gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-black uppercase tracking-tighter">INVALID ACCESS</p>
                      </div>
                      <p className="text-xs font-bold leading-relaxed">{validationError || errorMessage}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Beneficiary ID</Label>
                      <Input 
                        value={beneficiaryId}
                        onChange={(e) => setBeneficiaryId(e.target.value)}
                        placeholder="Ex: 1024" 
                        className="h-14 rounded-xl border-gray-100 bg-gray-50/50 font-bold focus:ring-4 focus:ring-green-500/10 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">QR Scan Value</Label>
                      <div className="relative group">
                        <Input 
                          value={qrValue}
                          onChange={(e) => setQrValue(e.target.value)}
                          placeholder="Place scanner focus here" 
                          className="h-14 pl-12 rounded-xl border-gray-100 bg-gray-50/50 font-bold focus:ring-4 focus:ring-green-500/10 transition-all" 
                        />
                        <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1B5E20] transition-colors" />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isValidating}
                    className="w-full h-14 rounded-xl bg-[#1B5E20] hover:bg-[#123E15] text-white font-black text-sm tracking-widest transition-all active:scale-95 shadow-lg shadow-green-900/20"
                  >
                    {isValidating ? "VERIFYING..." : "PROCEED TO ELIGIBILITY"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20 space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="p-8 rounded-[2.5rem] border-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] bg-white flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#E6F4EA] flex items-center justify-center text-[#047857]">
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Output</p>
                            <p className="text-3xl font-black text-gray-900 tabular-nums">
                                {isStatsLoading ? "..." : stats?.todayDistributions || 0} 
                                <span className="text-xs text-emerald-500 ml-1">Kits</span>
                            </p>
                        </div>
                    </Card>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="p-8 rounded-[2.5rem] border-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] bg-white flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E6] flex items-center justify-center text-amber-600">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Efficiency Rate</p>
                            <p className="text-3xl font-black text-gray-900 tabular-nums">
                                {isStatsLoading ? "..." : stats?.performancePercentage || 0} 
                                <span className="text-xs text-amber-500 ml-1">%</span>
                            </p>
                        </div>
                    </Card>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="p-8 rounded-[2.5rem] border-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] bg-white flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Distributed</p>
                            <p className="text-3xl font-black text-gray-900 tabular-nums">
                                {isStatsLoading ? "..." : stats?.distributedKits || "0"}
                            </p>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Table */}
            <Card className="rounded-[3rem] border-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] bg-white overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Distributions</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Real-time log tracking</p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <Search className="w-5 h-5 text-gray-400" />
                    </Button>
                </div>
                <div className="overflow-x-auto px-4 pb-4">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-0">
                                <TableHead className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 h-14">ID</TableHead>
                                <TableHead className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 h-14">Identity</TableHead>
                                <TableHead className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 h-14 text-center">Items</TableHead>
                                <TableHead className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 h-14">Date/Time</TableHead>
                                <TableHead className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 h-14">Status</TableHead>
                                <TableHead className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 h-14 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isHistoryLoading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <TableRow key={i} className="border-0">
                                        <TableCell colSpan={6} className="px-6 py-4">
                                            <div className="h-10 w-full bg-gray-50 rounded-xl animate-pulse" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : distributions.length === 0 ? (
                                <TableRow className="border-0">
                                    <TableCell colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        No recent distributions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                distributions.map((dist) => (
                                    <TableRow key={dist.id} className="group border-0 hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="px-6 py-5 font-black text-gray-900 text-sm tracking-tighter">{dist.id}</TableCell>
                                        <TableCell className="px-6 py-5">
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-gray-900 text-sm">{dist.beneficiaryName}</p>
                                                <p className="text-[10px] font-bold text-gray-400 transition-colors group-hover:text-[#1B5E20]">VERIFIED HOUSEHOLD</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-5 text-center">
                                            <div className="px-3 h-10 rounded-full bg-gray-50 flex items-center justify-center font-black text-[10px] text-gray-600 mx-auto group-hover:bg-[#E8F5E9] group-hover:text-[#1B5E20] transition-all whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                                                {dist.itemsSummary || "KIT"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-5">
                                            <div className="space-y-0.5 text-xs font-bold">
                                                <p className="text-gray-900">{dist.date}</p>
                                                <p className="text-gray-400">{dist.time}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-5">
                                            <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-100 font-black text-[10px] rounded-full px-3 py-1 scale-90">
                                                {dist.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-5 text-right">
                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-lg transition-all group-hover:text-[#1B5E20]">
                                                <Search className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

