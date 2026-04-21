import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, Loader2, UserPlus, Save } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

import { SessionManager } from '../../utils/SessionManager';
import { RetrofitClient } from '../../network/RetrofitClient';
import { toast } from 'sonner';

export function AddFamilyMember() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [relation, setRelation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const userId = SessionManager.getUserId();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !relation) return;

    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.addFamilyMember({
        userId,
        name,
        age: parseInt(age, 10),
        relation
      });

      if (response.isSuccessful) {
        toast.success("Family member added successfully!");
        navigate('/user/family');
      } else {
        toast.error(response.message || "Failed to add family member");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const primaryBlue = "#007AFF";
  const deepBlue = "#1E3A8A";

  return (
    <DashboardLayout role="user" title="">
      <div className="min-h-screen bg-[#F8FBFF] pb-24 lg:pb-12">
        {/* Gradient Header */}
        <div 
          className="relative w-full h-[300px] flex flex-col items-center justify-start p-8 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top duration-700"
          style={{ background: `linear-gradient(180deg, ${primaryBlue}, ${deepBlue})` }}
        >
          {/* Header Content */}
          <div className="relative z-10 w-full max-w-4xl pt-4">
            <div className="flex items-center gap-4 text-white">
              <Button 
                onClick={() => navigate(-1)}
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20 text-white rounded-full transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl font-black tracking-tight uppercase">Add Family Member</h1>
            </div>
            
            <div className="mt-12 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl animate-bounce-subtle">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <p className="text-blue-50 font-medium opacity-80 max-w-md">
                Register a new family member to track their oral health and access dental kits.
              </p>
            </div>
          </div>
          
          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        </div>

        {/* Member Details Card */}
        <div className="max-w-xl mx-auto px-6 -mt-16 relative z-20">
          <Card className="border-0 shadow-2xl shadow-blue-900/10 rounded-[2.5rem] p-8 lg:p-10 bg-white overflow-hidden">
            <div className="space-y-8">
              <div className="border-b border-gray-50 pb-6">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Member Details</h3>
                <p className="text-sm text-gray-400 font-bold mt-1">Please enter the details of the new family member.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</Label>
                  <Input 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name" 
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 p-6 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-gray-900 placeholder:text-gray-300 transition-all"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="age" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Age</Label>
                  <Input 
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age" 
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 p-6 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-gray-900 placeholder:text-gray-300 transition-all"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="relation" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Relation (e.g. Spouse, Child)</Label>
                  <Input 
                    id="relation"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    placeholder="Enter relation" 
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 p-6 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-gray-900 placeholder:text-gray-300 transition-all"
                    required
                  />
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit"
                    className="w-full h-16 bg-[#007AFF] hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg tracking-tight uppercase"
                    disabled={isLoading || !name || !age || !relation}
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Member
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Artistic Background Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full -z-0 opacity-40"></div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
