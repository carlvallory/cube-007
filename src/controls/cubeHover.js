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
            // Handle both single material and multi-material scenarios
            const materials = Array.isArray(cube.material) ? cube.material : [cube.material];
            
            // Identify invalid materials that are missing or lack the `side` property
            const invalidMaterials = materials
                .map((mat, index) => ({ mat, index }))
                .filter(({ mat }) => !mat || mat.side === undefined);

            if (invalidMaterials.length === 0) {
                // Proceed with raycasting if all materials are valid
                if (cube && cube.layers) {
                    try {
                        const intersects = raycaster.intersectObject(cube);
                        onHover(intersects.length > 0);
                    } catch (error) {
                        console.error("Error during intersection check:", error);
                    }
                } else {
                    console.warn("The object is missing required properties or is null.");
                }
            } else {
                console.warn(`One or more materials on the cube are misconfigured:`);
                invalidMaterials.forEach(({ mat, index }) => {
                    if (!mat) {
                        console.warn(`Material at index ${index} is undefined or null.`);
                    } else if (mat.side === undefined) {
                        console.warn(`Material at index ${index} is missing the 'side' property.`);
                    }
                });
            }
        } else {
            console.warn('El cubo o su material están indefinidos.');
        }
    });
}
