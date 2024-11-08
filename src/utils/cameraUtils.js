import * as THREE from 'three';

export function calculatePlaneSize(camera, planeZ) {
    const distance = camera.position.z - planeZ;
    const vFov = camera.fov * Math.PI / 180;
    const height = 2 * Math.tan(vFov / 2) * distance;
    return { width: height * camera.aspect, height };
}

export function adjustFov(camera, mesh, desiredHeight) {
    const distance = camera.position.z - mesh.position.z;
    const fov = 2 * Math.atan(desiredHeight / (2 * distance)) * (180 / Math.PI);
    camera.fov = fov;
    camera.updateProjectionMatrix();
}
