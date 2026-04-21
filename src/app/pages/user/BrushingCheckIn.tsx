import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { ArrowLeft, Sun, Moon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { RetrofitClient } from '../../network/RetrofitClient';
import { SessionManager } from '../../utils/SessionManager';

interface Member {
  id: number;
  name: string;
  initials: string;
}

export function BrushingCheckIn() {
  const navigate = useNavigate();
  const [sessionMode, setSessionMode] = useState<'morning' | 'evening'>('morning');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [familyMembers, setFamilyMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchFamily() {
      setIsLoading(true);
      try {
        const userId = SessionManager.getUserId();
        if (userId <= 0) {
          navigate('/login/user');
          return;
        }
        const headName = SessionManager.getUserName() || 'Family Head';
        // Family Head is always prepended as ID = userId (with negative sentinel to avoid clash)
        const headMember: Member = {
          id: -1, // sentinel for family head
          name: headName,
          initials: headName.charAt(0).toUpperCase()
        };

        const members = await RetrofitClient.apiService.getFamilyMembers(userId);
        if (members.isSuccessful && members.body) {
          setFamilyMembers([
            headMember,
            ...members.body.map((m: any) => ({
              id: m.id,
              name: m.memberName || m.name || m.member_name || 'Member',
              initials: (m.memberName || m.name || m.member_name || 'M').charAt(0).toUpperCase()
            }))
          ]);
        } else {
          setFamilyMembers([headMember]);
        }
      } catch (error) {
        console.error("Failed to fetch family members:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFamily();
  }, [navigate]);

  const toggleMember = (id: number) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const userId = SessionManager.getUserId();
      
      // We perform sequential requests because the backend handles one member per request
      for (const id of selectedMembers) {
        // -1 is our sentinel for the Family Head, which the backend expects as null member_id
        const memberId = id === -1 ? null : id;
        
        await RetrofitClient.apiService.submitBrushingCheckin({
          userId,
          memberId,
          sessionMode
        });
      }

      navigate('/user/dashboard');
    } catch (error) {
      console.error('Failed to sync check-in:', error);
      alert('Failed to synchronize logs with the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="user" title="">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/user/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Daily Brushing Check-in</h1>
        </div>

        <div className="space-y-6">
          {/* Session Mode Selection */}
          <Card className="p-6 border-0 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Session Mode
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setSessionMode('morning')}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  sessionMode === 'morning'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    sessionMode === 'morning'
                      ? 'border-orange-500'
                      : 'border-gray-300'
                  }`}
                >
                  {sessionMode === 'morning' && (
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  )}
                </div>
                <Sun className={`w-5 h-5 ${sessionMode === 'morning' ? 'text-orange-500' : 'text-gray-500'}`} />
                <span className={`font-medium ${sessionMode === 'morning' ? 'text-orange-900' : 'text-gray-700'}`}>
                  Morning
                </span>
              </button>

              <button
                onClick={() => setSessionMode('evening')}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  sessionMode === 'evening'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    sessionMode === 'evening'
                      ? 'border-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {sessionMode === 'evening' && (
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  )}
                </div>
                <Moon className={`w-5 h-5 ${sessionMode === 'evening' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className={`font-medium ${sessionMode === 'evening' ? 'text-blue-900' : 'text-gray-700'}`}>
                  Evening
                </span>
              </button>
            </div>
          </Card>

          {/* Family Members Selection */}
          <Card className="p-6 border-0 shadow-sm min-h-[200px]">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Mark who brushed today
            </h2>
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 animate-pulse">
                   <div className="h-2 w-32 bg-gray-100 rounded-full mb-2"></div>
                   <div className="h-2 w-24 bg-gray-100 rounded-full opacity-50"></div>
                </div>
              ) : familyMembers.length === 0 ? (
                <p className="text-center py-10 text-gray-400 text-sm italic">No family members registered yet.</p>
              ) : familyMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => toggleMember(member.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={member.id === -1 ? "bg-blue-900 text-white" : "bg-gray-300 text-gray-700"}>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">
                        {member.name}
                      </p>
                      {member.id === -1 && (
                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Family Head</span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      selectedMembers.includes(member.id)
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMembers.includes(member.id) && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            disabled={selectedMembers.length === 0 || isSubmitting}
            className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                 <Loader2 className="w-5 h-5 animate-spin" />
                 <span>Synchronizing Ledger...</span>
              </div>
            ) : "Confirm Check-in"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
