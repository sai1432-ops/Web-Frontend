import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { 
  Plus, Search, ArrowRight, 
  ShieldCheck, Filter, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { RetrofitClient } from '../../network/RetrofitClient';
import { getDealerSession } from '../../utils/dealerSession';

export default function DealerBeneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const DealerGreen = "#1B5E20";

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setIsLoading(true);
      setError("");

      const { dealerId } = getDealerSession();

      if (!dealerId) {
        throw new Error("Dealer session not found. Please login again.");
      }

      const data = await RetrofitClient.apiService.getDealerBeneficiaries(dealerId);

      setBeneficiaries(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Failed to load beneficiaries:", error);
      setError(error?.response?.data?.error || error?.message || "Failed to load beneficiaries");
      setBeneficiaries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter(
    (b) =>
      b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.rationId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ration_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pds_card_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pdsCardNo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="dealer" title="">
      <div className="min-h-screen bg-[#F8F9FA] pb-24 lg:pb-12">
        {/* Top Green Gradient Header */}
        <div 
          className="relative w-full h-[220px] flex flex-col items-center justify-start p-8 overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${DealerGreen}, rgba(255,255,255,0))` }}
        >
          <div className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-4">
            <div className="flex items-center gap-4 text-white">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/10 rounded-full transition-all">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-2xl font-black uppercase tracking-tight">Beneficiary List</h1>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full transition-all">
                <Filter className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-400/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-20 space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            {error && (
                <div className="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-bold">
                    {error}
                </div>
            )}

            {/* Search and Add Card */}
            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-green-900/10 p-8 lg:p-10 bg-white">
                <div className="space-y-6">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1B5E20] transition-colors" />
                        <Input 
                            placeholder="Search by Name or Card ID"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-16 pl-16 rounded-2xl border-0 bg-gray-50/80 focus:bg-white focus:ring-4 focus:ring-green-500/10 font-bold text-gray-900 transition-all text-lg placeholder:text-gray-300"
                        />
                    </div>

                    <Button 
                        onClick={() => navigate('/dealer/beneficiaries/register')} 
                        className="w-full h-16 rounded-2xl bg-[#1B5E20] hover:bg-[#123E15] text-white font-black text-sm tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 transition-all active:scale-[0.98] uppercase"
                    >
                        <Plus className="w-5 h-5 stroke-[3px]" />
                        ADD NEW BENEFICIARY
                    </Button>
                </div>
            </Card>

            {/* Beneficiary List Section */}
            <div className="space-y-4">
                {!isLoading && beneficiaries.length > 0 && (
                    <div className="px-4 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
                            {filteredBeneficiaries.length} Verified Records
                        </span>
                    </div>
                )}

                <div className="space-y-4">
                    {isLoading ? (
                        Array(4).fill(0).map((_, i) => (
                            <Card key={i} className="p-6 rounded-[2rem] border-0 shadow-sm animate-pulse flex items-center gap-5">
                                <Skeleton className="w-14 h-14 rounded-2xl" />
                                <div className="space-y-3 flex-1">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-56" />
                                </div>
                            </Card>
                        ))
                    ) : error ? (
                        <Card className="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-bold">
                            {error}
                        </Card>
                    ) : filteredBeneficiaries.length === 0 ? (
                        <Card className="p-20 text-center space-y-6 bg-white rounded-[3rem] shadow-xl border-2 border-dashed border-gray-100">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110 duration-500">
                                <Search className="w-10 h-10 text-gray-200" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-sm">No Beneficiaries Found</p>
                                <p className="text-gray-300 text-xs font-medium">No beneficiaries available for this dealer</p>
                            </div>
                        </Card>
                    ) : (
                        filteredBeneficiaries.map((beneficiary) => (
                            <Card 
                                key={beneficiary.id}
                                onClick={() => navigate(`/dealer/beneficiaries/${beneficiary.id}`)}
                                className="group p-6 rounded-[2rem] border-0 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-green-900/10 cursor-pointer transition-all active:scale-[0.99] bg-white flex items-center justify-between"
                            >
                                <div className="flex items-center gap-6">
                                    <Avatar className="w-16 h-16 rounded-2xl shadow-inner bg-[#E8F5E9] border-2 border-white">
                                        <AvatarFallback className="bg-transparent text-[#1B5E20] font-black text-2xl">
                                            {beneficiary.name?.charAt(0).toUpperCase() || "B"}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-[#1B5E20] transition-colors tracking-tight">
                                            {beneficiary.name || "Unknown"}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{beneficiary.ration_id || beneficiary.pds_card_no || beneficiary.pdsCardNo || beneficiary.rationId || "NO ID"}</p>
                                            {beneficiary.isActive && (
                                                <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                                                    <span className="text-[10px] font-black text-green-700 uppercase tracking-tighter">Verified</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#1B5E20] group-hover:text-white transition-all shadow-sm">
                                        <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}