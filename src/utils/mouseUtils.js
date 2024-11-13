import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let targetRotationY = 0;
const previousMousePosition = { x: 0, y: 0 };

/**
 * Configura el evento para el movimiento del mouse.
 * @param {function} onMoveCallback - Función a ejecutar cuando el mouse se mueve.
 */
export function setupMouseMove(onMoveCallback) {
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (isDragging) {
            // Calcula el movimiento en el eje X para actualizar la rotación en Y
            const deltaMove = { x: event.movementX || 0 };
            targetRotationY += deltaMove.x * 0.005;
        }

        onMoveCallback(event, mouse, targetRotationY);
    });
}

/**
 * Configura los eventos de arrastre (drag) del mouse.
 * @param {HTMLCanvasElement} domElement - Elemento del DOM donde se detectarán los eventos.
 */
export function setupMouseDrag(domElement) {
    domElement.addEventListener('mousedown', () => {
        isDragging = true;
    });

    domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

/**
 * Detecta la intersección con un objeto en la escena utilizando el raycaster.
 * @param {THREE.Camera} camera - Cámara activa en la escena.
 * @param {THREE.Object3D} object - Objeto a detectar la intersección.
 * @returns {boolean} - `true` si el mouse está sobre el objeto.
 */
export function detectMouseHover(camera, object) {
    // Verificar que la cámara y el objeto son válidos
    if (!camera || !(camera instanceof THREE.Camera)) {
        console.error('Invalid camera provided to detectMouseHover.');
        return false;
    }

    if (!object || !(object instanceof THREE.Object3D)) {
        console.error('Invalid object provided to detectMouseHover. Expected a THREE.Object3D instance.');
        return false;
    }

    raycaster.setFromCamera(mouse, camera);

    // Verificar que el objeto tiene las propiedades necesarias
    if (object && object.layers) {
        try {
            const intersects = raycaster.intersectObject(object);
            return intersects.length > 0;
        } catch (error) {
            console.error("Error during intersection check in detectMouseHover:", error);
            return false;
        }
    } else {
        console.warn("The object is missing required properties or is null.");
        return false;
    }
}

/**
 * Configura el evento de clic para detectar intersección con un objeto específico.
 * @param {THREE.Camera} camera - Cámara activa en la escena.
 * @param {THREE.Object3D} object - Objeto a detectar intersección en clic.
 * @param {function} onClickCallback - Función a ejecutar si se detecta intersección en clic.
 */
export function setupMouseClick(camera, object, onClickCallback) {

    // Verificar que la cámara y el objeto son válidos
    if (!camera || !(camera instanceof THREE.Camera)) {
        console.error('Invalid camera provided to setupMouseClick.');
        return;
    }

    if (!object || !(object instanceof THREE.Object3D)) {
        console.error('Invalid object provided to setupMouseClick. Expected a THREE.Object3D instance.');
        return;
    }

    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Ensure the object is fully initialized and has required properties
        if (object && object.layers) {
            try {
                const intersects = raycaster.intersectObject(object);

                if (intersects.length > 0) {
                    onClickCallback(event, intersects);
                }

            } catch (error) {
                console.error("Error during intersection check in setupMouseClick:", error);
            }
        } else {
            console.warn("The object is missing required properties or is null in setupMouseClick.");
        }
    });
}

/**
 * Suaviza la transición de rotación en el eje Y para el cubo.
 * @param {THREE.Object3D} object - Objeto a rotar.
 * @param {number} targetRotationY - Ángulo de rotación objetivo en el eje Y.
 * @param {number} lerpFactor - Factor de suavizado de la rotación.
 */
export function smoothMouseRotation(object, targetRotationY, lerpFactor = 0.1) {
    object.rotation.y += (targetRotationY - object.rotation.y) * lerpFactor;
}