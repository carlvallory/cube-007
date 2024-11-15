import { gsap } from 'gsap';

/**
 * Aplica una animación de vaivén a la rotación de un objeto en Three.js.
 * @param {THREE.Object3D} object - Objeto al que se aplicará la animación.
 * @param {number} maxRotation - Rotación máxima en radianes.
 * @param {number} duration - Duración de la animación en segundos.
 */
export function animateRotationVaiven(object, maxRotation = Math.PI / 16, duration = 1.5) {
    gsap.to(object.rotation, {
        y: maxRotation,
        duration: duration,
        ease: 'sine.inOut',
        yoyo: true, // Regresa a la rotación inicial
        repeat: -1, // Repetir infinitamente
    });
}
