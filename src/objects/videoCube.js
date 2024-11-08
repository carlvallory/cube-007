import * as THREE from 'three';
import { createVideoMaterial } from '../utils/video.js';

export function createVideoCube(videoUrls) {
    const materials = videoUrls.map((url) => createVideoMaterial(url));
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const videoCube = new THREE.Mesh(geometry, materials);
    return videoCube;
}
