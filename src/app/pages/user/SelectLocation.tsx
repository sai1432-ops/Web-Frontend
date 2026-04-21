import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Store, 
  Loader2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { Location } from '../../network/RetrofitClient';
import { toast } from 'sonner';
import { SessionManager } from '../../utils/SessionManager';
import { cn } from '../../components/ui/utils';

export default function SelectLocation() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLinkedToast, setShowLinkedToast] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.getLocations();
      if (response.isSuccessful) {
        setLocations(response.body || []);
      } else {
        toast.error("Failed to load available dealers");
      }
    } catch (e) {
      toast.error("Network error while fetching dealers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (loc: Location) => {
    setSelectedLocation(loc);
    setShowLinkedToast(true);
    // Hide success toast after 3 seconds
    setTimeout(() => setShowLinkedToast(false), 3000);
  };

  const handleConfirm = async () => {
    if (!selectedLocation) {
      toast.error("Please select a dealer first");
      return;
    }

    setIsSubmitting(true);
    try {
      const storedUserId = localStorage.getItem('user_id');
      if (!storedUserId) {
        toast.error('Session expired. Please log in again.');
        navigate('/user/login');
        return;
      }

      const response = await RetrofitClient.apiService.selectLocation({
        userId: parseInt(storedUserId), 
        dealerId: selectedLocation.id
      });

      if (response.isSuccessful) {
        // [FRONTEND-ONLY FIX] Persist assignment in local session to avoid backend dependency
        SessionManager.setAssignedDealerId(selectedLocation.id);
        SessionManager.setAssignedDealerName(selectedLocation.dealer_name || "Assigned Dealer");
        SessionManager.setAssignedDealerLocation(selectedLocation.location_name || "Verified Location");
        
        // Finalize identity verification status locally
        SessionManager.setIdentityVerified(true);
        
        toast.success("Dealer assigned successfully! Identity verification complete.");
        navigate('/user/dashboard');
      } else {
        toast.error(response.errorBody?.string() || "Assignment failed. Please try again.");
      }
    } catch (e: any) {
      toast.error(e.message || "Network error during assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col font-sans pb-32">
      {/* Blue Header Section */}
      <div className="bg-[#1E88E5] pt-12 pb-20 px-6 relative overflow-hidden rounded-b-[3rem] shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
        
        <div className="relative z-10 max-w-md mx-auto">
          <button 
             onClick={() => navigate(-1)}
             className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-90"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-8 space-y-2"
          >
            <h1 className="text-3xl font-black text-white tracking-tight">Select Your Dealer</h1>
            <p className="text-blue-100 font-medium">Choose your preferred PDS dealer for kit collection</p>
          </motion.div>

          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">
               {locations.length} active dealers found
             </span>
          </div>
        </div>
      </div>

      {/* Dealer List Section */}
      <div className="px-6 mt-8 max-w-md mx-auto w-full space-y-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
             <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
             <p className="text-xs font-black text-blue-900/30 uppercase tracking-[0.3em]">Locating Dealers...</p>
          </div>
        ) : (
          <AnimatePresence>
            {locations.map((loc, index) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DealerCard 
                  location={loc} 
                  isSelected={selectedLocation?.id === loc.id} 
                  onClick={() => handleSelect(loc)} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Linked Success Toast Overlay */}
      <AnimatePresence>
        {showLinkedToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl">
               <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
               </div>
               <span className="text-sm font-bold text-white tracking-tight">PDS linked successfully</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Footer */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100/50 z-40">
        <div className="max-w-md mx-auto">
          <Button 
             onClick={handleConfirm}
             disabled={!selectedLocation || isSubmitting}
             className={cn(
               "w-full h-16 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 border-none",
               selectedLocation 
                 ? "bg-[#1E88E5] hover:bg-blue-700 text-white shadow-blue-500/20" 
                 : "bg-gray-100 text-gray-300 pointer-events-none"
             )}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Establishing Link...
              </div>
            ) : "Confirm Selection"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function DealerCard({ location, isSelected, onClick }: { 
    location: Location, 
    isSelected: boolean, 
    onClick: () => void 
}) {
    return (
        <Card 
            onClick={onClick}
            className={cn(
                "p-6 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer group relative overflow-hidden",
                isSelected 
                ? "border-[#1E88E5] bg-white shadow-xl shadow-blue-900/5 scale-[1.02]" 
                : "border-transparent bg-white hover:border-blue-100 shadow-soft"
            )}
        >
            <div className="flex items-center gap-5 relative z-10">
                <div className={cn(
                    "w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all",
                    isSelected ? "bg-blue-50 text-blue-600" : "bg-[#F8FBFF] text-blue-400 group-hover:bg-blue-50/50"
                )}>
                    <Store className="w-7 h-7" />
                </div>
                
                <div className="flex-1 space-y-0.5">
                    <h3 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                      {location.location_name}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Managed by {location.dealer_name || "Unassigned"}
                    </p>
                </div>

                {isSelected && (
                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30"
                    >
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </motion.div>
                )}
            </div>

            {/* Subtle selection glow */}
            {isSelected && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-60" />
            )}
        </Card>
    );
}
