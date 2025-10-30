//--- Projection ---//
class Point3D {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new Point3D(this.x, this.y, this.z)
  }

  add(point) {
    return new Point3D(
      this.x + point.x,
      this.y + point.y,
      this.z + point.z
    );
  }

  subtract(point) {
    return new Point3D(
      this.x - point.x,
      this.y - point.y,
      this.z - point.z
    );
  }

  cross2(point) {
    return this.x * point.y - this.y * point.x;
  }

  dot2(point) {
    return this.x * point.x + this.y * point.y;
  }
}

// Convert 3D to 2D coordinates
function project(point, width, height, focalLength = 100) {
  let scale = focalLength / (point.z || 1);
  return new Point3D(
    point.x * scale + width / 2,
    -point.y * scale + height / 2, // It's upside-down
  );
}

function rotateX(point, angle) {
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  return new Point3D(
    point.x,
    point.y * cos - point.z * sin,
    point.y * sin + point.z * cos
  ); // Rotate around X. Moves Y and Z
}

function rotateY(point, angle) {
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  return new Point3D(
    point.x * cos - point.z * sin,
    point.y,
    point.x * sin + point.z * cos
  ); // Rotate around Y. Moves X and Z
}

function rotateZ(point, angle) {
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  return new Point3D(
    point.x * cos - point.y * sin,
    point.x * sin + point.y * cos,
    point.z
  ); // Rotate around Z. Moves X and Y
}
