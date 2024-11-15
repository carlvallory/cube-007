import * as THREE from 'three';

export function createCubeCamera() {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
    });
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);

    return { cubeCamera, cubeRenderTarget };
}

export function updateCubeCamera(renderer, scene, cubeCamera, reflectiveObject) {
    // Coloca la CubeCamera en la misma posición del objeto reflectante
    cubeCamera.position.copy(reflectiveObject.position);
    reflectiveObject.visible = false;  // Evita que el cubo se refleje a sí mismo
    // Actualiza la CubeCamera para capturar el entorno
    cubeCamera.update(renderer, scene);
    reflectiveObject.visible = true;
}
