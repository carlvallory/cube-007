import * as THREE from 'three';
import gsap from 'gsap';
import { loadTextMesh } from '../utils/fontLoader.js';
import { loadEnvironmentTexture } from '../utils/materialUtils.js';
import { detectHover } from '../controls/cubeHover.js';
import { smoothRotation } from '../controls/rotateControl.js';
import { addAmbientLight, addDirectionalLight } from '../utils/lighting.js';
import { createCube } from '../objects/cube.js';
import { createMaterials } from '../utils/materialUtils.js';
import { createCubeCamera, updateCubeCamera } from '../utils/cubeReflection.js';
import { setupMouseClick, smoothMouseRotation } from '../utils/mouseUtils.js';
import { enableMouseFollow } from '../controls/followMouse.js';
import { createWorld, rotateWorld } from '../objects/world.js';
import { animateCameraTransition } from '../utils/transitionUtils.js';
import { animateRotationVaiven } from '../utils/animations.js'; // Importa la animación
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

export class Scene1 {
    constructor(container, transition) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.cameraIsActive = false;
        this.renderer = new THREE.WebGLRenderer();
        this.transition = transition;
        this.container = container;
        this.cubeGroup = new THREE.Group();
        this.cube = null;
        this.sphere = null;
        this.textMesh = null;
        this.isDragging = false;
        this.isMouseOut = true;
        this.previousMousePosition = { x: 0, y: 0 };
        this.targetRotation = {x: 0, y: 0};
        this.gui = null;
        this.vaivenAnimation = null;

        this.setupMouseEvents();
        this.setupMouseHoverEvents();

        // Inicializar materiales del cubo
        this.cubeMaterials = {
            reflectiveMaterial: null,
            clearMaterial: null,
            unusedMaterial: null,
        };

        const { cubeCamera, cubeRenderTarget } = createCubeCamera();
        this.cubeCamera = cubeCamera
        this.cubeRenderTarget = cubeRenderTarget;

