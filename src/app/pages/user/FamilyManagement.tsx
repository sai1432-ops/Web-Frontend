import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Plus, 
  Edit, 
  Activity, 
  User, 
  Eye,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { RetrofitClient, type FamilyMemberResponse } from '../../network/RetrofitClient';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionManager } from '../../utils/SessionManager';

export function FamilyManagement() {
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const userId = SessionManager.getUserId();

  const fetchMembers = useCallback(async () => {
    if (userId <= 0) return;
    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.getFamilyMembers(userId);
      if (response.isSuccessful && response.body) {
        // Exclude the main user (Self) from the family management list
        const filtered = response.body.filter(member => member.relation !== 'Self');
        setFamilyMembers(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch family members:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handleDelete = async (memberId: number) => {
    if (!window.confirm("Are you sure you want to remove this family member?")) return;
    
    try {
      const response = await RetrofitClient.apiService.deleteFamilyMember(memberId, userId);
      if (response.isSuccessful) {
        toast.success("Member removed from your household");
        fetchMembers();
      } else {
        toast.error(response.errorBody?.string() || "Failed to delete member");
      }
    } catch (error) {
      toast.error("Network error while deleting member");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <DashboardLayout role="user" title="Family Members">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button 
            onClick={() => navigate('/user/family/add')}
            className="w-full h-16 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-[2rem] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Plus className="w-6 h-6" />
            <span className="text-lg font-black tracking-wide">Add Family Member</span>
          </Button>
        </motion.div>

        {/* Member List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-gray-400">Loading your household...</p>
            </div>
          ) : familyMembers.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <User className="w-16 h-16 mx-auto text-gray-200" />
              <p className="text-gray-500 font-bold font-lg">No family members found</p>
              <p className="text-gray-400 text-sm">Start by adding your first family member.</p>
            </div>
          ) : (
            <AnimatePresence>
              {familyMembers.map((member, index) => (
                <ProfessionalMemberCard 
                  key={member.id} 
                  member={member} 
                  index={index}
                  onDelete={() => handleDelete(member.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ProfessionalMemberCard({ member, index, onDelete }: { member: FamilyMemberResponse, index: number, onDelete: () => void }) {
  const navigate = useNavigate();
  const initials = member.memberName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="rounded-[2rem] border-none shadow-md hover:shadow-xl transition-all p-6 bg-white group overflow-hidden relative">
        <div className="flex items-center gap-5">
          {/* Avatar Area */}
          <div className="w-16 h-16 rounded-3xl bg-[#F0F7FF] text-[#3B82F6] flex items-center justify-center text-xl font-black shadow-inner">
            {initials}
          </div>

          {/* Info Area */}
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-900 leading-tight">
              {member.memberName}
            </h3>
            <p className="text-xs font-bold text-gray-400">
              Age: {member.age} • Relation: {member.relation}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(`/user/family/edit/${member.id}`)}
              className="p-3 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Edit className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={onDelete}
              className="p-3 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
              title="Delete Member"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={() => navigate(`/user/family/member/${member.id}/health-status`)}
              className="p-3 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 transition-colors"
              title="View Health Status"
            >
              <Eye className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100 my-5" />

        {/* Footer Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-gray-400">Risk Level:</p>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
              member.riskLevel?.toLowerCase() === 'low' 
                ? 'bg-green-50 text-green-600' 
                : 'bg-gray-50 text-gray-400'
            }`}>
              {member.riskLevel || 'PENDING'}
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-blue-50/50">
            <Activity className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span className="text-xs font-black text-[#3B82F6]">
              Score: {member.score || 0}/100
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}