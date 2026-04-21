import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { 
  ArrowLeft, 
  Sparkles, 
  Verified, 
  FileX,
  CheckCircle,
  Lightbulb,
  Activity
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { InitialsAvatar } from '../../components/ui/InitialsAvatar';
import { DiseaseFindingCard } from '../../components/cards/DiseaseFindingCard';
import { mapClassName } from '../../utils/ai-mapping';

interface AiDetection {
  detectedClass: string;
  confidence: number;
  bbox: number[];
}

interface AnalysisData {
  userId: number;
  memberId: number | null;
  isHead: boolean;
  memberName: string;
  image: string;
  timestamp: string;
  message: string;
  reportId: number;
  riskLevel: string;
  detections: AiDetection[];
}

export function AIAnalysisResult() {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('currentAnalysis');
    if (data) {
      setAnalysisData(JSON.parse(data));
    } else {
      navigate('/user/dashboard');
    }
  }, [navigate]);

  if (!analysisData) return null;

  const detections = Array.from(
    analysisData.detections
      .reduce((acc, current) => {
        const existing = acc.get(current.detectedClass);
        if (!existing || current.confidence > existing.confidence) {
          acc.set(current.detectedClass, current);
        }
        return acc;
      }, new Map<string, AiDetection>())
      .values()
  ).sort((a, b) => b.confidence - a.confidence);
  
  const riskLevel = analysisData.riskLevel.toUpperCase();
  const highestFinding = mapClassName(
    detections[0]?.detectedClass || "None Detected"
  );

  const riskStyles = {
    HIGH: { color: "#C62828", bg: "#FEF2F2", border: "#FEE2E2", hint: "Immediate professional attention is highly recommended." },
    MEDIUM: { color: "#EF6C00", bg: "#FFF7ED", border: "#FFEDD5", hint: "We detected potential issues. Consider scheduling a checkup." },
    LOW: { color: "#2E7D32", bg: "#F0FDF4", border: "#DCFCE7", hint: "Looking good! No major issues were detected in this scan." }
  }[riskLevel as 'HIGH' | 'MEDIUM' | 'LOW'] || { color: "#2E7D32", bg: "#F0FDF4", border: "#DCFCE7", hint: "Looking good! No major issues were detected in this scan." };

  const recommendation = {
    LOW: "Maintain hygiene and regular checkups.",
    MEDIUM: "Schedule a dental consultation soon.",
    HIGH: "Consult a dentist urgently."
  }[riskLevel as 'HIGH' | 'MEDIUM' | 'LOW'] || "Maintain hygiene and regular checkups.";

  const handleDone = () => {
    const scanHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    scanHistory.unshift({
      ...analysisData,
      reportId: `RPT-${analysisData.reportId}`,
      primaryFinding: highestFinding,
      riskLevel: riskLevel,
    });
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
    localStorage.removeItem('currentAnalysis');
    navigate('/user/dashboard');
  };

  return (
    <DashboardLayout role="user" title="">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
        {/* Professional Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('/user/dashboard')}
              className="p-2.5 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Scan Report</h1>
                <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-blue-100 flex items-center gap-1 uppercase">
                  <Verified className="w-3 h-3" /> AI Verified
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center gap-2">
                ID: <span className="text-gray-900 font-bold">#{analysisData.reportId}</span>
                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                DATED: <span className="text-gray-900 font-bold">{new Date().toLocaleDateString()}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
             <Button 
               onClick={handleDone}
               className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 px-8 shadow-md shadow-blue-200/50"
             >
               Finalize Report
             </Button>
          </div>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start pb-20">
          
          {/* Left Column: Visuals & Profile */}
          <div className="lg:col-span-12 xl:col-span-12 xxl:col-span-12 grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
               {/* Member Insight Card */}
               <Card className="p-6 rounded-[2rem] border-none shadow-soft-premium bg-white flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
                  <InitialsAvatar 
                    name={analysisData.memberName}
                    className="w-20 h-20 ring-4 ring-blue-50 shadow-inner group-hover:scale-105 transition-transform duration-500"
                  />
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{analysisData.memberName}</h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Patient Profile
                    </p>
                    <div className="flex items-center gap-2">
                       <span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-black text-gray-600 uppercase">Age: 24</span>
                       <span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-black text-gray-600 uppercase">Male</span>
                    </div>
                  </div>
               </Card>

               {/* Analyzed Image Card */}
               <Card className="overflow-hidden border-none rounded-[2rem] shadow-soft-premium bg-white group h-full">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                     <h3 className="font-black text-gray-900 tracking-tight text-lg uppercase flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-blue-500" /> Digital Scan Preview
                     </h3>
                     <span className="px-3 py-1 rounded-full bg-blue-50 text-[10px] font-black text-blue-600 uppercase">High Definition</span>
                  </div>
                  <div className="h-[400px] bg-gray-50 flex items-center justify-center relative overflow-hidden">
                    {analysisData.image ? (
                      <img 
                         src={analysisData.image} 
                         alt="Scanned teeth" 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0" 
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-300">
                        <FileX className="w-16 h-16 mb-4 opacity-50" />
                        <p className="font-black uppercase tracking-widest text-xs">No Scan Available</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
               </Card>
            </div>

            <div className="space-y-8">
                {/* AI Executive Summary */}
                <Card className="bg-gradient-to-br from-emerald-600 to-green-500 p-8 rounded-[2rem] border-none shadow-lg shadow-emerald-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
                  <div className="relative z-10 space-y-6 text-white">
                    <h2 className="text-xl font-black tracking-tight uppercase border-b border-white/20 pb-4">Executive AI Summary</h2>
                    <div className="grid gap-6">
                       <WebSummaryItem label="Primary Observation" value={highestFinding} icon={<Sparkles className="w-5 h-5" />} />
                       <WebSummaryItem label="Global Health Score" value={riskLevel} icon={<Activity className="w-5 h-5" />} />
                       <WebSummaryItem label="Smart Recommendation" value={recommendation} icon={<Lightbulb className="w-5 h-5" />} />
                    </div>
                  </div>
                </Card>

                {/* Risk Assessment & Insights */}
                <Card className="p-8 rounded-[2rem] border-none shadow-soft-premium bg-white space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                    <h3 className="font-black text-gray-900 tracking-tight text-lg uppercase">Global Risk Profile</h3>
                    <div 
                      className="px-5 py-2 rounded-2xl text-[10px] font-black border tracking-widest uppercase shadow-sm"
                      style={{ 
                        color: riskStyles.color, 
                        backgroundColor: `${riskStyles.color}10`,
                        borderColor: `${riskStyles.color}20`
                      }}
                    >
                      {riskLevel} RISK AREA
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                      {riskStyles.hint}
                    </p>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
                       <Lightbulb className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                       <p className="text-xs text-orange-800 font-bold leading-relaxed">
                         The analysis shows focused regions that may need clinical intervention. Early detection is a key factor in faster recovery.
                       </p>
                    </div>
                  </div>
                </Card>
            </div>
          </div>

          {/* Clinical Findings - Full Width below or Grid integrated */}
          <div className="lg:col-span-12 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
              Clinical Findings & AI Insight
            </h2>
            {detections.length === 0 ? (
              <Card className="bg-emerald-50/50 p-8 rounded-3xl border-dashed border-2 border-emerald-100 flex flex-col items-center gap-4 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
                <div>
                   <p className="text-xl font-black text-emerald-900">Optimal Oral Health</p>
                   <p className="text-sm text-emerald-700/70 font-semibold max-w-md">No clinical issues were detected by the AI model in this scan region. Continue regular hygiene practices.</p>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 xxl:grid-cols-3 gap-6">
                {detections.map((detection, idx) => (
                  <DiseaseFindingCard 
                    key={idx} 
                    detection={detection} 
                    isPrimary={idx === 0} 
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

function WebSummaryItem({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-lg font-black text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}
