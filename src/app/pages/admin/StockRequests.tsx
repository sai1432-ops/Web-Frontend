import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { 
  Search, 
  MapPin, 
  History, 
  CheckCircle, 
  Truck, 
  XCircle,
  Clock,
  ArrowLeft,
  Package,
  User,
  Info,
  MoreVertical,
  ChevronRight,
  Layers
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../components/ui/dialog';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { AdminStockRequestDto } from '../../network/RetrofitClient';
import { toast } from 'sonner';

type StockRequestStatus = 'Pending' | 'Approved' | 'Dispatched' | 'Rejected';
type TabKey = 'All' | 'Pending' | 'Accepted' | 'Dispatched' | 'Rejected';

interface RequestGroup {
    requestId: string;
    itemIds: number[];
    dealerName: string;
    location: string;
    kitTypeSummary: string;
    totalQuantity: string;
    status: StockRequestStatus;
    requestDate: string;
    firstItem: AdminStockRequestDto;
}

const TABS: { key: TabKey; label: string; icon: React.ReactNode; color: string; activeGradient: string }[] = [
  {
    key: 'All',
    label: 'All',
    icon: <Layers className="w-3.5 h-3.5" />,
    color: '#1E3A8A',
    activeGradient: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
  },
  {
    key: 'Pending',
    label: 'Pending',
    icon: <Clock className="w-3.5 h-3.5" />,
    color: '#D97706',
    activeGradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
  },
  {
    key: 'Accepted',
    label: 'Accepted',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    color: '#059669',
    activeGradient: 'linear-gradient(135deg, #059669, #10B981)',
  },
  {
    key: 'Dispatched',
    label: 'Dispatched',
    icon: <Truck className="w-3.5 h-3.5" />,
    color: '#2563EB',
    activeGradient: 'linear-gradient(135deg, #2563EB, #60A5FA)',
  },
  {
    key: 'Rejected',
    label: 'Rejected',
    icon: <XCircle className="w-3.5 h-3.5" />,
    color: '#DC2626',
    activeGradient: 'linear-gradient(135deg, #DC2626, #F87171)',
  },
];

export default function AdminStockRequests() {
  const navigate = useNavigate();
  const [rawRequests, setRawRequests] = useState<AdminStockRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('All');
  
  // Modal states
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<RequestGroup | null>(null);
  const [courierName, setCourierName] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.getAdminStockRequests();
      if (response.isSuccessful && response.body) {
        setRawRequests(response.body);
      } else {
        toast.error(response.errorBody?.string() || "Failed to load requests");
      }
    } catch (e) {
      toast.error("Network error accessing stock registry");
    } finally {
      setIsLoading(false);
    }
  };

  const groupedRequests = useMemo(() => {
    const groups: { [key: string]: AdminStockRequestDto[] } = {};
    rawRequests.forEach((req) => {
      const groupKey = req.request_id || req.requestId || String(req.id);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(req);
    });

    return Object.entries(groups)
      .map(([requestId, items]) => {
        const first = items[0];
        const kitTypeSummary = items
          .map(
            (it) =>
              `${it.item_name || it.kitType || "Item"} (${it.requested_quantity || it.quantity || 0})`
          )
          .join(", ");

        return {
          requestId,
          itemIds: items.map((it) => it.id),
          dealerName: first.dealer_name || first.dealerName || "Unknown Dealer",
          location: first.location || "Central Hub",
          kitTypeSummary,
          totalQuantity: `${items.length} Item Types`,
          status: (first.status || "PENDING") as StockRequestStatus,
          requestDate: first.requested_at || first.requestDate || "",
          firstItem: first,
        } as RequestGroup;
      })
      .sort((a, b) => (b.requestDate || "").localeCompare(a.requestDate || ""));
  }, [rawRequests]);

  // Per-tab counts
  const tabCounts = useMemo(() => ({
    All: groupedRequests.length,
    Pending: groupedRequests.filter(g => g.status.toUpperCase() === 'PENDING').length,
    Accepted: groupedRequests.filter(g => g.status.toUpperCase() === 'APPROVED').length,
    Dispatched: groupedRequests.filter(g => g.status.toUpperCase() === 'DISPATCHED').length,
    Rejected: groupedRequests.filter(g => g.status.toUpperCase() === 'REJECTED').length,
  }), [groupedRequests]);

  const filteredGroups = useMemo(() => {
    let result = groupedRequests;

    // Tab filter
    if (activeTab !== 'All') {
      const statusMap: Record<TabKey, string> = {
        All: '',
        Pending: 'PENDING',
        Accepted: 'APPROVED',
        Dispatched: 'DISPATCHED',
        Rejected: 'REJECTED',
      };
      result = result.filter(g => g.status.toUpperCase() === statusMap[activeTab]);
    }

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter(group => {
        const matchesSearch = (group.requestId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (group.dealerName || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      });
    }

    return result;
  }, [groupedRequests, activeTab, searchQuery]);

  const handleApprove = async (group: RequestGroup) => {
    setIsProcessing(true);
    try {
        const results = await Promise.all(group.itemIds.map(id => RetrofitClient.apiService.approveStockRequest(id)));
        if (results.every(r => r.isSuccessful)) {
            toast.success(`Request ${group.requestId} approved`);
            loadRequests();
        } else {
            const firstError = results.find(r => !r.isSuccessful)?.errorBody?.string();
            toast.error(firstError || "Partial failure in group approval");
        }
    } catch (e) {
        toast.error("Action interrupted by network failure");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDispatch = async () => {
    if (!selectedGroup || !courierName || !trackingId) return;
    setIsProcessing(true);
    try {
        const results = await Promise.all(selectedGroup.itemIds.map(id => 
            RetrofitClient.apiService.dispatchStockRequest(id, { courierName, trackingId, adminNote })
        ));
        if (results.every(r => r.isSuccessful)) {
            toast.success(`Request ${selectedGroup.requestId} dispatched via ${courierName}`);
            setIsDispatchModalOpen(false);
            setCourierName('');
            setTrackingId('');
            setAdminNote('');
            loadRequests();
        } else {
            const firstError = results.find(r => !r.isSuccessful)?.errorBody?.string();
            toast.error(firstError || "Dispatch update failed for some items");
        }
    } catch (e) {
        toast.error("Network synchronization error");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedGroup || !rejectReason) return;
    setIsProcessing(true);
    try {
        const results = await Promise.all(selectedGroup.itemIds.map(id => 
            RetrofitClient.apiService.rejectStockRequest(id, { reason: rejectReason })
        ));
        if (results.every(r => r.isSuccessful)) {
            toast.success(`Request ${selectedGroup.requestId} rejected`);
            setIsRejectModalOpen(false);
            setRejectReason('');
            loadRequests();
        } else {
            const firstError = results.find(r => !r.isSuccessful)?.errorBody?.string();
            toast.error(firstError || "Rejection processed with errors");
        }
    } catch (e) {
        toast.error("Backend communication failure");
    } finally {
        setIsProcessing(false);
    }
  };

  const PrimaryBlue = "#1E3A8A";
  const CyanGradient = "#3B82F6";

  const activeTabMeta = TABS.find(t => t.key === activeTab)!;

  return (
    <DashboardLayout role="admin" title="">
      <div className="flex flex-col min-h-screen bg-[#F8FBFF] -m-6 sm:-m-8 pb-32">
        {/* Gradient Header */}
        <div 
          className="w-full h-[200px] rounded-b-[32px] flex flex-col p-8 pt-12 relative overflow-hidden shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${PrimaryBlue}, ${CyanGradient})` }}
        >
            <div className="flex items-center justify-between z-10 transition-all duration-500 animate-in fade-in slide-in-from-left-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-black text-white tracking-tighter">Stock Requests</h1>
                      <p className="text-white/60 text-xs font-bold mt-0.5">{tabCounts.All} total requests</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all">
                        <History className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/20 shadow-lg">
                        <Info className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Abstract elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-36 -mt-36 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/5 rounded-full -ml-28 -mb-28 blur-2xl"></div>
        </div>

        {/* Content Section */}
        <div className="px-6 -mt-6 z-20 space-y-6">

            {/* Search Hub */}
            <Card className="p-2 rounded-[2rem] border-none shadow-xl bg-white/80 backdrop-blur-xl flex items-center gap-2">
                <div className="pl-6 text-gray-400">
                    <Search className="w-5 h-5" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search by Request ID or Dealer Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-14 bg-transparent outline-none text-sm font-bold text-gray-800 placeholder:text-gray-300"
                />
            </Card>

            {/* ─── Tab Bar ─── */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {TABS.map(tab => {
                const isActive = activeTab === tab.key;
                const count = tabCounts[tab.key];
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 active:scale-95"
                    style={
                      isActive
                        ? {
                            background: tab.activeGradient,
                            color: '#fff',
                            boxShadow: `0 4px 18px ${tab.color}40`,
                          }
                        : {
                            background: '#fff',
                            color: '#9CA3AF',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          }
                    }
                  >
                    {tab.icon}
                    {tab.label}
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={
                        isActive
                          ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                          : { background: '#F3F4F6', color: '#6B7280' }
                      }
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Section Label */}
            <div className="flex items-center gap-3 px-1">
              <div
                className="w-1.5 h-5 rounded-full"
                style={{ background: activeTabMeta.activeGradient }}
              />
              <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {activeTab === 'All' ? 'All Requests' : `${activeTab} Requests`}
              </h2>
            </div>

            {/* Cards / Loading / Empty */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing Request Pool...</p>
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="py-20 flex flex-col items-center text-center px-10">
                    <div
                      className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-6"
                      style={{ background: `${activeTabMeta.color}15` }}
                    >
                        {activeTabMeta.icon && (
                          <span style={{ color: activeTabMeta.color, transform: 'scale(2)' }}>
                            {activeTabMeta.icon}
                          </span>
                        )}
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">
                      No {activeTab === 'All' ? '' : activeTab} Requests
                    </h3>
                    <p className="text-sm font-bold text-gray-400">
                      {activeTab === 'All'
                        ? 'No stock requests have been submitted yet.'
                        : `There are no ${activeTab.toLowerCase()} requests at this time.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.map(group => (
                        <RequestGroupCard
                            key={group.requestId}
                            group={group}
                            onApprove={() => handleApprove(group)}
                            onDispatch={() => {
                                setSelectedGroup(group);
                                setIsDispatchModalOpen(true);
                            }}
                            onReject={() => {
                                setSelectedGroup(group);
                                setIsRejectModalOpen(true);
                            }}
                            onViewDetails={() => navigate(`/admin/stock-requests/${group.firstItem.id}`)}
                            isProcessing={isProcessing}
                        />
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Dispatch Modal */}
      <Dialog open={isDispatchModalOpen} onOpenChange={setIsDispatchModalOpen}>
        <DialogContent className="rounded-[2.5rem] border-none p-8 max-w-sm">
            <DialogHeader>
                <DialogTitle className="text-xl font-black text-gray-900 tracking-tight">Dispatch Details</DialogTitle>
                <DialogDescription className="font-bold text-gray-400">
                    Enter tracking information for <span className="text-blue-600">#{selectedGroup?.requestId}</span>.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-6">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Courier Service</p>
                    <Input 
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="e.g. BlueDart, DHL, Professional"
                        className="h-14 rounded-2xl border-gray-100 font-bold focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Tracking ID</p>
                    <Input 
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="AWA-0123456789"
                        className="h-14 rounded-2xl border-gray-100 font-bold focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Admin Note (Optional)</p>
                    <textarea 
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Add additional dispatch details or notes..."
                        className="w-full h-24 rounded-2xl border border-gray-100 p-4 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all"
                    />
                </div>
            </div>
            <DialogFooter className="flex-col gap-3 sm:flex-col">
                <Button 
                    onClick={handleDispatch}
                    disabled={isProcessing || !courierName || !trackingId}
                    className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black w-full"
                >
                    {isProcessing ? "Updating Registry..." : "Confirm Dispatch"}
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="h-14 rounded-2xl font-black text-gray-400 w-full"
                >
                    Cancel
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="rounded-[2.5rem] border-none p-8 max-w-sm">
            <DialogHeader>
                <DialogTitle className="text-xl font-black text-gray-900 tracking-tight">Decline Request</DialogTitle>
                <DialogDescription className="font-bold text-gray-400">
                    Provide a reason for rejecting <span className="text-red-600">#{selectedGroup?.requestId}</span>.
                </DialogDescription>
            </DialogHeader>
            <div className="py-6">
                <textarea 
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Stock unavailable, Invalid dealer location..."
                    className="w-full h-32 rounded-2xl border border-gray-100 p-4 font-bold text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition-all"
                />
            </div>
            <DialogFooter className="flex-col gap-3 sm:flex-col">
                <Button 
                    onClick={handleReject}
                    disabled={isProcessing || !rejectReason}
                    className="h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black w-full"
                >
                    {isProcessing ? "Processing..." : "Reject Request"}
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => setIsRejectModalOpen(false)}
                    className="h-14 rounded-2xl font-black text-gray-400 w-full"
                >
                    Cancel
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function RequestGroupCard({
    group,
    onApprove,
    onDispatch,
    onReject,
    onViewDetails,
    isProcessing
}: {
    group: RequestGroup,
    onApprove: () => void,
    onDispatch: () => void,
    onReject: () => void,
    onViewDetails: () => void,
    isProcessing: boolean
}) {
    const isPending = group.status.toUpperCase() === 'PENDING';
    const isApproved = group.status.toUpperCase() === 'APPROVED';
    const isDispatched = group.status.toUpperCase() === 'DISPATCHED';
    const isRejected = group.status.toUpperCase() === 'REJECTED';

    const getStatusColor = () => {
        if (isPending) return "#F59E0B";
        if (isApproved) return "#10B981";
        if (isDispatched) return "#3B82F6";
        if (isRejected) return "#EF4444";
        return "#6B7280";
    };

    const getStatusBg = () => {
        if (isPending) return "#FFFBEB";
        if (isApproved) return "#ECFDF5";
        if (isDispatched) return "#EFF6FF";
        if (isRejected) return "#FEF2F2";
        return "#F9FAFB";
    };

    return (
        <Card
          onClick={onViewDetails}
          className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-gray-50/50 cursor-pointer"
        >
            <div className="p-7 space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1">#{group.requestId}</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{group.requestDate}</p>
                        </div>
                    </div>
                    <button className="text-gray-300 hover:text-gray-900 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-blue-600/50 uppercase tracking-widest mb-0.5">Dealer</p>
                            <h5 className="text-[15px] font-black text-gray-900 tracking-tight leading-tight">{group.dealerName}</h5>
                            <div className="flex items-center gap-1.5 mt-0.5 text-gray-400">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-bold">{group.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-gray-50/70 space-y-4 border border-gray-50">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory Type</p>
                            <p className="text-[12px] font-black text-gray-900">{group.totalQuantity}</p>
                        </div>
                        <p className="text-[13px] font-bold text-gray-600 leading-relaxed italic">
                            "{group.kitTypeSummary}"
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div 
                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={{ backgroundColor: getStatusBg(), color: getStatusColor() }}
                    >
                        {isPending && <Clock className="w-3 h-3" />}
                        {isApproved && <CheckCircle className="w-3 h-3" />}
                        {isDispatched && <Truck className="w-3 h-3" />}
                        {isRejected && <XCircle className="w-3 h-3" />}
                        {group.status}
                    </div>

                    <Link 
                        to={`/admin/stock-requests/${group.firstItem.id}`}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-black hover:text-white transition-all shadow-sm"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Actions Hub */}
                {(isPending || isApproved) && (
                    <div className="pt-4 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2">
                        {isPending && (
                            <>
                                <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onApprove();
                                    }}
                                    disabled={isProcessing}
                                    className="h-12 rounded-2xl bg-black hover:bg-gray-800 text-white font-black text-[12px] uppercase tracking-widest flex-1"
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onReject();
                                    }}
                                    disabled={isProcessing}
                                    className="h-12 rounded-2xl border-gray-200 text-red-500 hover:bg-red-50 font-black text-[12px] uppercase tracking-widest flex-1"
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                        {isApproved && (
                            <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDispatch();
                                }}
                                disabled={isProcessing}
                                className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[12px] uppercase tracking-widest col-span-2 flex items-center justify-center gap-2"
                            >
                                <Truck className="w-4 h-4" />
                                Ready for Dispatch
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}