        window.scene = this.scene;
    }

    async start() {
        // Configuración de la escena y el renderizador
        this.scene.background = new THREE.Color(0xfefefe);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 10;
        addAmbientLight(this.scene);
        addDirectionalLight(this.scene);

        const unusedGeometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);

        // Cargar el entorno de iluminación
        try {
            const hdriPath = 'src/assets/textures/hdri/environment.exr';
            const texture = await loadEnvironmentTexture(this.scene, hdriPath);
            console.log('entorno de iluminacion cargada y aplicada:', texture);

        } catch (error) {
            console.error("Error al cargar el entorno de iluminacion:", error);
        }

        // Crear los materiales y el cubo
        try {
            this.cubeMaterials.reflectiveMaterial = this.createReflectiveMaterial();
            this.cubeMaterials.clearMaterial = this.createClearMaterial();
            this.cubeMaterials.unusedMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

            this.cube = createCube(this.cubeMaterials, { x: 0, y: 0, z: 0}, { x: 4, y: 4, z: 4});
            
            // Verificar si el cubo se creó correctamente antes de agregarlo a la escena
            if (this.cube) {
                this.scene.add(this.cube);
                this.sphere = createWorld(
                    'https://i.imgur.com/kFoWvzw.jpg', 
                    {x: 0, y: 0, z: 0}, 
                    {radius: 1.5, widhtSegments: 32, heighSegments: 32}
                );

                // Verificar si la esfera se creó correctamente antes de agregarlo a la escena
                if (this.sphere) {
                    this.cube.add(this.sphere);

                } else {
                    console.error("Error al crear la esfera. Verifica que los materiales sean válidos.");
                }

                // Load text mesh
                await this.addTextToCube();

                this.vaivenAnimation = animateRotationVaiven(this.cube);
                this.vaivenAnimation.pause();
                
            } else {
                console.error("Error al crear el cubo. Verifica que los materiales sean válidos.");
                return;
            }
            
        } catch (error) {
            console.error("Error al crear el cubo o la esfera:", error);
        }

        

        // Configurar detección de hover solo si el cubo está correctamente creado
        // if (this.cube instanceof THREE.Object3D) {
        //     console.log("Cube object before detectHover:", this.cube);

        //     enableMouseFollow(this.camera, this.cube, this.renderer.domElement);


        //     // Set up hover detection after confirming cube is initialized
        //     // detectHover(this.camera, this.cube, (isHovered) => {
        //     //     if (isHovered) {
        //     //         smoothRotation(this.cube, new THREE.Euler(0, Math.PI, 0));
        //     //     }
        //     // });
        // } else {
        //     console.error("Cube was not created as a THREE.Object3D instance.");
        // }

        this.initGUI();

        this.animate();
    }

    // Manejar el clic en el texto
    handleTextClick() {
        console.log('Texto "Start" clickeado');
        // Aquí puedes definir cualquier acción al hacer clic en el texto
        this.targetRotation.y += Math.PI;
        animateCameraTransition(this.camera, this.cube, this.renderer, this.scene, this.transition, { cameraIsActive: this.cameraIsActive});
    }

    // Crear el material reflectante usando el cubemap de CubeCamera
    createReflectiveMaterial() {
        return new THREE.MeshPhysicalMaterial({
            envMap: this.cubeRenderTarget.texture, // Usa la textura generada por la CubeCamera
            envMapIntensity: 1,
            color: 0xaaaaaa, 
            opacity: 0.1, // Transparente
            transparent: true,
            roughness: 0.05, 
            metalness: 0, 
            reflectivity: 0.9,
            transmission: 1, // Permitir que la luz pase a través
            clearcoat: 1, 
            clearcoatRoughness: 0,
            thickness: -1,
            ior: 1,
            sheen: 1, // Simular efectos de dispersión de luz
            sheenColor: new THREE.Color(0xff00ff), // Efecto prismático con un color inicial
            side: THREE.DoubleSide
        });
    }

    createClearMaterial() {
        return new THREE.MeshPhysicalMaterial({
            envMap: this.cubeRenderTarget.texture, // Usa la textura generada por la CubeCamera
            envMapIntensity: 1,
            metalness: 0.2,  
            roughness: 0.1,
            transmission: 0.9, // Add transparency
            thickness: -1, // Add refraction
            reflectivity: 1,
            ior: 1.3,
            sheen: 1, // Simular efectos de dispersión de luz
            sheenColor: new THREE.Color(0x0000ff), // Efecto prismático con un color inicial
            side: THREE.DoubleSide,
            lightMapIntensity: 1,
        });
    }

    async addTextToCube() {
        try {
            const fontPath = 'src/assets/fonts/roboto/Roboto_Regular.typeface.json';
            this.textMesh = await loadTextMesh('Start', fontPath, {
                size: 0.25,
                height: 0.05,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.005,
                bevelOffset: 0,
                bevelSegments: 5,
            }, {
                color: 0x000000,
                specular: 0xffffff,
                shininess: 100,
                transparent: true,
                opacity: 1,
            });

            if (this.textMesh) {
                this.textMesh.position.set(-0.4, -0.5, 2);
                this.cube.add(this.textMesh);

                setupMouseClick(this.camera, this.textMesh, () => this.handleTextClick());
            }
        } catch (error) {
            console.error('Error adding text to cube:', error);
        }
    }

    setupMouseEvents() {
        const canvas = this.renderer.domElement;

        canvas.addEventListener('mousedown', (event) => {
            this.isDragging = true;
            this.previousMousePosition.x = event.clientX;
            this.previousMousePosition.y = event.clientY;
        });

        canvas.addEventListener('mousemove', (event) => {
            if (this.isDragging && this.cube) {
                const deltaMove = {
                    x: event.clientX - this.previousMousePosition.x,
                    y: event.clientY - this.previousMousePosition.y,
                };

                // Rotate cube based on mouse movement
                this.cube.rotation.y += deltaMove.x * 0.01;

                this.previousMousePosition.x = event.clientX;
                this.previousMousePosition.y = event.clientY;
            }
        });

        canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // canvas.addEventListener('mouseover', () => {
        //     this.isMouseOut = false;
        // });

        // canvas.addEventListener('mouseout', () => {
        //     this.isMouseOut = true;
        // });
    }

    setupMouseHoverEvents() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
    
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
            raycaster.setFromCamera(mouse, this.camera);
    
            const intersects = raycaster.intersectObject(this.cube);
    
            // Actualizar isMouseOut según el estado del hover
            this.isMouseOut = intersects.length === 0;
        });
    }    

    initGUI() {
        this.gui = new GUI();

        // Controlar posición del cubo
        const cubeFolder = this.gui.addFolder('Cubo');
        cubeFolder.add(this.cube.position, 'x', -10, 10).name('Posición X');
        cubeFolder.add(this.cube.position, 'y', -10, 10).name('Posición Y');
        cubeFolder.add(this.cube.position, 'z', -10, 10).name('Posición Z');
        cubeFolder.add(this.cube.rotation, 'x', 0, Math.PI * 2).name('Rotación X');
        cubeFolder.add(this.cube.rotation, 'y', 0, Math.PI * 2).name('Rotación Y');
        cubeFolder.add(this.cube.rotation, 'z', 0, Math.PI * 2).name('Rotación Z');
        cubeFolder.add(this.cube.scale, 'x', 0.1, 3).name('Escala X');
        cubeFolder.add(this.cube.scale, 'y', 0.1, 3).name('Escala Y');
        cubeFolder.add(this.cube.scale, 'z', 0.1, 3).name('Escala Z');
        cubeFolder.open();

        // Controlar la cámara
        const cameraFolder = this.gui.addFolder('Cámara');
        cameraFolder.add(this.camera.position, 'x', -50, 50).name('Cámara X');
        cameraFolder.add(this.camera.position, 'y', -50, 50).name('Cámara Y');
        cameraFolder.add(this.camera.position, 'z', -50, 50).name('Cámara Z');
        cameraFolder.open();

        // Ocultar la GUI por defecto
        this.gui.domElement.style.display = 'none';

        // Escuchar el evento de teclado para alternar la visibilidad
        window.addEventListener('keydown', (event) => {
            if (event.key === 'g') { // Presionar la tecla 'G' para alternar
                this.toggleGUI();
            }
        });
    }

    toggleGUI() {
        if (this.gui.domElement.style.display === 'none') {
            this.gui.domElement.style.display = '';
        } else {
            this.gui.domElement.style.display = 'none';
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        if( this.cube ) {
            if (!this.isDragging) {
                smoothMouseRotation(this.cube, this.targetRotation);
                // Aplicar la animación de vaivén al cubo
            }

            if(this.isMouseOut) {
                if (this.vaivenAnimation && this.vaivenAnimation.paused()) {
                    this.vaivenAnimation.resume();
                }
            } else {
                if (this.vaivenAnimation && !this.vaivenAnimation.paused()) {
                    this.vaivenAnimation.pause();
                }
            }

            rotateWorld(this.sphere);
            updateCubeCamera(this.renderer, this.scene, this.cubeCamera, this.cube);
        }
        this.renderer.render(this.scene, this.camera);
    };

    stop() {
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
        if(this.gui) {
            this.gui.destroy();
        }
    }
}
