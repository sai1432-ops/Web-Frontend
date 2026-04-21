import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  Scan, 
  ArrowRight,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { InitialsAvatar } from '../../components/ui/InitialsAvatar';
import { DiseaseFindingCard } from '../../components/cards/DiseaseFindingCard';
import { RetrofitClient } from '../../network/RetrofitClient';
import type { MemberAiReport, FamilyMemberResponse } from '../../network/RetrofitClient';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { SessionManager } from '../../utils/SessionManager';

export default function MemberHealthStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<FamilyMemberResponse | null>(null);
  const [latestReport, setLatestReport] = useState<MemberAiReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  const loadData = async (memberId: number) => {
    setIsLoading(true);
    const userId = SessionManager.getUserId();
    if (!userId) {
      toast.error("Session expired. Please login again.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Fetch member info
      const familyResponse = await RetrofitClient.apiService.getFamilyMembers(userId);
      if (familyResponse.isSuccessful && familyResponse.body) {
        const found = familyResponse.body.find(m => m.id === memberId);
        if (found) {
          setMember(found);
        } else if (memberId === userId) {
          // Fallback for primary user
          setMember({
            id: userId,
            memberName: SessionManager.getUserName() || 'Self',
            relation: 'Self',
            age: 0,
            score: 0,
            riskLevel: 'Low'
          });
        }
      }

      // Fetch reports and take the latest assessment
      const reportMemberId = memberId === userId ? 0 : memberId;
      const reportsResponse = await RetrofitClient.apiService.getMemberAiReports(reportMemberId);
      if (reportsResponse.isSuccessful && reportsResponse.body && reportsResponse.body.length > 0) {
        // Explicitly sort by date descending to ensure we have the latest
        const sorted = [...reportsResponse.body].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLatestReport(sorted[0]);
      }
    } catch (e) {
      toast.error("Error loading health status dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const PrimaryBlue = "#1E3A8A";
  const CyanGradient = "#3B82F6";

  // Deduplicate detections to show highest confidence per finding class
  const deduplicatedDetections = latestReport?.aiResult.detections
    ? Array.from(
        latestReport.aiResult.detections
          .reduce((map, det) => {
            const existing = map.get(det.detectedClass);
            if (!existing || det.confidence > existing.confidence) {
              map.set(det.detectedClass, det);
            }
            return map;
          }, new Map<string, any>())
          .values()
      ).sort((a, b) => b.confidence - a.confidence)
    : [];

  return (
    <DashboardLayout role="user" title="">
      <div className="flex flex-col min-h-screen bg-[#F8FBFF] -m-6 sm:-m-8 pb-32">
        {/* Gradient Header with Profile Info - 280px Height per Spec */}
        <div 
          className="w-full h-[300px] rounded-b-[48px] flex flex-col items-center p-8 pt-12 relative overflow-hidden shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${PrimaryBlue}, ${CyanGradient})` }}
        >
            <div className="w-full flex items-center gap-4 z-10">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all active:scale-90"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-black text-white tracking-tight">Health Status</h1>
            </div>

            {isLoading ? (
                <div className="mt-12 flex flex-col items-center gap-4 z-10">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Analyzing Stats...</p>
                </div>
            ) : (
                <div className="mt-6 flex flex-col items-center gap-4 z-10 transition-all duration-700 animate-in fade-in slide-in-from-top-4">
                    <InitialsAvatar 
                        name={member?.memberName || "Member"} 
                        className="w-24 h-24 ring-8 ring-white/10 shadow-2xl" 
                    />
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-white tracking-tight leading-none">{member?.memberName || "..."}</h2>
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mt-3">
                            {member?.relation === 'Self' ? "Primary Health Profile" : "Family Member Profile"}
                        </p>
                    </div>
                </div>
            )}

            {/* Blurred Abstract Shapes */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        </div>

        {/* Content Section with Premium Overlap */}
        <div className="px-8 -mt-12 relative z-20 space-y-10">
            {/* Latest Report Summary Card */}
            <ProfessionalStatusCard 
                title="Latest AI Scan Report"
                subtitle={latestReport ? `Assessment on ${format(new Date(latestReport.createdAt), 'dd MMM yyyy')}` : "No recent scans recorded"}
                buttonText="Full Report"
                onButtonClick={() => navigate('/user/family/last-scan', { 
                    state: { 
                        report: {
                            memberId: member?.id ?? 0,
                            memberName: member?.memberName || (member as any)?.name || SessionManager.getUserName() || "Beneficiary",
                            image: latestReport?.imagePath || "",
                            timestamp: latestReport ? format(new Date(latestReport.createdAt), 'dd MMM yyyy') : "",
                            reportId: latestReport?.aiResult?.reportId ?? 0,
                            riskLevel: latestReport?.riskLevel || "LOW",
                            detections: latestReport?.aiResult?.detections || []
                        } 
                    } 
                })}
                isEnabled={!!latestReport}
            />

            {/* Detailed Findings Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-[20px] font-black text-gray-900 tracking-tight">Detailed Findings</h2>
                    {latestReport && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <Calendar className="w-3.5 h-3.5" />
                            Latest Scan
                        </div>
                    )}
                </div>

                {!latestReport ? (
                    <Card className="w-full bg-white rounded-[2.5rem] border-none shadow-xl shadow-gray-100 p-12 flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-2 shadow-inner">
                            <Scan className="w-8 h-8 text-gray-200" />
                        </div>
                        <p className="text-sm font-bold text-gray-400 max-w-[220px] leading-relaxed">No scan history available for this family member yet.</p>
                    </Card>
                ) : deduplicatedDetections.length === 0 ? (
                    <Card className="w-full bg-emerald-50 rounded-[2.5rem] border-none p-12 flex flex-col items-center text-center gap-4 border border-emerald-100/50">
                        <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center text-emerald-600 rounded-full shadow-lg shadow-emerald-500/10">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-black text-emerald-800 uppercase tracking-widest">All clear! No issues found.</p>
                    </Card>
                ) : (
                    <div className="space-y-5">
                        {deduplicatedDetections.map((detection, index) => (
                            <DiseaseFindingCard 
                                key={index} 
                                detection={detection} 
                                isPrimary={index === 0} 
                            />
                        ))}
                    </div>
                )}
            </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

function ProfessionalStatusCard({ title, subtitle, buttonText, onButtonClick, isEnabled }: { 
    title: string, 
    subtitle: string, 
    buttonText: string, 
    onButtonClick: () => void, 
    isEnabled: boolean 
}) {
    return (
        <Card className="w-full bg-white rounded-[2.5rem] border-none shadow-[0_25px_60px_-15px_rgba(30,58,138,0.1)] p-7 overflow-hidden relative group transition-all hover:shadow-2xl">
            <div className="flex items-center gap-6 relative z-10">
                <div className="flex-1 space-y-5">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{title}</h3>
                        <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-wide">{subtitle}</p>
                    </div>
                    
                    <Button 
                        onClick={onButtonClick}
                        disabled={!isEnabled}
                        className={`h-11 px-7 rounded-2xl font-black text-[11px] uppercase tracking-widest gap-2 flex items-center transition-all active:scale-95 ${
                            isEnabled 
                            ? 'bg-[#1E3A8A] text-white hover:bg-blue-800 shadow-xl shadow-blue-900/30' 
                            : 'bg-gray-100 text-gray-400 pointer-events-none'
                        }`}
                    >
                        {buttonText}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center group-hover:bg-blue-100 transition-colors shadow-inner flex-shrink-0 animate-in zoom-in duration-1000">
                    <Scan className="w-10 h-10 text-blue-600" />
                </div>
            </div>

            <div className="absolute -right-6 -bottom-6 opacity-[0.03] scale-[2.8] rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-[3] duration-1000 ease-out">
                <Scan className="w-24 h-24" />
            </div>
        </Card>
    );
}
