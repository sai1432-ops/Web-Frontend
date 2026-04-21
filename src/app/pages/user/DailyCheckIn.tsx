import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Check, 
  Loader2,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { FamilyMemberResponse } from '../../network/RetrofitClient';
import { cn } from '../../components/ui/utils';
import { toast } from 'sonner';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { SessionManager } from '../../utils/SessionManager';

export function DailyCheckIn() {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<'MORNING' | 'EVENING'>('MORNING');
  const [isPrimaryChecked, setIsPrimaryChecked] = useState(false);
  const [checkedMemberIds, setCheckedMemberIds] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberResponse[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const userId = SessionManager.getUserId();
  const userName = SessionManager.getUserName();

  useEffect(() => {
    if (userId <= 0) {
      navigate('/login/user');
      return;
    }
    fetchFamilyMembers();
  }, [userId, navigate]);

  const fetchFamilyMembers = async () => {
    try {
      const response = await RetrofitClient.apiService.getFamilyMembers(userId);
      if (response.isSuccessful && response.body) {
        setFamilyMembers(response.body);
      }
    } catch (error) {
      console.error("Failed to fetch family members", error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const toggleMember = (id: number) => {
    const newChecked = new Set(checkedMemberIds);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedMemberIds(newChecked);
  };

  const handleSubmit = async () => {
    if (!isPrimaryChecked && checkedMemberIds.size === 0) {
      toast.error("Please select at least one person who brushed.");
      return;
    }

    setIsSubmitting(true);
    try {
      const membersToSubmit = Array.from(checkedMemberIds);
      
      // If primary user is checked, find their member ID (relation === 'Self')
      if (isPrimaryChecked) {
        const selfMember = familyMembers.find(m => m.relation === 'Self');
        if (selfMember) {
          membersToSubmit.push(selfMember.id);
        } else {
          // If no 'Self' member found, we might need to handle this
          // For now, let's assume 'id: 0' refers to the primary user if no 'Self' record exists
          // but usually there should be one.
        }
      }

      for (const memberId of membersToSubmit) {
        const response = await RetrofitClient.apiService.submitBrushingCheckin({
          userId,
          members: membersToSubmit,
          sessionMode: selectedSession,
          date: new Date().toISOString().split('T')[0]
        });

        if (!response.isSuccessful) {
          throw new Error(response.message || 'Submission failed');
        }
      }

      toast.success(`Daily Habits updated for ${selectedSession.toLowerCase()}!`);
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "Check-in failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="user" title="">
      <div className="max-w-4xl mx-auto pb-32 px-4 sm:px-6">
        {/* Premium Header/Session Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 rounded-[3rem] overflow-hidden flex flex-col justify-center px-10 text-white mb-12 shadow-2xl bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] group"
        >
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="w-full flex items-center justify-between">
              <button 
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all group-hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="text-center space-y-1">
                 <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Daily Protocol</h1>
                 <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.25em]">Session Synchronization Hub</p>
              </div>
              <div className="w-12" /> 
            </div>

            {/* Session Switcher */}
            <div className="bg-white/5 backdrop-blur-xl p-1.5 rounded-[1.75rem] flex gap-2 border border-white/10 shadow-inner">
              <button 
                onClick={() => setSelectedSession('MORNING')}
                className={cn(
                  "flex items-center gap-3 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                  selectedSession === 'MORNING' ? "bg-white text-blue-900 shadow-xl scale-100" : "text-white/40 hover:text-white/60 scale-95"
                )}
              >
                <Sun className={cn("w-4 h-4 transition-transform", selectedSession === 'MORNING' ? "animate-pulse" : "")} />
                Morning
              </button>
              <button 
                onClick={() => setSelectedSession('EVENING')}
                className={cn(
                  "flex items-center gap-3 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                  selectedSession === 'EVENING' ? "bg-white text-blue-900 shadow-xl scale-100" : "text-white/40 hover:text-white/60 scale-95"
                )}
              >
                <Moon className={cn("w-4 h-4 transition-transform", selectedSession === 'EVENING' ? "animate-pulse" : "")} />
                Evening
              </button>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px]" />
        </motion.div>

        <div className="space-y-12">
          <div className="flex items-center justify-between px-2">
             <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-blue-900/20 rounded-full" />
                   <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Brushing Tracker</h2>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-5">Select participating unit members</p>
             </div>
             <motion.div 
               animate={{ scale: [1, 1.1, 1] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="w-3 h-3 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30"
             />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10">
            {/* Master User Card integrated into grid */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
            >
              <MemberCard 
                name={`${userName} (Head)`}
                checked={isPrimaryChecked}
                onToggle={() => setIsPrimaryChecked(!isPrimaryChecked)}
                isPrimary
              />
            </motion.div>

            <AnimatePresence>
              {isLoadingMembers ? (
                <div className="col-span-full flex flex-col items-center gap-4 py-20">
                  <Loader2 className="w-12 h-12 text-blue-900 animate-spin opacity-20" />
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Accessing Unit Records...</p>
                </div>
              ) : (
                familyMembers.map((member, idx) => (
                  <motion.div 
                    key={member.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MemberCard 
                      name={member.memberName}
                      checked={checkedMemberIds.has(member.id)}
                      onToggle={() => toggleMember(member.id)}
                      relation={member.relation}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Persistent Bottom Interface */}
        <div className="fixed bottom-0 left-0 right-0 p-8 pt-4 bg-white/40 backdrop-blur-xl border-t border-white/20 z-[55] lg:left-64 shadow-soft-premium">
          <div className="max-w-2xl mx-auto flex items-center gap-6">
            <div className="hidden sm:block flex-shrink-0">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Validated</p>
               <p className="text-2xl font-black text-blue-900 tracking-tighter leading-none">
                  { (isPrimaryChecked ? 1 : 0) + checkedMemberIds.size } <span className="text-sm text-gray-300">Members</span>
               </p>
            </div>
            <Button 
              disabled={(!isPrimaryChecked && checkedMemberIds.size === 0) || isSubmitting}
              onClick={handleSubmit}
              className="flex-1 h-16 rounded-[1.5rem] bg-[#0F172A] hover:bg-black text-white font-black tracking-[0.2em] uppercase text-[11px] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Lock Entry Ledger
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MemberCard({ name, checked, onToggle, isPrimary, relation }: { name: string, checked: boolean, onToggle: () => void, isPrimary?: boolean, relation?: string }) {
  return (
    <Card 
      onClick={onToggle}
      className={cn(
        "p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer group relative overflow-hidden",
        checked 
          ? "border-blue-900 bg-white shadow-2xl shadow-blue-900/10 scale-[1.02]" 
          : "border-white bg-white/60 backdrop-blur-sm shadow-soft hover:bg-white hover:border-blue-100"
      )}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className={cn(
            "w-20 h-20 rounded-[1.75rem] flex items-center justify-center transition-all duration-700 shadow-lg relative",
            checked ? "bg-blue-900 text-white rotate-6 scale-110 shadow-blue-900/20" : "bg-gray-50 text-blue-900"
          )}>
            <span className="text-2xl font-black">{name[0]}</span>
            {checked && (
               <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-in zoom-in duration-300">
                  <Check className="w-4 h-4 text-white" strokeWidth={4} />
               </div>
            )}
          </div>
          
          <div className="space-y-1.5 text-left">
            <h4 className={cn(
              "text-lg font-black tracking-tighter leading-none transition-colors",
              checked ? "text-blue-900" : "text-gray-900"
            )}>{name}</h4>
            <div className="flex items-center gap-2">
               <div className={cn("w-1.5 h-1.5 rounded-full", checked ? "bg-emerald-500" : "bg-gray-200")} />
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">
                 {isPrimary ? "Master Node" : relation || "Family Unit"}
               </p>
            </div>
          </div>
        </div>

        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 group-hover:scale-110",
          checked ? "bg-blue-900 border-blue-900 text-white" : "border-gray-50 bg-gray-50 text-transparent"
        )}>
           <Check className="w-5 h-5" strokeWidth={3} />
        </div>
      </div>
      
      {/* Selection Animated Shine */}
      {checked && (
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -z-10 skew-x-12"
        />
      )}
    </Card>
  );
}
