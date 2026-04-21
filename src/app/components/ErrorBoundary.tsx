import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';

export function ErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage = "An unexpected error occurred.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-10 text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 ring-4 ring-red-50/50">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
          {errorStatus === 404 ? "Page Not Found" : "Something went wrong"}
        </h1>
        
        <p className="text-gray-500 font-medium leading-relaxed mb-10">
          {errorStatus === 404 
            ? "The page you are looking for doesn't exist or has been moved."
            : errorMessage}
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            asChild
            className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200"
          >
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => window.location.reload()}
            className="h-14 rounded-2xl text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-50"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
            Error Code: {errorStatus} • Mukh Swasthya Hub
          </p>
        </div>
      </div>
    </div>
  );
}
