import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { InitialsAvatar } from '../../components/ui/InitialsAvatar';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { MonthlyUsageData } from '../../network/RetrofitClient';
import { toast } from 'sonner';
import { SessionManager } from '../../utils/SessionManager';
import { format } from 'date-fns';

export default function MonthlyUsage() {
  const navigate = useNavigate();
  const [usageItems, setUsageItems] = useState<MonthlyUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentMonthYear = format(new Date(), "MMMM yyyy");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const userId = SessionManager.getUserId();
    if (!userId) {
        toast.error("Session expired. Please login again.");
        return;
    }

    try {
      // 1. Fetch the family member list first
      const membersRes = await RetrofitClient.apiService.getFamilyMembers(userId);
      const members = (membersRes.isSuccessful && membersRes.body) ? membersRes.body : [];

      // 2. Head of Family check (ID = null or ID = userId)
      const headName = SessionManager.getUserName() || 'Family Head';
      
      // 3. Prepare requests for everyone (Head + Members)
      const requests = [
        // Request for Head of Family
        RetrofitClient.apiService.getMonthlyUsage(userId, currentMonthYear, null).then(res => {
            if (res.isSuccessful && res.body && res.body[0]) {
                return { ...res.body[0], name: headName };
            }
            return null;
        }),
        // Requests for all family members
        ...members.map(member => 
            RetrofitClient.apiService.getMonthlyUsage(userId, currentMonthYear, member.id).then(res => {
                if (res.isSuccessful && res.body && res.body[0]) {
                    return { ...res.body[0], name: member.memberName };
                }
                return null;
            })
        )
      ];

      // 4. Batch fetch and aggregate
      const results = await Promise.all(requests);
      const validResults = results.filter((r): r is MonthlyUsageData => r !== null);

      setUsageItems(validResults);
    } catch (e) {
      console.error("Monthly Usage Loader Error:", e);
      toast.error("Failed to synchronize usage metrics");
    } finally {
      setIsLoading(false);
    }
  };

  const PrimaryBlue = "#1E3A8A";
  const CyanGradient = "#3B82F6";

  return (
    <DashboardLayout role="user" title="">
      <div className="flex flex-col min-h-screen bg-[#F8FBFF] -m-6 sm:-m-8 pb-32">
        {/* Gradient Header - NHM Premium Theme (200px Height) */}
        <div 
          className="w-full h-[220px] rounded-b-[32px] flex flex-col p-8 pt-12 relative overflow-hidden shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${PrimaryBlue}, ${CyanGradient})` }}
        >
            <div className="flex items-center gap-4 z-10 transition-all duration-500 animate-in fade-in slide-in-from-left-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-black text-white tracking-tighter">Monthly Usage</h1>
            </div>

            <div className="mt-8 z-10 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                <p className="text-sm font-bold text-white/80 leading-relaxed">
                    Detailed breakdown of brushing sessions and resource consumption for <span className="text-white font-black">{currentMonthYear}</span>.
                </p>
            </div>

            {/* Abstract NHM-style elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        </div>

        {/* Usage Leaderboard Section */}
        <div className="px-8 mt-10 space-y-6">
            <h2 className="text-lg font-black text-gray-900 tracking-tight px-1 uppercase tracking-widest text-[11px] text-gray-400">Usage Leaderboard</h2>
            
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing Metrics...</p>
                </div>
            ) : usageItems.length === 0 ? (
                <Card className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border-none shadow-xl shadow-gray-100">
                    <AlertCircle className="w-12 h-12 text-gray-100 mb-4" />
                    <p className="text-sm font-black text-gray-400 leading-tight">No usage data recorded for this month.</p>
                </Card>
            ) : (
                <div className="space-y-5">
                    {usageItems.map((item, idx) => (
                        <ModernUsageCard key={idx} item={item} />
                    ))}
                </div>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ModernUsageCard({ item }: { item: MonthlyUsageData }) {
    return (
        <Card className="p-6 rounded-[2.5rem] border-none shadow-xl shadow-gray-100 bg-white hover:shadow-2xl transition-all duration-500 group border border-gray-50/50">
            <div className="flex items-center gap-5">
                <InitialsAvatar 
                    name={item.name} 
                    className="w-16 h-16 ring-8 ring-blue-50/50 shadow-lg shadow-blue-500/5 group-hover:scale-105 transition-transform duration-500" 
                />
                
                <div className="flex-1 min-w-0">
                    <h3 className="text-[18px] font-black text-gray-900 tracking-tight truncate group-hover:text-blue-900 transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <p className="text-[13px] font-bold text-gray-400">{item.days}</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-black text-blue-900 leading-none tracking-tighter">
                        {item.score}%
                    </div>
                    <p className="text-[9px] font-black text-blue-500/40 uppercase tracking-widest mt-1.5">Adherence</p>
                </div>
            </div>

            <div className="mt-8 space-y-6">
                {/* Adherence Progress Bar */}
                <div className="h-2.5 w-full bg-blue-50/50 rounded-full overflow-hidden border border-gray-50">
                    <div 
                        className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000 ease-out" 
                        style={{ width: `${item.score}%` }} 
                    />
                </div>
            </div>
        </Card>
    );
}
