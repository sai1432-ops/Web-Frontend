import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, ShoppingCart, 
  Package, Box, FileText,
  AlertTriangle, CheckCircle2,
  Minus, Plus, Clock, TrendingUp
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { RetrofitClient } from '../../network/RetrofitClient';
import { toast } from 'sonner';

export function RequestNewStock() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [brushQty, setBrushQty] = useState(0);
  const [pasteQty, setPasteQty] = useState(0);
  const [iecQty, setIecQty] = useState(0);
  const [totalKits, setTotalKits] = useState(0);
  const [urgency, setUrgency] = useState<"Normal" | "Urgent">("Normal");

  const DealerGreen = "#10B981";
  const DeepGreen = "#064E3B";

  const updateQty = (type: string, delta: number) => {
    if (type === 'brush') setBrushQty(Math.max(0, brushQty + delta));
    if (type === 'paste') setPasteQty(Math.max(0, pasteQty + delta));
    if (type === 'iec') setIecQty(Math.max(0, iecQty + delta));
    setTotalKits(0); // Reset master kit input if individual items are touched
  };

  const syncTotalKits = (delta: number) => {
    const newKits = Math.max(0, totalKits + delta);
    setTotalKits(newKits);
    setBrushQty(newKits);
    setPasteQty(newKits);
    setIecQty(newKits);
  };
  const handleSubmit = async () => {
    if (brushQty + pasteQty + iecQty === 0) {
      toast.error("Please specify at least one item quantity");
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const dealerId = currentUser.dealer_id || currentUser.id || 1;

      const response = await RetrofitClient.apiService.submitStockRequest({
        dealerId,
        brushQty,
        pasteQty,
        iecQty,
        totalKits: brushQty, // Since it's a 1:1:1 system
        urgency
      });

      if (response.isSuccessful) {
        toast.success("Request submitted successfully");
        navigate('/dealer/stock-request-success', { 
          state: { 
            requestId: response.body?.requestId || "REQ-98765",
            brushQty,
            pasteQty,
            iecQty,
            urgency
          } 
        });
      } else {
        toast.error(response.errorBody?.string() || "Failed to submit request. Please try again.");
      }
    } catch (e) {
      toast.error("Network error during submission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout role="dealer" title="Inventory Hub">
      <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
        
        {/* Dynamic Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-500 hover:text-[#10B981] hover:border-[#10B981] hover:shadow-lg transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Request New Stock</h1>
              <p className="text-sm font-medium text-gray-500">Restock your inventory to maintain service levels.</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            <StatSmall label="Active Requests" value="2" icon={<Clock className="w-4 h-4 text-amber-500" />} />
            <StatSmall label="Last Restock" value="3 Days ago" icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} />
          </div>
        </div>

        {/* Master Kit Entry Section */}
        <div 
          className="relative overflow-hidden rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-[#0DBE72]"
          style={{ background: `linear-gradient(135deg, ${DealerGreen}, ${DeepGreen})` }}
        >
          <div className="relative z-10 flex flex-col gap-2 max-w-lg">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit text-[10px] font-black uppercase tracking-widest border border-white/20">
              <ShoppingCart className="w-3 h-3" />
              Quick Fill
            </div>
            <h2 className="text-3xl font-black tracking-tight">Bulk Kit Ordering</h2>
            <p className="text-emerald-50 font-medium opacity-80">
              Enter the total number of complete 1:1:1 kits you need. All component quantities will update automatically.
            </p>
          </div>
          
          <div className="relative z-10 p-2 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-2xl flex items-center gap-4">
            <button 
                onClick={() => syncTotalKits(-10)}
                className="w-14 h-14 rounded-[1.8rem] bg-white text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-all active:scale-90 shadow-xl"
            >
                <Minus className="w-6 h-6" />
            </button>
            <div className="text-center px-4 min-w-[120px]">
                <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">TOTAL KITS</p>
                <p className="text-5xl font-black tabular-nums">{totalKits}</p>
            </div>
            <button 
                onClick={() => syncTotalKits(10)}
                className="w-14 h-14 rounded-[1.8rem] bg-white text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-all active:scale-90 shadow-xl"
            >
                <Plus className="w-6 h-6" />
            </button>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/40 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          
          {/* Left Column: Selection */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 italic">
                Fine-tune Quantities
                <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></div>
              </h3>
              <p className="text-xs font-bold text-gray-400">Individual component adjustments</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ItemCard 
                title="Toothbrushes" 
                subtitle="Adult Soft Bristles" 
                value={brushQty} 
                onUpdate={(d: number) => updateQty('brush', d)} 
                icon={<Package className="w-8 h-8" />}
                color="#10B981"
              />
              <ItemCard 
                title="Toothpaste" 
                subtitle="Anti-Cavity Fluoride" 
                value={pasteQty} 
                onUpdate={(d: number) => updateQty('paste', d)} 
                icon={<Box className="w-8 h-8" />}
                color="#0EA5E9"
              />
              <ItemCard 
                title="IEC Materials" 
                subtitle="Informational Flyers" 
                value={iecQty} 
                onUpdate={(d: number) => updateQty('iec', d)} 
                icon={<FileText className="w-8 h-8" />}
                color="#F59E0B"
              />
            </div>

            {/* Quick Kit Composition Tip */}
            <Card className="border-none shadow-xl rounded-3xl bg-gray-50 overflow-hidden flex flex-col md:flex-row">
              <div className="p-8 flex-1 space-y-4">
                <div className="flex items-center gap-3 text-gray-900">
                  <Package className="w-6 h-6 text-[#10B981]" />
                  <h4 className="text-lg font-black">Current Package Estimate</h4>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  The quantities selected above result in the following number of complete kits.
                </p>
                <div className="flex gap-4 pt-2">
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-400"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> 1 Brush</div>
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-400"><div className="w-2 h-2 rounded-full bg-sky-400"></div> 1 Paste</div>
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-400"><div className="w-2 h-2 rounded-full bg-amber-400"></div> 1 Flyer</div>
                </div>
              </div>
              <div className="md:w-48 bg-white border-l border-gray-100 flex items-center justify-center p-8">
                <div className="text-center">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">TOTAL KITS</p>
                   <p className="text-4xl font-black text-[#10B981]">{Math.min(brushQty, pasteQty, iecQty)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Checkout Summary */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="sticky top-8 border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden p-8 space-y-8 flex flex-col border-t-4 border-[#10B981]">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em]">REQUEST SUMMARY</p>
                <h3 className="text-2xl font-black text-gray-900">Checkout</h3>
              </div>

              <div className="space-y-4 py-4 border-y border-gray-50">
                <SummaryItem label="Toothbrushes" value={brushQty} />
                <SummaryItem label="Toothpaste" value={pasteQty} />
                <SummaryItem label="IEC Materials" value={iecQty} />
                <div className="pt-2 flex justify-between items-center text-lg font-black text-gray-900 border-t border-gray-100">
                  <span>Total Items</span>
                  <span>{brushQty + pasteQty + iecQty}</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Urgency Level</label>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setUrgency("Normal")}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${urgency === 'Normal' ? 'bg-emerald-50 border-emerald-400 shadow-lg' : 'bg-white border-gray-100 text-gray-400 grayscale'}`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-5 h-5 ${urgency === 'Normal' ? 'text-emerald-500' : 'text-gray-200'}`} />
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-sm">Routine Top-up</p>
                        <p className="text-[10px] font-medium opacity-60">Standard processing</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setUrgency("Urgent")}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${urgency === 'Urgent' ? 'bg-red-50 border-red-400 shadow-lg' : 'bg-white border-gray-100 text-gray-400 grayscale'}`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-5 h-5 ${urgency === 'Urgent' ? 'text-red-500' : 'text-gray-200'}`} />
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-sm">Critical (Stock Out)</p>
                        <p className="text-[10px] font-medium opacity-60">Express fulfillment</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-16 rounded-2xl bg-[#10B981] hover:bg-[#064E3B] text-white text-lg font-black shadow-xl shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    SUBMIT REQUEST
                  </>
                )}
              </Button>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

