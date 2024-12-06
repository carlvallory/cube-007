import * as THREE from 'three';
import gsap from 'gsap';
import { createVideoMaterial } from '../utils/video.js';

export function createVideoCube(videoUrls) {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const materials = Array(6).fill(new THREE.MeshBasicMaterial({ color: 0x000000 })); // Placeholder material
    const videoCube = new THREE.Mesh(geometry, materials);
    videoCube.videoUrls = videoUrls; // Store video URLs for later loading
    videoCube.videoTextures = {}; // Cache for video textures

    return videoCube;
}

/**
 * Crea un cubo con materiales transparentes.  (This function is not directly related to video loading and could be removed if not used elsewhere)
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
 */
export async function loadVideoForFace(cube, faceIndex) {
    if (faceIndex < 0 || faceIndex > 5 || cube.videoTextures[faceIndex]) return; // Already loaded or invalid index

    const videoUrl = cube.videoUrls[faceIndex];
    if (!videoUrl) return; // No video URL for this face

    try {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.crossOrigin = "anonymous"; // Important for CORS
        video.preload = 'auto';
        video.loop = true;
        video.muted = true; // Consider muting if audio isn't needed

        await new Promise((resolve, reject) => {
            video.onloadeddata = () => resolve(video);
            video.onerror = reject;
        });

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;
        cube.videoTextures[faceIndex] = videoTexture;
        cube.material[faceIndex] = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide, transparent: true });

    } catch (error) {
        console.error(`Error loading video for face ${faceIndex}:`, error);
    }
}


/**
 * Rotates the cube to the specified face index.  Loads the video for the new face.
 * @param {THREE.Mesh} cube - The cube mesh.
 * @param {number} targetFaceIndex - The target face index (0-5).
 * @param {Function} onComplete - Callback after rotation is complete.
 */
export async function rotateCube(cube, targetFaceIndex, onComplete = () => { }) {
    const totalFaces = 6;
    const targetRotationY = (targetFaceIndex / totalFaces) * Math.PI * 2;

    await loadVideoForFace(cube, targetFaceIndex); // Load video before rotation

    gsap.to(cube.rotation, {
        y: targetRotationY,
        duration: 1,
        ease: 'power1.inOut',
        onComplete,
    });
}
