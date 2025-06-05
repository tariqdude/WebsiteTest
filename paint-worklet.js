// paint-worklet.js
/**
 * @module paintWorklet
 * Purpose: Register CSS Paint Worklet for procedural steel I-beam drawing.
 */
if ('CSS' in window && CSS.paintWorklet) {
  CSS.paintWorklet.addModule('paint-worklet.js');
}
