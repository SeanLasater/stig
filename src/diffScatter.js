// Helper to generate a QuickChart config for three gauges in one image
export function makeCombinedGaugeChartConfig(analysis) {
  // Each gauge: value, leftLabel, rightLabel, color
  const gauges = [
    {
      value: analysis.scales.gripDrift.value,
      left: analysis.scales.gripDrift.leftLabel,
      right: analysis.scales.gripDrift.rightLabel,
      color: '#4dff4d',
      y: 60,
      label: 'Grip vs Drift',
    },
    {
      value: analysis.scales.underOver.value,
      left: analysis.scales.underOver.leftLabel,
      right: analysis.scales.underOver.rightLabel,
      color: '#ffb84d',
      y: 180,
      label: 'Understeer vs Oversteer',
    },
    {
      value: analysis.scales.controlPlay.value,
      left: analysis.scales.controlPlay.leftLabel,
      right: analysis.scales.controlPlay.rightLabel,
      color: '#4da6ff',
      y: 300,
      label: 'Playful vs Controllable',
    },
  ];

  // Compose a QuickChart config with three half-doughnuts using Chart.js v3+ scriptable options
  return {
    type: 'chart',
    data: {},
    options: {},
    plugins: [
      {
        id: 'multiGauge',
        afterDraw: function(chart) {
          const ctx = chart.ctx;
          gauges.forEach((g, i) => {
            // Draw gauge arc
            const cx = chart.width / 2;
            const cy = g.y;
            const r = 50;
            const start = Math.PI;
            const end = Math.PI + Math.PI * g.value;
            ctx.save();
            ctx.lineWidth = 18;
            ctx.strokeStyle = g.color;
            ctx.beginPath();
            ctx.arc(cx, cy, r, start, end, false);
            ctx.stroke();
            ctx.lineWidth = 18;
            ctx.strokeStyle = '#eee';
            ctx.beginPath();
            ctx.arc(cx, cy, r, end, Math.PI * 2, false);
            ctx.stroke();
            ctx.restore();
            // Draw pointer
            const pointerAngle = start + Math.PI * g.value;
            const px = cx + r * Math.cos(pointerAngle);
            const py = cy + r * Math.sin(pointerAngle);
            ctx.save();
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px - 7, py - 18);
            ctx.lineTo(px + 7, py - 18);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            // Draw labels
            ctx.save();
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText(g.left, cx - r, cy - 60);
            ctx.textAlign = 'right';
            ctx.fillText(g.right, cx + r, cy - 60);
            ctx.textAlign = 'center';
            ctx.font = '12px Arial';
            ctx.fillText(g.label, cx, cy + 30);
            ctx.restore();
          });
        }
      }
    ]
  };
}
// Generate an LSD Behavior Quadrants visualization using Canvas API
// This can be used to create images for Discord or web display

/**
 * Creates a canvas with LSD behavior quadrants and plots a tuning point
 * (legacy; kept for compatibility)
 */
