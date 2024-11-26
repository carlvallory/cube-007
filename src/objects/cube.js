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

export function createCube(materials, position, size) {
    if (!materials.reflectiveMaterial || !materials.clearMaterial) {
        console.error('Materiales no definidos o inválidos:', materials);
        return null; // Devuelve null si los materiales son inválidos
    }
    
    const geometry = new THREE.BoxGeometry( size.x, size.y, size.z);
    const materialsArray = [
        materials.reflectiveMaterial,
        materials.reflectiveMaterial,
        materials.reflectiveMaterial,
        materials.reflectiveMaterial,
        materials.reflectiveMaterial,
        materials.clearMaterial
    ];
    const cube = new THREE.Mesh(geometry, materialsArray);
    cube.position.set( position.x, position.y, position.z);
    return cube;
}