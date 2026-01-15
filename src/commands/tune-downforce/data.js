// All static data, constants and core calculation logic

export const gripDict = {
  ch: 0.82, cm: 0.90, cs: 0.99,
  sh: 1.05, sm: 1.09, ss: 1.16,
  rh: 1.25, rm: 1.29, rs: 1.33,
};

export const tireNames = {
  CH: 'Comfort Hard', CM: 'Comfort Medium', CS: 'Comfort Soft',
  SH: 'Sports Hard', SM: 'Sports Medium', SS: 'Sports Soft',
  RH: 'Racing Hard', RM: 'Racing Medium', RS: 'Racing Soft',
};

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