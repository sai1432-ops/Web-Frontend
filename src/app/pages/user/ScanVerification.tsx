import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { QrCode, Camera, Upload, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export function ScanVerification() {
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'failed' | null>(null);

  const handleScan = () => {
    setScanned(true);
    // Simulate scan result
    setTimeout(() => {
      setScanResult('success');
    }, 1000);
  };

  const scanHistory = [
    { id: 'SCAN-045', date: 'Mar 13, 2026', time: '09:30 AM', product: 'Toothbrush Set', status: 'Verified', points: 10 },
    { id: 'SCAN-044', date: 'Mar 10, 2026', time: '02:15 PM', product: 'Dental Floss', status: 'Verified', points: 5 },
    { id: 'SCAN-043', date: 'Mar 08, 2026', time: '11:20 AM', product: 'Mouthwash', status: 'Verified', points: 8 },
  ];

  return (
    <DashboardLayout role="user" title="Scan & Verify">
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scanner */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code</h3>
            
            {!scanned ? (
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <Button onClick={handleScan} className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                    <Camera className="w-4 h-4" />
                    Open Camera to Scan
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Upload className="w-4 h-4" />
                    Upload QR Image
                  </Button>
                </div>
              </div>
            ) : scanResult === null ? (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Scanning...</p>
                </div>
              </div>
            ) : scanResult === 'success' ? (
              <div className="space-y-4">
                <div className="aspect-square bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <CheckCircle className="w-32 h-32 text-green-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Verification Successful!</h4>
                    <p className="text-gray-600">Product verified and points added</p>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Product</span>
                    <span className="text-sm font-medium text-gray-900">Toothbrush Premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Batch Number</span>
                    <span className="text-sm font-medium text-gray-900">BT2026-0313</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Points Earned</span>
                    <span className="text-sm font-medium text-green-600">+10 Points</span>
                  </div>
                </div>
                <Button onClick={() => { setScanned(false); setScanResult(null); }} className="w-full">
                  Scan Another
                </Button>
              </div>
            ) : null}
          </Card>

          {/* Info & Rewards */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <h3 className="text-lg font-semibold mb-2">Your Rewards</h3>
              <p className="text-4xl font-bold mb-2">156 Points</p>
              <p className="text-blue-100 text-sm">Keep scanning to earn more rewards!</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Scan</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <p className="text-sm text-gray-600">Find the QR code on your product packaging</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <p className="text-sm text-gray-600">Click "Open Camera to Scan" and point at the QR code</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <p className="text-sm text-gray-600">Wait for verification and earn points!</p>
                </li>
              </ol>
            </Card>
          </div>
        </div>

        {/* Scan History */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan History</h3>
          <div className="space-y-3">
            {scanHistory.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{scan.product}</p>
                    <p className="text-sm text-gray-600">{scan.id} • {scan.date} at {scan.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+{scan.points} Points</p>
                  <p className="text-sm text-gray-600">{scan.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
