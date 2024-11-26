import * as THREE from 'three';
import gsap from 'gsap';
import { createVideoMaterial } from '../utils/video.js';

export function createVideoCube(videoUrls) {
    const materials = videoUrls.map((url) => createVideoMaterial(url));
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const videoCube = new THREE.Mesh(geometry, materials);
    return videoCube;
}

/**
 * Crea un cubo con materiales transparentes.
 * @param {number} size - Tamaño del cubo.
 * @returns {THREE.Mesh} - Cubo con materiales inicializados.
 */
export function createCube(size = 4) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const transparentMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        opacity: 0.2,
        transparent: true,
        side: THREE.DoubleSide,
    });

    const materials = Array(6).fill(transparentMaterial);

    return new THREE.Mesh(geometry, materials);
}

/**
 * Loads a video texture for a specific face of the cube.
 * @param {THREE.Mesh} cube - The cube mesh.
 * @param {number} faceIndex - The index of the cube face (0-5).
 * @param {string} videoUrl - The URL of the video to load.
 * @param {HTMLVideoElement} videoElement - The HTML video element to use.
 * @returns {THREE.MeshBasicMaterial} - The material with the video texture applied.
 */
export function loadVideoForFace(cube, faceIndex, videoUrl, videoElement) {
    videoElement.src = videoUrl;
    videoElement.play();

    const videoTexture = new THREE.VideoTexture(videoElement);
    const videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        side: THREE.DoubleSide,
        transparent: true,
    });

    cube.material[faceIndex] = videoMaterial;

    return videoMaterial;
}

/**
 * Rotates the cube to the specified face index.
 * @param {THREE.Mesh} cube - The cube mesh.
 * @param {number} targetFaceIndex - The target face index (0-5).
 * @param {Function} onComplete - Callback after rotation is complete.
 */
export function rotateCube(cube, targetFaceIndex, onComplete = () => {}) {
    const totalFaces = 6;
    const targetRotationY = (targetFaceIndex / totalFaces) * Math.PI * 2;

    gsap.to(cube.rotation, {
        y: targetRotationY,
        duration: 1,
        ease: 'power1.inOut',
        onComplete,
    });
}