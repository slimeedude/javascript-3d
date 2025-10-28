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
  const [r, g, b, a] = hexToRgba(hexColor);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
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

// Bresenham's line algorithm
function drawLine(x1, y1, x2, y2, color = "#FFFFFFFF") {
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

//--- Text rendering ---// Font data in a separate script
function drawChar(x, y, char, color = "#FFFFFF", font = defaultFont) {
  let charFont;
  if (font.chars[char]) {
    if (font.chars[char].width * font.height == font.chars[char].data.length) {
      charFont = font.chars[char];
    } else {
      charFont = font.unknown_char;
    }
  } else {
    charFont = font.unknown_char;
  }

  for (let dy = 0; dy < font.height; dy++) {
    for (let dx = 0; dx < charFont.width; dx++) {
      if (charFont.data[dy * charFont.width + dx] == "1")
        setPixel(x + dx, y + dy, color);
    }
  }
}

function drawText(startX, startY, text, color = "#FFFFFF", font = defaultFont, spacing = 1) {
  let x = startX;
  for (const char of text) {
    if (char == '\n') {
      startY += font.height + 1;
      x = startX;
      continue;
    }
    let width;
    if (font.chars[char]) {
      width = font.chars[char].width;
    } else {
      width = font.unknown_char.width;
    }
    drawChar(x, startY, char, color, font);
    x += width + spacing;
  }
}

//--- Projection ---//

// Convert 3D to 2D coordinates
function project(point, width, height, focalLength = 100) {
  let scale = focalLength / (point.z || 1);
  return {
    x: point.x * scale + width / 2,
    y: -point.y * scale + height / 2, // It's upside-down
  };
}

class Camera {
  constructor(position = { x: 0, y: 0, z: 0 }, focalLength = 100) {
    this.position = position;
    this.focalLength = focalLength; // Distance between the camera and the near plane
  }

  worldToCamera(point) {
    let p = {
      x: point.x - this.position.x,
      y: point.y - this.position.y,
      z: point.z - this.position.z
    };
    return p;
  }
}

class Object3D {
  constructor(points, edges, position = { x: 0, y: 0, z: 0 }) {
    this.points = points;
    this.edges = edges;
    this.position = position;
  }

  getTransformedPoints() { // @TODO: rotation transformation
    return this.points.map(p => {
      return {
        x: p.x + this.position.x,
        y: p.y + this.position.y,
        z: p.z + this.position.z
      };
    });
  }

  draw(camera, color = "#FFFFFFFF") {
    const transformed = this.getTransformedPoints();

    this.edges.forEach(edge => {
      let p1 = camera.worldToCamera(transformed[edge[0]]);
      let p2 = camera.worldToCamera(transformed[edge[1]]);

      const nearZ = 0.1;
      if (p1.z <= nearZ && p2.z <= nearZ) return;

      if (p1.z < nearZ || p2.z < nearZ) {
        const t = (nearZ - p1.z) / (p2.z - p1.z);
        const clipped = {
          x: p1.x + t * (p2.x - p1.x),
          y: p1.y + t * (p2.y - p1.y),
          z: nearZ
        };

        if (p1.z < nearZ) p1 = clipped;
        else p2 = clipped;
      }

      const proj1 = project(p1, WIDTH, HEIGHT, camera.focalLength);
      const proj2 = project(p2, WIDTH, HEIGHT, camera.focalLength);

      drawLine(
        Math.round(proj1.x), Math.round(proj1.y),
        Math.round(proj2.x), Math.round(proj2.y),
        color // Rounded, because a non-integer number causes it to freeze
      );      // It's also a pixel display, so there's no reason to use float type
    });
  }
}

//--- idk ---//
const camera = new Camera({ x: 0, y: 0, z: 0 }, 100);
const cube = new Object3D(shapes.cube.points, shapes.cube.edges, { x: -1.5, y: 0.25, z: 4 });
const pyramid = new Object3D(shapes.pyramid.points, shapes.pyramid.edges, { x: 1.5, y: -0.25, z: 5 });

let fps = 0;
let frames = 0;
let frameNow = performance.now();

function renderLoop() {
  clear();

  frames++;
  if (performance.now() - frameNow >= 1000) {
    frameNow = performance.now();
    fps = frames;
    frames = 0;
  }

  // Tests
  cube.draw(camera, "#FFFF00FF");
  pyramid.draw(camera, "#00FF00FF");
  drawText(1, 1, `FPS: ${fps}`, "#FF0000FF", defaultFont);

  update();

  requestAnimationFrame(renderLoop);
}

renderLoop();
