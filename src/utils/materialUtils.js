import * as THREE from 'three';
import loadingManager from '../utils/loadingManager.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

export function loadEnvironmentTexture(scene, texturePath) {
    return new Promise((resolve, reject) => {
        const loader = new EXRLoader(loadingManager);
        loader.load(texturePath, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
            scene.background = texture;
            resolve(texture);
        }, undefined, reject);
    });
}

export function createMaterials(envTexture) {
    return {
        clearMaterial: new THREE.MeshPhysicalMaterial({
            transmission: 1,
            transparent: true,
            roughness: 0.1,
            thickness: 0.1,
        }),
        reflectiveMaterial: new THREE.MeshPhysicalMaterial({
            envMap: envTexture,
            roughness: 0.05,
            metalness: 0.5,
            transmission: 0.9,
            reflectivity: 0.9,
        }),
    };
}

export function createTransparentMaterial() {
    return new THREE.MeshPhysicalMaterial({
        transmission: 1,     // Transparencia total
        opacity: 0.5,        // Ajusta la opacidad
        transparent: true,   // Define el material como transparente
        roughness: 0.1,
        metalness: 0.1
    });
}