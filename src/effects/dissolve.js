import * as THREE from 'three';
import gsap from 'gsap';

/**
 * Rotates the cube to the specified face index.
 * @param {THREE.Mesh} mesh - The cube mesh.
 * @param {number} duration - Duration effect.
 * @param {Function} onComplete - Callback after rotation is complete.
 */
export function dissolve(mesh, duration = 1, onComplete = () => {}) {
    if(!mesh) {
        console.error('Invalid mesh:', mesh);
        return;
    }

    // Usa gsap para disolver el texto
    gsap.to(this.textMesh.material, {
        opacity: 0, // Cambia la opacidad a 0
        duration: 1, // Duración de la animación
        ease: 'power1.out', // Efecto de suavizado
        onComplete: () => {
            // Escala el texto a cero después de la animación
            gsap.to(this.textMesh.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.5,
                ease: 'power1.out',
                onComplete: onComplete,
            });
        },
    });

    return;
}