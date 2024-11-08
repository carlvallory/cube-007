import { Scene1 } from './scenes/Scene1.js';
import { Scene2 } from './scenes/Scene2.js';

const container = document.getElementById('container');
let currentScene;

function init() {
    currentScene = new Scene1(container, transitionToScene2);
    currentScene.start();
}

function transitionToScene2() {
    currentScene.stop();
    currentScene = new Scene2(container, transitionToScene1);
    currentScene.start();
}

function transitionToScene1() {
    currentScene.stop();
    currentScene = new Scene1(container, transitionToScene2);
    currentScene.start();
}

init();
