# TaskFlow

TaskFlow es una aplicación web interactiva desarrollada en JavaScript moderno para la gestión integral de tareas. El proyecto integra Programación Orientada a Objetos (POO), características de ECMAScript 6+, manipulación avanzada del DOM, control de eventos, programación asíncrona, persistencia local y consumo de servicios API mediante `fetch`.

## Funcionalidades Principales
- **Creación y Gestión:** Permite agregar tareas con descripción y fecha límite opcional, además de editarlas, alternar su estado entre pendiente y completada, y eliminarlas.
- **Interfaz Dinámica:** Contiene un resumen en tiempo real del total, tareas pendientes y completadas, además de una cuenta regresiva dinámica para las fechas límite.
- **Persistencia Local:** Guarda y recupera automáticamente la colección de tareas utilizando `localStorage`.
- **Integración con API:** Permite importar tareas desde un servicio externo (`GET`) y sincronizar nuevos registros (`POST`) mediante `fetch` con manejo de errores utilizando bloques `try/catch`.

## Tecnologías y Características Técnicas
- **POO:** Clases estructuradas (`Tarea` y `GestorTareas`) para separar la responsabilidad de los datos individuales y la administración de la colección.
- **ES6+:** Uso de `const`, `let`, plantillas literales (*template literals*), funciones flecha (*arrow functions*), desestructuración (*destructuring*), operador *spread* (`...`) y operador *rest* (`...`).
- **Asincronía:** Implementación de promesas, `setTimeout`, `setInterval` y funciones `async/await`.
- **Estilos:** Diseño responsivo basado en Bootstrap 5 complementado con una capa mínima de estilos personalizados.

## Estructura del Proyecto y Mapa de Responsabilidades

taskflow/
├── index.html          # Interfaz principal de la aplicación basada en Bootstrap 5
├── README.md           # Documentación y explicación técnica del proyecto
├── css/
│   └── styles.css      # Estilos específicos para transiciones, resaltados y notificaciones
└── js/
    ├── Tarea.js        # Modela la unidad de tarea individual y sus métodos de estado
    ├── GestorTareas.js # Administra la colección completa de tareas y sus operaciones
    ├── storage.js      # Controla la persistencia de datos mediante localStorage y JSON
    ├── api.js          # Gestiona las solicitudes asíncronas GET y POST con fetch
    └── app.js          # Conecta la lógica con el DOM, eventos, asincronía y notificaciones

## Instrucciones de Ejecución
1. Clona o descarga este repositorio en tu computadora.
2. Abre la carpeta del proyecto en **Visual Studio Code**.
3. Ejecuta el archivo `index.html` utilizando la extensión **Live Server** para visualizar la aplicación funcionando en tu navegador web.