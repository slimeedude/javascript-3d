function moveCamera(camera, delta) { // @TODO: Touch interaction
  const speed = 3 * delta;

  let movementForward = rotateY(new Point3D(speed, 0, 0), camera.rotation.y);
  let movementRight = rotateY(new Point3D(0, 0, speed), camera.rotation.y);
  if (keys['KeyW']) {
    camera.position.z += movementForward.x;
    camera.position.x += movementForward.z;
  }
  if (keys['KeyS']) {
    camera.position.z -= movementForward.x;
    camera.position.x -= movementForward.z;
  }
  if (keys['KeyD']) {
    camera.position.z += movementRight.x;
    camera.position.x += movementRight.z;
  }
  if (keys['KeyA']) {
    camera.position.z -= movementRight.x;
    camera.position.x -= movementRight.z;
  }

  if (keys['Space']) camera.position.y += speed;
  if (keys['ShiftLeft']) camera.position.y -= speed;

  if (keys['KeyQ']) camera.focalLength -= speed * 50;
  if (keys['KeyE']) camera.focalLength += speed * 50;

  const rotSpeed = 1.5 * delta;
  if (keys['ArrowUp']) camera.rotation.x += rotSpeed;
  if (keys['ArrowDown']) camera.rotation.x -= rotSpeed;
  if (keys['ArrowLeft']) camera.rotation.y -= rotSpeed;
  if (keys['ArrowRight']) camera.rotation.y += rotSpeed;
}
