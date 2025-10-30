//--- Objects ---//
class Camera {
  constructor(position = new Point3D(0, 0, 0), rotation = { x: 0, y: 0, z: 0 }, focalLength = 100) {
    this.position = position;
    this.rotation = rotation;
    this.focalLength = focalLength; // Distance between the camera and the near plane
  }

  worldToCamera(point) {
    let p = point.subtract(this.position);

    // I had to use ZYX order, the camera was turning weird for some reason
    p = rotateZ(p, this.rotation.z);
    p = rotateY(p, this.rotation.y);
    p = rotateX(p, this.rotation.x);

    return p;
  }
}

class Object3D {
  constructor(points, edges, position = new Point3D(0, 0, 0), rotation = { x: 0, y: 0, z: 0 }, pivot = new Point3D(0, 0, 0)) {
    this.points = points;
    this.edges = edges;
    this.position = position;
    this.rotation = rotation;
    this.pivot = pivot;
  }

  getTransformedPoints() {
    return this.points.map(p => {
      // Shapes don't use Point3D (yet) so I create a new point to use .add
      let shifted = new Point3D(p.x, p.y, p.z).subtract(this.pivot);
      shifted = rotateX(shifted, this.rotation.x); // Rotate first
      shifted = rotateZ(shifted, this.rotation.z);
      shifted = rotateY(shifted, this.rotation.y);
      return shifted.add(this.pivot).add(this.position);
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
        const clipped = new Point3D(
          p1.x + t * (p2.x - p1.x),
          p1.y + t * (p2.y - p1.y),
          nearZ
        );

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
