import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft
} from 'lucide-react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { RetrofitClient } from '../../network/RetrofitClient';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

import { SessionManager } from '../../utils/SessionManager';

export function AIAnalysisLoading() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0.1);
  const [statusText, setStatusText] = useState("Uploading Cloud Data...");
  const [error, setError] = useState<string | null>(null);

  const softBlue = "#2563EB";
  const cyanGradient = "#06B6D4";

  useEffect(() => {
    async function startAnalysis() {
      const storedData = localStorage.getItem('currentAnalysis');
      if (!storedData) {
        navigate('/user/instant-analysis');
        return;
      }

      const { userId, memberId, image, memberName, isHead } = JSON.parse(storedData);
      const currentUserId = SessionManager.getUserId();

      try {
        // Step 1: Optimize Image (Simulation)
        setProgress(0.2);
        setStatusText("Optimizing Image...");
        await new Promise(r => setTimeout(r, 800));

        // Step 2: Convert base64 to Blob
        setStatusText("Preparing AI Data...");
        const response = await fetch(image);
        const blob = await response.blob();
        
        // Step 3: AI Engine Scanning
        setProgress(0.5);
        setStatusText("AI Engine Scanning...");
        
        const memberIdString = String(memberId ?? 0);
        const apiResponse = await RetrofitClient.apiService.analyzeTeeth(
          blob,
          String(userId || currentUserId || "1"),
          memberIdString
        );

        // Step 4: Finalizing
        setProgress(1.0);
        setStatusText("Analysis Finalized!");
        
        // Update localStorage with results
        const resultData = {
          userId: userId || currentUserId,
          memberId,
          isHead,
          memberName,
          image,
          timestamp: new Date().toISOString(),
          message: apiResponse.message,
          reportId: apiResponse.reportId,
          riskLevel: apiResponse.riskLevel,
          detections: (apiResponse.detections || []).map((d: any) => ({
            detectedClass: d.detectedClass || d.class || "Unknown",
            confidence: Number(d.confidence || 0),
            bbox: d.bbox || []
          }))
        };
        localStorage.setItem('currentAnalysis', JSON.stringify(resultData));

        await new Promise(r => setTimeout(r, 800));
        navigate('/user/ai-analysis-result');

      } catch (err: any) {
        console.error("AI_ANALYSIS_UI_ERROR:", err);
        setError(err.message || "Analysis encountered an issue. Please try again.");
      }
    }

    startAnalysis();
  }, [navigate]);

  if (error) {
    return (
      <DashboardLayout role="user" title="">
        <div className="max-w-md mx-auto px-4 flex flex-col items-center justify-center h-[70vh] text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
             <ArrowLeft className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <Button onClick={() => navigate('/user/instant-analysis')} className="bg-blue-600 h-12 px-8 rounded-xl font-bold">
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user" title="">
      <div className="max-w-md mx-auto px-6 h-[calc(100vh-100px)] flex flex-col items-center justify-center">
        {/* Animated AI Core */}
        <div className="relative flex items-center justify-center mb-12">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute w-40 h-40 rounded-full border border-blue-200"
            style={{ 
              background: `linear-gradient(135deg, ${softBlue}10, ${cyanGradient}10)`,
              border: `1px solid ${softBlue}30`
            }}
          />
          <div className="relative w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        {/* Status Text */}
        <motion.h2 
          key={statusText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-blue-600 mb-6 text-center"
        >
          {statusText}
        </motion.h2>

        {/* Premium Progress Bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-10 shadow-inner">
          <motion.div
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${softBlue}, ${cyanGradient})` }}
          />
        </div>

        {/* Info Card */}
        <Card className="w-full bg-[#F8FAFC] border-none p-5 rounded-2xl shadow-sm">
           <div className="flex gap-4 items-start">
             <div className="p-2 bg-emerald-100 rounded-lg">
               <ShieldCheck className="w-5 h-5 text-emerald-600" />
             </div>
             <p className="text-[13px] leading-relaxed text-gray-500 font-medium">
               Clinical AI model detecting cavities, plaque, and gum health in real-time.
             </p>
           </div>
        </Card>

        {/* Cancel Button */}
        <button 
          onClick={() => navigate('/user/instant-analysis')}
          className="mt-12 text-red-500/60 font-bold hover:text-red-500 transition-colors"
        >
          Cancel Analysis
        </button>
      </div>
    </DashboardLayout>
  );
}
