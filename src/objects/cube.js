import * as THREE from 'three';
import { createTransparentMaterial } from '../utils/materialUtils.js';

export function createObjects() {
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = createTransparentMaterial();
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    const sphereGeometry = new THREE.SphereGeometry(0.9, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('earth_texture.jpg'),
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    cube.add(sphere);
    return { cube };
}

export function createCube(materials) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materialsArray = [
        materials.reflectiveMaterial,
        materials.reflectiveMaterial,
        materials.reflectiveMaterial,
        materials.reflectiveMaterial,
        materials.clearMaterial,
        materials.clearMaterial
    ];
    const cube = new THREE.Mesh(geometry, materialsArray);
    cube.position.set(0, 0, 0);
    return cube;
}