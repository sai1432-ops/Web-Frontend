import { 
  Search, 
  RefreshCcw, 
  ArrowUpDown, 
  Triangle, 
  Zap, 
  AlertCircle, 
  Settings, 
  Brush, 
  Sun, 
  ShieldCheck, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';

export function Learn() {
  const PrimaryBlue = "#3B82F6";

  return (
    <DashboardLayout role="user" title="">
      <div className="min-h-[calc(100vh-80px)] bg-[#F8F9FA] relative flex flex-col pb-24 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-xl lg:rounded-tl-2xl overflow-hidden shadow-sm border border-gray-100/50">
        
        {/* Hub Header */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white p-8 sm:p-10 pb-20 rounded-b-[4rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-[80px]"></div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Education Terminal Live</span>
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-white">Oral Knowledge Hub</h1>
                  <p className="text-blue-100/60 font-bold text-sm tracking-tight capitalize mt-1">Master oral hygiene using professional techniques</p>
                </div>
              </div>
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input 
                placeholder="Search procedures, guidance, or hygiene tips..."
                className="pl-16 h-18 bg-white border-none rounded-[2rem] shadow-2xl shadow-blue-900/30 text-gray-900 placeholder:text-gray-300 font-black text-base focus-visible:ring-4 focus-visible:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-10 py-12 space-y-14 max-w-5xl mx-auto w-full">
          {/* Brushing Techniques Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Technique Library</h2>
              <div className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase border border-blue-100 shadow-sm">
                Certified Procedures
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <BrushingTechniqueCard
                step="STEP 01"
                title="Circular Motion"
                description="Execute localized small radius rotations."
                icon={<RefreshCcw className="w-8 h-8" />}
                iconColor={PrimaryBlue}
              />
              <BrushingTechniqueCard
                step="STEP 02"
                title="Vertical Displacement"
                description="Continuous vertical strokes across ivory."
                icon={<ArrowUpDown className="w-8 h-8" />}
                iconColor={PrimaryBlue}
              />
              <BrushingTechniqueCard
                step="STEP 03"
                title="Gumline Mapping"
                description="Angle bristles at 45 degree vector."
                icon={<Triangle className="w-8 h-8" />}
                iconColor={PrimaryBlue}
              />
              <BrushingTechniqueCard
                step="STEP 04"
                title="Biological Purge"
                description="Scrape gently from posterior to anterior."
                icon={<Zap className="w-8 h-8" />}
                iconColor={PrimaryBlue}
              />
            </div>
        </section>

        {/* Teeth Problems Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900">Teeth Problems</h2>
          <div className="space-y-3">
            <TeethProblemItem
              title="Cavities"
              description="Tooth decay causing localized structural failure."
              icon={<AlertCircle className="w-6 h-6" />}
              iconColor="#EF5350"
            />
            <TeethProblemItem
              title="Gingivitis"
              description="Inflammation of the biological gum tissues."
              icon={<Settings className="w-6 h-6" />}
              iconColor="#FFA726"
            />
            <TeethProblemItem
              title="Discoloration"
              description="Staining from external chromatic agents."
              icon={<Brush className="w-6 h-6" />}
              iconColor="#FFD54F"
            />
            <TeethProblemItem
              title="Mouth Ulcers"
              description="Painful biological lesions within the cavity."
              icon={<Sun className="w-6 h-6" />}
              iconColor="#AB47BC"
            />
          </div>
        </section>

        {/* Precautions Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="rounded-[2rem] border-none bg-[#E0F2F1] p-8 shadow-none space-y-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-24 h-24 text-[#00796B]" />
            </div>
            
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#00796B]" />
              <h2 className="text-xl font-black text-gray-900">Precautions</h2>
            </div>

            <div className="space-y-4">
              <PrecautionCheckItem text="Brush twice daily for 2 minutes" />
              <PrecautionCheckItem text="Avoid sugary drinks and snacks" />
              <PrecautionCheckItem text="Use fluoride-based toothpaste" />
              <PrecautionCheckItem text="Drink water after every meal" />
              <PrecautionCheckItem text="Replace toothbrush every 3 months" />
            </div>
          </Card>
        </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function BrushingTechniqueCard({ step, title, description, icon, iconColor }: { step: string, title: string, description: string, icon: React.ReactNode, iconColor: string }) {
  return (
    <Card className="rounded-[3rem] border-none shadow-premium bg-white p-8 hover:translate-y-[-8px] transition-all duration-500 group cursor-pointer flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center mb-8 shadow-inner border border-gray-100 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-600/30 transition-all duration-500 scale-100 group-hover:scale-110" style={{ color: iconColor }}>
        {icon}
      </div>
      <div className="space-y-4">
        <span className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
          {step}
        </span>
        <div className="space-y-2">
            <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-tight">
                {title}
            </h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                {description}
            </p>
        </div>
      </div>
    </Card>
  );
}

function TeethProblemItem({ title, description, icon, iconColor }: { title: string, description: string, icon: React.ReactNode, iconColor: string }) {
  
  return (
    <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/40 bg-white p-6 hover:translate-x-2 transition-all duration-500 group cursor-pointer">
      <div className="flex items-center gap-6">
        <div 
          className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-500"
          style={{ backgroundColor: `${iconColor}10`, color: iconColor }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-tight">{title}</h3>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1 leading-relaxed">{description}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <Zap className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>
    </Card>
  );
}

function PrecautionCheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-4 h-4 text-[#00796B]" />
      </div>
      <span className="text-sm font-bold text-gray-800">{text}</span>
    </div>
  );
}