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
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: options.size || 0.25,
                height: options.height || 0.05,
                curveSegments: options.curveSegments || 12,
                bevelEnabled: options.bevelEnabled !== undefined ? options.bevelEnabled : true,
                bevelThickness: options.bevelThickness || 0.02,
                bevelSize: options.bevelSize || 0.005,
                bevelOffset: options.bevelOffset || 0,
                bevelSegments: options.bevelSegments || 5,
            });

            // Configuración por defecto para el material
            const textMaterial = new THREE.MeshPhongMaterial({
                color: materialOptions.color || 0x000000,
                specular: materialOptions.specular || 0xffffff,
                shininess: materialOptions.shininess || 100,
                ...materialOptions
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            resolve(textMesh);
        }, undefined, (error) => {
            console.error('Error al cargar la fuente:', error);
            reject(error);
        });
    });
}
