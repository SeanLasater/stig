// src/server.js
// EXAMPLE

// Tuning constants
export const DF_PER_LB = 0.11;
export const BASE_NF_MULTIPLIER = 2.0;
export const FRONT_NF_ADJUST = 1.06;
export const REAR_NF_ADJUST = 0.94;
export const NF_MIN = 1.40;
export const NF_MAX = 3.30;
export const DF_MIN = 0;
export const DF_MAX = 300;

export function calculateGripTune(weightLbs, frontPercent, tire) {
  const tireKey = tire.toLowerCase();
  const grip = gripDict[tireKey] ?? 1.0;

  if (frontPercent < 30 || frontPercent > 70) {
    return { error: 'Front weight % must be between 30 and 70.' };
  }

  const frontRatio = frontPercent / 100;
  const rearRatio = 1 - frontRatio;

  const frontWeight = weightLbs * frontRatio;
  const rearWeight = weightLbs * rearRatio;

  const baseNF = grip * BASE_NF_MULTIPLIER;
  const frontNF = Math.max(NF_MIN, Math.min(NF_MAX, baseNF * FRONT_NF_ADJUST));
  const rearNF = Math.max(NF_MIN, Math.min(NF_MAX, baseNF * REAR_NF_ADJUST));

  const frontDF = Math.max(DF_MIN, Math.min(DF_MAX, frontWeight * grip * DF_PER_LB));
  const rearDF = Math.max(DF_MIN, Math.min(DF_MAX, rearWeight * grip * DF_PER_LB));

  return {
    frontDF: frontDF.toFixed(1),
    rearDF: rearDF.toFixed(1),
    frontNF: frontNF.toFixed(2),
    rearNF: rearNF.toFixed(2),
    grip: grip.toFixed(2),
    tireDisplay: tireNames[tire.toUpperCase()] || tire.toUpperCase(),
  };
}

export function calculateDownforce(level, tireCompound = 'medium') {
  const baseDownforce = level * 10;  // Simplified: e.g., level 1-10 → 10-100 units
  const grip = tireGripData[tireCompound].lateralGrip;
  const adjustedDownforce = baseDownforce * grip;
  
  // More complex logic: e.g., aero efficiency, drag penalty
  const dragPenalty = level * 2;  // Higher downforce = more drag
  return {
    downforce: adjustedDownforce,
    topSpeedLoss: dragPenalty,
    corneringGain: grip * level,
  };
}