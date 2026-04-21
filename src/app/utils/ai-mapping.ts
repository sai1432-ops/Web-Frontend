// src/app/utils/ai-mapping.ts

export const mapClassName = (name: string): string => {
  const map: Record<string, string> = {
    "ToothDiscoloration": "Tooth Discoloration",
    "Caries": "Dental Caries (Cavities)",
    "Gingivitis": "Gingivitis (Gum Inflammation)",
    "Ulcer": "Mouth Ulcer",
    "Plaque": "Plaque Accumulation",
    "Calculus": "Tartar (Calculus)"
  };

  if (map[name]) return map[name];

  // Fallback: convert CamelCase to Space Case
  return name.replace(/([a-z])([A-Z])/g, '$1 $2');
};

export const getConfidenceInfo = (confidence: number) => {
  if (confidence < 0.40) {
    return {
      label: "Low Confidence",
      color: "#9CA3AF" // gray-400
    };
  } else if (confidence <= 0.70) {
    return {
      label: "Moderate Confidence",
      color: "#FB8C00" // orange-600
    };
  } else {
    return {
      label: "High Confidence",
      color: "#E53935" // red-600
    };
  }
};
