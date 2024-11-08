import * as THREE from 'three';

export function createVideoMaterial(videoSrc) {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.muted = true;
    video.loop = true;
    video.play();
    const texture = new THREE.VideoTexture(video);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
}
