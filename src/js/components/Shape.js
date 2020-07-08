import React, { Component } from "react";
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);
class Shape extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.addShape = this.addShape.bind(this);
    this.addCubes = this.addCubes.bind(this);
    this.addSpheres = this.addSpheres.bind(this);
    this.initializeCamera = this.initializeCamera.bind(this);
    this.initializeOrbits = this.initializeOrbits.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.shapes = [];
  }

  componentDidMount() {
    this.sceneSetup();
    this.addSceneObjects();
    this.animate();
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener("resize", this.handleWindowResize);
    this.mount.removeChild(this.renderer.domElement);
  }

  sceneSetup() {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    let light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(1, 1, 1);
    this.scene.add(light);

    this.controls = new OrbitControls(this.camera, this.mount);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.mount.appendChild(this.renderer.domElement);
  }

  addSceneObjects() {
    this.initializeOrbits();
    this.initializeCamera();

    var positions = [];
    const nx = 2;
    const ny = 2;
    const nz = 2;
    for (var i = 0; i < nx; i++) {
      for (var j = 0; j < ny; j++) {
        for (var k = 0; k < nz; k++) {
          positions.push([i, j, k]);
        }
      }
    }
    this.addSpheres(positions, 1, 3);
    this.addCubes(positions, 1, 2, 3);
  }

  addShape(geometry, color, x, y, z) {
    const material = new THREE.MeshPhongMaterial({ color: color });
    const shape = new THREE.Mesh(geometry, material);
    shape.position.x = x;
    shape.position.y = y;
    shape.position.z = z;
    shape.scale.multiplyScalar(0.1);

    this.scene.add(shape);
    this.shapes.push(shape);
  }

  addCubes(positions, height, width, depth) {
    const geometry = new THREE.BoxGeometry(height, width, depth);
    positions.forEach((p) => {
      this.addShape(geometry, 0x0000ff, p[0], p[1], p[2]);
    });
  }

  addSpheres(positions, radius, detail) {
    const geometry = new THREE.IcosahedronBufferGeometry(radius, detail);
    positions.forEach((p) => {
      this.addShape(geometry, 0xff0000, p[0], p[1], p[2]);
    });
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);

    this.shapes.forEach((shape) => {
      shape.rotation.x += 0.05 * Math.random();
      shape.rotation.y += 0.05 * Math.random();
    });
  }

  handleWindowResize() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
  }

  initializeCamera() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 4;
  }

  initializeOrbits() {
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
  }

  onDocMouseDown(event) {
    const x = (event.clientX / this.width) * 2 - 1;
    const y = -(event.clientY / this.height) * 2 + 1;
    const z = 0.5;
    const mouse3D = new THREE.Vector3(x, y, z);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse3D, this.camera);

    let intersects = raycaster.intersectObjects(this.shapes);
    if (intersects.length > 0) {
      intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    }
  }

  render() {
    const width = "100%";
    const height = "100%";
    return (
      <div
        onClick={(e) => this.onDocMouseDown(e)}
        id="boardCanvas"
        ref={(ref) => {
          this.mount = ref;
        }}
        style={{
          width: width,
          height: height,
          position: "absolute",
        }}
      />
    );
  }
}
export default Shape;
