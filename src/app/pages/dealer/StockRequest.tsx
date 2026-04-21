import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Package, Clock, CheckCircle, Truck, XCircle, ShoppingCart, Box, FileText, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { RetrofitClient, type AdminStockRequestDto } from '../../network/RetrofitClient';
import { toast } from 'sonner';

export function StockRequest() {
  const [requests, setRequests] = useState<AdminStockRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [kitQty, setKitQty] = useState('0');
  const [urgency, setUrgency] = useState('Routine'); // 'Routine' or 'Critical'

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const dealerId = currentUser.dealer_id || currentUser.id || 1;

  useEffect(() => {
    loadRequests();
  }, [dealerId]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.getAdminStockRequests();
      if (response.isSuccessful && response.body) {
        // Filter for this dealer
        const myRequests = response.body.filter(r => r.dealerId === dealerId);
        setRequests(myRequests);
      }
    } catch (e) {
      toast.error("Failed to load stock requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(kitQty);
    if (!qty || qty <= 0) {
      toast.error("Please specify a valid quantity of kits");
      return;
    }

    setIsSubmitting(true);
    try {
      // Map "Kits" to backend quantities (1:1:1 ratio)
      // Maintaining the backend integrity as requested.
      const response = await RetrofitClient.apiService.submitStockRequest({
        dealerId,
        brushQty: qty,
        pasteQty: qty,
        iecQty: qty,
        totalKits: qty, // Mapping kits to total_kits for backend
        urgency: urgency === 'Critical' ? 'Urgent' : 'Normal' 
      });

      if (response.isSuccessful) {
        toast.success("Stock request submitted successfully!");
        setKitQty('0');
        setUrgency('Routine');
        loadRequests();
      } else {
        toast.error(response.errorBody?.string() || "Failed to submit request");
      }
    } catch (e) {
      toast.error("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status.toUpperCase() === 'PENDING').length,
    approved: requests.filter(r => r.status.toUpperCase() === 'APPROVED').length,
    delivered: requests.filter(r => r.status.toUpperCase() === 'RECEIVED' || r.status.toUpperCase() === 'DELIVERED').length
  };

  return (
    <DashboardLayout role="dealer" title="Request New Stock">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* Top Section: Inventory Summary Card */}
        <Card className="p-8 border-none shadow-xl bg-gradient-to-br from-[#064e3b] to-[#065f46] text-white rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingCart className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <ShoppingCart className="w-8 h-8 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Inventory Summary</h2>
              <p className="text-emerald-100/80 font-medium">Current stock level requires topping up.</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Request Form */}
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <h3 className="text-xl font-black text-gray-900 px-2 tracking-tight">Request Quantity</h3>
              <p className="text-sm font-medium text-gray-400 px-2">Specify how many complete kits you need.</p>
              
              <Card className="p-8 border-none shadow-lg bg-white rounded-[2rem] flex items-center justify-between group hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Box className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900">Complete Kits</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">All items included</p>
                  </div>
                </div>
                <div className="w-32">
                  <Input 
                    type="number" 
                    value={kitQty}
                    onChange={e => setKitQty(e.target.value)}
                    className="h-16 text-2xl font-black text-center border-2 border-gray-100 focus:border-emerald-500 rounded-2xl bg-gray-50/50"
                  />
                </div>
              </Card>
            </section>

            <section className="space-y-4">
              <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-8">Kit Composition (1:1:1)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                      <Box className="w-5 h-5 text-emerald-700" />
                    </div>
                    <span className="text-sm font-black text-gray-900">1 Brush</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 text-center border-x border-gray-100">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                      <Box className="w-5 h-5 text-emerald-700" />
                    </div>
                    <span className="text-sm font-black text-gray-900">1 Paste</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                      <FileText className="w-5 h-5 text-emerald-700" />
                    </div>
                    <span className="text-sm font-black text-gray-900">1 Flyer</span>
                  </div>
                </div>
              </Card>
            </section>
          </div>

          {/* Right Column: Urgency & Submit */}
          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-xl font-black text-gray-900 px-2 tracking-tight">Urgency Level</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setUrgency('Routine')}
                  className={`p-6 rounded-[2rem] font-black text-sm transition-all duration-300 border-2 ${
                    urgency === 'Routine' 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md' 
                      : 'bg-white border-transparent text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  Routine
                </button>
                <button 
                  onClick={() => setUrgency('Critical')}
                  className={`p-6 rounded-[2rem] font-black text-sm transition-all duration-300 border-2 ${
                    urgency === 'Critical' 
                      ? 'bg-red-50 border-red-500 text-red-700 shadow-md' 
                      : 'bg-white border-transparent text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  Critical
                </button>
              </div>
            </section>

            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-20 rounded-[2rem] bg-[#2d5a57] hover:bg-[#244845] text-white text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  Submit Stock Request
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Bottom Section: History */}
        <div className="space-y-6 pt-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-gray-900 tracking-tight text-emerald-950">Recent History</h3>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-emerald-50 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest">{stats.pending} Pending</div>
              <div className="px-3 py-1 bg-blue-50 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">{stats.approved} Active</div>
            </div>
          </div>

          <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
            {isLoading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Records...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-24 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6">
                  <Package className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">No Requests Yet</h3>
                <p className="text-sm font-bold text-gray-400">Your historical stock requests will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-transparent border-gray-100">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest px-8 h-16">ID</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest h-16">Kits Requested</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest h-16">Request Date</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest h-16">Status</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-right px-8 h-16">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.slice(0, 5).map((request) => {
                      const status = request.status.toUpperCase();
                      const isDelivered = status === 'RECEIVED' || status === 'DELIVERED';
                      const isApproved = status === 'APPROVED';
                      const isDispatched = status === 'DISPATCHED';
                      const isPending = status === 'PENDING';
                      const isRejected = status === 'REJECTED';

                      return (
                        <TableRow key={request.id} className="hover:bg-gray-50/50 border-gray-100">
                          <TableCell className="font-black text-sm text-gray-400 px-8 py-6">
                            #{request.requestId}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <Box className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-gray-900">{request.quantity} Kits</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Complete Unit</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-[11px] font-bold text-gray-500">
                            {request.requestDate ? new Date(request.requestDate).toLocaleDateString(undefined, {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest
                              ${isDelivered ? 'bg-blue-50 text-blue-600' : 
                                isApproved ? 'bg-emerald-50 text-emerald-600' :
                                isDispatched ? 'bg-indigo-50 text-indigo-600' :
                                isRejected ? 'bg-red-50 text-red-600' :
                                'bg-orange-50 text-orange-600'}`}>
                              {isPending && <Clock className="w-3.5 h-3.5" />}
                              {isApproved && <CheckCircle className="w-3.5 h-3.5" />}
                              {isDispatched && <Truck className="w-3.5 h-3.5" />}
                              {isDelivered && <Package className="w-3.5 h-3.5" />}
                              {isRejected && <XCircle className="w-3.5 h-3.5" />}
                              {request.status}
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <Button variant="ghost" className="text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
