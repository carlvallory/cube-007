import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import loadingManager from './loadingManager.js';

// Función para cargar una fuente y crear un mesh de texto
export function loadTextMesh(text, fontPath, options = {}, materialOptions = {}) {
    return new Promise((resolve, reject) => {
        const fontLoader = new FontLoader(loadingManager);
        
        fontLoader.load(fontPath, (font) => {
            // Configuración por defecto para la geometría del texto
            const geometry = new TextGeometry(text, {
                font: font,
                size: options.size || 0.2,
                height: options.height || 0.02,
                curveSegments: options.curveSegments || 12,
                bevelEnabled: options.bevelEnabled || false,
                bevelThickness: options.bevelThickness || 0.005,
                bevelSize: options.bevelSize || 0.005,
                bevelSegments: options.bevelSegments || 3,
            });

            // Configuración por defecto para el material
            const material = new THREE.MeshPhongMaterial(materialOptions || { color: 0x000000 });
            const mesh = new THREE.Mesh(geometry, material);
            resolve(mesh);
        }, undefined, (error) => {
            console.error(`Error al cargar la fuente desde ${fontPath}`, error);
            //reject(error);
            resolve(null);
        });
    });
}
