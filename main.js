//--- idk ---//
const camera = new Camera(new Point3D(-1.5, 3, -5), { x: -0.45, y: 0.35, z: 0 }, 100);
const cube = new Object3D(shapes.cube.points, shapes.cube.edges, new Point3D(-2, 1, 0));
const pyramid = new Object3D(shapes.pyramid.points, shapes.pyramid.edges, new Point3D(2, 1, 0));
const plane = new Object3D(shapes.plane.points, shapes.plane.edges, new Point3D(0, 0, 0));

let now = performance.now();

let fps = 0;
let frames = 0;
let frameNow = performance.now();

function renderLoop() {
  clear();

  let delta = (performance.now() - now) / 1000;
  now = performance.now();

  frames++;
  if (performance.now() - frameNow >= 1000) {
    frameNow = performance.now();
    fps = frames;
    frames = 0;
  }

  // Tests

  pyramid.rotation.y += 1 * delta;
  cube.rotation.x += 0.2 * delta;
  cube.rotation.y += 1 * delta;
  cube.rotation.z += 0.5 * delta;

  plane.draw(camera, "#0000FFFF");
  pyramid.draw(camera, "#00FF00FF");
  cube.draw(camera, "#FFFF00FF");
  drawText(1, 1, `FPS: ${fps}`, "#FF0000FF", defaultFont);

  update();

  requestAnimationFrame(renderLoop);
}

renderLoop();
