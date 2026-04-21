import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  MoreVertical,
  Calendar,
  Layers,
  FileText,
  Info,
  Phone,
  AlertTriangle,
  History,
  Navigation
} from 'lucide-react';
import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import { RetrofitClient, type AdminStockRequestDto } from "../../network/RetrofitClient";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import { toast } from "sonner";

export default function StockRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<AdminStockRequestDto | any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal states
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [courierName, setCourierName] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await RetrofitClient.apiService.getStockRequestDetailsSync(Number(id));
      if (res.isSuccessful && res.body) {
        setRequest(res.body);
      } else {
        toast.error("Failed to load request details");
        setRequest(null);
      }
    } catch (err) {
      console.error("Error fetching details", err);
      toast.error("Network error accessing stock registry");
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!request) return;
    setIsProcessing(true);
    try {
      const res = await RetrofitClient.apiService.approveStockRequest(Number(id));
      if (res.isSuccessful) {
        toast.success(`Request #${request.request_id || request.requestId} approved`);
        fetchDetails();
      } else {
        toast.error("Approval failed. Please try again.");
      }
    } catch (e) {
      toast.error("Action interrupted by network failure");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDispatch = async () => {
    if (!request || !courierName || !trackingId) return;
    setIsProcessing(true);
    try {
      const res = await RetrofitClient.apiService.dispatchStockRequest(Number(id), { 
        courierName, 
        trackingId, 
        adminNote 
      });
      if (res.isSuccessful) {
        toast.success(`Stock dispatched via ${courierName}`);
        setIsDispatchModalOpen(false);
        setCourierName("");
        setTrackingId("");
        setAdminNote("");
        fetchDetails();
      } else {
        toast.error("Dispatch update failed");
      }
    } catch (e) {
      toast.error("Network synchronization error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!request || !rejectReason) return;
    setIsProcessing(true);
    try {
      const res = await RetrofitClient.apiService.rejectStockRequest(Number(id), { 
        reason: rejectReason 
      });
      if (res.isSuccessful) {
        toast.success(`Request rejected`);
        setIsRejectModalOpen(false);
        setRejectReason("");
        fetchDetails();
      } else {
        toast.error("Rejection processed with errors");
      }
    } catch (e) {
      toast.error("Backend communication failure");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === 'PENDING') return "#F59E0B";
    if (s === 'APPROVED') return "#10B981";
    if (s === 'DISPATCHED') return "#3B82F6";
    if (s === 'REJECTED') return "#EF4444";
    if (s === 'RECEIVED') return "#10B981";
    return "#6B7280";
  };

  const getStatusBg = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === 'PENDING') return "#FFFBEB";
    if (s === 'APPROVED') return "#ECFDF5";
    if (s === 'DISPATCHED') return "#EFF6FF";
    if (s === 'REJECTED') return "#FEF2F2";
    if (s === 'RECEIVED') return "#ECFDF5";
    return "#F9FAFB";
  };

  if (loading) {
    return (
      <DashboardLayout role="admin" title="">
        <div className="flex flex-col min-h-screen bg-[#F8FBFF] items-center justify-center -m-6 sm:-m-8">
           <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">Accessing Request Terminal...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!request) {
    return (
      <DashboardLayout role="admin" title="">
        <div className="flex flex-col min-h-screen bg-[#F8FBFF] items-center justify-center -m-6 sm:-m-8 space-y-6">
           <div className="w-24 h-24 rounded-[3rem] bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
              <Package className="w-10 h-10" />
           </div>
           <h2 className="text-xl font-black text-gray-900 tracking-tight">Request Details Missing</h2>
           <p className="text-sm font-bold text-gray-400 max-w-xs text-center">We couldn't find the requested stock information. It may have been relocated or archived.</p>
           <Button
            onClick={() => navigate("/admin/stock-requests")}
            className="h-14 px-8 rounded-2xl bg-black text-white font-black"
          >
            Back to Registry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const PrimaryBlue = "#1E3A8A";
  const CyanGradient = "#3B82F6";
  const currentStatus = request.status || "PENDING";
  const isPending = currentStatus.toUpperCase() === 'PENDING';
  const isApproved = currentStatus.toUpperCase() === 'APPROVED';
  const isDispatched = currentStatus.toUpperCase() === 'DISPATCHED';
  const isRejected = currentStatus.toUpperCase() === 'REJECTED';
  const isReceived = currentStatus.toUpperCase() === 'RECEIVED';
  const urgency = (request.urgency || "Normal").toUpperCase();

  return (
    <DashboardLayout role="admin" title="">
      <div className="flex flex-col min-h-screen bg-[#F8FBFF] -m-6 sm:-m-8 pb-32">
        {/* Modern Gradient Header */}
        <div 
          className="w-full h-[280px] rounded-b-[50px] flex flex-col p-10 pt-16 relative overflow-hidden shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${PrimaryBlue}, ${CyanGradient})` }}
        >
            <div className="flex items-center justify-between z-10 animate-in fade-in slide-in-from-left-4">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate("/admin/stock-requests")} 
                        className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all active:scale-95 shadow-lg"
                    >
                        <ArrowLeft className="w-7 h-7" />
                    </button>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                         <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-black text-white uppercase tracking-wider">Registry Management</span>
                         {urgency !== "NORMAL" && (
                            <span className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-black text-white uppercase tracking-wider ${urgency === 'HIGH' ? 'bg-red-500/80 shadow-lg shadow-red-500/20' : 'bg-amber-500/80 shadow-lg shadow-amber-500/20'}`}>
                               <AlertTriangle className="w-3.5 h-3.5" />
                               {urgency} Priority
                            </span>
                         )}
                      </div>
                      <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">
                         #{request.request_id || request.requestId || "REQ-UNTITLED"}
                      </h1>
                      <div className="flex items-center gap-2 text-white/60">
                         <Calendar className="w-4 h-4" />
                         <span className="text-xs font-bold uppercase tracking-widest">{request.requestDate || request.requestedAt}</span>
                      </div>
                    </div>
                </div>
                <div className="hidden lg:flex flex-col items-end gap-3">
                    <div 
                        className="px-8 py-4 rounded-3xl text-[14px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl backdrop-blur-xl border border-white/10"
                        style={{ backgroundColor: getStatusBg(currentStatus), color: getStatusColor(currentStatus) }}
                    >
                        {isPending && <Clock className="w-5 h-5 shadow-sm" />}
                        {isApproved && <CheckCircle className="w-5 h-5 shadow-sm" />}
                        {isDispatched && <Truck className="w-5 h-5 shadow-sm" />}
                        {isRejected && <XCircle className="w-5 h-5 shadow-sm" />}
                        {isReceived && <CheckCircle className="w-5 h-5 shadow-sm" />}
                        {currentStatus}
                    </div>
                    {isDispatched && request.deliveredAt && (
                        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Delivered: {request.deliveredAt}</span>
                    )}
                </div>
            </div>

            {/* Premium backdrop elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-[100px] opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full -ml-40 -mb-40 blur-[80px] opacity-30"></div>
        </div>

        {/* Content Hub */}
        <div className="px-10 -mt-16 z-20">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Wing - Main Intel */}
              <div className="lg:col-span-8 space-y-10">
                 
                 {/* Inventory Breakdown Card */}
                 <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden p-10 border border-gray-50/50 relative overflow-hidden group">
                    <div className="flex items-center gap-5 mb-10">
                       <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          <Package className="w-8 h-8" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Stock Inventory</h2>
                          <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Full Request Breakdown</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-8 rounded-[2.5rem] bg-gray-50/70 border border-gray-100 flex flex-col justify-between hover:bg-gray-100/80 transition-all">
                          <div className="flex items-center gap-4 mb-6">
                             <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-500 shadow-sm">
                                <Layers className="w-6 h-6" />
                             </div>
                             <span className="text-[13px] font-black text-gray-400 uppercase tracking-widest">Asset Class</span>
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
                             {request.kitType || request.item_name || "Standard Supply"}
                          </h3>
                       </div>

                       <div className="p-8 rounded-[2.5rem] bg-[#0F172A] text-white flex flex-col justify-between shadow-xl">
                          <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                             <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/60 shadow-inner">
                                <FileText className="w-6 h-6" />
                             </div>
                             <span className="text-[13px] font-black text-white/40 uppercase tracking-widest">Volume Request</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-black tracking-tighter">
                                {request.quantity || request.requested_quantity || 0}
                             </span>
                             <span className="text-[12px] text-white/40 uppercase font-black tracking-[0.2em]">Total Units</span>
                          </div>
                       </div>
                    </div>

                    {request.adminNote && (
                       <div className="mt-10 p-8 rounded-[2.5rem] bg-amber-50 border border-amber-100 relative overflow-hidden group/note">
                          <div className="absolute top-0 right-0 p-5 opacity-5 group-hover/note:opacity-10 transition-opacity">
                             <Info className="w-16 h-16 text-amber-900" />
                          </div>
                          <h4 className="text-[11px] font-black text-amber-800 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                             <AlertTriangle className="w-4 h-4 text-amber-600" />
                             Compliance & Notes
                          </h4>
                          <p className="text-[15px] font-bold text-amber-900 leading-relaxed italic pr-10">
                             "{request.adminNote}"
                          </p>
                       </div>
                    )}
                 </Card>

                 {/* Timeline Milestones Card */}
                 <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden p-10 border border-gray-50/50">
                    <div className="flex items-center gap-5 mb-10">
                       <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                          <History className="w-8 h-8" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Lifecycle Timeline</h2>
                          <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Critical Milestones</p>
                       </div>
                    </div>

                    <div className="space-y-8 relative before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                       <TimelineItem 
                          icon={<Clock className="w-4 h-4" />} 
                          label="Requested At" 
                          date={request.requestedAt || request.requestDate} 
                          active={true}
                          color="amber"
                       />
                       <TimelineItem 
                          icon={<CheckCircle className="w-4 h-4" />} 
                          label="Approval Phase" 
                          date={request.approvedAt} 
                          active={!!request.approvedAt}
                          color="emerald"
                       />
                       {request.rejectedAt && (
                          <TimelineItem 
                             icon={<XCircle className="w-4 h-4" />} 
                             label="Request Rejected" 
                             date={request.rejectedAt} 
                             active={true}
                             color="red"
                          />
                       )}
                       <TimelineItem 
                          icon={<Truck className="w-4 h-4" />} 
                          label="Shipment Dispatched" 
                          date={request.dispatchedAt} 
                          active={!!request.dispatchedAt}
                          color="blue"
                       />
                       <TimelineItem 
                          icon={<Package className="w-4 h-4" />} 
                          label="Supply Received" 
                          date={request.deliveredAt} 
                          active={!!request.deliveredAt}
                          color="violet"
                       />
                    </div>
                 </Card>

                 {/* Actions Command Center */}
                 {(isPending || isApproved) && (
                    <Card className="rounded-[3rem] border-none shadow-2xl bg-[#0F172A] overflow-hidden p-10 text-white relative group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-[60px] group-hover:bg-white/10 transition-all duration-700"></div>
                       
                       <div className="relative z-10">
                          <div className="flex items-center gap-5 mb-10">
                             <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-lg backdrop-blur-md transition-transform group-hover:scale-110">
                                <Navigation className="w-8 h-8" />
                             </div>
                             <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Administrative Terminal</h2>
                                <p className="text-[12px] font-black text-white/40 uppercase tracking-[0.2em] mt-0.5">Execute Operational Steps</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {isPending && (
                                <>
                                   <Button
                                      onClick={handleApprove}
                                      disabled={isProcessing}
                                      className="h-20 rounded-[2rem] bg-white text-black hover:bg-emerald-500 hover:text-white font-black text-[15px] uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 group/btn"
                                   >
                                      {isProcessing ? "Updating Registry..." : (
                                         <>
                                            <CheckCircle className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                                            Confirm Approval
                                         </>
                                      )}
                                   </Button>
                                   <Button
                                      onClick={() => setIsRejectModalOpen(true)}
                                      disabled={isProcessing}
                                      variant="outline"
                                      className="h-20 rounded-[2rem] border-white/10 text-white hover:bg-red-500 text-white font-black text-[15px] uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-95 border-b-4 border-b-black"
                                   >
                                      <XCircle className="w-6 h-6" />
                                      Decline Flow
                                   </Button>
                                </>
                             )}

                             {isApproved && (
                                <div className="col-span-2 flex flex-col md:flex-row gap-6">
                                   <Button
                                      onClick={() => setIsDispatchModalOpen(true)}
                                      className="h-24 rounded-[2.5rem] bg-blue-600 hover:bg-blue-500 text-white font-black text-[18px] uppercase tracking-[0.2em] flex-1 flex items-center justify-center gap-6 shadow-[0_15px_45px_rgba(37,99,235,0.4)] transition-all active:scale-95 border-b-[6px] border-blue-800"
                                   >
                                      <Truck className="w-8 h-8 animate-pulse" />
                                      Initialize Dispatch
                                   </Button>
                                   <Button
                                      onClick={() => setIsRejectModalOpen(true)}
                                      variant="outline"
                                      className="h-24 rounded-[2.5rem] border-white/10 text-white/30 hover:text-white hover:border-white/20 hover:bg-white/5 font-black text-[13px] uppercase tracking-widest px-10 transition-all"
                                   >
                                      Cancel Process
                                   </Button>
                                </div>
                             )}
                          </div>
                       </div>
                    </Card>
                 )}
              </div>

              {/* Right Wing - Merchant Intel */}
              <div className="lg:col-span-4 space-y-10">
                 
                 {/* Dealer Profile Dossier */}
                 <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden border border-gray-50/50">
                    <div className="p-10">
                        <div className="flex items-center gap-5 mb-10">
                           <div className="w-14 h-14 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                              <User className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="text-xl font-black text-gray-900 tracking-tight">Dealer Persona</h3>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Partner Intelligence</p>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-indigo-100 transition-colors">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Corporate Identity</p>
                              <h4 className="text-[17px] font-black text-gray-900 mb-1">{request.dealerName || request.dealer_name || "Unknown Merchant"}</h4>
                              <p className="text-[12px] text-indigo-600 font-black uppercase tracking-wider">{request.dealerUsername || "@merchant_id"}</p>
                           </div>

                           <div className="flex items-center gap-6 px-2">
                              <div className="flex flex-col flex-1">
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Phone className="w-3 h-3" /> Secure Line
                                 </p>
                                 <p className="text-[15px] font-black text-gray-900 tracking-tight">{request.contactPhone || "+91 00000 00000"}</p>
                              </div>
                              <div className="w-px h-10 bg-gray-100"></div>
                              <div className="flex flex-col flex-1">
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Layers className="w-3 h-3" /> Dealer ID
                                 </p>
                                 <p className="text-[15px] font-black text-gray-900 tracking-tight">#{request.dealerId || "N/A"}</p>
                              </div>
                           </div>

                           <div className="p-6 rounded-3xl bg-indigo-50/40 border border-indigo-100/50 group">
                              <div className="flex items-center gap-3 mb-3">
                                 <MapPin className="w-5 h-5 text-indigo-600" />
                                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Deployment Base</p>
                              </div>
                              <p className="text-sm font-bold text-indigo-900 leading-relaxed">
                                 {request.dealerAddress || request.location || "Central Distribution Hub"}
                              </p>
                           </div>
                        </div>
                    </div>
                 </Card>

                 {/* Logistics Terminal Card */}
                 {(isDispatched || isReceived || request.trackingId) && (
                    <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden p-10 border-l-[8px] border-l-blue-600 relative">
                        <div className="flex items-center gap-5 mb-10">
                           <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                              <Truck className="w-7 h-7" />
                           </div>
                           <div>
                              <h3 className="text-xl font-black text-gray-900 tracking-tight">Logistics Hub</h3>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Data</p>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <div className="flex flex-col gap-2">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Merchant Provider</p>
                              <p className="text-xl font-black text-gray-900 tracking-tight leading-none">{request.courierName || "Standard Dispatch"}</p>
                           </div>
                           
                           <div className="p-8 rounded-[2.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/30 group">
                              <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.25em] mb-2">Registry Tracking ID</p>
                              <p className="text-2xl font-black tracking-tighter group-hover:tracking-widest transition-all duration-500">{request.trackingId || "PENDING_SYNC"}</p>
                           </div>

                           <div className="space-y-4 pt-2">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                 <Navigation className="w-3.5 h-3.5" /> Destination Terminal
                              </p>
                              <p className="text-[13px] font-bold text-gray-600 leading-relaxed pl-1">
                                 {request.dispatchAddress || "N/A"}<br/>
                                 <span className="text-gray-400 font-extrabold">{request.dispatchCity}, {request.dispatchState} {request.pincode ?`- ${request.pincode}` : ''}</span>
                              </p>
                           </div>
                        </div>
                    </Card>
                 )}

                 {/* Operational Knowledge Base */}
                 <div className="p-8 rounded-[3rem] bg-gray-100/40 border border-gray-200 backdrop-blur-sm shadow-inner group">
                    <div className="flex items-start gap-5">
                       <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shrink-0 mt-0.5 shadow-lg group-hover:scale-110 transition-transform">
                          <Info className="w-4 h-4" />
                       </div>
                       <div>
                          <h4 className="text-[15px] font-black text-gray-900 tracking-tight mb-2 uppercase tracking-wider">Protocol Guidance</h4>
                          <p className="text-[13px] font-bold text-gray-500 leading-loose opacity-80">
                             The "Dispatched" phase marks the transition of liability to the courier. Real-time updates depend on API synchronization from the logistics terminal.
                          </p>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      </div>

      {/* Modern Dispatch Terminal Modal */}
      <Dialog open={isDispatchModalOpen} onOpenChange={setIsDispatchModalOpen}>
        <DialogContent className="rounded-[50px] border-none p-12 max-w-lg bg-white overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-[80px] opacity-60"></div>
            
            <DialogHeader className="relative z-10 text-left">
                <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-200">
                   <Truck className="w-10 h-10" />
                </div>
                <DialogTitle className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-3">Launch Shipment</DialogTitle>
                <DialogDescription className="font-bold text-[15px] text-gray-400 leading-relaxed">
                    Capture the shipment manifest for <span className="text-blue-600 font-black">#{request.request_id || request.requestId}</span> to continue the chain of custody.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                       <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Merchant Service</p>
                       <Input 
                           value={courierName}
                           onChange={(e) => setCourierName(e.target.value)}
                           placeholder="e.g. BlueDart Express"
                           className="h-16 rounded-3xl border-gray-100 bg-gray-50/50 font-black focus:ring-blue-500 text-gray-900 px-6"
                       />
                   </div>
                   <div className="space-y-3">
                       <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Registry Tracking ID</p>
                       <Input 
                           value={trackingId}
                           onChange={(e) => setTrackingId(e.target.value)}
                           placeholder="AWB-77889901"
                           className="h-16 rounded-3xl border-gray-100 bg-gray-50/50 font-black focus:ring-blue-500 text-gray-900 px-6"
                       />
                   </div>
                </div>
                <div className="space-y-3">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Manifest (Optional)</p>
                    <textarea 
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Add logistical constraints or special handling notes..."
                        className="w-full h-32 rounded-[2.5rem] border border-gray-100 bg-gray-50/50 p-6 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all text-gray-900 resize-none"
                    />
                </div>
            </div>

            <DialogFooter className="flex flex-col gap-4 sm:flex-col relative z-10 pt-4">
                <Button 
                    onClick={handleDispatch}
                    disabled={isProcessing || !courierName || !trackingId}
                    className="h-20 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black w-full text-[16px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 transition-all active:scale-95 border-b-6 border-blue-900"
                >
                    {isProcessing ? "Persisting Data..." : "Finalize & Launch"}
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="h-16 rounded-3xl font-black text-gray-400 w-full text-[13px] uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                    Return to Terminal
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Precision Rejection Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="rounded-[50px] border-none p-12 max-w-md bg-white overflow-hidden shadow-[0_30px_100px_rgba(220,38,38,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 blur-[80px] opacity-60"></div>
            
            <DialogHeader className="relative z-10 text-left">
                <div className="w-20 h-20 rounded-[2rem] bg-red-500 flex items-center justify-center text-white mb-8 shadow-2xl shadow-red-100">
                   <XCircle className="w-10 h-10" />
                </div>
                <DialogTitle className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-3">Authorize Decline</DialogTitle>
                <DialogDescription className="font-bold text-[15px] text-gray-400 leading-relaxed">
                    Provide a forensic justification for declining <span className="text-red-600 font-black">#{request.request_id || request.requestId}</span>.
                </DialogDescription>
            </DialogHeader>

            <div className="py-8 relative z-10">
                <textarea 
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Provide specific reasons: Supply chain deficit, Merchant verification failure, etc..."
                    className="w-full h-48 rounded-[2.5rem] border border-gray-100 bg-gray-50/50 p-8 font-bold text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition-all text-gray-900 resize-none shadow-inner"
                />
            </div>

            <DialogFooter className="flex flex-col gap-4 sm:flex-col relative z-10 pt-4">
                <Button 
                    onClick={handleReject}
                    disabled={isProcessing || !rejectReason}
                    className="h-20 rounded-[2rem] bg-red-500 hover:bg-red-600 text-white font-black w-full text-[16px] uppercase tracking-[0.2em] shadow-2xl shadow-red-100 transition-all active:scale-95 border-b-6 border-red-900"
                >
                    {isProcessing ? "Processing Decline..." : "Decline Permanently"}
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => setIsRejectModalOpen(false)}
                    className="h-16 rounded-3xl font-black text-gray-400 w-full text-[13px] uppercase tracking-widest hover:text-gray-900"
                >
                    Back to Safety
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function TimelineItem({ icon, label, date, active, color }: { icon: any, label: string, date?: string, active: boolean, color: string }) {
   const colorMap: any = {
      amber: "bg-amber-500 text-white",
      emerald: "bg-emerald-500 text-white",
      red: "bg-red-500 text-white",
      blue: "bg-blue-500 text-white",
      violet: "bg-violet-500 text-white",
      gray: "bg-gray-100 text-gray-400"
   };

   return (
      <div className={`flex items-start gap-8 transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-40'}`}>
         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg z-10 transition-transform ${active ? colorMap[color] : colorMap['gray']} ${active ? 'scale-100' : 'scale-90 hover:scale-100'}`}>
            {icon}
         </div>
         <div className="flex flex-col flex-1 pt-1">
            <h5 className={`text-[12px] font-black uppercase tracking-[0.2em] mb-1.5 ${active ? 'text-gray-900' : 'text-gray-400'}`}>
               {label}
            </h5>
            <p className={`text-[16px] font-black tracking-tight ${active ? 'text-gray-900' : 'text-gray-300'}`}>
               {date || (active ? 'In Progress' : 'Pending Lifecycle')}
            </p>
         </div>
      </div>
   );
}
