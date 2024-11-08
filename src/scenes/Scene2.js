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
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 10;

        const videoUrls = ['video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4', 'video6.mp4'];
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
