import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Hospital, 
  Plus, 
  Trash2, 
  Globe, 
  Phone, 
  MapPin,
  Loader2,
  Search,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router';
import { RetrofitClient, type ClinicResponse } from '../../network/RetrofitClient';
import { cn } from '../../components/ui/utils';

export function AdminClinics() {
  const [clinics, setClinics] = useState<ClinicResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const data = await RetrofitClient.apiService.viewClinics();
      setClinics(data);
    } catch (error) {
      console.error("Failed to fetch clinics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to decommission this clinical node?")) return;
    
    setIsDeleting(id);
    try {
      await RetrofitClient.apiService.deleteClinic(id);
      setClinics(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete clinic:", error);
      alert("Failed to delete clinic. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredClinics = clinics.filter(c => 
    (c.clinicName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.district || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin" title="Medical Integration">
      <div className="space-y-10 max-w-[1600px] mx-auto pb-20">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-8 lg:p-14 text-white shadow-premium">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 text-blue-300">
                <Hospital className="w-3.5 h-3.5" />
                Healthcare Node Management
              </div>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">Clinical Partners</h1>
              <p className="text-blue-100/60 text-lg font-bold leading-relaxed">
                Manage medical nodes authorized for beneficiary check-ups and oral health consultations.
              </p>
            </div>
            <Link to="/admin/clinics/add">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-2xl transition-all font-black px-10 h-20 rounded-2xl uppercase tracking-widest text-xs gap-3 group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Register New Clinic
              </Button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
           <input 
             type="text"
             placeholder="Search by clinic name or district..."
             className="w-full h-16 pl-16 pr-8 rounded-2xl bg-white border-none shadow-premium font-bold text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-blue-900 animate-spin" />
            <p className="text-gray-400 font-black animate-pulse uppercase tracking-widest text-[10px]">Scanning Clinical Nodes...</p>
          </div>
        ) : filteredClinics.length === 0 ? (
          <Card className="p-20 text-center space-y-6 bg-gray-50/50 border-dashed border-2 border-gray-200 rounded-[2.5rem]">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto text-gray-300">
               <Hospital className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Clinics Found</h3>
              <p className="text-gray-400 font-bold text-sm">Expand your network by registering a new medical partner.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredClinics.map((clinic) => (
              <Card key={clinic.id} className="card-premium group p-8 border-none relative overflow-hidden flex flex-col h-full bg-white transition-all hover:shadow-2xl hover:-translate-y-2">
                <div className="relative z-10 flex flex-col h-full space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="p-5 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm">
                      <Hospital className="w-8 h-8 text-blue-900" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="px-3 py-1 rounded-full bg-blue-900/5 text-blue-900 text-[10px] font-black uppercase tracking-widest border border-blue-900/10">
                          {clinic.clinicType}
                       </span>
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">ID: {clinic.id}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-blue-900 transition-colors uppercase truncate">{clinic.clinicName}</h3>
                  </div>

                  <div className="grid gap-3 pt-4 border-t border-gray-50 mt-auto">
                    {clinic.website && (
                      <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Globe className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider">Consultation Portal</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                      </a>
                    )}
                    {clinic.contactNumber && (
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider">{clinic.contactNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <Button 
                      onClick={() => handleDelete(clinic.id)}
                      disabled={isDeleting === clinic.id}
                      variant="ghost" 
                      className="w-full h-14 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] gap-3"
                    >
                      {isDeleting === clinic.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Decommission Node
                    </Button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
