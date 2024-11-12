import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function detectHover(camera, cube, onHover) {
    // Check if the camera is valid
    if (!camera || !(camera instanceof THREE.Camera)) {
        console.error('Invalid camera provided to detectHover.');
        return;
    }

    // Check if the cube is a valid mesh
    if (!cube || !(cube instanceof THREE.Mesh)) {
        console.error('Invalid cube object provided to detectHover. Expected a THREE.Mesh instance.');
        return;
    }

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        if (cube && cube.material) {
            // Si el material es un array (para objetos con múltiples materiales), verifica cada uno
            const materials = Array.isArray(cube.material) ? cube.material : [cube.material];
            // Check each material for validity
            let allMaterialsValid = true;
            materials.forEach((mat, index) => {
                if (!mat) {
                    console.warn(`Material at index ${index} is missing or undefined.`);
                    allMaterialsValid = false;
                } else if (mat.side === undefined) {
                    console.warn(`Material at index ${index} is missing the 'side' property.`);
                    allMaterialsValid = false;
                }
            });

            // Only proceed with raycasting if all materials are valid
            if (allMaterialsValid) {
                const intersects = raycaster.intersectObject(cube);
                onHover(intersects.length > 0);
            } else {
                console.warn('One or more materials on the cube are not configured correctly.');
            }
        } else {
            console.warn('El cubo o su material están indefinidos.');
        }
    });
}
