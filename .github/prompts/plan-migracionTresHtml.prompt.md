## Plan: Migrar a 3 Páginas (Panel, Editar, Insertar)

TL;DR: Consolidar la base duplicada, crear tres HTML semánticos independientes (panel, editar, insertar) con un solo `styles.css` y un módulo JS principal `app.js` apoyado por submódulos (datos, almacenamiento, UI). Se reemplazan modales y DOM acoplado por formularios limpios y rutas separadas, usando un modelo `Packaging` y una capa de datos desacoplada (fetch + IndexedDB/localStorage). Se optimiza responsive con Flex/Grid y se renombran clases/IDs para mejorar mantenibilidad y accesibilidad.

### Steps
1. Definir nueva estructura: `public/panel.html`, `public/edit.html`, `public/new.html`, `public/styles.css`, `public/assets/js/app.js` + submódulos (`dataService.js`, `storage.js`, `ui-list.js`, `ui-form.js`), eliminar duplicados `other/HHS/*`.
2. Modelar entidad `Packaging` y catálogo: extraer lógica de fetch/IndexedDB desde `bdLocal.js` y `controller.js` a `dataService.js` y `storage.js` (normalizar campos).
3. Implementar render lista en `panel.html` vía `ui-list.js` (cargar catálogo, pintar tabla/grid con botones Editar/Insertar enlazando a `edit.html?id=` y `new.html`).
4. Crear formularios semánticos en `edit.html` y `new.html` con `ui-form.js`: carga inicial (editar), validación (longitud, ancho, alto, peso), guardado al catálogo y redirección al panel.
5. Unificar estilos en `styles.css`: capas base (reset, variables), layout responsive (Grid/Flex), componentes (lista, formulario, botones), media queries móvil.
6. Añadir accesibilidad: `label for`, `aria-live` para mensajes, enfoque claro, roles en listas y formularios; eliminar IDs no usados y nombres genéricos.

### Further Considerations
1. Persistencia: ¿Solo en memoria/IndexedDB o sincronizar siempre con backend? Definir estrategia.
2. Edición/Inserción: ¿Validar dimensiones numéricas estrictas y rango? Opciones: mín/max configurable.
3. Navegación: ¿Usar enlaces simples o manejar historia (pushState) para posible SPA futura?
4. Considerar conservar el login 
