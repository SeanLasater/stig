export const gripDict = {
  ch: 0.82, cm: 0.90, cs: 0.99,
  sh: 1.05, sm: 1.09, ss: 1.16,
  rh: 1.25, rm: 1.29, rs: 1.33,
};

export const tireNames = {
  CH: 'Comfort Hard',   CM: 'Comfort Medium', CS: 'Comfort Soft',
  SH: 'Sports Hard',    SM: 'Sports Medium',  SS: 'Sports Soft',
  RH: 'Racing Hard',    RM: 'Racing Medium',  RS: 'Racing Soft',
};

// NF = Natural Frequency
// DF = Downforce

/**
 * @typedef {{ frontDF: string, rearDF: string, frontNF: string, rearNF: string, grip: string, tireDisplay: string }} SuccessResult
 * @typedef {{ error: string }} ErrorResult
 * @typedef {SuccessResult | ErrorResult} TuneResult
 */

/**
 * @param {number} weightLbs
 * @param {number} frontPercent
 * @param {string} tire
 * @returns {TuneResult}
 */

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

  const baseNF = grip * 2.0;
  const frontNF = Math.max(1.40, Math.min(3.30, baseNF * 1.06));
  const rearNF = Math.max(1.40, Math.min(3.30, baseNF * 0.94));

  const dfPerLb = 0.11;
  const frontDF = Math.max(0, Math.min(300, frontWeight * grip * dfPerLb));
  const rearDF = Math.max(0, Math.min(300, rearWeight * grip * dfPerLb));

  return {
    frontDF:  frontDF.toFixed(1),
    rearDF:   rearDF.toFixed(1),
    frontNF:  frontNF.toFixed(2),
    rearNF:   rearNF.toFixed(2),
    grip:     grip.toFixed(2),
    tireDisplay: tireNames[tire.toUpperCase()] || tire.toUpperCase(),
  };
}