function ItemCard({ title, subtitle, value, onUpdate, icon, color }: any) {
  return (
    <Card className="group p-6 rounded-[2rem] border border-gray-100 bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
      <div className="relative z-10 flex flex-col h-full gap-6">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500"
          style={{ background: color }}
        >
          {icon}
        </div>
        
        <div className="space-y-1">
          <h4 className="text-lg font-black text-gray-900">{title}</h4>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{subtitle}</p>
        </div>

        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 group-hover:bg-gray-100 transition-colors">
          <button 
            type="button"
            onClick={() => onUpdate(-10)}
            className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-lg transition-all active:scale-90"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <span className="text-2xl font-black text-gray-900 tabular-nums">{value}</span>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">PCS</p>
          </div>

          <button 
            type="button"
            onClick={() => onUpdate(10)}
            className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-emerald-500 hover:shadow-lg transition-all active:scale-90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Dynamic Hover Background */}
      <div 
        className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12"
        style={{ color: color }}
      >
        {icon}
      </div>
    </Card>
  );
}

function SummaryItem({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex justify-between items-center text-sm font-medium">
      <span className="text-gray-400 italic">{label}</span>
      <span className="text-gray-900 font-bold tabular-nums">{value} pcs</span>
    </div>
  );
}

function StatSmall({ label, value, icon }: any) {
  return (
    <div className="flex items-center gap-3 py-2 px-4 bg-white/50 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
        <p className="text-sm font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}