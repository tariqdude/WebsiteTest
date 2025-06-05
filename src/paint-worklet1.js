// paint-worklet.js (inside /assets/svg or root depending on path)
/**
 * CSS Paint Worklet: Procedural Steel I-Beam
 */
registerPaint('steelIBeam', class {
  static get inputProperties() {
    return ['--beam-color'];
  }
  paint(ctx, size, props) {
    const color = props.get('--beam-color').toString() || '#1a2b4c';
    ctx.fillStyle = color;
    const w = size.width, h = size.height;
    const flangeH = h * 0.2;
    ctx.fillRect(0, 0, w, flangeH);                              // top flange
    ctx.fillRect((w - flangeH * 0.4) / 2, flangeH, flangeH * 0.4, h - 2 * flangeH); // web
    ctx.fillRect(0, h - flangeH, w, flangeH);                     // bottom flange
  }
});
