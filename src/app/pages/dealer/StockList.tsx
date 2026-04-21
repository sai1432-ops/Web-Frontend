import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Brush as BrushIcon, 
  Zap, 
  FileText, 
  Package, 
  History,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { StockItem } from '../../network/RetrofitClient';

export function DealerStockList() {
  const navigate = useNavigate();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const dealerId = currentUser.dealer_id || currentUser.id || 0;

  const DealerGreen = "#047857";

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await RetrofitClient.apiService.getDealerStockDetailed(dealerId);
        setStockItems(data);
      } catch (error) {
        console.error("Failed to fetch stock:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStock();
  }, [dealerId]);

  return (
    <DashboardLayout role="dealer" title="">
      <div className="min-h-[calc(100vh-80px)] bg-[#F8F9FA] relative flex flex-col items-center pb-24 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-xl lg:rounded-tl-2xl overflow-hidden shadow-sm border border-gray-100/50">
        {/* Top Gradient */}
        <div 
          className="absolute top-0 left-0 right-0 h-[220px] z-0"
          style={{ 
            background: `linear-gradient(to bottom, ${DealerGreen}, #F8F9FA00)` 
          }}
        ></div>

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-2xl flex items-center px-6 py-8 text-white">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full bg-white/10 hover:bg-white/20 text-white mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-black tracking-tight uppercase">Stock Details</h1>
      </header>

      <main className="relative z-10 w-full max-w-lg px-6 pb-12 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: DealerGreen }} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading inventory...</p>
          </div>
        ) : stockItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-[2rem] flex items-center justify-center text-gray-400">
              <Package className="w-10 h-10" />
            </div>
            <p className="text-sm font-bold text-gray-400">No detailed stock records found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stockItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <StockDetailCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
      </div>
    </DashboardLayout>
  );
}

function StockDetailCard({ item }: { item: StockItem }) {
  const visuals = getItemVisuals(item.itemName);
  const statusColor = getStatusColor(item.status);
  const DealerGreen = "#047857";

  return (
    <Card className="p-5 rounded-[1.5rem] border-none shadow-xl shadow-black/5 bg-white overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div 
            className="w-12 h-12 rounded-[1rem] flex items-center justify-center shrink-0 shadow-sm"
            style={{ backgroundColor: visuals.bgColor, color: DealerGreen }}
          >
            {visuals.icon}
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight leading-tight">
              {item.itemName.replace(/_/g, ' ')}
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
              Category: {visuals.category}
            </span>
          </div>
        </div>

        <div 
          className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border"
          style={{ 
            backgroundColor: `${statusColor}10`, 
            borderColor: `${statusColor}20`, 
            color: statusColor 
          }}
        >
          {item.status}
        </div>
      </div>

      <div className="h-px bg-gray-50 mb-4"></div>

      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Stock Quantity</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black" style={{ color: DealerGreen }}>{item.quantity}</span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Units</span>
          </div>
        </div>

        {item.requestedQuantity !== undefined && item.requestedQuantity > 0 && (
          <div className="text-right space-y-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Requested</span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xl font-black text-blue-600">{item.requestedQuantity}</span>
              <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Units</span>
            </div>
          </div>
        )}
      </div>

      {item.requestedAt && (
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2">
          <History className="w-3 h-3 text-gray-300" />
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Last updated: {item.requestedAt}
          </span>
        </div>
      )}
    </Card>
  );
}

function getItemVisuals(name: string) {
  const upperName = name.trim().toUpperCase();
  if (upperName.includes("BRUSH")) {
    return { 
      category: "Oral Care", 
      icon: <BrushIcon className="w-6 h-6" />, 
      bgColor: "#ECFDF5" 
    };
  }
  if (upperName.includes("PASTE")) {
    return { 
      category: "Oral Care", 
      icon: <Zap className="w-6 h-6" />, 
      bgColor: "#FEF3C7" 
    };
  }
  if (upperName.includes("FLYER") || upperName.includes("IEC")) {
    return { 
      category: "Education", 
      icon: <FileText className="w-6 h-6" />, 
      bgColor: "#F5F3FF" 
    };
  }
  return { 
    category: "General", 
    icon: <Package className="w-6 h-6" />, 
    bgColor: "#F9FAFB" 
  };
}

function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (s === 'pending') return "#D97706";
  if (['approved', 'delivered', 'active'].includes(s)) return "#059669";
  if (['dispatched', 'shipped'].includes(s)) return "#2563EB";
  if (['rejected', 'cancelled'].includes(s)) return "#DC2626";
  return "#047857";
}
