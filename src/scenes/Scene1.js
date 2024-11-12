import * as THREE from 'three';
import { loadTextMesh } from '../utils/fontLoader.js';
import { loadEnvironmentTexture } from '../utils/materialUtils.js';
import { detectHover } from '../controls/cubeHover.js';
import { smoothRotation } from '../controls/rotateControl.js';
import { addAmbientLight, addDirectionalLight } from '../utils/lighting.js';
import { createCube } from '../objects/cube.js';
import { createMaterials } from '../utils/materialUtils.js';
import { createCubeCamera, updateCubeCamera } from '../utils/cubeReflection.js';
import { setupMouseMove, setupMouseDrag, detectMouseHover, setupMouseClick, smoothMouseRotation } from '../utils/mouseUtils.js';

export class Scene1 {
    constructor(container, transition) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer();
        this.transition = transition;
        this.container = container;
        this.cube = null;
        this.textMesh = null;
        this.targetRotationY = 0;

        const { cubeCamera, cubeRenderTarget } = createCubeCamera();
        this.cubeCamera = cubeCamera
        this.cubeRenderTarget = cubeRenderTarget;

        setupMouseMove((event, mouse, targetRotationY) => {
            // Aquí puedes manejar el movimiento del mouse en la escena
            this.targetRotationY = targetRotationY;
        });

        setupMouseDrag(this.renderer.domElement);

        setupMouseClick(this.camera, this.textMesh, (event, intersects) => {
            // Acción al hacer clic sobre el objeto textMesh
            if (intersects.length > 0) {
                // Acción al hacer clic sobre el objeto textMesh
                this.handleTextClick();
            }
        });
    }

    async start() {
        // Renderizador
        this.scene.background = new THREE.Color(0xfefefe);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
        addAmbientLight(this.scene);
        addDirectionalLight(this.scene);

        await loadEnvironmentTexture(this.scene, 'src/assets/textures/hdri/environment.exr');

        const cubeMaterials = this.createReflectiveMaterial();
        this.cube = createCube(cubeMaterials, { x: 0, y: 0, z: 0}, { x: 4, y: 4, z: 4});
        this.scene.add(this.cube);

        try {
            // Cargar y agregar el texto al cubo
            this.textMesh = await loadTextMesh('Start', 'src/assets/fonts/roboto/Roboto_Regular.typeface.json', {
                size: 0.25,
                height: 0.05,
            }, {
                color: 0x000000,
                specular: 0xffffff,
                shininess: 100,
            });

            // Verificar que textMesh esté correctamente cargado antes de acceder a su posición
            if (this.textMesh) {
                this.textMesh.position.set(-0.4, -0.5, 0.5);
                this.cube.add(this.textMesh);
            } else {
                console.error("Error al cargar el textMesh: El archivo de fuente puede estar en una ruta incorrecta o no cargarse.");
            }
        } catch (error) {
            console.error("Error al cargar el textMesh:", error);
        }

        detectHover(this.camera, this.cube, (isHovered) => {
            if (isHovered) {
                smoothRotation(this.cube, new THREE.Euler(0, Math.PI, 0));
            }
        });

        this.animate();
    }

    // Manejar el clic en el texto
    handleTextClick() {
        console.log('Texto "Start" clickeado');
        // Aquí puedes definir cualquier acción al hacer clic en el texto
    }

    // Crear el material reflectante usando el cubemap de CubeCamera
    createReflectiveMaterial() {
        return new THREE.MeshStandardMaterial({
            envMap: this.cubeRenderTarget.texture, // Usa la textura generada por la CubeCamera
            metalness: 1.0,
            roughness: 0.0,
            side: THREE.DoubleSide
        });
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        if( this.cube ) {
            updateCubeCamera(this.renderer, this.scene, this.cubeCamera, this.cube);
            // Aplicar una rotación suave al cubo según la rotación objetivo en Y
            smoothMouseRotation(this.cube, this.targetRotationY);
        }
        this.renderer.render(this.scene, this.camera);
    };

    stop() {
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
}
