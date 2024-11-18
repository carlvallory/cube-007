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
import { setupMouseMove, setupMouseDrag, detectMouseHover, setupMouseClick, smoothMouseRotation } from '../utils/mouseUtils.js';
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
        this.targetRotation = {x: 0, y: 0, z: 0};
        this.gui = null

        // Inicializar materiales del cubo
        this.cubeMaterials = {
            reflectiveMaterial: null,
            clearMaterial: null,
        };

        const { cubeCamera, cubeRenderTarget } = createCubeCamera();
        this.cubeCamera = cubeCamera
        this.cubeRenderTarget = cubeRenderTarget;
    }

    async start() {
        // Configuración de la escena y el renderizador
        this.scene.background = new THREE.Color(0xfefefe);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 10;
        addAmbientLight(this.scene);
        addDirectionalLight(this.scene);

        try {
            // Cargar el entorno de iluminación
            const hdriPath = 'src/assets/textures/hdri/environment.exr';
            const texture = await loadEnvironmentTexture(this.scene, hdriPath);
            console.log('entorno de iluminacion cargada y aplicada:', texture);

        } catch (error) {
            console.error("Error al cargar el entorno de iluminacion:", error);
        }

        try {
            // Crear los materiales y el cubo
            this.cubeMaterials.reflectiveMaterial = this.createReflectiveMaterial();
            this.cubeMaterials.clearMaterial = this.createClearMaterial();

            this.cube = createCube(this.cubeMaterials, { x: 0, y: 0, z: 0}, { x: 4, y: 4, z: 4});
            
            // Verificar si el cubo se creó correctamente antes de agregarlo a la escena
            if (this.cube) {
                //this.cubeGroup.add(this.cube);
                this.sphere = createWorld('https://i.imgur.com/kFoWvzw.jpg', {x: 0, y: 0, z: 0}, {radius: 1.5, widhtSegments: 32, heighSegments: 32});

                // Verificar si la esfera se creó correctamente antes de agregarlo a la escena
                if (this.sphere) {
                    this.cube.add(this.sphere);

                    try {
                        // Cargar y agregar el texto en la cara frontal del cubo
                        const fontPath = 'src/assets/fonts/roboto/Roboto_Regular.typeface.json';
                        this.textMesh = await loadTextMesh('Start', fontPath, {
                            size: 0.25,
                            height: 0.05,
                            bevelEnabled: true,
                            bevelThickness: 0.02,
                            bevelSize: 0.005,
                            bevelOffset: 0,
                            bevelSegments: 5
                        }, {
                            color: 0x000000,
                            specular: 0xffffff,
                            shininess: 100,
                        });
            
                        // Verificar que textMesh esté correctamente cargado antes de acceder a su posición
                        if (this.textMesh) {
                            this.textMesh.position.set(-0.4, -0.5, 2);
                            this.cube.add(this.textMesh);
            
                            // Configurar el clic en el texto después de que esté completamente inicializado
                            setupMouseClick(this.camera, this.textMesh, (event, intersects) => {
                                if (intersects.length > 0) {
                                    this.handleTextClick();
                                }
                            });
                        } else {
                            console.error("Error al cargar el textMesh: El archivo de fuente puede estar en una ruta incorrecta o no cargarse.");
                        }
                    } catch (error) {
                        console.error("Error al cargar el textMesh:", error);
                    }

                } else {
                    console.error("Error al crear la esfera. Verifica que los materiales sean válidos.");
                }

                this.scene.add(this.cube);

                // Aplicar la animación de vaivén al cubo
                animateRotationVaiven(this.cube);

                //Configurar el arrastre del cubo
                setupMouseDrag(this.renderer.domElement, {
                    onStart: () => {
                        console.log('Drag started');
                        this.cube.userData.isDragging = true; // Evitar conflicto con otras animaciones
                    },
                    onDrag: (deltaX, deltaY) => {
                        if (this.cube.userData.isDragging) {
                            // this.cube.rotation.y += deltaX * 0.001;
                            // this.cube.rotation.x += deltaY * 0.001;
                            gsap.to(this.cube.rotation, {
                                x: this.cube.rotation.x + deltaY * 0.01,
                                y: this.cube.rotation.y + deltaX * 0.01,
                                duration: 0.1,
                                ease: 'power1.out',
                            });
                        }
                    },
                    onEnd: () => {
                        console.log('Drag ended');
                        this.cube.userData.isDragging = false;
                    },
                });
            } else {
                console.error("Error al crear el cubo. Verifica que los materiales sean válidos.");
            }
            
        } catch (error) {
            console.error("Error al crear el cubo o la esfera:", error);
        }

        

        // Configurar detección de hover solo si el cubo está correctamente creado
        if (this.cube instanceof THREE.Object3D) {
            console.log("Cube object before detectHover:", this.cube);

            enableMouseFollow(this.camera, this.cube, this.renderer.domElement);


            // Set up hover detection after confirming cube is initialized
            // detectHover(this.camera, this.cube, (isHovered) => {
            //     if (isHovered) {
            //         smoothRotation(this.cube, new THREE.Euler(0, Math.PI, 0));
            //     }
            // });
        } else {
            console.error("Cube was not created as a THREE.Object3D instance.");
        }

        this.initGUI();

        this.animate();
    }

    // Manejar el clic en el texto
    handleTextClick() {
        console.log('Texto "Start" clickeado');
        // Aquí puedes definir cualquier acción al hacer clic en el texto
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
            if (!this.cube.userData.isDragging) {
                //smoothMouseRotation(this.cube, this.targetRotation);
                rotateWorld(this.sphere);
            }
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
