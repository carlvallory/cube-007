import * as THREE from 'three';
import { loadTextMesh } from '../utils/fontLoader.js';
import { loadEnvironmentTexture } from '../utils/materialUtils.js';
import { detectHover } from '../controls/cubeHover.js';
import { smoothRotation } from '../controls/rotateControl.js';
import { addAmbientLight, addDirectionalLight } from '../utils/lighting.js';
import { createCube } from '../objects/cube.js';
import { createMaterials } from '../utils/materialUtils.js';
import { createCubeCamera, updateCubeCamera } from '../utils/cubeReflection.js';

export class Scene1 {
    constructor(container, transition) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer();
        this.transition = transition;
        this.container = container;
        this.cube = null;

        const { cubeCamera, cubeRenderTarget } = createCubeCamera();
        this.cubeCamera = cubeCamera
        this.cubeRenderTarget = cubeRenderTarget;
    }

    async start() {
        // Renderizador
        this.scene.background = new THREE.Color(0xfefefe);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
        addAmbientLight(this.scene);
        addDirectionalLight(this.scene);

        loadEnvironmentTexture(this.scene, 'src/assets/textures/hdri/environment.exr');

        const cubeMaterials = this.createReflectiveMaterial();
        this.cube = createCube(cubeMaterials, { x: 0, y: 0, z: 0}, { x: 4, y: 4, z: 4});
        this.scene.add(this.cube);

        // Cargar y agregar el texto al cubo
        const textMesh = await loadTextMesh('Start', 'src/assets/fonts/roboto/Roboto_Regular.typeface.json', {
            size: 0.25,
            height: 0.05,
        }, {
            color: 0x000000,
            specular: 0xffffff,
            shininess: 100,
        });

        // Posiciona el texto en la cara frontal del cubo
        textMesh.position.set(-0.4, -0.5, 0.5);
        this.cube.add(textMesh);

        detectHover(this.camera, this.cube, (isHovered) => {
            if (isHovered) {
                smoothRotation(this.cube, new THREE.Euler(0, Math.PI, 0));
            }
        });

        this.animate();
    }

    // Crear el material reflectante usando el cubemap de CubeCamera
    createReflectiveMaterial() {
        return new THREE.MeshStandardMaterial({
            envMap: this.cubeRenderTarget.texture, // Usa la textura generada por la CubeCamera
            metalness: 1.0,
            roughness: 0.0
        });
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        if( this.cube ) {
            updateCubeCamera(this.renderer, this.scene, this.cubeCamera, this.cube);
        }
        this.renderer.render(this.scene, this.camera);
    };

    stop() {
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
}
