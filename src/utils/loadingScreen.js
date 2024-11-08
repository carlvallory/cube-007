let loadingScreen = document.createElement('div');
loadingScreen.id = 'loading-screen';
loadingScreen.style.position = 'fixed';
loadingScreen.style.width = '100vw';
loadingScreen.style.height = '100vh';
loadingScreen.style.backgroundColor = '#000';
loadingScreen.style.display = 'flex';
loadingScreen.style.justifyContent = 'center';
loadingScreen.style.alignItems = 'center';
loadingScreen.style.color = '#fff';
loadingScreen.style.fontSize = '24px';
loadingScreen.innerHTML = 'Cargando... 0%';

document.body.appendChild(loadingScreen);

export function updateLoadingScreen(progress) {
    loadingScreen.innerHTML = `Cargando... ${progress}%`;
}

export function hideLoadingScreen() {
    loadingScreen.style.display = 'none';
}
