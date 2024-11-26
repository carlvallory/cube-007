import * as THREE from 'three';
import { createVideoCube, createCube, loadVideoForFace, rotateCube } from '../objects/videoCube.js';
import { fullscreenTransition } from '../effects/fullscreenEffect.js';

export class Scene2 {
    constructor(container, transition) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.container = container;
        this.cube = null;
        this.activeVideoTexture = null;
        this.videoElement = document.createElement('video');
        this.videoElement.loop = true;
        this.videoElement.muted = true; // Puedes cambiar esto según sea necesario
        this.videoElement.playsInline = true; // Necesario para reproducir en algunos navegadores móviles
        this.videoElement.style.display = 'none'; // Oculta el elemento de video en el DOM
        document.body.appendChild(this.videoElement);

        this.videoMap = {
            0: 'src/assets/videos/video1.mp4', // Cara frontal
            1: 'src/assets/videos/video2.mp4', // Cara trasera
            2: 'src/assets/videos/video3.mp4', // Cara superior
            3: 'src/assets/videos/video4.mp4', // Cara inferior
            4: 'src/assets/videos/video5.mp4', // Cara izquierda
            5: 'src/assets/videos/video6.mp4', // Cara derecha
        };

        this.previousActiveFace = null;
        this.currentFaceIndex = 0;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.arrowLeft = null;
        this.arrowRight = null;
    }

    start() {
        // Configuración de la escena y el renderizador
        this.scene.background = new THREE.Color(0x000000);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 8;

        // Crear luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.scene.add(ambientLight, directionalLight);

        // Crear el cubo usando la función modularizada
        this.cube = createCube(4);
        this.scene.add(this.cube);

        // Crear flechas para rotación
        this.createArrows();

        // Eventos para la detección de cara activa
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onArrowClick.bind(this));

        this.animate();
    }

    createArrows() {
        const arrowGeometry = new THREE.PlaneGeometry(1, 1);
        const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

        this.arrowLeft = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.arrowLeft.position.set(-6, 0, 0);
        this.arrowLeft.rotation.y = Math.PI; // Point left
        this.scene.add(this.arrowLeft);

        this.arrowRight = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.arrowRight.position.set(6, 0, 0);
        this.scene.add(this.arrowRight);
    }

    onArrowClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.arrowLeft, this.arrowRight]);

        if (intersects.length > 0) {
            if (intersects[0].object === this.arrowLeft) {
                this.rotateToFace('left');
            } else if (intersects[0].object === this.arrowRight) {
                this.rotateToFace('right');
            }
        }
    }

    rotateToFace(direction) {
        const totalFaces = 6;
        if (direction === 'left') {
            this.currentFaceIndex = (this.currentFaceIndex - 1 + totalFaces) % totalFaces;
        } else if (direction === 'right') {
            this.currentFaceIndex = (this.currentFaceIndex + 1) % totalFaces;
        }

        rotateCube(this.cube, this.currentFaceIndex, () => {
            this.loadVideoForFace(this.currentFaceIndex);
        });
    }

    loadVideoForFace(faceIndex) {
        const videoUrl = this.videoMap[faceIndex];
        if (videoUrl) {
            this.activeVideoTexture = loadVideoForFace(
                this.cube,
                faceIndex,
                videoUrl,
                this.videoElement
            );
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.cube);

        if (intersects.length > 0) {
            const faceIndex = Math.floor(intersects[0].faceIndex / 2);
            if (this.previousActiveFace !== faceIndex) {
                this.previousActiveFace = faceIndex;
                this.loadVideoForFace(faceIndex);
            }
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    };

    stop() {
        // Detener el renderizado y limpiar los recursos
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
        this.videoElement.pause();
        document.body.removeChild(this.videoElement);
    }
}
