import * as THREE from 'three';
import { detectHover } from '../controls/cubeHover.js';
import { smoothRotation } from '../controls/rotateControl.js';
import { addAmbientLight, addDirectionalLight } from '../utils/lighting.js';
import { createCube } from '../objects/cube.js';
import { createMaterials } from '../utils/materialUtils.js';

export class Scene1 {
    constructor(container, transition) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer();
        this.transition = transition;
        this.container = container;
        this.cube = null;
    }

    start() {
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
        addAmbientLight(this.scene);
        addDirectionalLight(this.scene);

        const cubeMaterials = createMaterials(null);
        this.cube = createCube(cubeMaterials);
        this.scene.add(this.cube);

        detectHover(this.camera, this.cube, (isHovered) => {
            if (isHovered) {
                smoothRotation(this.cube, new THREE.Euler(0, Math.PI, 0));
            }
        });

        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    };

    stop() {
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
}
