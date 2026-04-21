import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Verified, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../components/ui/utils';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
export default function HouseholdEligibility() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  
  const beneficiaryId = state.beneficiaryId || 'PDS-ERROR';
  const beneficiary = state.beneficiary || { 
    name: "IDENTIFICATION FAILED", 
    familyMembers: []
  };
  
  const householdId = beneficiaryId;
  const headName = beneficiary.name;
  const category = "PHH (Primary Household)";
  
  const [isKitReturned, setIsKitReturned] = useState<boolean | null>(null);

  const familyMembers = beneficiary.familyMembers.map((m: any) => ({
    id: m.id.toString(),
    memberName: m.memberName + (m.relation === 'Self' ? ' - Head' : ` - ${m.relation}`),
    kitType: `1x ${m.kitType || 'Adult Kit'}`,
    items: (m.kitType || 'Adult Kit').includes('Child') ? 'Child Brush, Paste' : 'Adult Brush, Paste'
  }));

  const handleProceed = () => {
    navigate('/dealer/final-distribution', { 
      state: {
        beneficiaryId,
        beneficiaryDbId: beneficiary?.id,
        headName,
        memberCount: familyMembers.length, // familyMembers already includes everyone (head included via 'Self' relation check in mock)
        oldKitReturned: isKitReturned
      }
    });
  };

  return (
    <DashboardLayout role="dealer">
      <div className="min-h-[calc(100vh-80px)] bg-[#F4F7FB] relative flex flex-col items-center pb-12 font-sans overflow-x-hidden -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-xl lg:rounded-tl-2xl border border-gray-100/50 shadow-sm">
      {/* Immersive Deep Emerald Banner */}
      <div className="absolute top-0 left-0 right-0 h-[300px] z-0 overflow-hidden rounded-t-xl lg:rounded-tl-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#10b981]" />
        {/* Abstract shapes */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
        <div className="absolute bottom-[-100px] left-[-10px] w-80 h-80 bg-[#022c22]/40 rounded-full blur-3xl mix-blend-overlay" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-2xl px-6 py-6 flex items-center gap-4 text-white">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight leading-none uppercase">Household Details</h1>
            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mt-1">Verification Step 2 of 4</p>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-xl px-6 space-y-8 mt-2">
        
        {/* Dynamic Profile Card Overlapping Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="w-full bg-white rounded-[2.5rem] border-0 shadow-2xl shadow-emerald-900/10 overflow-hidden">
            {/* Split layout: Image top, details bottom */}
            <div className="relative w-full h-56 bg-emerald-800 group flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
                <div className="w-28 h-28 rounded-full bg-white/20 border-4 border-white/30 backdrop-blur-sm shadow-2xl flex items-center justify-center text-white font-black text-6xl group-hover:scale-110 transition-transform duration-700 z-10">
                    {headName.charAt(0)}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div className="text-white space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Verified className="w-4 h-4 text-emerald-400" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded-full backdrop-blur-md border border-emerald-400/20">
                                Link ID: {householdId}
                            </p>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter leading-none">{headName}</h2>
                        <p className="text-sm font-medium text-gray-200">Registered Beneficiary</p>
                    </div>
                </div>
            </div>
            
            <div className="p-6 bg-white flex items-center justify-between border-t border-gray-50">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Eligibility Category</p>
                    <p className="text-sm font-bold text-gray-900">{category}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Info className="w-5 h-5" />
                </div>
            </div>
          </Card>
        </motion.div>

        {/* Family Members Verification Module */}
        <div className="space-y-4">
          <div className="flex flex-col px-2">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Family Members</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Kit Allocation Details</p>
          </div>
          
          <div className="space-y-3">
            {familyMembers.map((member: any, index: number) => (
              <motion.div 
                key={member.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="group bg-white p-4 rounded-[1.5rem] shadow-xl shadow-gray-200/50 flex items-center justify-between border border-transparent hover:border-emerald-100 transition-all hover:shadow-emerald-900/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-white shadow-md flex items-center justify-center text-emerald-800 font-black text-xl flex-shrink-0">
                    {member.memberName.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-black text-gray-900 text-[15px] leading-none">{member.memberName}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{member.kitType}</span>
                        <span className="text-xs font-bold text-gray-400">{member.items}</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:bg-white shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Old Kit Return Interactive Module */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50"
        >
          <div className="space-y-1">
            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">Return Policy Check</h3>
            <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-widest">
              Confirm if the previous kit has been returned for replacement.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              onClick={() => setIsKitReturned(true)}
              className={cn(
                "h-14 rounded-xl font-black uppercase tracking-widest transition-all text-xs border-2",
                isKitReturned === true 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-inner shadow-emerald-600/10" 
                  : "bg-transparent border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50"
              )}
            >
              Returned
            </button>
            <button
              onClick={() => setIsKitReturned(false)}
              className={cn(
                "h-14 rounded-xl font-black uppercase tracking-widest transition-all text-xs border-2",
                isKitReturned === false 
                  ? "bg-rose-50 border-rose-500 text-rose-600 shadow-inner shadow-rose-600/10" 
                  : "bg-transparent border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50"
              )}
            >
              Not Returned
            </button>
          </div>
        </motion.div>

        {/* Floating Action CTA */}
        <AnimatePresence>
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="pt-6 pb-2"
            >
            <Button
                onClick={handleProceed}
                disabled={isKitReturned === null}
                className={cn(
                "relative overflow-hidden w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm transition-all duration-300",
                "bg-blue-600 text-white shadow-xl shadow-blue-600/30",
                "hover:bg-blue-700 hover:shadow-blue-700/40 hover:-translate-y-1",
                "disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 disabled:bg-gray-300 disabled:text-gray-500"
                )}
            >
                {/* Micro animation for button background */}
                {!isKitReturned === null && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] animate-[shimmer_2s_infinite]" />
                )}
                Proceed to Distribution
            </Button>
            </motion.div>
        </AnimatePresence>
      </main>
      </div>
    </DashboardLayout>
  );
}