import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DealerQRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealerId: string;
}

export function DealerQRModal({ open, onOpenChange, dealerId }: DealerQRModalProps) {
  const qrData = JSON.stringify({
    type: 'DEALER',
    dealerId: dealerId,
    timestamp: new Date().toISOString(),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 bg-gradient-to-b from-gray-800 to-gray-900 border-0 text-white">
        <DialogTitle className="sr-only">Dealer QR Code</DialogTitle>
        <DialogDescription className="sr-only">
          QR code for dealer {dealerId} to confirm kit receipt
        </DialogDescription>
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">Scan to Confirm Receipt</h2>
          </div>
        </div>

        {/* Dealer ID Display */}
        <div className="px-6 py-3">
          <div className="border-2 border-blue-500 rounded-lg p-3 text-center bg-gray-800/50">
            <p className="text-sm text-gray-300 mb-1">Dealer ID</p>
            <p className="text-xl font-bold text-white">{dealerId}</p>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-2xl p-8 shadow-2xl relative">
            {/* Corner Decorations */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-gray-300 rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-gray-300 rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-gray-300 rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-gray-300 rounded-br-lg"></div>
            
            {/* QR Code with Frame */}
            <div className="border-8 border-yellow-700 rounded-xl p-4 bg-white shadow-inner">
              <QRCodeSVG
                value={qrData}
                size={200}
                level="H"
                includeMargin={false}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-300 mb-2">
            This is your standard dealer QR. The user scans this to confirm receipt.
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Static Dealer QR
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}