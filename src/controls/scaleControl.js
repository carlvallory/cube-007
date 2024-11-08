import * as THREE from 'three';

export function adjustScale(object, hoverScale = 1.2, lerpFactor = 0.1, isHovered) {
    const targetScale = new THREE.Vector3(
        isHovered ? hoverScale : 1,
        isHovered ? hoverScale : 1,
        isHovered ? hoverScale : 1
    );
    object.scale.lerp(targetScale, lerpFactor);
}
