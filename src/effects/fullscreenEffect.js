import { TweenLite } from 'gsap';

export function fullscreenTransition(cube, isFullscreen, duration = 1) {
    TweenLite.to(cube.scale, duration, {
        x: isFullscreen ? 1.5 : 1,
        y: isFullscreen ? 1.5 : 1,
        z: isFullscreen ? 1.5 : 1,
        onUpdate: () => {
            cube.material.needsUpdate = true;
        }
    });
}