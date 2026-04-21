import { useLocation, useNavigate } from 'react-router';
import { CheckCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function StockRequestSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    requestId = `REQ-${Date.now()}`, 
    brushQty = 0, 
    pasteQty = 0, 
    iecQty = 0, 
    urgency = "Normal" 
  } = location.state || {};

  const DealerGreen = "#10B981";
  const totalItems = brushQty + pasteQty + iecQty;

  return (
    <DashboardLayout role="dealer" title="">
      <div className="flex flex-col min-h-screen bg-[#F4F7FB] -m-6 sm:-m-8 pb-32">
        {/* Immersive Background Hero - 380px per Spec */}
        <div 
          className="absolute top-0 left-0 w-full h-[380px] flex items-center justify-center z-0"
          style={{ background: `linear-gradient(to bottom, ${DealerGreen}, #003322)` }}
        >
            {/* Success Visual */}
            <div className="w-[130px] h-[130px] rounded-full bg-white flex items-center justify-center shadow-[0_24px_50px_rgba(0,0,0,0.4)]">
                <CheckCircle className="w-14 h-14 text-[#10B981]" strokeWidth={2.5} />
            </div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen px-6 sm:px-8" style={{ paddingTop: '280px' }}>
            <Card className="w-full rounded-[24px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)] border-none">
                <div className="flex flex-col items-center p-8">
                    <h2 className="text-[24px] font-extrabold text-gray-900 mb-2">Request Confirmed!</h2>
                    <p className="text-[14px] text-gray-500 text-center leading-relaxed mb-8">
                        Your request has been securely forwarded to the District Warehouse for review.
                    </p>

                    <div className="w-full h-px bg-[#EEEEEE] mb-6"></div>

                    {/* Request details */}
                    <div className="w-full space-y-4">
                        <RequestDetailItem 
                            label="Request ID" 
                            value={requestId} 
                        />
                        <RequestDetailItem 
                            label="Priority Status" 
                            value={urgency} 
                            valueColor={urgency === "Urgent" ? "#D32F2F" : DealerGreen} 
                        />
                        <RequestDetailItem 
                            label="Total Items" 
                            value={`${totalItems} Units`} 
                        />
                    </div>
                </div>
            </Card>

            <div className="mt-auto pt-10">
                <Button 
                    onClick={() => navigate('/dealer/stock-management')}
                    className="w-full h-[56px] rounded-xl bg-[#10B981] hover:bg-[#0EA5E9]/90 shadow-[0_8px_16px_rgba(16,185,129,0.3)] text-white text-[16px] font-bold transition-all"
                >
                    Back to Inventory
                </Button>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function RequestDetailItem({ label, value, valueColor = "#111827" }: { 
    label: string, 
    value: string, 
    valueColor?: string 
}) {
    return (
        <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-medium text-gray-500">{label}</span>
            <span className="text-[14px] font-bold" style={{ color: valueColor }}>{value}</span>
        </div>
    );
}