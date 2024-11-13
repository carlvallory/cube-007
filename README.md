# Three.js Interactive Cube Project

Este proyecto es una escena 3D interactiva creada con Three.js, donde un cubo en el centro de la escena reacciona al movimiento y a la posición del mouse. Al pasar el mouse sobre el cubo, su cara frontal sigue el movimiento del cursor de manera suave y, al salir del área del cubo, este mantiene su última posición.

## Características

- **Cubo interactivo**: La cara frontal del cubo sigue el mouse cuando el puntero está sobre él.
- **Animaciones suaves**: Se utiliza interpolación de rotación para obtener un movimiento fluido.
- **Textura y reflejos**: El cubo tiene un material reflectante, simulando un efecto de prisma.
- **Detección de hover y clic**: El cubo responde a eventos de hover y clic en el texto frontal.

## Tecnologías

- **Three.js**: Biblioteca principal para renderizado 3D.
- **JavaScript (ES6)**: Para toda la lógica de animación e interacción.
- **Webpack** (opcional): Para la construcción y optimización del proyecto.

## Requisitos previos

Asegúrate de tener instalados los siguientes componentes:

- **Node.js** (v14 o superior)
- **npm** (gestor de paquetes de Node.js)

## Instalación

1. Clona este repositorio:
    ```bash
    git clone https://github.com/carlvallory/cube-007.git
    cd cube-007
    ```

2. Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

3. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

4. Abre tu navegador y accede a `http://localhost:{port}` para ver el proyecto en acción.

## Estructura del Proyecto

```plaintext
src/
├── controls/
│   ├── cubeHover.js         # Detección de hover sobre el cubo
│   ├── followMouse.js       # Permite que el cubo siga al mouse
├── objects/
│   ├── cube.js              # Configuración del cubo con materiales
├── utils/
│   ├── fontLoader.js        # Carga de fuentes 3D
│   ├── materialUtils.js     # Utilidades para la creación de materiales
│   ├── lighting.js          # Configuración de iluminación
├── scene/
│   ├── Scene1.js            # Configuración de la escena principal
│   ├── cubeReflection.js    # Configuración de reflejos del cubo
└── main.js                  # Archivo principal para inicializar la aplicación
```

## Descripción de los módulos
**cubeHover.js:** Detecta cuándo el mouse está sobre el cubo y ejecuta las acciones correspondientes.
**followMouse.js:** Controla la rotación del cubo para que siga el mouse cuando está sobre él.
**materialUtils.js:** Contiene funciones para crear materiales reflectantes y transparentes.
**Scene1.js:** Configura la escena principal, inicializa el cubo y los materiales, y gestiona la animación.
**cubeReflection.js:** Configura una cámara de cubo para reflejos en el cubo.

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para obtener más detalles.