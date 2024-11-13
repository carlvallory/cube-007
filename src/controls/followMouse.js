import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isMouseOver = false;

/**
 * Activa el seguimiento del mouse sobre la cara frontal del cubo.
 * @param {THREE.Camera} camera - La cámara activa en la escena.
 * @param {THREE.Object3D} cube - El cubo que seguirá al mouse.
 * @param {HTMLCanvasElement} domElement - El elemento de renderizado donde se detectará el evento del mouse.
 */
export function enableMouseFollow(camera, cube, domElement) {

    // Suavizado de rotación
    const lerpFactor = 0.05;  // Ajusta este valor para cambiar la velocidad de seguimiento

    // Detecta si el mouse está sobre el cubo
    domElement.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(cube);

        // Detecta si el mouse está sobre el cubo
        isMouseOver = intersects.length > 0;

        if (isMouseOver) {
            // Calcula la posición en 3D del mouse en el espacio de la escena
            const mouse3D = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);

            // Calcula la dirección desde el cubo hacia la posición del mouse
            const direction = mouse3D.sub(cube.position).normalize();

            // Aplica una rotación suave hacia la posición del mouse
            const targetRotation = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 0, 1),  // Eje Z frontal del cubo
                direction
            );

            // Interpolación de la rotación actual hacia la rotación objetivo
            cube.quaternion.slerp(targetRotation, lerpFactor);
        }
    });
}

