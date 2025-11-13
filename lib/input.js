//--- Input ---//
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

const pointer = {
  x: 0, y: 0,
  dx: 0, dy: 0,
  updated: false,
  getX: () => Math.floor(pointer.x),
  getY: () => Math.floor(pointer.y),
  icon: icons.cursor,
  down: {
    lmb: false,
    mmb: false,
    rmb: false
  },
  click: {
    lmb: false,
    mmb: false,
    rmb: false
  },
};

canvas.addEventListener('click', async () => {
  await canvas.requestPointerLock();
});

document.addEventListener('mousemove', e => {
  if (document.pointerLockElement === canvas) {
    pointer.updated = true;
    pointer.x += e.movementX;
    pointer.y += e.movementY;
    if (pointer.x >= WIDTH) pointer.x = WIDTH - 1;
    if (pointer.x < 0) pointer.x = 0;
    if (pointer.y >= HEIGHT) pointer.y = HEIGHT - 1;
    if (pointer.y < 0) pointer.y = 0;
  }
});

canvas.addEventListener('mousedown', e => {
  pointer.updated = true;
  if (e.which == 1) {
    pointer.down.lmb = true;
    pointer.click.lmb = false;
  } else if (e.which == 2) {
    pointer.down.mmb = true;
    pointer.click.mmb = false;
  } else {
    pointer.down.rmb = true;
    pointer.click.rmb = false;
  }
});

canvas.addEventListener('mouseup', e => {
  pointer.updated = true;
  if (e.which == 1) {
    pointer.down.lmb = false;
    pointer.click.lmb = true;
  } else if (e.which == 2) {
    pointer.down.mmb = false;
    pointer.click.mmb = true;
  } else {
    pointer.down.rmb = false;
    pointer.click.rmb = true;
  }
});
