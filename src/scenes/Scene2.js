import * as THREE from 'three';
import { createVideoCube } from '../objects/videoCube.js';
import { fullscreenTransition } from '../effects/fullscreenEffect.js';

export class Scene2 {
    constructor(container, transition) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.transition = transition;
        this.container = container;
        this.videoCube = null;
    }

    start() {
        this.scene.background = new THREE.Color(0xfefefe);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 10;

        const videoUrls = [null, null, null, null, 'src/assets/videos/video1.mp4', null];
        this.videoCube = createVideoCube(videoUrls);
        this.scene.add(this.videoCube);

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
