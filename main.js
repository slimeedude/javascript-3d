//--- Canvas ---//
const WIDTH = 256, HEIGHT = 128;
const canvas = document.getElementById('pixels');
const ctx = canvas.getContext('2d', { alpha: true });

const imageData = ctx.createImageData(WIDTH, HEIGHT);
const data = imageData.data; // Uint8ClampedArray, length = WIDTH*HEIGHT*4

function update() {
  ctx.putImageData(imageData, 0, 0);
}

//--- Color handling ---//
function hexToRgba(h) {
  if (!h) return [0, 0, 0, 0];
  h = h.replace('#', '');
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
      255
    ];
  }
  if (h.length === 4) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
      parseInt(h[3] + h[3], 16)
    ];
  }
  if (h.length === 6) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
      255
    ];
  }
  if (h.length === 8) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
      parseInt(h.slice(6, 8), 16)
    ];
  }
  return [0, 0, 0, 0];
}

//--- Drawing ---//
function clear(hexColor = '#00000000') {
  const [r,g,b,a] = hexToRgba(hexColor);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i+1] = g;
    data[i+2] = b;
    data[i+3] = a;
  }
}

function setPixel(x, y, hexColor) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
  const idx = (y * WIDTH + x) * 4;
  const [r, g, b, a] = hexToRgba(hexColor);
  data[idx] = r;
  data[idx + 1] = g;
  data[idx + 2] = b;
  data[idx + 3] = a;
}

//--- idk ---//
function renderLoop() {

  // Tests
  setPixel(1, 1, "#FF0000FF")

  update();

  requestAnimationFrame(renderLoop);
}

renderLoop();
