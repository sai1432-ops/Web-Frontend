import { 
  ArrowLeft, 
  Package,
  Calendar,
  History,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/card';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { useFamilyHealth } from '../../hooks/useFamilyHealth';
import { useEffect } from 'react';
import { cn } from '../../components/ui/utils';
import { SessionManager } from '../../utils/SessionManager';

export function KitHub() {
  const navigate = useNavigate();
  const { 
    distributionHistory, 
    familyMembers,
    isLoadingHistory, 
    fetchDistributionHistory,
    fetchFamilyMembers
  } = useFamilyHealth();
  
  const userId = SessionManager.getUserId();
  const headName = SessionManager.getUserName() || 'Family Head';

  useEffect(() => {
    if (userId > 0) {
      fetchDistributionHistory(userId);
      fetchFamilyMembers(userId);
    }
  }, [fetchDistributionHistory, fetchFamilyMembers, userId]);

  return (
    <DashboardLayout role="user" title="">
      <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-6">
        {/* Premium Gradient Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 rounded-[3rem] overflow-hidden flex flex-col justify-center px-10 text-white mb-12 shadow-2xl bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] group"
        >
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all group-hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="space-y-1">
                 <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Family Kit Hub</h1>
                 <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.25em]">Central Inventory & Distribution</p>
              </div>
            </div>
            <p className="text-blue-100/60 font-medium text-sm max-w-sm leading-relaxed">
              Manage your monthly dental sanitation kits and synchronize health tracking for the entire unit.
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse duration-7000" />
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px]" />
        </motion.div>

        <div className="space-y-16">
          {/* Status Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-[2rem] border-none bg-emerald-50/50 backdrop-blur-sm p-8 shadow-soft border border-emerald-100/50 group/status">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover/status:scale-110 transition-transform">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-emerald-900 tracking-tight uppercase">Active Distribution Pass</h3>
                      <p className="text-[11px] font-bold text-emerald-700/60 uppercase tracking-widest mt-1">Status: Fully Eligible for Current Cycle</p>
                    </div>
                 </div>
                 <div className="hidden sm:block px-4 py-2 bg-emerald-100 rounded-xl text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                    Cycle 12/2026
                 </div>
              </div>
            </Card>
          </motion.div>

          {/* Eligibility Overview */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-blue-900/20 rounded-full" />
                 <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Unit Eligibility</h2>
               </div>
               <div className="px-4 py-1.5 bg-blue-900/5 rounded-full text-[10px] font-black text-blue-900 uppercase tracking-widest">
                 {1 + familyMembers.length} Eligible
               </div>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2">
              {/* Family Head is always shown first */}
              <EligibilityMemberItem 
                key="head" 
                name={headName} 
                status="Eligible" 
                isPrimary={true}
                badge="Head"
              />
              {familyMembers.map((member) => (
                <EligibilityMemberItem 
                  key={member.id} 
                  name={member.memberName || member.name || "Member"} 
                  status="Eligible" 
                  isPrimary={false} 
                />
              ))}
              <div 
                onClick={() => navigate('/user/family')}
                className="min-w-[160px] h-[180px] rounded-[2rem] border-2 border-gray-100 border-dashed flex flex-col items-center justify-center gap-3 text-gray-400 group cursor-pointer hover:bg-gray-50/50 transition-all font-bold"
              >
                 <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-all shadow-sm">
                    <Plus className="w-6 h-6" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Add Member</span>
              </div>
            </div>
          </section>

          {/* Service Actions */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 px-2">
               <div className="w-1.5 h-6 bg-blue-900/20 rounded-full" />
               <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Service Protocols</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <KitActionCard
                title="Monthly Usage"
                subtitle="Record data for all active members"
                icon={<Calendar className="w-8 h-8" />}
                color="orange"
                onClick={() => navigate('/user/monthly-usage')}
              />
              <KitActionCard
                title="Kit Confirmation"
                subtitle="Verify distribution & kit integrity"
                icon={<Package className="w-8 h-8" />}
                color="blue"
                onClick={() => navigate('/user/confirm-kit-receipt')}
              />
            </div>
          </section>

          {/* Distribution History */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-900/20 rounded-full" />
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Audit History</h2>
               </div>
            </div>
            
            {isLoadingHistory ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-900/10"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Secure Records...</p>
              </div>
            ) : distributionHistory.filter(r => r.status === "CONFIRMED" || r.status === "Delivered").length === 0 ? (
              <EmptyHistoryPlaceholder />
            ) : (
              <div className="space-y-4">
                {distributionHistory
                  .filter(r => r.status === "CONFIRMED" || r.status === "Delivered")
                  .map((record) => {
                  const items = [];
                  if (record.brushReceived > 0) items.push(`${record.brushReceived} Brushes`);
                  if (record.pasteReceived > 0) items.push(`${record.pasteReceived} Paste`);
                  if (record.iecReceived > 0) items.push(`${record.iecReceived} Health Kit`);
                  
                  return (
                    <HistoryItem
                      key={record.id}
                      title={items.length > 0 ? items.join(" • ") : "Standard Sanitation Unit"}
                      id={record.kit_unique_id}
                      date={record.confirmed_at || "Processing Queue"}
                      isDelivered={record.status === "CONFIRMED" || record.status === "Delivered"}
                      isAlert={record.show_red_alert}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function EligibilityMemberItem({ name, status, isPrimary, badge }: { name: string, status: string, isPrimary?: boolean, badge?: string }) {
  const safeName = name || "Member";
  const initials = safeName.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || "M";
  
  return (
    <Card className="min-w-[180px] rounded-[2.5rem] border-none shadow-premium hover:shadow-2xl transition-all duration-300 p-8 text-center space-y-6 group cursor-pointer bg-white/80 backdrop-blur-md relative overflow-hidden">
      {badge && (
        <div className="absolute top-4 right-4 px-2 py-0.5 bg-blue-900 text-white text-[8px] font-black rounded-full uppercase tracking-widest">
          {badge}
        </div>
      )}
      <div className={cn(
        "w-20 h-20 rounded-[1.75rem] flex items-center justify-center text-2xl font-black mx-auto transition-transform group-hover:scale-110 shadow-lg",
        isPrimary ? "bg-blue-900 text-white shadow-blue-900/20" : "bg-gray-50 text-blue-900 border border-gray-100"
      )}>
        {initials}
      </div>
      <div>
        <h4 className="text-base font-black text-gray-900 tracking-tight truncate">{name}</h4>
        <div className={cn(
          "mt-3 inline-flex px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase",
          status === 'Eligible' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
        )}>
          {status}
        </div>
      </div>
    </Card>
  );
}

function KitActionCard({ title, subtitle, icon, color, onClick }: { title: string, subtitle: string, icon: React.ReactNode, color: 'blue' | 'orange', onClick: () => void }) {
  return (
    <Card 
      onClick={onClick}
      className="rounded-[2.5rem] border-white/50 bg-white/80 backdrop-blur-md shadow-premium hover:shadow-2xl transition-all duration-300 p-8 cursor-pointer flex items-center gap-6 group"
    >
      <div className={cn(
        "w-20 h-20 rounded-[1.75rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-xl shadow-opacity-10",
        color === 'blue' ? "bg-[#0F172A] text-white" : "bg-orange-600 text-white"
      )}>
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">{title}</h3>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1.5">{subtitle}</p>
      </div>
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-all">
         <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-900 group-hover:translate-x-1" />
      </div>
    </Card>
  );
}

function HistoryItem({ title, id, date, isDelivered, isAlert }: { title: string, id: string, date: string, isDelivered: boolean, isAlert: boolean }) {
  return (
    <Card className={cn(
      "rounded-[2rem] border-white/50 bg-white/80 backdrop-blur-md shadow-soft p-6 flex items-center justify-between group transition-all hover:shadow-xl",
      isAlert && "bg-rose-50/50 border-rose-100"
    )}>
      <div className="flex items-center gap-6">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6",
          isAlert ? "bg-rose-600 text-white" : "bg-gray-50 text-blue-900 border border-gray-100"
        )}>
          {isAlert ? <AlertCircle className="w-8 h-8" /> : <Package className="w-8 h-8" />}
        </div>
        <div>
          <h3 className={cn("text-base font-black tracking-tight", isAlert ? "text-rose-900" : "text-gray-900")}>{title}</h3>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Confirmed: {date} • ID: <span className="font-mono">{id.slice(0, 10).toUpperCase()}</span>
          </p>
          {isAlert && (
             <div className="flex items-center gap-1.5 mt-2">
                <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
                <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Protocol exception detected</p>
             </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
         {isDelivered && !isAlert && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
               <CheckCircle2 className="w-4 h-4 text-emerald-600" />
               <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Synchronized</span>
            </div>
         )}
         <ChevronRight className="w-5 h-5 text-gray-300" />
      </div>
    </Card>
  );
}

function EmptyHistoryPlaceholder() {
  return (
    <div className="py-24 text-center space-y-4 bg-gray-50/50 rounded-[3rem] border-2 border-gray-100 border-dashed">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
         <History className="w-10 h-10 text-gray-200" />
      </div>
      <div className="space-y-1">
         <p className="text-base font-black text-gray-900 uppercase tracking-tighter">No Distributions Found</p>
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Transaction Audit is Empty</p>
      </div>
    </div>
  );
}