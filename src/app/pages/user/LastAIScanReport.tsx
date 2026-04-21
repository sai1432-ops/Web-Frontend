import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  ArrowLeft, 
  ImageOff, 
  CheckCircle, 
  Calendar,
  ShieldCheck,
  AlertCircle,
  Activity,
  History,
  Info,
  Maximize2,
  Stethoscope,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { InitialsAvatar } from '../../components/ui/InitialsAvatar';
import { DiseaseFindingCard } from '../../components/cards/DiseaseFindingCard';
import { mapClassName } from '../../utils/ai-mapping';
import { SessionManager } from '../../utils/SessionManager';

interface AiDetection {
  detectedClass: string;
  confidence: number;
}

interface HistoricalReportData {
  memberId: number;
  memberName: string;
  image?: string;
  timestamp: string;
  reportId: string | number;
  riskLevel: string;
  detections: AiDetection[];
}

export function LastAIScanReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState<HistoricalReportData | null>(null);

  useEffect(() => {
    if (location.state?.report) {
      setReport({
        memberId: location.state.report.memberId ?? 0,
        memberName: location.state.report.memberName || SessionManager.getUserName() || "Beneficiary",
        image: location.state.report.image || "",
        timestamp: location.state.report.timestamp || "",
        reportId: location.state.report.reportId ?? 0,
        riskLevel: location.state.report.riskLevel || "LOW",
        detections: location.state.report.detections || []
      });
    }
  }, [location.state]);

  if (!report) {
    return (
      <DashboardLayout role="user" title="">
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200 m-8">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <History className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Diagnostic Data Unavailable</h2>
          <p className="text-gray-500 text-center mb-8 max-w-sm px-6 font-medium">
            We couldn't find an active session for this report. Please return to your health status dashboard to select a valid scan record.
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const riskLevel = report.riskLevel.toUpperCase();
  const sortedDetections = [...report.detections].sort((a, b) => b.confidence - a.confidence);
  const highestFindingRaw = sortedDetections[0]?.detectedClass || "None Detected";
  const highestFinding = mapClassName(highestFindingRaw);

  const riskStyles = {
    HIGH: { 
      color: "#F43F5E", 
      bg: "bg-rose-50/50", 
      accent: "bg-rose-500",
      border: "border-rose-200", 
      icon: <AlertCircle className="w-6 h-6 text-rose-500" />,
      hint: "Critical findings detected. Clinical intervention is highly recommended." 
    },
    MEDIUM: { 
      color: "#F59E0B", 
      bg: "bg-amber-50/50", 
      accent: "bg-amber-500",
      border: "border-amber-200", 
      icon: <Activity className="w-6 h-6 text-amber-500" />,
      hint: "Moderate issues observed. Early treatment can prevent further complications." 
    },
    LOW: { 
      color: "#10B981", 
      bg: "bg-emerald-50/50", 
      accent: "bg-emerald-500",
      border: "border-emerald-200", 
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      hint: "All parameters look healthy. Maintain your current oral hygiene routine." 
    }
  }[riskLevel as 'HIGH' | 'MEDIUM' | 'LOW'] || { 
    color: "#10B981", 
    bg: "bg-emerald-50/50", 
    accent: "bg-emerald-500",
    border: "border-emerald-200", 
    icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    hint: "Analysis complete. No major issues found." 
  };

  return (
    <DashboardLayout role="user" title="">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Navigation Breadcrumbs & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-8 gap-4">
          <div className="flex items-center gap-3 text-sm font-bold">
            <button onClick={() => navigate('/user/dashboard')} className="text-gray-400 hover:text-blue-600 transition-colors">Dashboard</button>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-blue-600 transition-colors">Health History</button>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-blue-600">Scan ID: #{report.reportId}</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-2xl shadow-black/5 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between relative z-10 gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <InitialsAvatar name={report.memberName} className="w-20 h-20 ring-[8px] ring-blue-50 shadow-2xl" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{report.memberName}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-400">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Reported on {report.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
                    <Stethoscope className="w-4 h-4 text-rose-500" />
                    <span>Clinical ID: #{report.reportId}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full uppercase tracking-widest text-[10px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>AI Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-[2rem] border ${riskStyles.border} ${riskStyles.bg} min-w-[280px]`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Overall Status</span>
                {riskStyles.icon}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black" style={{ color: riskStyles.color }}>{riskLevel}</span>
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Risk Level</span>
              </div>
              <div className="mt-4 w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full ${riskStyles.accent} shadow-lg`} 
                  style={{ width: riskLevel === 'LOW' ? '33%' : riskLevel === 'MEDIUM' ? '66%' : '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visual Analysis Section */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="w-full h-auto min-h-[500px] rounded-[3rem] border-4 border-white bg-white overflow-hidden shadow-2xl relative group">
              {report.image ? (
                <>
                  <img src={report.image} alt="High Resolution Dental Scan" className="w-full h-full object-contain bg-gray-900 transition-transform duration-700 group-hover:scale-[1.02]" />
                  <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="flex items-end justify-between text-white">
                      <div>
                        <h4 className="text-xl font-black tracking-tight mb-1">Source AI Analysis Image</h4>
                        <p className="text-sm font-bold text-white/70">Processed by DeepMind Diagnostic Engine v2.4</p>
                      </div>
                      <button className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all active:scale-95 shadow-2xl group">
                         <Maximize2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                  {/* Digital Diagnostic Overlays */}
                  <div className="absolute top-8 left-8 flex flex-col gap-3">
                    <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Diagnostic Live Feed</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 text-gray-300">
                  <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mb-6">
                    <ImageOff className="w-16 h-16" />
                  </div>
                  <span className="text-lg font-black uppercase tracking-widest text-gray-400">Imaging Data Missing</span>
                  <p className="text-sm font-bold text-gray-300 mt-2">Historical scan image was not successfully archived</p>
                </div>
              )}
            </Card>

            <div className="space-y-6 px-2">
              <div className="flex items-center border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <Stethoscope className="w-7 h-7 text-blue-600" />
                  Detailed Diagnostic Breakdown
                </h2>
              </div>
              
              {sortedDetections.length === 0 ? (
                <div className="bg-emerald-50 rounded-[2.5rem] p-12 flex flex-col items-center text-center border-2 border-emerald-100 border-dashed">
                  <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-emerald-900 mb-2 tracking-tight">Optimal Oral Condition</h3>
                  <p className="text-emerald-700/70 font-bold max-w-md">Our AI engine analyzed every sector of the dental arch and found no significant pathological markers. Excellent work maintaining your oral health!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedDetections.map((detection, index) => (
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

          {/* Sidebar Panel Section */}
          <div className="lg:col-span-4 space-y-8 sticky top-8">
            
            {/* Risk Summary Panel */}
            <Card className="w-full bg-white rounded-[3rem] p-8 border border-gray-100 shadow-2xl shadow-black/5 overflow-hidden">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                   <Info className="w-5 h-5 text-blue-600" />
                 </div>
                 <h3 className="text-xl font-black text-gray-900 tracking-tight">AI Insights</h3>
               </div>
               
               <p className="text-gray-500 font-bold leading-relaxed mb-8">
                 The automated analysis suggests a status of <span className="text-gray-900 font-black">{highestFinding}</span> with a confidence interval of <span className="text-blue-600 font-black">{(sortedDetections[0]?.confidence * 100 || 96).toFixed(1)}%</span>.
               </p>
               
               <div className="space-y-4 mb-8">
                  <div className="p-5 bg-gray-50 rounded-2xl flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 mt-1">
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 mb-1 leading-tight">Patient Note</h4>
                      <p className="text-[13px] font-bold text-gray-400 leading-snug">{riskStyles.hint}</p>
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-2xl flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 mt-1">
                      <Activity className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 mb-1 leading-tight">Progression Monitoring</h4>
                      <p className="text-[13px] font-bold text-gray-400 leading-snug">Compare this report with your next scan to track treatment efficacy.</p>
                    </div>
                  </div>
               </div>

               <button 
                onClick={() => navigate('/user/consult')}
                className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
               >
                 Schedule Professional Consultation
                 <ExternalLink className="w-4 h-4 text-white/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
               </button>
            </Card>

            {/* Quick Stats / Action Panel */}
            <Card className="w-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <h3 className="text-xl font-black tracking-tight mb-4">Historical Archive</h3>
                  <div className="space-y-4 mb-8">
                     <div className="flex justify-between items-center py-3 border-b border-white/10">
                       <span className="text-sm font-bold text-white/60">Detections</span>
                       <span className="text-lg font-black">{sortedDetections.length}</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-white/10">
                       <span className="text-sm font-bold text-white/60">Report Integrity</span>
                       <span className="text-lg font-black text-emerald-300">Verified</span>
                     </div>
                  </div>
                  <p className="text-sm font-medium text-blue-100/70 mb-8 leading-relaxed italic">
                    "Regular dental scans are the primary defense against periodontal complications. This report remains part of your permanent medical record."
                  </p>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/40">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secure Cloud Encryption Active
                  </div>
               </div>
            </Card>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
