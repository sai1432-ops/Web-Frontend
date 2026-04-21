import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  ArrowLeft, Loader2, MapPin, 
  Building2, Store, Users, Map
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

// Mock Dealer Data for Dropdown
const mockDealers = [
  { id: 1, name: "Rajesh Medical Store" },
  { id: 2, name: "Sharma Dental Supplies" },
  { id: 3, name: "Kumar Healthcare" },
  { id: 4, name: "Patel Distributors" },
];

export function AdminAddLocation() {
  const [locationName, setLocationName] = useState('');
  const [selectedDealerId, setSelectedDealerId] = useState<number | null>(null);
  const [dealers, setDealers] = useState<{id: number, name: string}[]>([]);
  const [isLoadingDealers, setIsLoadingDealers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching dealers
    const fetchDealers = setTimeout(() => {
      setDealers(mockDealers);
      setIsLoadingDealers(false);
    }, 800);
    return () => clearTimeout(fetchDealers);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim() || !selectedDealerId) return;

    setIsSubmitting(true);
    
    // Mock API call to addLocation
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/admin/dashboard'); // Navigating back to dashboard
    }, 1500);
  };

  const selectedDealerName = dealers.find(d => d.id === selectedDealerId)?.name || 'Select a Dealer';
  const primaryBlue = "#1E3A8A";
  const softBlue = "#3B82F6";

  return (
    <DashboardLayout role="admin" title="">
      <div className="min-h-screen bg-[#F8F9FA] pb-24 lg:pb-12">
        {/* Premium Blue Gradient Header */}
        <div 
          className="relative w-full h-[320px] flex flex-col items-center justify-start p-8 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top duration-700"
          style={{ background: `linear-gradient(180deg, ${primaryBlue}, ${softBlue})` }}
        >
          {/* Header Content */}
          <div className="relative z-10 w-full max-w-4xl pt-4">
            <div className="flex items-center gap-4 text-white">
              <Button 
                onClick={() => navigate(-1)}
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20 text-white rounded-full transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl font-black tracking-tight uppercase">Add PDS Location</h1>
            </div>
            
            <div className="mt-12 flex items-center gap-6 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="text-left space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">New Distribution Center</h2>
                <p className="text-blue-100 font-medium text-sm">
                  Assign a new geographic location to a certified regional dealer for PDS distribution tracking.
                </p>
              </div>
            </div>
          </div>
          
          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto px-6 -mt-16 relative z-20">
          <Card className="border-0 shadow-2xl shadow-blue-900/10 rounded-[2.5rem] p-8 lg:p-12 bg-white overflow-visible">
            <form onSubmit={handleSave} className="space-y-8">
              
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Map className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Location Details</h3>
              </div>
              
              <div className="space-y-8">
                {/* Location Name */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Location Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3b82f6]" />
                    <Input 
                      placeholder="e.g. T-Nagar Outlet" 
                      className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 pr-6 focus:ring-blue-500/20 focus:border-[#3b82f6] font-bold text-gray-900 placeholder:text-gray-300 transition-all"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Dealer Select Dropdown (Custom implementation for aesthetics) */}
                <div className="space-y-3 relative">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Assign Dealer</Label>
                  
                  <div 
                    onClick={() => !isLoadingDealers && setIsDropdownOpen(!isDropdownOpen)}
                    className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-4 flex items-center justify-between cursor-pointer border transition-all ${isDropdownOpen ? 'border-[#3b82f6] ring-4 ring-blue-500/10' : 'hover:bg-gray-100/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className={`w-5 h-5 ${selectedDealerId ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
                      <span className={`font-bold ${selectedDealerId ? 'text-gray-900' : 'text-gray-400'}`}>
                        {isLoadingDealers ? 'Loading Dealers...' : selectedDealerName}
                      </span>
                    </div>
                    {isLoadingDealers ? (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    ) : (
                      <div className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="max-h-60 overflow-y-auto p-2">
                        {dealers.length === 0 ? (
                          <div className="p-4 text-center text-sm font-medium text-gray-500">No dealers found.</div>
                        ) : (
                          dealers.map((dealer) => (
                            <div 
                              key={dealer.id}
                              onClick={() => {
                                setSelectedDealerId(dealer.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                                selectedDealerId === dealer.id ? 'bg-blue-50 text-[#1E3A8A]' : 'hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedDealerId === dealer.id ? 'bg-[#3b82f6]/20' : 'bg-gray-100'}`}>
                                <Store className={`w-4 h-4 ${selectedDealerId === dealer.id ? 'text-[#3b82f6]' : 'text-gray-500'}`} />
                              </div>
                              <span className="font-bold">{dealer.name}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Final Action Button */}
              <div className="pt-8 border-t border-gray-50 mt-8">
                <Button 
                  type="submit"
                  className="w-full h-18 bg-[#1E3A8A] hover:bg-blue-900 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-4 text-xl tracking-tight uppercase py-8"
                  disabled={isSubmitting || !locationName || !selectedDealerId}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <>
                      <MapPin className="w-6 h-6" />
                      Save Location
                    </>
                  )}
                </Button>
              </div>

            </form>
          </Card>
        </div>
      </div>
      
      {/* Click outside to close dropdown handler (invisible overlay) */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}
