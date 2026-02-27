

/**
 * Analyse a differential tuning and return a human‑readable title/description
 * plus three normalised scale values (0…1).
 */
export function analyzeDifferentialTuning(tuning) {
  const maxValue = 60;
  const accelMidpoint = 25;
  const initialMidpoint = 15;

  // determine a “zone” for the title/description
  const isHighAccel = tuning.accelerationSensitivity >= accelMidpoint;
  const isHighInitial = tuning.initialTorque >= initialMidpoint;
  let title, description;

  if (!isHighAccel && !isHighInitial) {
    title = 'Free Diff / Loose Oversteer';
    description =
      'Very low acceleration and torque. The car will rotate easily and feel very playful ' +
      'but it is unforgiving – drift friendly and prone to snap oversteer.';
  } else if (isHighAccel && !isHighInitial) {
    title = 'Throttle‑Stable Oversteer';
    description =
      'High acceleration sensitivity with low torque pre‑load. You get good rotation on gas, ' +
      'and the car resists mid‑corner snaps. Excellent for power‑on entries.';
  } else if (!isHighAccel && isHighInitial) {
    title = 'Locked Diff / Preloaded Understeer';
    description =
      'High initial torque with low accel response. The rear is planted, it pushes in corners ' +
      'and is very stable, but it is slow in tight sections.';
  } else {
    title = 'Full‑Lock Stability';
    description =
      'Both values are high; the diff is effectively locked. Expect maximum stability, ' +
      'very predictable behaviour, and lots of grip at the cost of rotation.';
  }

  // sliding‑scale metrics

  // grip ↔ drift: more initial torque & less accel → grip
  const gripDriftValue = (() => {
    const grip =
      (tuning.initialTorque + (maxValue - tuning.accelerationSensitivity)) /
      (2 * maxValue);
    return 1 - grip; // 0 = grip, 1 = drift
  })();

  // understeer ↔ oversteer: accel minus initial
  const underOverValue = (() => {
    const diff = tuning.accelerationSensitivity - tuning.initialTorque;
    const norm = (diff / maxValue + 1) / 2;
    return Math.min(Math.max(norm, 0), 1); // 0 = understeer, 1 = oversteer
  })();

  // playful ↔ controllable: braking sensitivity
  const controlPlayValue = Math.min(
    Math.max(tuning.brakingSensitivity / maxValue, 0),
    1
  ); // 0 = playful, 1 = controllable

  // new characteristic: braking lock (soft ↔ aggressive)
  // Soft = low braking sensitivity, Aggressive = high
  const brakeLockValue = Math.min(
    Math.max(tuning.brakingSensitivity / maxValue, 0),
    1
  ); // 0 = soft, 1 = aggressive

  return {
    title,
    description,
    scales: {
      gripDrift: {
        value: gripDriftValue,
        leftLabel: 'Grip',
        rightLabel: 'Drift'
      },
      underOver: {
        value: underOverValue,
        leftLabel: 'Understeer',
        rightLabel: 'Oversteer'
      },
      controlPlay: {
        value: controlPlayValue,
        leftLabel: 'Playful',
        rightLabel: 'Controllable'
      },
      brakeLock: {
        value: brakeLockValue,
        leftLabel: 'Soft Braking',
        rightLabel: 'Aggressive Braking'
      }
    }
  };
}