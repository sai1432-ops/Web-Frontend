import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  ArrowLeft, Loader2, Save,
  Hospital, Globe, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { RetrofitClient } from '../../network/RetrofitClient';
import { cn } from '../../components/ui/utils';

export function AdminAddClinic() {
  const [clinicName, setClinicName] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!clinicName.trim()) newErrors.clinicName = "Clinic name is required";
    if (!website.trim()) newErrors.website = "Website link is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await RetrofitClient.apiService.addClinic({
        clinic_name: clinicName,
        clinic_type: 'ONLINE',
        address: 'N/A',
        district: 'N/A',
        contact_number: 'N/A',
        website: website
      });
      navigate('/admin/clinics');
    } catch (error) {
      console.error("Failed to add clinic:", error);
      setErrors({ submit: "Failed to register clinic. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };


  const primaryBlue = "#1E3A8A";
  const softBlue = "#3B82F6";

  return (
    <DashboardLayout role="admin" title="">
      <div className="min-h-screen bg-[#F8F9FA] pb-24 lg:pb-12">
        <div 
          className="relative w-full h-[320px] flex flex-col items-center justify-start p-8 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top duration-700"
          style={{ background: `linear-gradient(180deg, ${primaryBlue}, ${softBlue})` }}
        >
          <div className="relative z-10 w-full max-w-5xl pt-4">
            <div className="flex items-center gap-4 text-white">
              <Button 
                onClick={() => navigate(-1)}
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20 text-white rounded-full transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl font-black tracking-tight uppercase">New Dental Partner</h1>
            </div>
            
            <div className="mt-12 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
                <Hospital className="w-10 h-10 text-white" />
              </div>
              <p className="text-blue-50 font-medium opacity-90 max-w-md">
                Register a regional clinic for beneficiary care and consultation appointments.
              </p>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        </div>

        <div className="max-w-3xl mx-auto px-6 -mt-20 relative z-20">
          <Card className="border-0 shadow-2xl shadow-blue-900/10 rounded-[2.5rem] p-8 lg:p-12 bg-white overflow-hidden">
            <form onSubmit={handleSave} className="space-y-8">
              
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Hospital className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Clinic Details</h3>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Clinic Name</Label>
                  <div className="relative">
                    <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                    <Input 
                      placeholder="Enter clinic name" 
                      className={cn(
                        "h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 pr-6 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-gray-900 placeholder:text-gray-300 transition-all",
                        errors.clinicName && "border-red-500 bg-red-50/50"
                      )}
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                    />
                  </div>
                  {errors.clinicName && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1">
                      <AlertCircle className="w-3 h-3" /> {errors.clinicName}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Web Page URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                    <Input 
                      type="url"
                      placeholder="https://example.com"
                      className={cn(
                        "h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 pr-6 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-gray-900 placeholder:text-gray-300 transition-all",
                        errors.website && "border-red-500 bg-red-50/50"
                      )}
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium ml-1">Official clinic website or consultation portal</p>
                  {errors.website && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 ml-1">
                      <AlertCircle className="w-3 h-3" /> {errors.website}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50">
                <Button 
                  type="submit"
                  className="w-full h-18 bg-[#1E3A8A] hover:bg-blue-900 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-4 text-xl tracking-tight uppercase py-8"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      Add Clinic
                    </>
                  )}
                </Button>
                {errors.submit && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-bold text-sm flex items-center gap-2">
                     <AlertCircle className="w-5 h-5" />
                     {errors.submit}
                  </div>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
