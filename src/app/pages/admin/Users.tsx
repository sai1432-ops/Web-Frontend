import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Search, Filter, Download, 
  Users, 
  MapPin, Plus, ArrowRight, Clock, Store
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Link } from 'react-router';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { DealerInfo } from '../../network/RetrofitClient';
import { Loader2, User as UserIcon } from 'lucide-react';

type DealerStatus = 'Active' | 'Offline';

interface Dealer {
  id: string;
  name: string;
  username: string;
  status: DealerStatus;
  phone?: string;
  location?: string;
  isOnline: boolean;
}

interface Beneficiary {
  id: string;
  name: string;
  pds_card_no: string | null;
  pds_verified: boolean;
  pds_linked_at: string | null;
  phone: string | null;
  email: string | null;
  dealer_name: string | null;
  location_name: string | null;
}

export function AdminUsers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dealers');

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setSearchParams({ tab: val });
  };
  const [dealersData, setDealersData] = useState<DealerInfo[]>([]);
  const [isDealersLoading, setIsDealersLoading] = useState(true);
  const [beneficiariesData, setBeneficiariesData] = useState<Beneficiary[]>([]);
  const [isBeneficiariesLoading, setIsBeneficiariesLoading] = useState(true);

  useEffect(() => {
    async function fetchDealers() {
      setIsDealersLoading(true);
      try {
        const data = await RetrofitClient.apiService.getDealers();
        setDealersData(data);
      } catch (error) {
        console.error("Failed to fetch dealers:", error);
      } finally {
        setIsDealersLoading(false);
      }
    }

    async function fetchBeneficiaries() {
      setIsBeneficiariesLoading(true);
      try {
        const data = await RetrofitClient.apiService.getBeneficiaries();
        setBeneficiariesData(data);
      } catch (error) {
        console.error("Failed to fetch beneficiaries:", error);
      } finally {
        setIsBeneficiariesLoading(false);
      }
    }

    if (activeTab === 'dealers') {
      fetchDealers();
    } else {
      fetchBeneficiaries();
    }
  }, [activeTab]);

  const mapped = dealersData.map((d: any) => ({
    id: String(d.id),
    name: d.name ?? "Unknown Dealer",
    handle: d.handle ?? d.username ?? "",
    location: d.location ?? "",
    city: d.city ?? "",
    state: d.state ?? "",
    address: d.address ?? "",
    phone: d.phone ?? "",
    activeStatus: d.activeStatus ?? (d.isEnabled ? "Active" : "Inactive"),
    isOnline: d.isOnline ?? false
  }));

  const getAddress = (d: any) => {
    if (d.location) return d.location;
    if (d.city && d.state) return `${d.city}, ${d.state}`;
    return d.address || "No Address";
  };

  const filtered = mapped.filter((d) =>
    (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.handle || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredBeneficiaries = useMemo(() => beneficiariesData.filter(beneficiary => {
    if (beneficiary.id === '?') return false;
    const searchTerm = search.toLowerCase();
    const nameMatch = (beneficiary?.name || '').toLowerCase().includes(searchTerm);
    const locationMatch = (beneficiary?.location_name || '').toLowerCase().includes(searchTerm);
    const pdsMatch = (beneficiary?.pds_card_no || '').toLowerCase().includes(searchTerm);
    const dealerMatch = (beneficiary?.dealer_name || '').toLowerCase().includes(searchTerm);
    return nameMatch || locationMatch || pdsMatch || dealerMatch;
  }), [search, beneficiariesData]);

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const avatarColors = [
    'bg-red-500', 'bg-emerald-500', 'bg-blue-500', 
    'bg-amber-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-cyan-500', 'bg-teal-500'
  ];

  const getAvatarBg = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  return (
    <DashboardLayout role="admin" title="Management Hub">
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Modern Header with Red Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-[#D32F2F] p-8 lg:p-10 text-white shadow-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {activeTab === 'dealers' ? 'Dealers Management' : 'Beneficiaries Management'}
              </h1>
              <p className="text-red-50 opacity-90 font-medium">
                {activeTab === 'dealers' 
                  ? 'Manage regional outlets and oversee distribution performance' 
                  : 'Track and manage beneficiary enrollments and kit distributions'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to={activeTab === 'dealers' ? '/admin/dealers/add' : '/admin/beneficiaries/add'}>
                <Button size="lg" className="bg-white text-[#D32F2F] hover:bg-red-50 font-bold px-6 h-12 rounded-xl shadow-lg transition-all flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {activeTab === 'dealers' ? 'Add New Dealer' : 'Add New Beneficiary'}
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-8 relative z-10">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-200" />
              <input 
                type="text"
                placeholder={activeTab === 'dealers' 
                  ? "Search dealers by name or handle..." 
                  : "Search beneficiaries by name or location..."}
                className="w-full h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl pl-12 pr-4 text-white placeholder:text-red-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {/* Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>

        <Tabs defaultValue="dealers" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-white border border-gray-100 p-1.5 shadow-sm rounded-2xl h-14">
              <TabsTrigger value="dealers" className="gap-2 px-6 rounded-xl data-[state=active]:bg-[#D32F2F] data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-bold">
                <Users className="w-4 h-4" />
                Dealers
              </TabsTrigger>
              <TabsTrigger value="beneficiaries" className="gap-2 px-6 rounded-xl data-[state=active]:bg-[#D32F2F] data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-bold">
                <UserIcon className="w-4 h-4" />
                Beneficiaries
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-gray-100 shadow-sm hover:bg-gray-50">
                <Filter className="w-5 h-5 text-gray-400" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-gray-100 shadow-sm hover:bg-gray-50">
                <Download className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
          </div>

          <TabsContent value="dealers" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-0">
            {isDealersLoading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="w-10 h-10 text-[#D32F2F] animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Dealer Data...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((dealer) => (
                  <Card
                    key={dealer.id}
                    className="p-4 cursor-pointer hover:shadow-lg transition flex items-center gap-4"
                    onClick={() => navigate(`/admin/dealers/${dealer.id}`)}
                  >
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-red-400 flex items-center justify-center text-white font-bold text-lg">
                      {dealer.name?.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-lg">{dealer.name}</h2>
                        {dealer.isOnline && (
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500">
                        {getAddress(dealer)}
                      </p>
                      <p className="text-xs text-gray-400">{dealer.phone}</p>
                    </div>

                    {/* Status */}
                    <div
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        dealer.activeStatus === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {dealer.activeStatus}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </Card>
                ))}

                {filtered.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No dealers found</h3>
                    <p className="text-gray-500 mt-1">Try searching with a different keyword</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="beneficiaries" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-0">
            {isBeneficiariesLoading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="w-10 h-10 text-[#D32F2F] animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Beneficiary Data...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBeneficiaries.map((user) => (
                <Link key={user.id} to={`/admin/beneficiaries/${user.id}`}>
                  <Card className="group p-6 hover:shadow-2xl transition-all duration-300 border-none bg-white relative overflow-hidden cursor-pointer h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between relative z-10 w-full mb-4">
                      <div className="flex items-center gap-4 w-full">
                        <Avatar className="w-14 h-14 border-2 border-white shadow-sm ring-2 ring-gray-100 flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
                          <AvatarFallback className={`${getAvatarBg(user.name)} text-white font-bold text-xl`}>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-gray-900 text-lg group-hover:text-indigo-600 transition-colors truncate">{user.name}</h4>
                          <p className="text-sm font-bold text-gray-400">PDS: {user.pds_card_no || 'Not Linked'}</p>
                        </div>
                      </div>
                      <div className="ml-2 flex flex-col items-end gap-2 flex-shrink-0">
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          user.pds_verified ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {user.pds_verified ? 'Verified' : 'Not Verified'}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors group-hover:translate-x-1 duration-300" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 relative z-10 text-sm">
                      {user.phone && <p className="text-gray-500 font-medium">Phone: {user.phone}</p>}
                      {user.email && <p className="text-gray-500 font-medium truncate">Email: {user.email}</p>}
                      
                      {user.dealer_name && user.dealer_name !== 'None' && (
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                          <Store className="w-4 h-4 text-gray-400" />
                          <span className="truncate">Dealer: {user.dealer_name}</span>
                        </div>
                      )}
                      
                      {user.location_name && (
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="truncate">Location: {user.location_name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-gray-400 font-medium relative z-10">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">{user.pds_linked_at ? `Linked: ${user.pds_linked_at}` : 'No link history'}</span>
                    </div>

                    {/* Hover Effect Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </Card>
                </Link>
              ))}

              {filteredBeneficiaries.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-200" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No beneficiaries found</h3>
                  <p className="text-gray-500 mt-1">Try checking their PDS card number</p>
                </div>
              )}
            </div>
          )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}