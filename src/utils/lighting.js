import * as THREE from 'three';

export function addAmbientLight(scene, intensity = 0.5) {
    const ambientLight = new THREE.AmbientLight(0xffffff, intensity);
    scene.add(ambientLight);
}

export function addDirectionalLight(scene, position = { x: 10, y: 10, z: 10 }, intensity = 1) {
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.set(position.x, position.y, position.z);
    scene.add(light);
}
