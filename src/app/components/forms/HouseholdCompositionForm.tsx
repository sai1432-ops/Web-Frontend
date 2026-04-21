import { useState } from 'react';
import { X, User, Calendar, Users, PlusCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

export interface FamilyMemberInput {
  name: string;
  age: string;
  relation: string;
}

interface HouseholdCompositionFormProps {
  addedMembers: FamilyMemberInput[];
  onAddMember: (member: FamilyMemberInput) => void;
  onRemoveMember: (index: number) => void;
}

export function HouseholdCompositionForm({ 
  addedMembers, 
  onAddMember, 
  onRemoveMember 
}: HouseholdCompositionFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [relation, setRelation] = useState('Male');
  const [errors, setErrors] = useState<{name?: string, age?: string}>({});

  const handleAdd = () => {
    const newErrors: {name?: string, age?: string} = {};
    if (!name.trim()) newErrors.name = "Member name is required";
    if (!age.trim()) newErrors.age = "Member age is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddMember({ name, age, relation });
    setName('');
    setAge('');
    setRelation('Male');
    setErrors({});
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
          2
        </div>
        <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">
          Household Composition
        </h2>
      </div>

      {/* Stats Summary */}
      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-bold text-blue-900">NUMBER OF FAMILY MEMBERS</span>
        </div>
        <span className="text-xl font-black text-blue-600">{addedMembers.length}</span>
      </div>
      <p className="text-xs font-medium text-gray-500 leading-relaxed">
        Please include all family members residing at the same address. Each member will receive their own kits.
      </p>

      {/* Add Member Form Section */}
      <div className="space-y-6 pt-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Add Family Member</h3>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</Label>
            <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                    placeholder="Enter member name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrors({...errors, name: undefined});
                    }}
                    className={`pl-12 h-14 bg-gray-50 border-none rounded-2xl font-bold transition-all focus-visible:ring-2 ${errors.name ? 'ring-2 ring-red-500' : 'focus-visible:ring-blue-600/20'}`}
                />
            </div>
            {errors.name && <p className="text-[10px] font-bold text-red-500 ml-2">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                    type="tel"
                    placeholder="24"
                    maxLength={3}
                    value={age}
                    onChange={(e) => {
                        setAge(e.target.value.replace(/\D/g, ''));
                        setErrors({...errors, age: undefined});
                    }}
                    className={`pl-12 h-14 bg-gray-50 border-none rounded-2xl font-bold transition-all focus-visible:ring-2 ${errors.age ? 'ring-2 ring-red-500' : 'focus-visible:ring-blue-600/20'}`}
                />
              </div>
              {errors.age && <p className="text-[10px] font-bold text-red-500 ml-2">{errors.age}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender/Relation</Label>
              <RadioGroup value={relation} onValueChange={setRelation} className="flex h-14 items-center gap-4 bg-gray-50 px-4 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="m" className="text-blue-600" />
                  <Label htmlFor="m" className="text-xs font-bold cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="f" className="text-blue-600" />
                  <Label htmlFor="f" className="text-xs font-bold cursor-pointer">Female</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <button 
          type="button"
          onClick={handleAdd}
          className="w-full h-14 border-2 border-gray-100 border-dashed rounded-2xl flex items-center justify-center gap-3 text-blue-600 hover:bg-blue-50 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-widest">Add to List</span>
        </button>
      </div>

      {/* Member List */}
      <div className="space-y-4 pt-4">
        {addedMembers.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
            <p className="text-sm font-bold text-gray-400">No family members added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
             {addedMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-50 group hover:border-blue-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-blue-600 font-black">
                        {member.name[0]}
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-gray-900">{member.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Age: {member.age} • {member.relation}
                        </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => onRemoveMember(index)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
