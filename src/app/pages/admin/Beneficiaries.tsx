import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Search, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { RetrofitClient } from '../../network/RetrofitClient';

type StatusFilter = 'All' | 'Given' | 'Pending';

interface Beneficiary {
  id: string;
  name: string;
  beneficiaryId: string;
  status: 'Given' | 'Pending';
  timestamp: string;
}

export function AdminBeneficiaries() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBeneficiaries() {
      try {
        const data = await RetrofitClient.apiService.getBeneficiaries();
        // Backend returns slightly different keys, mapping if necessary
        const mapped = data.map((b: any) => ({
           id: b.id,
           name: b.name,
           beneficiaryId: b.pds_card_no || 'Not Linked',
           status: b.status || (b.pds_card_no ? 'Given' : 'Pending'),
           timestamp: b.pds_linked_at || 'N/A'
        }));
        setBeneficiaries(mapped);
      } catch (error) {
        console.error("Failed to fetch beneficiaries:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBeneficiaries();
  }, []);

  const filters: StatusFilter[] = ['All', 'Given', 'Pending'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Given':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'Pending':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const filteredBeneficiaries = beneficiaries.filter(ben => {
    const matchesFilter = activeFilter === 'All' || ben.status === activeFilter;
    const matchesSearch = (ben.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (ben.beneficiaryId || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const givenCount = beneficiaries.filter(b => b.status === 'Given').length;
  const pendingCount = beneficiaries.filter(b => b.status === 'Pending').length;

  return (
    <DashboardLayout role="admin" title="">
      <div className="space-y-6">
        {/* Stats Tabs */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setActiveFilter('All')}
            className={`p-4 rounded-xl text-center transition-all ${
              activeFilter === 'All'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <p className="text-2xl font-bold">{beneficiaries.length}</p>
            <p className="text-xs mt-1 opacity-90">Total</p>
          </button>
          <button 
            onClick={() => setActiveFilter('Given')}
            className={`p-4 rounded-xl text-center transition-all ${
              activeFilter === 'Given'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <p className="text-2xl font-bold">{givenCount}</p>
            <p className="text-xs mt-1 opacity-90">Given</p>
          </button>
          <button 
            onClick={() => setActiveFilter('Pending')}
            className={`p-4 rounded-xl text-center transition-all ${
              activeFilter === 'Pending'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-xs mt-1 opacity-90">Pending</p>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search beneficiaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-white border-gray-300 rounded-lg"
          />
        </div>

        {/* Filter Indicator */}
        <div className="flex items-center gap-2">
          <div className={`h-1 flex-1 rounded-full ${
            activeFilter === 'Given' ? 'bg-green-500' : 
            activeFilter === 'Pending' ? 'bg-orange-500' : 
            'bg-blue-500'
          }`}></div>
        </div>

        {/* Beneficiary List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
               <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
               <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Beneficiary Log...</p>
            </div>
          ) : filteredBeneficiaries.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No beneficiaries found</p>
            </Card>
          ) : (
            filteredBeneficiaries.map((beneficiary) => (
              <Link 
                key={beneficiary.id} 
                to={`/admin/beneficiaries/${beneficiary.id}`}
              >
                <Card className="p-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {getInitial(beneficiary.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{beneficiary.name}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(beneficiary.status)}`}>
                          {beneficiary.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{beneficiary.beneficiaryId}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{beneficiary.timestamp}</span>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}