import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

export function loadEnvironmentTexture(scene, path) {
    const loader = new EXRLoader();
    return new Promise((resolve) => {
        loader.load(path, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
            scene.background = texture;
            resolve(texture);
        });
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