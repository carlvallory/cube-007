import * as THREE from 'three';

/**
 * Realiza una transición animada de la cámara.
 * @param {THREE.Camera} camera - La cámara que será animada.
 * @param {THREE.Vector3} object - Objetivo para la cámara.
 * @param {THREE.Renderer} renderer - El renderizador de la escena.
 * @param {THREE.Scene} scene - La escena actual que se está renderizando.
 * @param {function} onComplete - Función a ejecutar al completar la transición.
 */
export function animateCameraTransition(camera, object, renderer, scene, onComplete, options = { cameraIsActive: false}) {
    let animationProgress = 0;
    const startPosition = camera.position.clone();
    const targetPosition = object.position.clone();

    options.cameraIsActive = true;
    
    const animate = () => {
        
        // Rotar el cubo continuamente alrededor del eje Y
        object.rotation.y += 0.1; // Ajusta la velocidad de rotación según tus preferencias

        if (animationProgress < 1) {
            animationProgress += 0.02; // Ajustar velocidad de la animación

            if (options.cameraAnimationActive) {
                // Rotar el cubo continuamente alrededor del eje Y
                cube.rotation.y += 0.1; // Ajusta la velocidad de rotación según tus preferencias

            }

            // Interpolar la posición de la cámara
            camera.position.lerpVectors(startPosition, targetPosition, animationProgress);

            // Renderizar la escena durante la animación
            renderer.render(scene, camera);

            // Continuar la animación
            requestAnimationFrame(animate);
        } else {
            // Llamar a la función de callback al completar la transición
            if (onComplete) onComplete();
        }
        
    };

    animate();
}
