import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Stars, Send } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Textarea } from '../../components/ui/textarea';
import { cn } from '../../components/ui/utils';

export function About() {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const navigate = useNavigate();

  const ratings = [
    { emoji: "😞", value: 1 },
    { emoji: "😐", value: 2 },
    { emoji: "😊", value: 3 },
    { emoji: "🤩", value: 4 }
  ];

  const primaryBlue = "#007AFF";
  const cyanGradient = "#00BCD4";
  const emblemPath = "/brain/f13d255b-94f6-4a51-a7ab-4a67c291743e/gov_emblem_1774807546883.png";

  return (
    <DashboardLayout role="user" title="">
      <div className="min-h-screen bg-[#F8F9FA] pb-24 lg:pb-12">
        {/* Gradient Header with Emblem */}
        <div 
          className="relative w-full h-56 rounded-b-[2.5rem] p-8 flex flex-col items-center justify-center shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top duration-700"
          style={{ background: `linear-gradient(135deg, ${primaryBlue}, ${cyanGradient})` }}
        >
          {/* Header Content */}
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <Button 
                onClick={() => navigate(-1)}
                variant="ghost" 
                size="icon" 
                className="bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-xl font-black text-white tracking-tight">About Program</h1>
              <div className="w-10"></div> {/* Spacer for symmetry */}
            </div>
            
            <div className="mt-2 group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full p-2 border-2 border-white/30 shadow-2xl transform transition-transform group-hover:scale-110 duration-500">
                <img 
                  src={emblemPath} 
                  alt="Gov Emblem" 
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>
          
          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        </div>

        <div className="max-w-2xl mx-auto px-6 -mt-8 relative z-20 space-y-8">
          {/* Mission Card */}
          <Card className="border-0 shadow-2xl shadow-blue-500/10 rounded-[2rem] p-8 bg-white overflow-hidden group hover:shadow-blue-500/20 transition-all duration-500">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
                <Stars className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Our Mission</h3>
            </div>
            <p className="text-gray-500 font-bold leading-relaxed text-sm lg:text-base opacity-80 group-hover:opacity-100 transition-opacity">
              To ensure every Indian has access to affordable oral healthcare and essential hygiene products 
              through digital innovation and subsidized kits.
            </p>
          </Card>

          {/* Feedback Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 ml-2 uppercase tracking-tight">Your Feedback</h3>
            
            <Card className="border-0 shadow-2xl shadow-blue-500/10 rounded-[2rem] p-8 bg-white overflow-hidden relative">
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Rate your experience</p>
                  <div className="flex justify-between gap-3 sm:gap-6">
                    {ratings.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setSelectedRating(r.value)}
                        className={cn(
                          "flex-1 flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 border-2",
                          selectedRating === r.value 
                            ? "bg-blue-50 border-blue-500 scale-105 shadow-lg" 
                            : "bg-gray-50 border-transparent hover:bg-gray-100"
                        )}
                      >
                        <span className="text-3xl sm:text-4xl transform transition-transform duration-300 hover:scale-125">{r.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Textarea 
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="min-h-[150px] rounded-[1.5rem] border-gray-100 bg-[#F8FAFC] p-6 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-gray-700 placeholder:text-gray-300 resize-none transition-all"
                  />
                  
                  <Button 
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                    disabled={!selectedRating || !feedbackText.trim()}
                  >
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </Button>
                </div>
              </div>
              
              {/* Subtle Background Icon */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full -z-0 opacity-50"></div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}