// Generate an LSD Behavior Quadrants visualization using Canvas API
// This can be used to create images for Discord or web display

/**
 * Creates a canvas with LSD behavior quadrants for RWD in GT7
 * @param {number} width - Canvas width in pixels (default: 800)
 * @param {number} height - Canvas height in pixels (default: 640)
 * @returns {HTMLCanvasElement} - Canvas element with the visualization
 */
export function createDiffScatterCanvas(width = 800, height = 640) {
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

  return canvas;
}

/**
 * Converts canvas to base64 PNG for Discord embeds
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {string} - Base64 encoded PNG data URL
 */
export function canvasToDataURL(canvas) {
  return canvas.toDataURL('image/png');
}
