import { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  AlertCircle, 
  Moon, 
  Sun, 
  ChevronRight,
  Trophy,
  History,
  Loader2,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { cn } from '../../components/ui/utils';
import { toast } from 'sonner';
import { SessionManager } from '../../utils/SessionManager';
import { RetrofitClient } from '../../network/RetrofitClient';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'REMINDER' | 'ALERT' | 'SUCCESS' | 'INFO';
  icon: any;
  color: string;
  isRead: boolean;
}

export default function Notifications() {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndGenerateNotifications = async () => {
    setIsLoading(true);
    try {
      const userId = SessionManager.getUserId();
      if (userId <= 0) return;

      const res = await RetrofitClient.apiService.getBrushingProgress(userId);
      const todayDate = new Date().toISOString().split('T')[0];
      const currentHour = new Date().getHours();
      
      let sessions = [];
      if (res && (res as any).sessions) {
          sessions = (res as any).sessions;
      } else if (Array.isArray(res)) {
          sessions = res;
      }

      const todayLog = sessions.find((s: any) => s.date === todayDate || s.checkin_date === todayDate);
      const generated: Notification[] = [];

      // 1. Morning Reminder
      if (!todayLog?.morning) {
        generated.push({
          id: 'morning-rem',
          title: 'Morning Brush Pending',
          message: "You haven't logged your morning brushing session yet. Let's keep those teeth sparkling!",
          time: 'Active',
          type: 'REMINDER',
          icon: Sun,
          color: 'text-amber-500 bg-amber-50',
          isRead: false
        });
      }

      // 2. Evening Reminder (starts appearing after 6 PM / 18:00)
      if (!todayLog?.evening && currentHour >= 18) {
        generated.push({
          id: 'evening-rem',
          title: 'Evening Routine Alert',
          message: "Before you sleep, don't forget your evening brushing session for total protection.",
          time: 'Active',
          type: 'REMINDER',
          icon: Moon,
          color: 'text-indigo-500 bg-indigo-50',
          isRead: false
        });
      }

      // 3. Success Streak (if completed both or high weekly count)
      const weeklyCount = sessions.filter((s: any) => s.morning && s.evening).length;
      if (todayLog?.morning && todayLog?.evening) {
        generated.push({
            id: 'success-today',
            title: 'Daily Goal Achieved!',
            message: 'Both brushing sessions completed for today. Exceptional consistency!',
            time: 'Today',
            type: 'SUCCESS',
            icon: Trophy,
            color: 'text-emerald-500 bg-emerald-50',
            isRead: false
          });
      } else if (weeklyCount >= 3) {
        generated.push({
            id: 'streak-info',
            title: 'Great Consistency!',
            message: `You've completed full sessions for ${weeklyCount} days this week. Keep it up!`,
            time: 'Today',
            type: 'SUCCESS',
            icon: Trophy,
            color: 'text-emerald-500 bg-emerald-50',
            isRead: true
          });
      }

      // 4. Kit Hub Info
      generated.push({
        id: 'kithub-info',
        title: 'Kit Distribution Hub',
        message: 'Ensure you check your Kit Hub for the latest hygiene resources from your assigned dealer.',
        time: 'System',
        type: 'INFO',
        icon: Package,
        color: 'text-blue-500 bg-blue-50',
        isRead: true
      });

      setNotifications(generated);
    } catch (error) {
      console.error("Failed to generate dynamic notifications:", error);
      toast.error("Resource error: Could not sync notification feed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndGenerateNotifications();
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success("Feed updated");
  };

  const toggleReminders = () => {
    setRemindersEnabled(!remindersEnabled);
    toast.info(remindersEnabled ? "Alerts silenced" : "Alerts enabled");
  };

  return (
    <DashboardLayout role="user" title="Live Notifications">
      <div className="max-w-4xl mx-auto space-y-10 pb-12 animate-in fade-in duration-700">
        
        {/* Dynamic Status Dashboard */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative rounded-[3rem] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 p-10 overflow-hidden shadow-2xl border border-white/10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Real-time Sync</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Your Health Feed</h2>
              <p className="text-blue-100/60 font-bold text-sm max-w-xs">Dynamic reminders and alerts based on your actual hygiene check-ins today.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
                 <span className="text-2xl font-black text-white leading-none">{new Date().getDate()}</span>
                 <span className="text-[8px] font-black text-blue-300 uppercase tracking-widest mt-1">{new Date().toLocaleDateString('en-US', { month: 'short' })}</span>
              </div>
              <div className="w-20 h-20 rounded-[2rem] bg-indigo-500 flex flex-col items-center justify-center shadow-xl shadow-indigo-400/20">
                 <Bell className="w-8 h-8 text-white" />
                 <span className="text-[8px] font-black text-white uppercase tracking-widest mt-1">Live</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Today's Protocol</h3>
              </div>
              <Button 
                variant="ghost" 
                onClick={markAllAsRead}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50"
              >
                Mark Read
              </Button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] shadow-soft-premium animate-pulse">
                   <Loader2 className="w-10 h-10 text-blue-100 animate-spin mb-4" />
                   <div className="h-2 w-32 bg-gray-50 rounded-full" />
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center bg-white rounded-[3rem] shadow-soft-premium border-2 border-dashed border-gray-100">
                             <BellOnIcon className="mx-auto" />
                             <h4 className="text-lg font-black text-gray-900 tracking-tight mt-6">All Quiet for Now!</h4>
                             <p className="text-sm text-gray-400 font-bold max-w-xs mx-auto mt-2">Check back later for automated reminders and streak updates.</p>
                        </div>
                    ) : notifications.map((notif, idx) => (
                    <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card 
                        onClick={() => {
                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                        }}
                        className={cn(
                            "p-6 rounded-[2.5rem] border-none shadow-soft-premium group cursor-pointer transition-all hover:translate-x-2",
                            !notif.isRead ? "bg-white ring-1 ring-indigo-100" : "bg-gray-50/50 opacity-70"
                        )}
                        >
                        <div className="flex gap-6">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", notif.color)}>
                            <notif.icon className="w-7 h-7" />
                            </div>
                            <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <h4 className={cn("text-base font-black tracking-tight", notif.type === 'REMINDER' ? 'text-indigo-900' : 'text-gray-900')}>{notif.title}</h4>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{notif.time}</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">{notif.message}</p>
                            </div>
                            <div className="flex items-center">
                            {!notif.isRead && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                            <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-400 transition-colors ml-2" />
                            </div>
                        </div>
                        </Card>
                    </motion.div>
                    ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="p-8 rounded-[3rem] bg-white border-none shadow-2xl shadow-blue-900/5 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Feed Alerts</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Resets daily at 00:00</p>
                  </div>
                  <button 
                    onClick={toggleReminders}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative flex items-center px-1",
                      remindersEnabled ? "bg-indigo-600" : "bg-gray-200"
                    )}
                  >
                    <motion.div 
                      animate={{ x: remindersEnabled ? 24 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
               </div>

               <div className={cn("space-y-6 transition-opacity", !remindersEnabled && "opacity-30 pointer-events-none")}>
                  <ReminderTimeInfo 
                    label="Morning Window" 
                    time="06:00 - 10:00" 
                    icon={<Sun className="w-4 h-4" />} 
                    color="amber"
                  />
                  <ReminderTimeInfo 
                    label="Evening Window" 
                    time="20:00 - 00:00" 
                    icon={<Moon className="w-4 h-4" />} 
                    color="indigo"
                  />
               </div>
            </Card>
            
            <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest px-8">
                Your feed is generated in real-time based on system check-ins and is cleared daily for fresh monitoring.
            </p>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

function ReminderTimeInfo({ label, time, icon, color }: { label: string, time: string, icon: any, color: 'amber' | 'indigo' }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", color === 'amber' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500')}>
          {icon}
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      </div>
      <div className="relative group">
        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 shadow-sm" />
        <div className="w-full h-12 bg-gray-50 border-none rounded-xl pl-12 flex items-center text-sm font-black text-gray-900 shadow-inner">
            {time}
        </div>
      </div>
    </div>
  );
}

function BellOnIcon({ className }: { className?: string }) {
    return (
        <div className={cn("w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center", className)}>
            <div className="relative">
                <Bell className="w-8 h-8 text-indigo-200" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
        </div>
    )
}

