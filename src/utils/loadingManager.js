import * as THREE from './three.js'; // Asegúrate de usar el import centralizado
import { updateLoadingScreen, hideLoadingScreen } from './loadingScreen.js';

// Crear el LoadingManager
const loadingManager = new THREE.LoadingManager();

// Agregar funciones de callback opcionales
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log(`Starting loading: ${url}`);
    console.log(`Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};

loadingManager.onLoad = () => {
    hideLoadingScreen();
    console.log('All assets loaded.');
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = Math.floor((itemsLoaded / itemsTotal) * 100);
    updateLoadingScreen(progress);
    console.log(`Loading file: ${url}.`);
    console.log(`Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};

loadingManager.onError = (url) => {
    console.error(`Error loading: ${url}`);
};

export default loadingManager;