export function createDiffScatterCanvas(tuning, width = 800, height = 640) {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  
  if (!canvas) {
    throw new Error('Canvas API is only available in browser environments');
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Configuration
  const padding = 60;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const maxValue = 60;
  const accelMidpoint = 25;
  const initialMidpoint = 15;

  // Helper function to convert data coordinates to canvas pixels
  function dataToPixel(x, y) {
    const pixelX = padding + (x / maxValue) * plotWidth;
    const pixelY = height - padding - (y / maxValue) * plotHeight;
    return { pixelX, pixelY };
  }

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeRect(padding, padding, plotWidth, plotHeight);

  // Draw axis labels
  ctx.fillStyle = '#000000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Acceleration Sensitivity (Low to High)', width / 2, height - 20);
  
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Initial Torque (Low to High)', 0, 0);
  ctx.restore();

  // Draw title
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Predicted LSD Behavior Quadrants for RWD in GT7', width / 2, 30);

  // Draw quadrant dividing lines
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  
  const accelLine = dataToPixel(accelMidpoint, 0);
  const initialLine = dataToPixel(0, initialMidpoint);
  
  ctx.beginPath();
  ctx.moveTo(accelLine.pixelX, padding);
  ctx.lineTo(accelLine.pixelX, height - padding);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(padding, initialLine.pixelY);
  ctx.lineTo(width - padding, initialLine.pixelY);
  ctx.stroke();
  
  ctx.setLineDash([]);

  // Define quadrants: { x1, y1, width, height, color, label, description }
  const quadrants = [
    {
      x: 0, y: 0, width: accelMidpoint, height: initialMidpoint,
      color: 'rgba(255, 0, 0, 0.15)',
      label: 'Loose Oversteer',
      description: '(Agile but Unforgiving)\nDrift Mode - Fun, Low Stability'
    },
    {
      x: accelMidpoint, y: 0, width: maxValue - accelMidpoint, height: initialMidpoint,
      color: 'rgba(255, 165, 0, 0.15)',
      label: 'Throttle-Stable Oversteer',
      description: '(Responsive Exit Specialist)\nExit Hero - Rotation on Entry'
    },
    {
      x: 0, y: initialMidpoint, width: accelMidpoint, height: maxValue - initialMidpoint,
      color: 'rgba(255, 255, 0, 0.15)',
      label: 'Preloaded Understeer',
      description: '(Locked but Pushy)\nPush Mode - Stable, Slow in Tights'
    },
    {
      x: accelMidpoint, y: initialMidpoint, width: maxValue - accelMidpoint, height: maxValue - initialMidpoint,
      color: 'rgba(0, 128, 0, 0.15)',
      label: 'Full-Lock Stability',
      description: '(Planted All-Around)\nSafe Cruiser - Grip Everywhere'
    }
  ];

  // Draw quadrants
  quadrants.forEach((quad) => {
    const topLeft = dataToPixel(quad.x, quad.y + quad.height);
    const bottomRight = dataToPixel(quad.x + quad.width, quad.y);
    
    ctx.fillStyle = quad.color;
    ctx.fillRect(
      topLeft.pixelX,
      bottomRight.pixelY,
      bottomRight.pixelX - topLeft.pixelX,
      topLeft.pixelY - bottomRight.pixelY
    );
  });

  // Draw quadrant labels
  ctx.font = '11px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  quadrants.forEach((quad) => {
    const centerX = quad.x + quad.width / 2;
    const centerY = quad.y + quad.height / 2;
    const center = dataToPixel(centerX, centerY);

    // Draw label
    ctx.font = 'bold 11px Arial';
    ctx.fillText(quad.label, center.pixelX, center.pixelY - 15);

    // Draw description
    ctx.font = '9px Arial';
    const lines = quad.description.split('\n');
    lines.forEach((line, index) => {
      ctx.fillText(line, center.pixelX, center.pixelY + (index - 0.5) * 12);
    });
  });

  // Draw grid
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 0.5;
  const gridStep = 10;
  for (let i = 0; i <= maxValue; i += gridStep) {
    const x = dataToPixel(i, 0);
    const y = dataToPixel(0, i);
    
    ctx.beginPath();
    ctx.moveTo(x.pixelX, padding);
    ctx.lineTo(x.pixelX, height - padding);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, y.pixelY);
    ctx.lineTo(width - padding, y.pixelY);
    ctx.stroke();
  }

  // Draw axis values
  ctx.font = '10px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (let i = 0; i <= maxValue; i += 10) {
    const x = dataToPixel(i, 0);
    ctx.fillText(i, x.pixelX, height - padding + 5);
  }

  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= maxValue; i += 10) {
    const y = dataToPixel(0, i);
    ctx.fillText(i, padding - 10, y.pixelY);
  }

  // Plot the tuning point
  const tuningPoint = dataToPixel(tuning.accelerationSensitivity, tuning.initialTorque);
  
  // Draw point with size based on braking sensitivity
  const pointRadius = 10 + (tuning.brakingSensitivity / 60) * 5;
  ctx.fillStyle = '#0066ff';
  ctx.beginPath();
  ctx.arc(tuningPoint.pixelX, tuningPoint.pixelY, pointRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw point border
  ctx.strokeStyle = '#003399';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw tuning info box
  const infoX = tuningPoint.pixelX + 30;
  const infoY = tuningPoint.pixelY - 50;
  const boxWidth = 200;
  const boxHeight = 90;

  // Draw semi-transparent background for info box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(infoX, infoY, boxWidth, boxHeight);
  
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.strokeRect(infoX, infoY, boxWidth, boxHeight);

  // Draw tuning values
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.fillText('Your Tuning:', infoX + 8, infoY + 8);
  
  ctx.font = '10px Arial';
  ctx.fillText(`Accel: ${tuning.accelerationSensitivity.toFixed(1)}`, infoX + 8, infoY + 25);
  ctx.fillText(`Initial: ${tuning.initialTorque.toFixed(1)}`, infoX + 8, infoY + 40);
  ctx.fillText(`Braking: ${tuning.brakingSensitivity.toFixed(1)}`, infoX + 8, infoY + 55);

  // Determine which quadrant
  const isHighAccel = tuning.accelerationSensitivity >= accelMidpoint;
  const isHighInitial = tuning.initialTorque >= initialMidpoint;
  
  let quadrantName = '';
  if (!isHighAccel && !isHighInitial) quadrantName = 'Loose Oversteer';
  else if (isHighAccel && !isHighInitial) quadrantName = 'Throttle-Stable Oversteer';
  else if (!isHighAccel && isHighInitial) quadrantName = 'Preloaded Understeer';
  else quadrantName = 'Full-Lock Stability';

  ctx.font = '9px Arial';
  ctx.fillText(`Zone: ${quadrantName}`, infoX + 8, infoY + 70);

  return canvas;
}

/**
 * Converts canvas to base64 PNG for Discord embeds
 */
export function canvasToDataURL(canvas) {
  return canvas.toDataURL('image/png');
}

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
      }
    }
  };
}

