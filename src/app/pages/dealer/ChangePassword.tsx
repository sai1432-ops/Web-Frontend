import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { RetrofitClient } from '../../network/RetrofitClient';
import { toast } from 'sonner';

export function DealerChangePassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const validate = () => {
    if (formData.newPassword.length < 6) {
      setErrorText("New password must be at least 6 characters");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorText("Passwords do not match");
      return false;
    }
    setErrorText(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await RetrofitClient.apiService.changeDealerPassword('', {
        oldPassword: formData.currentPassword, 
        newPassword: formData.newPassword
      });

      if (!response.isSuccessful) {
        throw new Error(await response.errorBody?.string() || "Failed to update password");
      }

      toast.success("Password updated successfully!");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const DealerGreen = "#047857";

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative flex flex-col">
      {/* Dynamic Header Background */}
      <div 
        className="absolute top-0 left-0 right-0 h-[300px] z-0"
        style={{ 
          background: `linear-gradient(to bottom, ${DealerGreen}, #065f46, #064e3b)` 
        }}
      ></div>

      {/* Navigation Header */}
      <header className="relative z-10 flex items-center px-6 py-6 text-white">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-white/10 text-white mr-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-black tracking-tight uppercase">Change Password</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 pb-12 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mt-8"
        >
          <Card className="p-8 rounded-[2.5rem] border-none shadow-2xl shadow-black/5 bg-white space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: `${DealerGreen}15` }}
              >
                <Lock className="w-8 h-8" style={{ color: DealerGreen }} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Update Security</h2>
              <p className="text-sm font-bold text-gray-400 max-w-[280px]">
                Ensure your new password is secure and at least 6 characters long.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <PasswordField 
                label="Current Password"
                value={formData.currentPassword}
                onChange={(val) => setFormData({...formData, currentPassword: val})}
                show={showPass.current}
                onToggle={() => setShowPass({...showPass, current: !showPass.current})}
                accent={DealerGreen}
              />

              <PasswordField 
                label="New Password"
                value={formData.newPassword}
                onChange={(val) => setFormData({...formData, newPassword: val})}
                show={showPass.new}
                onToggle={() => setShowPass({...showPass, new: !showPass.new})}
                accent={DealerGreen}
              />

              <PasswordField 
                label="Confirm New Password"
                value={formData.confirmPassword}
                onChange={(val) => setFormData({...formData, confirmPassword: val})}
                show={showPass.confirm}
                onToggle={() => setShowPass({...showPass, confirm: !showPass.confirm})}
                accent={DealerGreen}
              />

              {errorText && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">{errorText}</span>
                </motion.div>
              )}

              <div className="pt-6">
                <Button 
                  disabled={isLoading}
                  style={{ backgroundColor: DealerGreen }}
                  className="w-full h-16 rounded-2xl hover:brightness-110 text-white font-black tracking-widest uppercase text-sm shadow-xl shadow-green-900/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Update Password
                      <CheckCircle2 className="w-5 h-5 opacity-50" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        <p className="mt-10 text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-center max-w-[240px] leading-loose">
          Security is our top priority. Never share your password with anyone.
        </p>
      </main>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, accent }: { 
  label: string, 
  value: string, 
  onChange: (val: string) => void, 
  show: boolean, 
  onToggle: () => void, 
  accent: string 
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <Input 
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="h-14 px-5 bg-gray-50 border-none rounded-2xl focus-visible:ring-2 text-gray-900 font-bold placeholder:text-gray-300 transition-all"
          style={{ '--tw-ring-color': `${accent}20` } as any}
        />
        <button 
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
