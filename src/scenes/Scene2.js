import * as THREE from 'three';
import { createVideoCube, rotateCube } from '../objects/videoCube.js';

export class Scene2 {
    constructor(container, transition) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.container = container;
        this.cube = null;

        this.videoMap = {
            0: 'src/assets/videos/video1.mp4',
            1: 'src/assets/videos/video2.mp4',
            2: 'src/assets/videos/video3.mp4',
            3: 'src/assets/videos/video4.mp4',
            4: 'src/assets/videos/video5.mp4',
            5: 'src/assets/videos/video6.mp4',
        };

        this.currentFaceIndex = 0;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.arrowLeft = null;
        this.arrowRight = null;
    }

    start() {
        this.scene.background = new THREE.Color(0x000000);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 8;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.scene.add(ambientLight, directionalLight);

        this.cube = createVideoCube(Object.values(this.videoMap));
        this.scene.add(this.cube);
        this.createArrows();

        window.addEventListener('click', this.onArrowClick.bind(this));
        this.animate();
    }

    createArrows() {
        // ... (Arrow creation remains unchanged)
    }

    onArrowClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.arrowLeft, this.arrowRight]);

        if (intersects.length > 0) {
            const direction = intersects[0].object === this.arrowLeft ? 'left' : 'right';
            this.rotateToFace(direction);
        }
    }

    async rotateToFace(direction) {
        const totalFaces = 6;
        if (direction === 'left') {
            this.currentFaceIndex = (this.currentFaceIndex - 1 + totalFaces) % totalFaces;
        } else {
            this.currentFaceIndex = (this.currentFaceIndex + 1) % totalFaces;
        }
        try {
            await rotateCube(this.cube, this.currentFaceIndex);
        } catch (error) {
            console.error("Error rotating cube:", error);
        }
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
