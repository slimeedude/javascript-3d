//--- Canvas ---//
const WIDTH = 256, HEIGHT = 128;
const canvas = document.getElementById('pixels');
const ctx = canvas.getContext('2d', { alpha: true });

const imageData = ctx.createImageData(WIDTH, HEIGHT);
const data = imageData.data; // Uint8ClampedArray, length = WIDTH*HEIGHT*4
// const depthBuffer = new Array(WIDTH * HEIGHT).fill(Number.MAX_VALUE);

function update() {
  ctx.putImageData(imageData, 0, 0);
}
