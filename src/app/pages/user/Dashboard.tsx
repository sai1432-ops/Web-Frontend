import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  CheckCircle2, 
  PlusCircle,
  ChevronRight,
  Users,
  Package,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../../components/ui/utils';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { useState, useEffect, type ReactNode } from 'react';
import { RetrofitClient } from '../../network/RetrofitClient';
import { SessionManager } from '../../utils/SessionManager';

type WeeklyDay = {
  day: string;
  morning: boolean;
  evening: boolean;
  date: string;
};

export function UserDashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState(SessionManager.getUserName() || 'User');
  const [isVerified, setIsVerified] = useState(SessionManager.isIdentityVerified());
  const [weeklyData, setWeeklyData] = useState<WeeklyDay[]>([]);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const buildFallbackWeek = (): WeeklyDay[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    return days.map((label, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      return {
        day: label,
        morning: false,
        evening: false,
        date: d.toISOString().split('T')[0]
      };
    });
  };

  const normalizeWeeklyProgress = (progress: any): WeeklyDay[] => {
    const sessions = Array.isArray(progress)
      ? progress
      : Array.isArray(progress?.sessions)
      ? progress.sessions
      : [];

    if (!sessions.length) {
      return buildFallbackWeek();
    }

    return sessions.map((item: any, index: number) => {
      const rawDate = item.date || item.checkin_date || '';
      const d = rawDate ? new Date(rawDate) : null;

      const label =
        d && !Number.isNaN(d.getTime())
          ? d.toLocaleDateString('en-US', { weekday: 'short' })
          : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] || 'Day';

      return {
        day: label,
        morning: Boolean(item.morning),
        evening: Boolean(item.evening),
        date: rawDate
      };
    });
  };

  const fetchDashboardData = async () => {
    setIsDataLoading(true);

    try {
      const userId = SessionManager.getUserId();

      if (!userId || userId <= 0) {
        navigate('/login/user');
        return;
      }

      setUserName(SessionManager.getUserName() || 'User');
      setIsVerified(SessionManager.isIdentityVerified());

      const [progressResponse, membersResponse] = await Promise.all([
        RetrofitClient.apiService.getBrushingProgress(userId),
        RetrofitClient.apiService.getFamilyMembers(userId)
      ]);

      const normalizedProgress = normalizeWeeklyProgress(progressResponse);
      setWeeklyData(normalizedProgress);

      if (membersResponse?.isSuccessful) {
        setFamilyMembers(Array.isArray(membersResponse.body) ? membersResponse.body : []);
      } else if (Array.isArray(membersResponse)) {
        setFamilyMembers(membersResponse);
      } else {
        setFamilyMembers([]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setWeeklyData(buildFallbackWeek());
      setFamilyMembers([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout role="user">
       <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        
        {/* Radiant Vibrant Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[3.5rem] bg-gradient-to-br from-indigo-900 via-blue-800 to-violet-900 p-12 sm:p-20 overflow-hidden shadow-[0_20px_60px_-15px_rgba(30,58,138,0.5)] border border-white/10"
        >
          {/* Animated Background Orbs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[140px] -mr-80 -mt-80 animate-pulse duration-[8000ms]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[120px] -ml-60 -mb-60" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[100px]" />

          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-inner-premium">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span className="text-[11px] font-black text-cyan-50 uppercase tracking-[0.25em]">
                Elite Identity Status: <span className="text-cyan-400">Verified</span>
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
              Hello,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300">
                {userName}
              </span>
            </h1>

            <p className="text-blue-100/70 font-semibold text-lg sm:text-xl max-w-xl leading-relaxed">
              Your comprehensive health hub for monitoring, distributions, and AI-powered insights. Let's make today healthy.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
               <div className="px-5 py-2.5 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl text-[10px] font-black text-cyan-200 uppercase tracking-widest backdrop-blur-md">
                 Active System
               </div>
               <div className="px-5 py-2.5 bg-fuchsia-500/20 border border-fuchsia-400/30 rounded-2xl text-[10px] font-black text-fuchsia-200 uppercase tracking-widest backdrop-blur-md">
                 Real-time Monitor
               </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Activity Center */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-4">
                <div className="w-3 h-10 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full shadow-lg" />
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                  Activity Tracker
                </h2>
              </div>
              <Button
                onClick={fetchDashboardData}
                variant="ghost"
                className={cn(
                  "rounded-2xl w-12 h-12 p-0 flex items-center justify-center bg-white shadow-soft-premium border border-gray-100/50 hover:bg-gray-50 transition-all",
                  isDataLoading && "animate-spin"
                )}
                disabled={isDataLoading}
              >
                <RefreshCw className={cn("w-5 h-5", isDataLoading ? "text-blue-600" : "text-gray-400")} />
              </Button>
            </div>

            <Card className="p-10 rounded-[3rem] border-white/60 bg-white/40 backdrop-blur-3xl shadow-soft-premium overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/30 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12 relative z-10">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    Weekly Health Log
                  </h3>
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none">
                    Track your daily hygiene performance
                  </p>
                </div>

                <div className="flex -space-x-4 items-center scale-110">
                  {familyMembers.slice(0, 3).map((member, idx) => {
                    const displayName = member.memberName || member.name || member.member_name || 'M';
                    return (
                      <div
                        key={member.id}
                        className={cn(
                          "w-12 h-12 rounded-2xl border-[3px] border-white flex items-center justify-center shadow-xl ring-2 transition-transform hover:-translate-y-1 duration-300",
                          idx === 0 ? "bg-indigo-100 ring-indigo-50" : idx === 1 ? "bg-rose-100 ring-rose-50" : "bg-cyan-100 ring-cyan-50"
                        )}
                        style={{ zIndex: 3 - idx }}
                      >
                        <span className="text-[12px] font-black text-gray-900">
                          {displayName[0].toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                  {familyMembers.length > 3 && (
                    <div className="w-12 h-12 rounded-2xl border-[3px] border-white bg-gray-900 text-white flex items-center justify-center text-xs font-black shadow-2xl relative z-0">
                      +{familyMembers.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-6 mb-12 relative z-10">
                {isDataLoading ? (
                  <div className="col-span-full h-32 flex items-center justify-center animate-pulse bg-gray-50/50 rounded-3xl border border-gray-100/50">
                    <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                ) : (
                  weeklyData.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-5">
                      <div className="flex flex-col gap-3">
                        <SessionIndicator
                          isDone={day.morning}
                          icon={<Sun className="w-5 h-5" />}
                          gradient="from-amber-400 via-orange-400 to-orange-500 shadow-orange-200"
                        />
                        <SessionIndicator
                          isDone={day.evening}
                          icon={<Moon className="w-5 h-5" />}
                          gradient="from-indigo-400 via-violet-500 to-purple-600 shadow-indigo-200"
                        />
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-gray-50/80 border border-gray-100 border-dashed">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day.day}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Button
                onClick={() => navigate('/user/brushing-check-in')}
                className="w-full h-18 rounded-[2rem] bg-gradient-to-r from-indigo-900 to-blue-900 text-white hover:from-indigo-950 hover:to-blue-950 px-10 font-black uppercase tracking-[0.2em] text-[12px] flex gap-4 items-center group/btn shadow-2xl shadow-indigo-200 transition-all duration-500 border border-white/10"
              >
                <PlusCircle className="w-6 h-6 group-hover/btn:rotate-180 transition-transform duration-700" />
                Submit New Log Entry
              </Button>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <ActionCard 
                title="AI Scan"
                desc="Smart Monitor"
                icon={<Sparkles className="w-8 h-8" />}
                onClick={() => navigate('/user/ai-scan')}
                gradient="from-violet-600 via-fuchsia-600 to-pink-600"
              />
              <ActionCard 
                title="Kit Hub"
                desc="Distribution"
                icon={<Package className="w-8 h-8" />}
                onClick={() => navigate('/user/kit-hub')}
                gradient="from-amber-500 via-orange-500 to-orange-600"
              />
              <ActionCard 
                title="Manage"
                desc="Family Hub"
                icon={<Users className="w-8 h-8" />}
                onClick={() => navigate('/user/family')}
                gradient="from-cyan-500 via-blue-500 to-indigo-600"
              />
            </div>
          </div>

          {/* Right Panel: Identity & Support */}
          <div className="lg:col-span-4 space-y-12">
            <div>
               <div className="flex items-center gap-3 px-3 mb-8">
                  <div className="w-2 h-6 bg-rose-500/20 rounded-full" />
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                    Security
                  </h3>
               </div>
               
               <div className="space-y-6">
                  <ModernHomeCard
                    name={userName}
                    subtitle="Main User Profile"
                    tag={isVerified ? 'Verified Account' : 'Verification Required'}
                    tagColor={isVerified ? '#10B981' : '#F43F5E'}
                    verified={isVerified}
                    onClick={() => {
                      const userId = SessionManager.getUserId();
                      if (userId) {
                        navigate(`/user/family/member/0/health-status`);
                      } else {
                        navigate('/user/family');
                      }
                    }}
                  />

                  {!isVerified && (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="group cursor-pointer"
                      onClick={() => navigate('/user/link-identity')}
                    >
                      <Card className="p-8 rounded-[2.5rem] bg-gradient-to-br from-rose-500 to-pink-600 border-none shadow-2xl shadow-rose-200 transition-all duration-500 group-hover:shadow-rose-300">
                        <div className="flex items-center gap-6 text-white">
                          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
                            <ShieldCheck className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-xl font-black tracking-tighter uppercase leading-none mb-1">
                              Action Required
                            </p>
                            <p className="text-[10px] font-black text-rose-100 uppercase tracking-widest opacity-80">
                              Link Bio-Identity for Access
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )}

               </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}


function SessionIndicator({
  isDone,
  icon,
  gradient
}: {
  isDone: boolean;
  icon: ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={cn(
        'w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shadow-soft-premium border border-white/40',
        isDone
          ? `bg-gradient-to-br ${gradient} text-white shadow-2xl scale-110 rotate-[2deg] ring-4 ring-white`
          : 'bg-white/50 text-gray-200 border-dashed border-gray-200'
      )}
    >
      {icon}
    </div>
  );
}

function ActionCard({
  title,
  desc,
  icon,
  onClick,
  gradient
}: {
  title: string;
  desc: string;
  icon: ReactNode;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <motion.div whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }}>
      <Card
        className="p-8 rounded-[2.5rem] group cursor-pointer border-none bg-white shadow-soft-premium hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
        onClick={onClick}
      >
        <div className={cn(
          "absolute -top-12 -right-12 w-32 h-32 opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000 bg-gradient-to-br",
          gradient
        )} />
        
        <div className="space-y-6 relative z-10">
          <div
            className={cn(
              'w-20 h-20 rounded-[1.75rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-2xl group-hover:rotate-3 text-white bg-gradient-to-br',
              gradient
            )}
          >
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              {title}
            </h3>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
              {desc}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ModernHomeCard({
  name,
  subtitle,
  tag,
  tagColor,
  onClick,
  verified
}: {
  name: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  onClick?: () => void;
  verified?: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card
        className="p-8 rounded-[3rem] border-white/60 bg-white/40 backdrop-blur-3xl shadow-soft-premium flex items-center justify-between cursor-pointer transition-all duration-500 hover:shadow-2xl hover:bg-white"
        onClick={onClick}
      >
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-[2.25rem] bg-gradient-to-br from-gray-50 to-white flex items-center justify-center relative border border-gray-100 shadow-inner group overflow-hidden">
            <span className="text-3xl font-black text-gray-900 group-hover:scale-125 transition-transform duration-500">{name?.[0] || 'U'}</span>
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            {verified && (
              <div className="absolute -top-1.5 -right-1.5 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900 tracking-tighter leading-none mb-2">{name}</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-4">{subtitle}</p>
            <div
              className="inline-flex px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm border border-transparent transition-all"
              style={{ color: tagColor, backgroundColor: `${tagColor}15`, borderColor: `${tagColor}20` }}
            >
              {tag}
            </div>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-blue-50 transition-colors">
          <ChevronRight className="w-6 h-6 text-gray-300" />
        </div>
      </Card>
    </motion.div>
  );
}
