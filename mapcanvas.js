// js/mapCanvas.js
/**
 * @module mapCanvas
 * Purpose: Draw procedural grid and pulsing markers on #map-canvas.
 */
export function drawMap() {
  const canvas = document.getElementById('map-canvas');
  const ctx = canvas.getContext('2d');
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function render() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#b0b0b0';
    ctx.lineWidth = 1;
    // Draw grid
    const step = 50;
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    // Draw pulsing markers
    const now = Date.now() / 500;
    const radius = 5 + Math.abs(Math.sin(now)) * 3;
    ctx.fillStyle = '#ff7f11';
    ctx.beginPath();
    ctx.arc(w * 0.3, h * 0.4, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.7, h * 0.6, radius, 0, 2 * Math.PI);
    ctx.fill();

    requestAnimationFrame(render);
  }

  render();
}
