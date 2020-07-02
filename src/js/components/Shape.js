import React, { Component } from "react";
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);
class Shape extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.initializeCamera = this.initializeCamera.bind(this);
    this.initializeOrbits = this.initializeOrbits.bind(this);
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    this.initializeOrbits();
    this.initializeCamera();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
    this.animate();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    this.mount.removeChild(this.renderer.domElement);
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
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

  onDocMouseDown(event, mesh) {
    const x = (event.clientX / this.mount.clientWidth) * 2 - 1;
    const y = -(event.clientY / this.mount.clientHeight) * 2 + 1;
    const z = 0.5;
    const mouse3D = new THREE.Vector3(x, y, z);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse3D, this.camera);

    let intersects = raycaster.intersectObjects(mesh);
    if (intersects.length > 0) {
      intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    }
  }

  render() {
    return (
      <div>
        <div
          onClick={(e) => this.onDocMouseDown(e, [this.mesh])}
          id="boardCanvas"
          style={{ width: "80vw", height: "40vw" }}
          ref={(mount) => {
            this.mount = mount;
          }}
        />
      </div>
    );
  }
}
export default Shape;
