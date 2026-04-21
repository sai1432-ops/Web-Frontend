import QRScanner from './QRScanner';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { RetrofitClient } from '../../network/RetrofitClient';
import { SessionManager } from '../../utils/SessionManager';

function normalizeDealerQrInput(raw: string): string {
  return raw.trim();
}

export function ScanDealerQR() {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const scanLock = useRef(false);

  const handleResult = async (result: string) => {
    if (scanLock.current) return;

    const qrValue = normalizeDealerQrInput(result);
    if (!qrValue) return;

    scanLock.current = true;
    setIsVerifying(true);

    const userId = SessionManager.getUserId();

    // Read kit quantities saved from ConfirmKitReceipt screen
    const preliminaryDataStr = localStorage.getItem('preliminaryKitData');
    const premData = preliminaryDataStr ? JSON.parse(preliminaryDataStr) : null;

    const brushQuantity  = premData?.brushQuantity  ?? 1;
    const pasteQuantity  = premData?.pasteQuantity  ?? 1;
    const iecQuantity    = premData?.iecQuantity     ?? 1;
    const oldKitReturned = premData?.oldKitReturned === 'yes';
    const totalMembers   = premData?.totalFamilyMembers ?? 1;

    try {
      // STEP 1: Verification & Creation
      const response = await RetrofitClient.apiService.confirmKitByDealerQR(
        userId,
        qrValue,
        brushQuantity,
        pasteQuantity,
        iecQuantity,
        oldKitReturned
      );

      if (!response?.isSuccessful) {
        const errMsg =
          response?.errorBody?.string() ||
          (response?.body as any)?.error ||
          (response?.body as any)?.message ||
          'Invalid dealer QR. Please try again.';
        throw new Error(errMsg);
      }

      // Extract kit_unique_id
      const responseData = response.body?.data || response.body || {};
      const kitUniqueId = responseData.kit_unique_id;

      if (!kitUniqueId) {
        throw new Error('Verification successful, but no kit ID was returned.');
      }

      // STEP 2: Final Confirmation
      const confirmResponse = await RetrofitClient.apiService.confirmKitReceipt(
        userId,
        qrValue,
        kitUniqueId,
        brushQuantity,
        pasteQuantity,
        iecQuantity,
        oldKitReturned
      );

      if (!confirmResponse?.isSuccessful) {
        const errMsg =
          confirmResponse?.errorBody?.string() ||
          (confirmResponse?.body as any)?.message ||
          'Final kit confirmation failed';
        throw new Error(errMsg);
      }

      // Build receipt summary from what the backend returned
      const payload = confirmResponse.body?.data ?? confirmResponse.body ?? {};

      const receiptData = {
        brushReceived:  payload?.brush_received  ?? brushQuantity,
        pasteReceived:  payload?.paste_received  ?? pasteQuantity,
        iecReceived:    payload?.iec_received    ?? iecQuantity,
        returnedOldKit: payload?.old_kit_returned === true
          ? 'yes'
          : (oldKitReturned ? 'yes' : 'no'),
        timestamp: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        totalKits:        totalMembers,
        dealerQrValue:    qrValue,
        show_red_alert:   payload?.show_red_alert    ?? (!oldKitReturned),
        red_alert_message: payload?.red_alert_message ?? (!oldKitReturned ? 'Old kit pending return' : undefined),
        isConfirmed: true,
      };

      localStorage.setItem('pendingKitReceipt', JSON.stringify(receiptData));
      localStorage.removeItem('preliminaryKitData');

      toast.success(confirmResponse.body?.message || 'Kit confirmed successfully!');
      navigate('/user/kit-received');
    } catch (e: any) {
      toast.error(e?.message || 'Invalid dealer QR');
      scanLock.current = false;  // Allow re-scan on error
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <QRScanner
        onClose={() => navigate('/user/confirm-kit-receipt')}
        onResult={handleResult}
        scanModeLabel={isVerifying ? 'Confirming kit...' : 'Scan Dealer QR'}
      />
    </div>
  );
}