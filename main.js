//--- idk ---//
const camera = new Camera(new Point3D(-1.5, 3, -5), { x: -0.45, y: 0.35, z: 0 }, 100);
const cube = new Object3D(shapes.cube, new Point3D(-2, 1, 0));
const pyramid = new Object3D(shapes.pyramid, new Point3D(2, 1, 0));
const plane = new Object3D(shapes.plane, new Point3D(0, 0, 0));

function renderLoop() {
  clear("#111");

  let delta = (performance.now() - now) / 1000;
  now = performance.now();

  frame.count++;
  if (performance.now() - frame.now >= 1000) {
    frame.now = performance.now();
    frame.perSec = frame.count;
    frame.count = 0;
  }

  moveCamera(camera, delta);

  pyramid.rotation.y += 1 * delta;
  cube.rotation.x += 0.2 * delta;
  cube.rotation.y += 1 * delta;
  cube.rotation.z += 0.5 * delta;

  plane.outline(camera, "#0000FFFF");
  pyramid.outline(camera, "#00FF00FF");
  cube.outline(camera, "#FFFF00FF");
  drawText(1, 1, `FPS: ${frame.perSec}`, "#F00", fonts.defaultFont);

  if (icon) drawIcon(iconpack2.icon1, 160, 32, true);

  if (pointer.updated) {
    updateUi();
    pointer.updated = false;
  }
  drawUi(delta);

  drawIcon(pointer.icon, pointer.getX(), pointer.getY());

  update();

  requestAnimationFrame(renderLoop);
}

renderLoop();
