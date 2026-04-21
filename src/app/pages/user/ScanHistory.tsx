import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  Calendar,
  ChevronRight,
  Activity,
  History,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { InitialsAvatar } from '../../components/ui/InitialsAvatar';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { MemberAiReport, FamilyMemberResponse } from '../../network/RetrofitClient';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ScanHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState<MemberAiReport[]>([]);
  const [member, setMember] = useState<FamilyMemberResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  const loadData = async (memberId: number) => {
    setIsLoading(true);
    try {
      // Fetch member info to show in header - assuming userId 1 for mock purposes
      const familyResponse = await RetrofitClient.apiService.getFamilyMembers(1);
      if (familyResponse.isSuccessful && familyResponse.body) {
        const found = familyResponse.body.find(m => m.id === memberId);
        if (found) setMember(found);
      }

      // Fetch reports
      const reportMemberId = memberId === 0 ? 0 : memberId;
      const response = await RetrofitClient.apiService.getMemberAiReports(reportMemberId);
      if (response.isSuccessful && response.body) {
        setReports(response.body);
      } else {
        toast.error("Failed to load scan history");
      }
    } catch (e) {
      toast.error("Network error accessing scan history");
    } finally {
      setIsLoading(false);
    }
  };

  const PrimaryBlue = "#1E3A8A";
  const CyanGradient = "#3B82F6";

  return (
    <DashboardLayout role="user" title="">
      <div className="flex flex-col min-h-screen bg-[#F8FBFF] -m-6 sm:-m-8 pb-32">
        {/* Gradient Header - Premium NHM Theme */}
        <div 
          className="pt-12 pb-24 px-8 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${PrimaryBlue}, ${CyanGradient})` }}
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24 blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Health Timeline</p>
                    <h1 className="text-3xl font-black text-white tracking-tighter">Scan History</h1>
                </div>
            </div>
        </div>

        {/* Member Header Card Overlay */}
        <div className="px-8 -mt-16 relative z-20">
            <Card className="p-5 rounded-[2rem] border-none shadow-xl shadow-blue-900/10 flex items-center gap-4 bg-white">
                <InitialsAvatar 
                    name={member?.memberName || "Member"} 
                    className="w-14 h-14 ring-4 ring-blue-50" 
                />
                <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 leading-tight">{member?.memberName || "Retrieving..."}</h3>
                    <div className="flex items-center gap-2 mt-1 text-gray-400">
                        <History className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold tracking-tight">{reports.length} assessment records</span>
                    </div>
                </div>
            </Card>
        </div>

        {/* Chronological List of Reports */}
        <div className="px-8 mt-10 space-y-4">
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Synchronizing Archive...</p>
                </div>
            ) : reports.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 flex flex-col items-center justify-center text-center shadow-xl shadow-gray-100 border border-gray-50/50">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">No history found</h3>
                    <p className="text-sm font-bold text-gray-400 mt-2 max-w-[200px]">Perform your first AI Teeth Scan to see records here.</p>
                </div>
            ) : (
                reports.map((report, idx) => (
                    <HistoryItemCard 
                        key={idx} 
                        report={report} 
                        onClick={() => navigate('/user/family/last-scan', { 
                            state: { 
                                report: {
                                    memberId: report.memberId,
                                    memberName: member?.memberName || "Member",
                                    image: report.imagePath,
                                    timestamp: format(new Date(report.createdAt), 'dd MMM yyyy'),
                                    reportId: report.aiResult.reportId,
                                    riskLevel: report.riskLevel,
                                    detections: report.aiResult.detections
                                } 
                            } 
                        })} 
                    />
                ))
            )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function HistoryItemCard({ report, onClick }: { report: MemberAiReport, onClick: () => void }) {
    const dateObj = new Date(report.createdAt);
    const formattedDate = format(dateObj, 'dd MMM yyyy');
    const formattedTime = format(dateObj, 'hh:mm a');
    
    const riskStyles = {
        HIGH: "bg-red-50 text-red-600 border-red-100",
        MEDIUM: "bg-orange-50 text-orange-600 border-orange-100",
        LOW: "bg-green-50 text-green-600 border-green-100"
    }[report.riskLevel] || "bg-gray-50 text-gray-500 border-gray-100";

    const topFinding = report.aiResult.detections[0]?.detectedClass || "Healthy";

    return (
        <Card 
            onClick={onClick}
            className="p-5 rounded-[2rem] border-none shadow-lg shadow-gray-100 bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden flex items-center justify-center relative shadow-inner border border-gray-100/50">
                    {report.imagePath ? (
                        <img src={report.imagePath} alt="AI Scan Archive" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-gray-200" />
                    )}
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-300" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{formattedDate}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest border ${riskStyles}`}>
                            {report.riskLevel}
                        </span>
                    </div>
                    <h4 className="text-[17px] font-black text-gray-900 tracking-tight leading-none mb-1.5">
                        {topFinding}
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400">Assessment at {formattedTime}</p>
                </div>

                <div className="w-10 h-10 rounded-full border border-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-500 transition-all">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-gray-50/50 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">View Detailed Report</span>
            </div>
        </Card>
    );
}
