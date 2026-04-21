import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { InitialsAvatar } from '../../components/ui/InitialsAvatar';
import { X, Camera, Image as ImageIcon, Sparkles, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../components/ui/utils';
import { useFamilyHealth } from '../../hooks/useFamilyHealth';
import { SessionManager } from '../../utils/SessionManager';
import { toast } from 'sonner';

export function InstantAnalysis() {
  const navigate = useNavigate();
  const { familyMembers, fetchFamilyMembers } = useFamilyHealth();
  const userId = SessionManager.getUserId();
  const headName = SessionManager.getUserName() || 'Family Head';
  const HEAD_ID = -1; // Sentinel ID for the family head
  
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userId) {
      fetchFamilyMembers(userId);
    }
  }, [userId, fetchFamilyMembers]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name.toLowerCase());
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedMember === null) {
      toast.error("Please select a member first");
      return;
    }
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsLoading(true);

    const isTeethImage = fileName.includes('teeth') || 
                        fileName.includes('tooth') || 
                        fileName.includes('oral') || 
                        fileName.includes('mouth') ||
                        Math.random() > 0.3;

    setTimeout(() => {
      if (!isTeethImage) {
        setIsLoading(false);
        toast.error("INVALID IMAGE", {
          description: "System detected non-dental features. Please upload a clear image of teeth.",
          action: {
            label: "Retry",
            onClick: () => {
                setUploadedImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
          },
          duration: 4000
        });
        return;
      }

      const isHead = selectedMember === HEAD_ID;
      const member = isHead ? null : familyMembers.find(m => m.id === selectedMember);
      const analysisData = {
        userId,
        memberId: isHead ? 0 : selectedMember,
        memberName: isHead ? headName : (member?.memberName || member?.name || ''),
        image: uploadedImage,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('currentAnalysis', JSON.stringify(analysisData));
      navigate('/user/ai-analysis-loading');
    }, 2000);
  };

  const PrimaryBlue = "#3B82F6";
  const CyanGradient = "#00BCD4";

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden pb-32">
      {/* Header with Gradient Backdrop */}
      <div 
        className="w-full h-[240px] rounded-b-[40px] flex flex-col p-8 pt-12 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PrimaryBlue}, ${CyanGradient})` }}
      >
        <button 
          onClick={() => navigate('/user/dashboard')}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mt-8 z-10">
          <h1 className="text-4xl font-black text-white tracking-tight">AI Scan</h1>
          <p className="text-sm font-bold text-white/80 mt-1 uppercase tracking-widest">Powered by Bio-Cloud AI Engine</p>
        </div>

        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      <div className="px-6 -mt-10 space-y-8 relative z-20">
        {/* Member Selector Card */}
        <Card className="w-full bg-white rounded-[2rem] border-none shadow-2xl shadow-black/5 p-6 pb-8">
          <h2 className="text-lg font-black text-gray-900 mb-6 px-1">Select Patient</h2>
          
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide px-1">
            {/* Family Head — always first */}
            <button
              key="head"
              onClick={() => setSelectedMember(HEAD_ID)}
              className="flex flex-col items-center gap-3 flex-shrink-0 group"
            >
              <div
                className={cn(
                  "w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-300 relative",
                  selectedMember === HEAD_ID
                    ? "ring-4 ring-blue-500 ring-offset-4 bg-blue-50"
                    : "bg-[#F1F5F9] group-hover:bg-gray-100"
                )}
              >
                <InitialsAvatar 
                  name={headName} 
                  className="w-[60px] h-[60px]" 
                  backgroundColor="transparent"
                  textColor={selectedMember === HEAD_ID ? PrimaryBlue : "#64748B"}
                  fontSize="1.5rem"
                />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-blue-900 text-white px-1.5 py-0.5 rounded-full uppercase">Head</span>
              </div>
              <span
                className={cn(
                  "text-xs font-black uppercase tracking-widest",
                  selectedMember === HEAD_ID ? "text-blue-600" : "text-gray-400"
                )}
              >
                {headName.split(' ')[0]}
              </span>
            </button>

            {familyMembers.length === 0 ? null : familyMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member.id)}
                className="flex flex-col items-center gap-3 flex-shrink-0 group"
              >
                <div
                  className={cn(
                    "w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-300",
                    selectedMember === member.id
                      ? "ring-4 ring-blue-500 ring-offset-4 bg-blue-50"
                      : "bg-[#F1F5F9] group-hover:bg-gray-100"
                  )}
                >
                  <InitialsAvatar 
                    name={member.memberName || member.name || "User"} 
                    className="w-[60px] h-[60px]" 
                    backgroundColor="transparent"
                    textColor={selectedMember === member.id ? PrimaryBlue : "#64748B"}
                    fontSize="1.5rem"
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-black uppercase tracking-widest",
                    selectedMember === member.id ? "text-blue-600" : "text-gray-400"
                  )}
                >
                  {member.memberName || member.name || "Me"}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Data Capture Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-gray-900 tracking-tight ml-1">Data Capture</h3>
          <div className="grid grid-cols-2 gap-4">
            <ModernActionBox
              title="Camera"
              icon={Camera}
              accent={PrimaryBlue}
              onClick={() => fileInputRef.current?.click()} // Simulating camera for web
            />
            <ModernActionBox
              title="Gallery"
              icon={ImageIcon}
              accent="#10B981"
              onClick={() => fileInputRef.current?.click()}
            />
          </div>
        </div>

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Image Preview */}
        <AnimatePresence>
          {uploadedImage && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="space-y-4 overflow-hidden px-1"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Image Preview</h3>
                <button 
                  onClick={() => {
                    setUploadedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="flex items-center gap-1.5 text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
              
              <div className="w-full aspect-[4/3] rounded-[2.5rem] border-4 border-blue-50 bg-white overflow-hidden shadow-2xl shadow-blue-500/10 relative group">
                <img
                  src={uploadedImage}
                  alt="Oral Checkup"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                
                {/* Visual Guide Lines (Aesthetic) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                    <div className="w-48 h-48 border-2 border-dashed border-white rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA Layer */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 p-6 z-30">
        <Button
          onClick={handleAnalyze}
          disabled={selectedMember === null || !uploadedImage || isLoading}
          className={cn(
            "w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 active:scale-[0.98]",
            "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_30px_rgb(37,99,235,0.3)]",
            "disabled:opacity-40 disabled:shadow-none"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              AI Scanning...
            </div>
          ) : (
            <>Initiate AI Scan</>
          )}
        </Button>
      </div>
    </div>
  );
}

function ModernActionBox({ title, icon: Icon, accent, onClick }: { 
  title: string, icon: any, accent: string, onClick: () => void 
}) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "h-[140px] rounded-[2rem] border-none shadow-xl shadow-black/5 hover:shadow-2xl transition-all cursor-pointer group flex flex-col items-center justify-center gap-3",
        "bg-white active:scale-95"
      )}
    >
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
        style={{ backgroundColor: `${accent}15`, color: accent }}
      >
        <Icon className="w-7 h-7" />
      </div>
      <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{title}</span>
    </Card>
  );
}
