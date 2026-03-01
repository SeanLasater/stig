

/**
 * Analyse a differential tuning and return a human‑readable title/description
 * plus three normalised scale values (0…1).
 */
export function analyzeDifferentialTuning(tuning) {
  const maxValue = 60;

  // Create 4 zones for each parameter to generate 16 unique combinations
  const accelZone = Math.floor((tuning.accelerationSensitivity / maxValue) * 4);
  const initialZone = Math.floor((tuning.initialTorque / maxValue) * 4);

  // 16 unique tuning profiles in a 4x4 matrix
  // Rows: accel zones (0-3), Columns: initial torque zones (0-3)
  const profiles = [
    // Very Low Accel (0-15)
    [
      { title: 'Freewheel', description: 'Ultra-loose differential with minimal lock. Extremely responsive to steering inputs, snap oversteer prone. For drift specialists only.' },
      { title: 'Drift Prone', description: 'Very low accel, low-mid preload. The car rotates easily but feels unstable mid-corner. Quick inputs necessary.' },
      { title: 'Tail-Happy', description: 'Low accel with moderate preload. Easier control than pure drift, but rear stays light. Good for drifters learning stability.' },
      { title: 'Rear-Light GTR', description: 'Low accel, high preload. Paradoxically light-feeling in the rear despite high preload; unusual and demanding setup.' }
    ],
    // Low Accel (15-30)
    [
      { title: 'Loose Street', description: 'Low accel sensitivity with no preload. Street-car feel with plenty of rotational freedom. Twitchy on limit.' },
      { title: 'Neutral Free', description: 'Both parameters low-mid. Balanced oversteer bias with smooth, progressive feel. Great for learning smooth inputs.' },
      { title: 'Progressive Lock', description: 'Low accel, moderate-high preload. Locks in progressively, resisting sudden yaw swings. Confidence-inspiring mid-corner.' },
      { title: 'Staged Lock', description: 'Low accel, very high preload. Locked feel without maximum stiffness. Planted rear, playful at the limit.' }
    ],
    // High Accel (30-45)
    [
      { title: 'Throttle Pop', description: 'High accel sensitivity, minimal preload. Spins up instantly on power application. Requires precise throttle modulation.' },
      { title: 'Gas Responsive', description: 'High accel, low-mid preload. Snappy on-throttle response with acceptable stability. Good power-on control.' },
      { title: 'Accel Stable', description: 'High accel sensitivity with moderate preload. Excellent throttle feel and rotation; resists snap oversteer well.' },
      { title: 'Power-Lock Hybrid', description: 'High accel, high preload. Maximum on-power rotation combined with strong mid-field stability. Fast-car setup.' }
    ],
    // Very High Accel (45-60)
    [
      { title: 'Max Rotation', description: 'Maximum accel, minimum preload. Spins at a breath; extremely sensitive and demanding. Track-only drift setup.' },
      { title: 'Radical Throttle', description: 'Very high accel, low preload. Extreme on-power rotation. Loses grip quick; expert drivers only.' },
      { title: 'Killer Combos', description: 'Very high accel and moderate preload. Rotation on demand with surprising mid-corner grip. Unpredictable and rewarding.' },
      { title: 'Full-Bore Lock', description: 'Maximum accel and maximum preload. Fully-locked, ultra-aggressive feel. Race-tuned, unforgiving, lightning-fast.' }
    ]
  ];

  const profile = profiles[accelZone][initialZone];
  const title = profile.title;
  const description = profile.description;

  // sliding-scale metrics

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
