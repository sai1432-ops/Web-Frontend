import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';

export interface BeneficiaryData {
  fullName: string;
  email: string | null;
  phone: string;
  pdsCard: string;
  age: string;
  gender: string;
  education: string;
  employment: string;
  streetAddress: string;
}

interface BeneficiaryFormProps {
  isLoading?: boolean;
  submitButtonText?: string;
  buttonColor?: string;
  children?: React.ReactNode;
  onSubmit: (data: BeneficiaryData) => void;
}

export function BeneficiaryForm({
  isLoading = false,
  submitButtonText = "CONFIRM & REGISTER",
  buttonColor = "bg-blue-600 hover:bg-blue-700",
  children,
  onSubmit
}: BeneficiaryFormProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [education, setEducation] = useState("");
  const [employment, setEmployment] = useState("");
  const [pdsCard, setPdsCard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const validate = () => {
    const newErrors: Record<string, string | null> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (phone.length !== 10) newErrors.phone = "Enter valid 10-digit phone number";
    if (!age.trim()) newErrors.age = "Age is required";
    if (!pdsCard.trim()) newErrors.pdsCard = "PDS card number is required";
    if (!streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (validate()) {
      onSubmit({
        fullName,
        email: email.trim() || null,
        phone,
        pdsCard,
        age,
        gender,
        education,
        employment,
        streetAddress
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-sm">
          1
        </div>
        <h2 className="text-base font-black text-gray-900 tracking-wider">
          PRIMARY BENEFICIARY
        </h2>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label className="font-bold text-gray-700">Full Name</Label>
          <Input 
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all ${errors.fullName ? "border-red-500 focus:ring-red-500/20" : "focus:ring-blue-500/20"}`}
          />
          {errors.fullName && <p className="text-xs text-red-500 font-medium pl-1">{errors.fullName}</p>}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <Label className="font-bold text-gray-700">Phone Number</Label>
          <Input 
            placeholder="10-digit mobile number"
            type="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className={`h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all ${errors.phone ? "border-red-500 focus:ring-red-500/20" : "focus:ring-blue-500/20"}`}
          />
          {errors.phone && <p className="text-xs text-red-500 font-medium pl-1">{errors.phone}</p>}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <Label className="font-bold text-gray-700">Email Address (Optional)</Label>
          <Input 
            placeholder="example@mail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all focus:ring-blue-500/20"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-4 space-y-1.5">
            <Label className="font-bold text-gray-700">Age</Label>
            <Input 
              placeholder="00"
              maxLength={3}
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))}
              className={`h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all ${errors.age ? "border-red-500 focus:ring-red-500/20" : "focus:ring-blue-500/20"}`}
            />
            {errors.age && <p className="text-xs text-red-500 font-medium pl-1">{errors.age}</p>}
          </div>
          <div className="col-span-6 space-y-2">
            <Label className="font-bold text-gray-700">Gender</Label>
            <RadioGroup defaultValue={gender} onValueChange={setGender} className="flex h-12 items-center gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" className="text-blue-600" />
                  <Label htmlFor="male" className="font-medium cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" className="text-blue-600" />
                  <Label htmlFor="female" className="font-medium cursor-pointer">Female</Label>
                </div>
            </RadioGroup>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-1.5">
            <Label className="font-bold text-gray-700">Educational Level</Label>
            <Select onValueChange={setEducation}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Primary">Primary Education</SelectItem>
                    <SelectItem value="Secondary">Secondary Education</SelectItem>
                    <SelectItem value="Higher">Higher Education</SelectItem>
                    <SelectItem value="None">No formal education</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Employment */}
        <div className="space-y-1.5">
            <Label className="font-bold text-gray-700">Employment Status</Label>
            <Select onValueChange={setEmployment}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* PDS Card No */}
        <div className="space-y-1.5">
          <Label className="font-bold text-gray-700">PDS Card Number</Label>
          <Input 
            placeholder="Enter Card Number"
            value={pdsCard}
            onChange={(e) => setPdsCard(e.target.value.toUpperCase())}
            className={`h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all ${errors.pdsCard ? "border-red-500 focus:ring-red-500/20" : "focus:ring-blue-500/20"}`}
          />
          {errors.pdsCard && <p className="text-xs text-red-500 font-medium pl-1">{errors.pdsCard}</p>}
        </div>

        {/* Street Address */}
        <div className="space-y-1.5">
          <Label className="font-bold text-gray-700">Street Address</Label>
          <Input 
            placeholder="House no, Street name, etc."
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            className={`h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all ${errors.streetAddress ? "border-red-500 focus:ring-red-500/20" : "focus:ring-blue-500/20"}`}
          />
          {errors.streetAddress && <p className="text-xs text-red-500 font-medium pl-1">{errors.streetAddress}</p>}
        </div>
      </div>

      {/* Additional content slot */}
      {children}

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className={`w-full h-14 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 ${buttonColor} text-white`}
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
