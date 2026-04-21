// src/app/components/cards/DiseaseFindingCard.tsx

import React from 'react';
import { Info } from 'lucide-react';
import { Card } from '../ui/card';
import { mapClassName, getConfidenceInfo } from '../../utils/ai-mapping';
import { cn } from '../ui/utils';

interface DiseaseFindingCardProps {
  detection: {
    detectedClass: string;
    confidence: number;
  };
  isPrimary: boolean;
}

export const DiseaseFindingCard: React.FC<DiseaseFindingCardProps> = ({
  detection,
  isPrimary
}) => {
  const mappedName = mapClassName(detection.detectedClass);
  const confidencePercent = (detection.confidence * 100).toFixed(1);
  const { label: confidenceLabel, color: confidenceColor } = getConfidenceInfo(detection.confidence);

  return (
    <Card
      className={cn(
        "w-full overflow-hidden rounded-[2rem] border-none bg-white p-8 shadow-soft-premium transition-all hover:shadow-xl group duration-500",
        isPrimary && "ring-2 ring-blue-100 shadow-lg shadow-blue-50"
      )}
    >
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-gray-50 pb-4">
          <div className="space-y-1.5">
            {isPrimary && (
              <div className="mb-2 inline-flex items-center rounded-xl bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm ring-1 ring-blue-100">
                Primary Diagnosis
              </div>
            )}
            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight uppercase group-hover:text-blue-600 transition-colors">
              {mappedName}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Detected Clinical Marker</p>
          </div>

          <div className="text-right bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <p className="text-2xl font-black text-blue-600 tabular-nums tracking-tighter">
              {confidencePercent}%
            </p>
            <p
              className="text-[10px] font-black uppercase tracking-widest mt-0.5"
              style={{ color: confidenceColor }}
            >
              {confidenceLabel}
            </p>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="flex items-start gap-4 rounded-2xl bg-blue-50/30 p-5 transition-all group-hover:bg-blue-50/50 border border-transparent group-hover:border-blue-100/50">
          <div className="mt-1 bg-blue-100 p-1.5 rounded-lg shrink-0">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-xs font-semibold leading-relaxed text-gray-600">
            <span className="font-black text-gray-900 uppercase tracking-tight block mb-1">AI Diagnostic Insight:</span> 
            Analysis suggests potential {mappedName} in the scanned region. This finding is provided for informational purposes only and requires clinical validation by a certified dental professional.
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2">
           <div className="flex -space-x-1">
              {[1,2,3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full bg-gray-100 border border-white ring-1 ring-gray-50" />
              ))}
           </div>
           <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Source Image</button>
        </div>
      </div>
    </Card>
  );
};
