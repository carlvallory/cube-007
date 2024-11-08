import * as THREE from 'three';

export function smoothRotation(object, targetRotation, lerpFactor = 0.1) {
    object.rotation.x += (targetRotation.x - object.rotation.x) * lerpFactor;
    object.rotation.y += (targetRotation.y - object.rotation.y) * lerpFactor;
    object.rotation.z += (targetRotation.z - object.rotation.z) * lerpFactor;
    object.rotation.x = THREE.MathUtils.clamp(object.rotation.x, -Math.PI, Math.PI);
    object.rotation.y = THREE.MathUtils.clamp(object.rotation.y, -Math.PI, Math.PI);
    object.rotation.z = THREE.MathUtils.clamp(object.rotation.z, -Math.PI, Math.PI);
}
