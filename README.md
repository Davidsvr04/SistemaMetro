# Sistema Metro de Medellín - Calculador de Rutas Inteligente

Este proyecto implementa un sistema interactivo para calcular rutas óptimas en el sistema de transporte público de Medellín utilizando grafos dinámicos y el algoritmo de Dijkstra.

## 🚇 Características Principales

- **Cálculo de Rutas Óptimas**: Encuentra la mejor ruta entre dos estaciones según diferentes criterios
- **Visualización Interactiva**: Representación gráfica de la red de transporte con animaciones fluidas
- **Simulación de Disrupciones**: Maneja cierres de estaciones completas o de líneas específicas con detección inteligente
- **Análisis de Rutas**: Compara múltiples opciones de viaje con estadísticas detalladas
- **Interfaz Moderna**: Diseño con los colores oficiales del Metro de Medellín y animaciones suaves
- **Estaciones Multimodales**: Soporte completo para estaciones con múltiples líneas
- **Mensajes Inteligentes**: Sistema de mensajes contextuales que sugiere alternativas cuando no hay ruta disponible

## 🎨 Características de Diseño

### Estética del Metro de Medellín
- **Colores Oficiales**: Paleta basada en la identidad visual del Metro de Medellín
  - Azul Metro: `#003d7a`, `#0066cc`, `#3399ff`
  - Naranja: `#ff6600`, `#ff9933`
  - Verde: `#00aa44`, `#00cc55`
  - Amarillo: `#ffcc00`, `#ffe066`
  - Morado: `#6633cc`, `#8855dd`
  - Rojo: `#cc0033`, `#ff3366`

### Animaciones y Transiciones
- **Entrada Escalonada**: Los elementos de la leyenda aparecen con un efecto secuencial suave
- **Hover Mejorado**: Efectos de elevación y escala en botones y tarjetas
- **Pulso Sutil**: El botón de calcular tiene un pulso de sombra para destacarlo
- **Ripple Effect**: Efecto de onda en botones al hacer clic
- **Shimmer Effect**: Brillo sutil en las tarjetas de estadísticas al pasar el cursor
- **Slide Animations**: Los resultados aparecen con una animación de deslizamiento
- **Path Pulse**: Las rutas en el grafo tienen un pulso animado
- **Loading Spinner**: Indicador de carga durante el cálculo de rutas

### Mensajes de Estado
- **Error**: Gradiente rojo con icono de advertencia
- **Éxito**: Gradiente verde con icono de check
- **Info**: Gradiente azul con icono de información
- **Cargando**: Gradiente morado con spinner animado

## 🏗️ Arquitectura del Sistema

### Estructura de Archivos

```
SistemaMetro/
├── index.html          # Interfaz principal
├── styles.css          # Estilos y diseño responsivo
├── metroData.js        # Datos del sistema de transporte
├── dijkstra.js         # Algoritmo de Dijkstra y pathfinding
├── visualization.js    # Visualización del grafo
├── app.js             # Aplicación principal
└── README.md          # Documentación
```

### Componentes Principales

1. **MetroData**: Gestiona la información de estaciones, conexiones y costos
2. **DijkstraPathfinder**: Implementa el algoritmo de búsqueda de rutas óptimas
3. **SimpleMetroVisualization**: Visualiza la red de transporte como un grafo SVG
4. **MetroApp**: Aplicación principal que coordina todos los componentes

## 🚌 Sistema de Transporte Modelado

### Líneas Incluidas

- **Línea A**: Metro (20 estaciones) - Niquía a La Estrella
- **Línea B**: Metro (6 estaciones) - San Antonio a San Javier
- **Línea 1**: Bus (19 estaciones) - Aranjuez a UdeM
- **Línea 2**: Bus (20 estaciones) - Aranjuez a UdeM
- **Línea P**: MetroCable (3 estaciones) - Acevedo a El Progreso
- **Línea J**: MetroCable (3 estaciones) - San Javier a La Aurora
- **Línea K**: MetroCable (3 estaciones) - Acevedo a Santo Domingo
- **Línea M**: MetroCable (2 estaciones) - Miraflores a Trece de Noviembre
- **Línea H**: MetroCable (2 estaciones) - Oriente a Villa Sierra
- **Línea T**: Tranvía (8 estaciones) - San Antonio a Oriente

## ⚡ Funcionalidades Avanzadas

### 1. Criterios de Optimización
- **Menor Tiempo**: Minimiza el tiempo total de viaje
- **Menor Costo**: Optimiza el costo económico del recorrido
- **Menos Transbordos**: Reduce el número de cambios de línea

