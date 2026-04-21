import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect, Suspense } from 'react';
import { suppressRechartsWarnings } from '../utils/suppressRechartsWarnings';
import { Loader2 } from 'lucide-react';

export default function App() {
  useEffect(() => {
    suppressRechartsWarnings();
  }, []);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 space-y-4 font-sans">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center p-4 border border-gray-100 animate-pulse ring-4 ring-blue-50/50">
           <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-gray-900 font-black text-xs uppercase tracking-[0.2em] mb-1">Mukh Swasthya Hub</p>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Initializing Portal...</p>
        </div>
      </div>
    }>
      <RouterProvider router={router} />
      <Toaster />
    </Suspense>
  );
}