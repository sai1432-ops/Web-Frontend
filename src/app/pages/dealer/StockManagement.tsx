import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Package, 
  Truck, 
  ArrowLeft,
  CalendarDays,
  MapPin,
  ClipboardList,
  Ban,
  CheckCircle,
  Archive
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { RetrofitClient } from '../../network/RetrofitClient';

interface GroupedStockRequest {
  id: string; // The request_id (e.g. REQ-87A0)
  dbId: number; // The database primary key ID
  totalUnits: string;
  date: string;
  status: string;
  statusColor: string;
  progress: number;
  lastLocation: string | null;
  detailedItems: string;
}

export default function StockManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Pending' | 'In-Transit' | 'Delivered'>('Pending');
  const [isLoading, setIsLoading] = useState(false);
  const [stockRequests, setStockRequests] = useState<GroupedStockRequest[]>([]);
  const [stats, setStats] = useState({
    totalRequested: 0,
    inTransit: 0,
    arrived: 0
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const dealerId = currentUser.dealer_id || currentUser.id || 1;

  useEffect(() => {
    fetchStockData();
  }, [dealerId]);

  const fetchStockData = async () => {
    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.getDealerStockRequests(Number(dealerId));
      if (response.isSuccessful) {
        const myRequests = response.body || [];
        
        // Grouping logic by requestId
        const groupedMap = new Map<string, any[]>();
        myRequests.forEach(req => {
          const rId = req.requestId || req.request_id;
          if (!groupedMap.has(rId)) {
            groupedMap.set(rId, []);
          }
          groupedMap.get(rId)?.push(req);
        });

        const mapped: GroupedStockRequest[] = Array.from(groupedMap.entries()).map(([requestId, items]) => {
          const first = items[0];
          // Prevent summing components of the same kit. A request for 10 kits might have 3 items of 10 qty each.
          let totalQty = first.total_kits || first.totalKits || 0;
          if (!totalQty) {
            totalQty = items.reduce((max, item) => {
              const qtyStr = item.quantity || item.requested_quantity || '0';
              const val = parseInt(qtyStr) || 0;
              return val > max ? val : max;
            }, 0);
          }
          const itemsDescription = items.map(it => `${it.kitType || it.item_name || 'Unknown Item'} (${it.quantity || it.requested_quantity || '0'})`).join(', ');

          let statusText = first.status.toUpperCase();
          let statusColor = "text-gray-500";
          let progress = 0;
          let lastLocation = "Pending Review";

          switch (statusText) {
            case "PENDING":
              statusColor = "text-[#E65100]";
              progress = 0.1;
              break;
            case "DISPATCHED":
              statusText = "SHIPPED";
              statusColor = "text-[#1976D2]";
              progress = 0.6;
              lastLocation = "In Transit";
              break;
            case "RECEIVED":
            case "DELIVERED":
              statusText = "DELIVERED";
              statusColor = "text-[#4CAF50]";
              progress = 1.0;
              lastLocation = "Delivered to Warehouse";
              break;
            case "REJECTED":
              statusColor = "text-[#D32F2F]";
              progress = 0;
              lastLocation = "Request Declined";
              break;
          }

          return {
            id: requestId,
            dbId: first.id || 0,
            totalUnits: `${totalQty} Total Units`,
            date: first.requestDate || first.requested_at || first.request_date || "N/A",
            status: statusText,
            statusColor,
            progress,
            lastLocation,
            detailedItems: itemsDescription
          };
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setStockRequests(mapped);

        // Calculate stats
        const requested = mapped.filter(r => r.status === "PENDING" || r.status === "REJECTED").length;
        const shipped = mapped.filter(r => r.status === "SHIPPED").length;
        const delivered = mapped.filter(r => r.status === "DELIVERED").length;

        setStats({
          totalRequested: requested,
          inTransit: shipped,
          arrived: delivered
        });

      } else {
        toast.error("Failed to fetch stock data");
      }
    } catch (e) {
      toast.error("Network error accessing stock data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = stockRequests.filter(req => {
    if (activeTab === 'Pending') return req.status === "PENDING" || req.status === "REJECTED";
    if (activeTab === 'In-Transit') return req.status === "SHIPPED";
    if (activeTab === 'Delivered') return req.status === "DELIVERED";
    return false;
  });

  return (
    <DashboardLayout role="dealer" title="">
      {/* Absolute background gradient just like Android */}
      <div 
        className="absolute top-0 left-0 w-full h-[280px] bg-gradient-to-b from-[#10B981] to-[#F8FBFF] z-0"
        style={{ pointerEvents: 'none' }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen -m-6 sm:-m-8 px-6 sm:px-8 pt-8 pb-32">
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={() => navigate(-1)} 
                className="w-10 h-10 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Stock Hub</h1>
        </div>
        
        {/* Stats Section */}
        <div className="flex justify-between items-center gap-4 mb-8">
            <StatCard label="Pending" value={stats.totalRequested.toString()} icon={ClipboardList} />
            <StatCard label="In Transit" value={stats.inTransit.toString()} icon={Truck} />
            <StatCard label="Arrived" value={stats.arrived.toString()} icon={Archive} />
        </div>

        {/* Custom Tab Navigation */}
        <div className="mb-6">
            <div className="flex justify-between relative border-b border-[#10B981]/20">
                {['Pending', 'In-Transit', 'Delivered'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 pb-3 text-[13px] text-center transition-all relative ${
                            activeTab === tab 
                            ? 'text-[#10B981] font-black' 
                            : 'text-[#10B981]/60 font-bold'
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#10B981] rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* List Content */}
        <div className="flex-1 mt-2">
            {isLoading ? (
                <div className="flex items-center justify-center h-full pt-32">
                    <div className="w-10 h-10 border-4 border-emerald-100 border-t-[#10B981] rounded-full animate-spin"></div>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-32 text-center h-full">
                    <Package className="w-16 h-16 text-gray-300 mb-4 opacity-30" />
                    <p className="text-gray-500 font-medium">No records in this category</p>
                </div>
            ) : (
                <div className="space-y-4 pb-6 mt-2">
                    {filteredRequests.map((req) => (
                        <StockItemCard 
                            key={req.id} 
                            req={req} 
                            showTracking={activeTab === 'In-Transit'} 
                            onConfirm={async () => {
                                setIsLoading(true);
                                try {
                                    const res = await RetrofitClient.apiService.confirmStockReceipt(Number(dealerId), req.id);
                                    if (res.isSuccessful) {
                                        toast.success("Stock received and inventory updated");
                                        fetchStockData();
                                    } else {
                                        toast.error(res.errorBody?.string() || "Failed to confirm receipt");
                                    }
                                } catch (e) {
                                    toast.error("Network error during confirmation");
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </div>

      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
    return (
        <Card className="flex-1 p-3 rounded-[20px] shadow-[0_8px_16px_rgba(0,0,0,0.1)] border-none bg-white flex flex-col items-center">
            <div className={`w-9 h-9 rounded-[10px] bg-[#10B981]/10 flex items-center justify-center mb-2`}>
                <Icon className={`w-[18px] h-[18px] text-[#10B981]`} />
            </div>
            <p className="text-[10px] font-bold text-gray-400">{label}</p>
            <p className="text-[18px] font-black text-gray-900 leading-tight">{value}</p>
        </Card>
    );
}

function StockItemCard({ req, showTracking, onConfirm }: { 
    req: GroupedStockRequest, 
    showTracking: boolean,
    onConfirm?: () => void 
}) {
    return (
        <Card className="p-4 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.05)] border-none bg-white">
            <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center shrink-0">
                    {req.status === "DELIVERED" ? (
                        <Archive className="w-6 h-6 text-[#10B981]" />
                    ) : req.status === "REJECTED" ? (
                        <Ban className="w-6 h-6 text-[#10B981]" />
                    ) : (
                        <Package className="w-6 h-6 text-[#10B981]" />
                    )}
                </div>
                
                <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between pointer-events-none">
                       <div>
                         <p className="text-[12px] font-black text-[#10B981]">Req ID: {req.id}</p>
                         <p className="text-[16px] font-bold text-gray-900 mt-0.5">{req.totalUnits}</p>
                       </div>
                       
                       <div className="px-2 py-1 rounded-[8px]" style={{ backgroundColor: `${getHexCode(req.statusColor)}1A` }}>
                           <span className="text-[10px] font-black" style={{ color: getHexCode(req.statusColor) }}>
                               {req.status}
                           </span>
                       </div>
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <p className="text-[13px] text-gray-700/80 leading-[18px]">
                    {req.detailedItems}
                </p>
                
                <div className="flex items-center mt-1 text-gray-500">
                    <CalendarDays className="w-3 h-3" />
                    <span className="text-[12px] ml-1">Requested: {req.date}</span>
                </div>
            </div>

            {showTracking && (
                <div className="mt-4 pt-4 border-t border-transparent">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[12px] font-bold text-gray-900">In Transit Progress</p>
                        <p className="text-[12px] font-black text-[#10B981]">{Math.round(req.progress * 100)}%</p>
                    </div>
                    <div className="w-full h-2 bg-[#10B981]/10 rounded flex overflow-hidden">
                        <div 
                            className="bg-[#10B981] rounded"
                            style={{ width: `${req.progress * 100}%` }}
                        ></div>
                    </div>
                    <div className="flex items-center mt-1 text-gray-500 font-medium">
                        <MapPin className="w-3 h-3 text-[#10B981]" />
                        <span className="text-[11px] ml-1">{req.lastLocation}</span>
                    </div>
                </div>
            )}
            
            {req.status === "SHIPPED" && (
                <div className="mt-4 pt-4 border-t border-gray-100/50">
                    <Button 
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onConfirm?.();
                        }}
                        className="w-full h-11 bg-[#10B981] hover:bg-[#0EA5E9] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Confirm Stock Receipt
                    </Button>
                </div>
            )}
        </Card>
    );
}

// Helper to grab hex out of Tailwind classes for dynamic inline coloring
function getHexCode(twClass: string) {
    if(twClass.includes("E65100")) return "#E65100";
    if(twClass.includes("1976D2")) return "#1976D2";
    if(twClass.includes("4CAF50")) return "#4CAF50";
    if(twClass.includes("D32F2F")) return "#D32F2F";
    return "#808080";
}