// Helper that draws one horizontal bar with a two‑colour gradient and a
// vertical marker showing `value` (0…1).  The labels are drawn above the bar.
function drawScaleBar(ctx, x, y, width, height, value, leftLabel, rightLabel) {
  // gradient from red (left) to green (right) – feel free to adjust colours
  const grad = ctx.createLinearGradient(x, y, x + width, y);
  grad.addColorStop(0, '#ff4d4d');
  grad.addColorStop(1, '#4dff4d');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, width, height);

  // marker line
  const markerX = x + Math.round(value * width);
  ctx.fillStyle = '#000';
  ctx.fillRect(markerX - 2, y, 4, height);

  // labels
  ctx.fillStyle = '#000';
  ctx.font = '10px Arial';
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'left';
  ctx.fillText(leftLabel, x + 2, y - 2);
  ctx.textAlign = 'right';
  ctx.fillText(rightLabel, x + width - 2, y - 2);
}

/**
 * Combine the three sliding scales into a single image and return a PNG data url.
 * Works in both browser (uses <canvas>) and Cloudflare Worker (OffscreenCanvas).
 *
 * @param {object} analysis result from `analyzeDifferentialTuning`
 * @param {number} [width=400]
 * @returns {Promise<string>} data url
 */
export async function createScalePoster(analysis, width = 400) {
  const barHeight = 30;
  const padding = 10;
  const totalHeight = padding + 3 * (barHeight + padding);

  let canvas = null;
  if (typeof document !== 'undefined') {
    canvas = document.createElement('canvas');
  } else if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(width, totalHeight);
  }
  if (!canvas) {
    throw new Error('Canvas API is not available in this environment');
  }
  canvas.width = width;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');

  // white background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, totalHeight);

  const scales = [
    analysis.scales.gripDrift,
    analysis.scales.underOver,
    analysis.scales.controlPlay,
  ];

  for (let i = 0; i < scales.length; i++) {
    const s = scales[i];
    const y = padding + i * (barHeight + padding);
    drawScaleBar(ctx, 0, y, width, barHeight, s.value, s.leftLabel, s.rightLabel);
  }

  // convert to data url
  if (canvas.convertToBlob) {
    const blob = await canvas.convertToBlob();
    const buf = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    buf.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return 'data:image/png;base64,' + btoa(binary);
  } else if (canvas.toDataURL) {
    return canvas.toDataURL('image/png');
  }
  throw new Error('Unable to convert canvas to data URL');
}

/**
 * Draw a single horizontal sliding‑scale bar and return the canvas.
 */
export function createSlidingScaleCanvas(
  value,
  leftLabel,
  rightLabel,
  width = 350,
  height = 60
) {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) throw new Error('Canvas API is only available in browser environments');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Bar dimensions
  const barX = 40;
  const barY = 28;
  const barWidth = width - 2 * barX;
  const barHeight = 16;

  // Draw gradient bar
  const grad = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
  grad.addColorStop(0, "#ff4d4d");    // red
  grad.addColorStop(0.5, "#ffff66");  // yellow
  grad.addColorStop(1, "#4dff4d");    // green
  ctx.fillStyle = grad;
  ctx.fillRect(barX, barY, barWidth, barHeight);
  ctx.strokeStyle = "#888";
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  // Draw ticks and numbers
  ctx.font = "10px Arial";
  ctx.fillStyle = "#222";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const numTicks = 10;
  for (let i = 0; i <= numTicks; i++) {
    const x = barX + (i / numTicks) * barWidth;
    ctx.beginPath();
    ctx.moveTo(x, barY + barHeight);
    ctx.lineTo(x, barY + barHeight + 7);
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillText(i, x, barY + barHeight + 8);
  }

  // Draw pointer (triangle) above the bar
  const pointerX = barX + value * barWidth;
  const pointerY = barY - 6;
  ctx.beginPath();
  ctx.moveTo(pointerX, pointerY);
  ctx.lineTo(pointerX - 7, pointerY - 12);
  ctx.lineTo(pointerX + 7, pointerY - 12);
  ctx.closePath();
  ctx.fillStyle = "#222";
  ctx.fill();

  // Draw labels above bar
  ctx.font = "bold 13px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(leftLabel, barX, barY - 18);
  ctx.textAlign = "right";
  ctx.fillText(rightLabel, barX + barWidth, barY - 18);

  return canvas;
}

/**
 * Convenience helper – run the analysis and produce data‑URLs for
 * the three sliding‑scale images.
 */
export function generateDiffVisuals(tuning) {
  const analysis = analyzeDifferentialTuning(tuning);
  const scaleImages = {};
  Object.entries(analysis.scales).forEach(
    ([key, { value, leftLabel, rightLabel }]) => {
      const canvas = createSlidingScaleCanvas(value, leftLabel, rightLabel);
      scaleImages[key] = canvasToDataURL(canvas);
    }
  );

  return {
    title: analysis.title,
    description: analysis.description,
    scaleImages
  };
}