### 2. Simulación de Eventos Disruptivos
- **Cierre de Estaciones Completas**: Bloquea todas las líneas de una estación
- **Cierre de Líneas Específicas**: Permite cerrar solo una línea en estaciones multimodales
- **Detección Inteligente**: Identifica automáticamente estaciones críticas bloqueadas
- **Sugerencias Alternativas**: Propone estaciones cercanas cuando no hay ruta disponible
- **Reset Completo**: Limpia todas las interrupciones con un solo clic

### 3. Análisis de Rutas
- Comparación de rutas alternativas
- Estadísticas detalladas de tiempo, costo y transbordos
- Velocidad promedio estimada
- Eficiencia de la ruta
- Análisis de accesibilidad desde estaciones bloqueadas

### 4. Visualización Interactiva
- Selección de estaciones directamente en el grafo
- Resaltado de rutas calculadas con animación
- Indicadores visuales de interrupciones (líneas punteadas)
- Leyenda organizada por categorías de transporte
- Efectos hover con elevación y escala
- Estaciones multimodales con indicador especial
- Gráficos SVG con filtros drop-shadow y glow

### 5. Filtrado Inteligente de Líneas
- **Actualización Dinámica**: El selector de líneas se actualiza según la estación seleccionada
- **Solo Líneas Disponibles**: Muestra únicamente las líneas que pasan por la estación
- **Feedback Visual**: Deshabilitado cuando no hay estación seleccionada

## 🔧 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualización**: SVG nativo con animaciones CSS
- **Algoritmos**: Dijkstra con Min-Heap optimizado
- **Estructuras de Datos**: Grafos dirigidos ponderados, Sets, Maps
- **Diseño**: CSS Grid, Flexbox, Variables CSS personalizadas
- **Animaciones**: Cubic-Bezier easing, transforms, filters, pseudo-elementos
- **UX**: Estados de carga, mensajes contextuales, feedback visual inmediato

## 📊 Algoritmo de Dijkstra

### Implementación Optimizada

```javascript
class DijkstraPathfinder {
    findShortestPath(start, end, criterion = 'tiempo') {
        // Implementación con cola de prioridad (Min-Heap)
        // Manejo de pesos dinámicos según criterio
        // Soporte para disrupciones en tiempo real
    }
}
```

### Características Especiales

- **Cola de Prioridad**: Min-Heap para eficiencia O(log n)
- **Pesos Dinámicos**: Adaptación según criterio seleccionado
- **Manejo de Disrupciones**: Exclusión dinámica de nodos/aristas
- **Rutas Alternativas**: Algoritmo para encontrar múltiples caminos
- **Cierre de Líneas Específicas**: Soporte para estaciones multimodales con cierres selectivos
- **Análisis de Accesibilidad**: Verifica la conectividad desde estaciones con disrupciones
- **Búsqueda de Estaciones Alternativas**: Encuentra la estación accesible más lejana para sugerir alternativas

## 🎨 Diseño de Interfaz

### Principios de Diseño
- **Responsive**: Adaptable a diferentes tamaños de pantalla (1024px, 768px, 480px)
- **Accesible**: Uso de iconos Font Awesome, colores contrastantes y focus states
- **Intuitivo**: Flujo de usuario lógico y simple con feedback inmediato
- **Visual**: Representación gráfica clara con animaciones fluidas
- **Moderno**: Gradientes, sombras, efectos de profundidad y micro-interacciones

### Paleta de Colores (Metro de Medellín)
- **Metro Líneas A/B**: Azul (`#003d7a`, `#0066cc`, `#3399ff`)
- **Tranvía Línea T**: Azul claro (`#6699ff`)
- **Metroplus Líneas 1/2**: Verde/Rosa (`#00cc66`, `#cc0066`)
- **MetroCable P/J/K/M/H**: Morado/Rojo/Amarillo (`#9933cc`, `#ff3366`, `#ffcc00`)
- **Acentos**: Naranja (`#ff6600`), Verde (`#00aa44`), Amarillo (`#ffcc00`)

### Efectos Visuales
- **Box Shadows**: Sombras suaves con múltiples capas
- **Gradientes**: Transiciones de color lineales en 135deg
- **Transforms**: Translate, scale, rotate para micro-interacciones
- **Filters**: Drop-shadow, blur para profundidad
- **Transitions**: Cubic-bezier personalizado (0.4, 0, 0.2, 1) para fluidez
- **Animaciones**: Fade, slide, scale, pulse, shimmer, ripple

