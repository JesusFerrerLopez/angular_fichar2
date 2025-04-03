# Fichar2 cliente ANGULAR

## índice

1. [Introducción](#introducción)  
2. [Instalación](#instalación)  
3. [Uso](#uso)  

## Introducción

Cliente en angular que toma los servicios de la API en laravel

## Instalación

1. Clona el repositorio:  
    ```bash
    git clone https://github.com/tu-usuario/fichar2_angular.git
    ```

2. Navega al directorio del proyecto:  
    ```bash
    cd fichar2_angular
    ```

3. Instala las dependencias:  
    ```bash
    npm install
    ```

4. Configurar variables de entorno.
    ```bash
    export const environment = {
    production: false,
    // La URL de la API de tu backend aquí
    apiUrl: 'http://fichar2.local/api/v1/'
    };
    ```

5. Inicia el servidor de desarrollo:  
    ```bash
    ng serve
    ```

6. Abre tu navegador y accede a `http://localhost:4200`.

## Uso

### Estructura de directorios
```plaintext
fichar2_angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   ├── app.module.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts 
│   │   ├── app.routes.ts
│   │   └── app.component.html
│   ├── environments/
│   │   └── environment.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── README.md
└── tsconfig.json
```
### Explicación de la funcionalidad

#### Components
Contiene los componentes de la aplicación Angular. Cada componente representa una parte específica de la interfaz de usuario y está compuesto por un archivo HTML, un archivo CSS y un archivo TypeScript.

#### Services
Incluye los servicios que manejan la lógica de negocio y la comunicación con la API. Los servicios son utilizados para compartir datos entre componentes y realizar peticiones HTTP.

#### App Config
Archivo de configuración de la aplicación. Puede contener constantes, configuraciones globales o valores que se utilizan en toda la aplicación.

#### App Routes
Define las rutas de la aplicación. Es donde se configuran las URL y los componentes asociados a cada ruta para la navegación dentro de la aplicación.

#### Environments
Contiene configuraciones específicas para diferentes entornos (desarrollo, producción, etc.). Por ejemplo, la URL de la API puede variar según el entorno.

#### Main.ts
Es el punto de entrada principal de la aplicación Angular. Aquí se inicializa la aplicación y se arranca el módulo raíz (`AppModule`).
