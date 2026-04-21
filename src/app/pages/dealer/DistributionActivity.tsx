import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  getDaysInMonth, 
  getDay, 
  isSameDay 
} from 'date-fns';
import { RetrofitClient } from '../../network/RetrofitClient';
import { Button } from '../../components/ui/button';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';

export function DistributionActivity() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [activities, setActivities] = useState<any[]>([]);
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const dealerId = currentUser.dealer_id || currentUser.id || 1;
  
  const daysInMonth = getDaysInMonth(currentMonth);
  const monthStart = startOfMonth(currentMonth);
  const startDay = getDay(monthStart); // 0 = Sunday
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [selectedDate, allActivities]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await RetrofitClient.apiService.getDealerDistributionHistory(dealerId);
      if (res.isSuccessful && res.body) {
        setAllActivities(res.body);
      }
    } catch (e) {
      console.error("Failed to fetch distribution activity:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const filterActivities = () => {
    const filtered = allActivities.filter(item => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      return isSameDay(itemDate, selectedDate);
    });
    setActivities(filtered);
  };

  return (
    <DashboardLayout role="dealer">
      <div className="min-h-[calc(100vh-80px)] bg-[#FDFEFE] relative flex flex-col pb-24 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-xl lg:rounded-tl-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-50 bg-white sticky top-0 z-30">
          <button 
            onClick={() => navigate('/dealer/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
          <h1 className="text-lg font-black text-gray-900">Select Date</h1>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        <main className="flex-1 px-6 pt-6 space-y-8 max-w-2xl mx-auto w-full">
          
          {/* Calendar Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <button 
                onClick={handlePrevMonth}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
              </div>
              <button 
                onClick={handleNextMonth}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-4">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-black text-gray-900 py-2">
                  {day}
                </div>
              ))}
              
              {/* Empty spaces for start of month if needed */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {days.map(day => {
                const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isSelected = isSameDay(dateObj, selectedDate);
                
                return (
                  <div key={day} className="flex justify-center items-center py-1">
                    <button
                      onClick={() => setSelectedDate(dateObj)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all relative
                        ${isSelected 
                          ? 'bg-[#1877F2] text-white shadow-lg shadow-blue-500/30' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Styled Teal Gradient Block */}
          <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-[#4E8D89] to-[#2B514E] shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />
          </div>

          {/* Activity Detail */}
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                Activity Detail – {format(selectedDate, 'MMM d, yyyy')}
              </h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {activities.length} ENTRIES
              </p>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="h-20 w-full bg-gray-50 rounded-xl animate-pulse" />
                ))
              ) : activities.length === 0 ? (
                <div className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  No activities recorded for this date
                </div>
              ) : (
                activities.map((item) => (
                  <div key={item.id} className="flex items-start justify-between group py-2">
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-gray-800 leading-tight">
                        {item.beneficiaryName}
                      </h4>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-[280px]">
                        Items: {item.itemsSummary || "KIT Handover"}
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">
                        ID #{item.id}
                      </p>
                    </div>
                    {(item.completed || item.status === "VERIFIED" || item.status === "CONFIRMED") && (
                      <div className="mt-1">
                         <Check className="w-5 h-5 text-gray-700 stroke-[3px]" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        {/* Floating Bottom Button */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-40 lg:left-[calc(50%+128px)]">
           <Button
             onClick={() => navigate('/dealer/dashboard')}
             className="w-full h-14 bg-[#1877F2] hover:bg-blue-700 text-white rounded-xl font-black tracking-tight text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
           >
              Back To Home
           </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
