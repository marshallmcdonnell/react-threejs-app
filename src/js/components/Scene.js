import React, { Component } from "react";
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);
var elements = require("./elements");

function rgbFloatToHex(rgb) {
  let r = Math.round(255 * rgb[0]);
  let g = Math.round(255 * rgb[1]);
  let b = Math.round(255 * rgb[2]);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

class Scene extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.drawShape = this.drawShape.bind(this);
    this.drawSphere = this.drawSphere.bind(this);
    this.drawCylinder = this.drawCylinder.bind(this);
    this.initializeOrbits = this.initializeOrbits.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.objects = [];
    this.scale = 0.5;
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

    const fov = 75;
    const aspect = this.width / this.height;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    /*
    const factor = 100;
    this.camera = new THREE.OrthographicCamera(
      this.width / -factor,
      this.width / factor,
      this.height / factor,
      this.height / -factor,
      near,
      far
    );
    */

    this.camera.position.x = 15;
    this.camera.position.y = 15;
    this.camera.position.z = 15;
    this.light = new THREE.DirectionalLight(0xffffff, 0.8);
    this.scene.add(this.light);

    this.controls = new OrbitControls(this.camera, this.mount);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.mount.appendChild(this.renderer.domElement);
  }

  addSceneObjects() {
    this.initializeOrbits();

    this.system = new THREE.Object3D();
    this.scene.add(this.system);

    let water = {
      atoms: {
        1: {
          symbol: "O",
          position: { x: 0, y: 0, z: 0 },
        },
        2: {
          symbol: "H",
          position: { x: 0.758602, y: 0.0, z: 0.504284 },
        },
        3: {
          symbol: "H",
          position: { x: 0.758602, y: 0.0, z: -0.504284 },
        },
      },
      bonds: [
        {
          atomA: 1,
          atomB: 2,
        },
        {
          atomA: 1,
          atomB: 3,
        },
      ],
    };

    let xstart = 0;
    let xend = 2;
    let ystart = 0;
    let yend = 2;
    let zstart = 0;
    let zend = 2;
    let offset = 3.0;
    for (var i = xstart; i <= xend; i++) {
      for (var j = ystart; j <= yend; j++) {
        for (var k = zstart; k <= zend; k++) {
          var new_system = JSON.parse(JSON.stringify(water));
          const molecule = new THREE.Object3D();
          molecule.position.x += i * offset;
          molecule.position.y += j * offset;
          molecule.position.z += k * offset;

          this.addAtomsToParent(molecule, new_system.atoms);
          this.addBondsToParent(molecule, new_system);
          console.log(molecule.position);

          this.system.add(molecule);
          this.objects.push(molecule);
        }
      }
    }

    var axisHelper = new THREE.AxesHelper(10);
    this.scene.add(axisHelper);

    const groundGeometry = new THREE.PlaneBufferGeometry(10, 10);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcc8866 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x -= 90 * (Math.PI / 180);
    groundMesh.position.copy(new THREE.Vector3(5, -1, 5));
    this.scene.add(groundMesh);
  }

  addAtomsToParent(parent, atoms) {
    const detail = 3;
    for (let [key, atom] of Object.entries(atoms)) {
      let color = rgbFloatToHex(elements[atom.symbol].color);
      let radius = elements[atom.symbol].radius;
      parent.add(this.drawSphere(atom.position, color, radius, detail));
    }
  }

  addBondsToParent(parent, system) {
    let bond_color = 0xffffff;
    let bond_radius = 0.1;
    let atoms = system.atoms;
    let bonds = system.bonds;
    bonds.forEach((bond) => {
      let p1 = atoms[bond.atomA].position;
      let p2 = atoms[bond.atomB].position;
      parent.add(this.drawCylinder(p1, p2, bond_color, bond_radius));
    });
  }

  drawShape(geometry, color, x, y, z) {
    const material = new THREE.MeshPhongMaterial({ color: color });
    const shape = new THREE.Mesh(geometry, material);
    shape.position.x = x;
    shape.position.y = y;
    shape.position.z = z;
    shape.scale.multiplyScalar(this.scale);

    return shape;
  }

  drawSphere(position, color, radius, detail) {
    const geometry = new THREE.IcosahedronBufferGeometry(radius, detail);
    return this.drawShape(geometry, color, position.x, position.y, position.z);
  }

  drawCylinder(p1, p2, color, radius) {
    const HALF_PI = Math.PI * 0.5;

    let vstart = new THREE.Vector3(p1.x, p1.y, p1.z);
    let vend = new THREE.Vector3(p2.x, p2.y, p2.z);

    let height = (1 / this.scale) * vstart.distanceTo(vend);
    let position = vend.clone().add(vstart).divideScalar(2);

    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshPhongMaterial({ color: color });

    let orientation = new THREE.Matrix4();
    let offsetRotation = new THREE.Matrix4();
    orientation.lookAt(vstart, vend, new THREE.Vector3(0, 1, 0));
    offsetRotation.makeRotationX(HALF_PI);
    orientation.multiply(offsetRotation);
    geometry.applyMatrix4(orientation);

    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.copy(position);
    cylinder.scale.multiplyScalar(this.scale);
    return cylinder;
  }

  handleWindowResize() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
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

    let intersects = raycaster.intersectObjects(this.objects);
    if (intersects.length > 0) {
      intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    }
  }

  animate() {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);

    this.objects.forEach((object) => {
      object.rotation.x += Math.random() * 0.1;
      object.rotation.y += Math.random() * 0.1;
      object.rotation.z += Math.random() * 0.1;
    });

    this.light.position.set(
      this.camera.position.x + 2,
      this.camera.position.y + 2,
      this.camera.position.z
    );
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
export default Scene;
