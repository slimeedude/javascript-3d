//--- Drawing ---//
function clear(hexColor = '#00000000') {
  const [r, g, b, a] = hexToRgba(hexColor);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  }
}

function setPixel(x, y, color, blend = false) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
  if (blend && color[3] == 0) return;
  const idx = (y * WIDTH + x) * 4;

  const srcA = color[3];
  if (!blend || srcA === 255) {
    data[idx] = color[0];
    data[idx + 1] = color[1];
    data[idx + 2] = color[2];
    data[idx + 3] = srcA;
    return;
  }
  if (srcA === 0) return;

  const dstR = data[idx];
  const dstG = data[idx + 1];
  const dstB = data[idx + 2];
  const dstA = data[idx + 3];

  const srcAlpha = srcA / 255;
  const invSrcAlpha = 1 - srcAlpha;

  data[idx]     = Math.round(color[0] * srcAlpha + dstR * invSrcAlpha);
  data[idx + 1] = Math.round(color[1] * srcAlpha + dstG * invSrcAlpha);
  data[idx + 2] = Math.round(color[2] * srcAlpha + dstB * invSrcAlpha);
  data[idx + 3] = Math.round(srcA + dstA * invSrcAlpha);
}

// Bresenham's line algorithm
function drawLine(x1, y1, x2, y2, hexColor = "#FFFFFFFF") {
  const color = hexToRgba(hexColor);
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = (x1 < x2) ? 1 : -1;
  let sy = (y1 < y2) ? 1 : -1;
  let err = dx - dy;

  while (true) {
    setPixel(x1, y1, color);

    if (x1 === x2 && y1 === y2) break;

    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x1 += sx; }
    if (e2 < dx) { err += dx; y1 += sy; }
  }
}
