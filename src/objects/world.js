import * as THREE from 'three';
import loadingManager from '../utils/loadingManager.js';

export function createWorld(texturePath, position, size={radius: 1.5, widhtSegments: 32, heighSegments: 32}) {
    // Crear una esfera azul dentro del cubo
    const sphereGeometry = new THREE.SphereGeometry(size.radius, size.widhtSegments, size.heighSegments);
    const sphereTexture = new THREE.TextureLoader(loadingManager).load( texturePath );
    const sphereMaterial = new THREE.MeshBasicMaterial( { map: sphereTexture } );
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
    sphere.position.set( position.x, position.y, position.z);
    return sphere;
}

export function rotateWorld(world, rotationSpeed={ x: 0, y: 0.01, z: 0 }) {
    world.rotation.y += rotationSpeed.y;
}