import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  Activity,
  TrendingUp
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';

export function DetailedAIReport() {
  const navigate = useNavigate();

  // Mock data matching the Android specification
  const reportData = {
    overallScore: 92,
    findings: [
      { label: "Gum Health", value: "Excellent", accent: "#10B981" },
      { label: "Cavity Detection", value: "None Found", accent: "#3B82F6" },
      { label: "Enamel Quality", value: "Very Good", accent: "#F59E0B" }
    ],
    advice: [
      {
        title: "Optimal Brushing",
        desc: "Maintain your current twice-daily routine with the provided fluoride paste.",
        icon: <Sparkles className="w-5 h-5" />,
        color: "#3B82F6"
      },
      {
        title: "Posterior Care",
        desc: "Focus on the back molars during evening brushing to prevent plaque accumulation.",
        icon: <Activity className="w-5 h-5" />,
        color: "#1E40AF"
      }
    ]
  };

  return (
    <DashboardLayout role="user" title="">
      <div className="max-w-2xl mx-auto -mt-6 -mx-6 lg:m-0 min-h-screen bg-[#F8F9FA] font-sans pb-12">
        {/* Gradient Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[200px] bg-gradient-to-br from-[#3B82F6] to-[#00BCD4] rounded-b-[32px] overflow-hidden shadow-lg"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <div className="w-full flex items-center justify-between mb-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition-all font-bold"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-white">Detailed Health Report</h1>
              <div className="w-10"></div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">AI Analysis Verified</span>
            </div>
          </div>
        </motion.div>

        <div className="px-6 -mt-8 space-y-8">
          {/* Analysis Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden h-[240px] rounded-[32px] border-none shadow-xl relative group">
              <img 
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800" 
                alt="Analyzed Scan" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-5 left-6">
                <span className="text-white font-bold text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Captured Scan View
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Health Metrics Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Health Metrics
            </h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 rounded-[32px] border-none shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] font-bold">Overall Score</span>
                  <span className="text-3xl font-black text-[#3B82F6]">{reportData.overallScore}/100</span>
                </div>
                
                <div className="relative h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${reportData.overallScore}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-0 bg-[#3B82F6] rounded-full"
                  />
                </div>

                <div className="h-[1px] bg-[#F1F5F9]" />

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-4">Findings Breakdown</h3>
                  <div className="space-y-4">
                    {reportData.findings.map((finding, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: finding.accent }}
                          />
                          <span className="text-sm font-medium text-[#1E293B]">{finding.label}</span>
                        </div>
                        <span 
                          className="text-sm font-bold"
                          style={{ color: finding.accent }}
                        >
                          {finding.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Personalized Advice Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Personalized Advice
            </h2>
            
            <div className="space-y-4">
              {reportData.advice.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                >
                  <Card className="p-4 rounded-[24px] border-none shadow-sm flex gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <div style={{ color: item.color }}>{item.icon}</div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-[#1E293B]">{item.title}</h3>
                      <p className="text-sm text-[#64748B] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