## 🚀 Cómo Usar

1. **Abrir la aplicación**: Cargar `index.html` en un navegador web
2. **Seleccionar origen**: Elegir estación de partida
3. **Seleccionar destino**: Elegir estación de llegada
4. **Elegir criterio**: Tiempo, costo o transbordos
5. **Calcular ruta**: Hacer clic en "Calcular Ruta Óptima"
6. **Ver resultados**: Analizar la ruta propuesta y estadísticas

### Funciones Adicionales
- **Eventos disruptivos**: Simular interrupciones del servicio completas o por línea
- **Selección visual**: Hacer clic en estaciones del grafo
- **Comparación**: Ver rutas alternativas automáticamente
- **Reset de interrupciones**: Botón para limpiar todas las disrupciones
- **Filtrado inteligente**: Selector de líneas se actualiza según estación
- **Botón limpiar ruta**: Restaura la vista completa del mapa

## 📈 Métricas y Análisis

### Estadísticas Mostradas
- **Tiempo Total**: Duración estimada del viaje
- **Costo Total**: Precio total del recorrido
- **Número de Transbordos**: Cambios de línea necesarios
- **Velocidad Promedio**: Estimación basada en distancia/tiempo
- **Líneas Utilizadas**: Sistemas de transporte involucrados

### Análisis de Eficiencia
- Comparación entre rutas alternativas
- Métricas de resiliencia del sistema
- Impacto de disrupciones en conectividad

## 🔬 Casos de Uso Académicos

### 1. Teoría de Grafos
- Representación de redes como grafos ponderados
- Algoritmos de camino más corto
- Análisis de conectividad y componentes

### 2. Optimización
- Múltiples criterios de optimización
- Trade-offs entre tiempo, costo y comodidad
- Programación dinámica aplicada

### 3. Simulación de Sistemas
- Modelado de eventos disruptivos
- Análisis de robustez y redundancia
- Sistemas de transporte inteligentes

## 🛠️ Posibles Extensiones

### Funcionalidades Avanzadas
- **Predicción de Tiempos**: Machine learning para estimaciones más precisas
- **Datos en Tiempo Real**: Integración con APIs de transporte público
- **Optimización Multi-objetivo**: Algoritmos genéticos o Pareto-front
- **Análisis Estadístico**: Patrones de uso y optimización de red

### Mejoras Técnicas
- **Progressive Web App**: Funcionalidad offline
- **Base de Datos**: Persistencia de rutas favoritas
- **APIs REST**: Backend para múltiples clientes
- **WebSockets**: Actualizaciones en tiempo real

## 📝 Requisitos del Proyecto

### Funcionalidades Implementadas ✅
- ✅ Grafo dirigido ponderado con estaciones como nodos
- ✅ Algoritmo de Dijkstra para rutas óptimas
- ✅ Visualización gráfica de la red con SVG
- ✅ Múltiples criterios de optimización
- ✅ Simulación de eventos disruptivos (estaciones y líneas)
- ✅ Predicción de tiempos de viaje
- ✅ Análisis de resiliencia del sistema
- ✅ Interfaz interactiva y responsive
- ✅ Estaciones multimodales con soporte de múltiples líneas
- ✅ Cierre selectivo de líneas en estaciones
- ✅ Detección inteligente de estaciones críticas bloqueadas
- ✅ Sugerencias de rutas alternativas contextuales
- ✅ Animaciones fluidas y micro-interacciones
- ✅ Estados de carga con feedback visual
- ✅ Diseño con colores oficiales del Metro de Medellín
- ✅ Sistema de mensajes inteligente con gradientes

### Datos Implementados
- ✅ Todas las líneas del sistema Metro de Medellín
- ✅ Tiempos reales entre estaciones
- ✅ Costos por tipo de transporte
- ✅ Conexiones y transbordos

## 🎓 Valor Educativo

Este proyecto demuestra aplicaciones prácticas de:
- **Estructuras de Datos**: Grafos, heaps, conjuntos
- **Algoritmos**: Dijkstra, búsqueda, optimización
- **Programación Web**: JavaScript moderno, CSS avanzado
- **Diseño de Sistemas**: Arquitectura modular, separación de responsabilidades
- **Resolución de Problemas**: Modelado de sistemas reales complejos

---

**Desarrollado como proyecto universitario para el estudio de Algoritmos de Grafos y el Algoritmo de Dijkstra aplicado a sistemas de transporte urbano.**