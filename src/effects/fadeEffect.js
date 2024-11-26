import gsap from 'gsap';

/**
 * Aplica el efecto de disolver a un objeto 3D.
 * @param {THREE.Object3D} object - El objeto 3D al que se aplicará el efecto.
 * @param {function} onComplete - Función que se ejecuta después de completar la animación.
 */
export function dissolveEffect(object, onComplete) {
    if (!object || !object.material) {
        console.error('El objeto o su material no es válido.');
        return;
    }

    // Asegurarse de que el material sea transparente
    object.material.transparent = true;

    // Animar la opacidad
    gsap.to(object.material, {
        opacity: 0,
        duration: 1,
        ease: 'power1.out',
        onComplete: () => {
            // Escalar a cero después de la animación de opacidad
            gsap.to(object.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.5,
                ease: 'power1.out',
                onComplete: () => {
                    if (onComplete) onComplete();
                },
            });
        },
    });
}