# Sistema Metro de Medellín - Calculador de Rutas Inteligente

Este proyecto implementa un sistema interactivo para calcular rutas óptimas en el sistema de transporte público de Medellín utilizando grafos dinámicos y el algoritmo de Dijkstra.

## 🚇 Características Principales

- **Cálculo de Rutas Óptimas**: Encuentra la mejor ruta entre dos estaciones según diferentes criterios
- **Visualización Interactiva**: Representación gráfica de la red de transporte
- **Simulación de Disrupciones**: Maneja cierres de estaciones y factores de retraso
- **Análisis de Rutas**: Compara múltiples opciones de viaje
- **Interfaz Intuitiva**: Fácil de usar con selección visual de estaciones

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
- Cierre temporal de estaciones
- Factores de retraso por clima o mantenimiento
- Actualización dinámica de pesos en el grafo

### 3. Análisis de Rutas
- Comparación de rutas alternativas
- Estadísticas detalladas de tiempo, costo y transbordos
- Velocidad promedio estimada
- Eficiencia de la ruta

### 4. Visualización Interactiva
- Selección de estaciones directamente en el grafo
- Resaltado de rutas calculadas
- Indicadores visuales de interrupciones
- Leyenda de líneas con códigos de colores

## 🔧 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualización**: SVG nativo
- **Algoritmos**: Dijkstra con Min-Heap optimizado
- **Estructuras de Datos**: Grafos dirigidos ponderados
- **Diseño**: CSS Grid, Flexbox, Variables CSS

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

## 🎨 Diseño de Interfaz

### Principios de Diseño
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Accesible**: Uso de iconos y colores contrastantes
- **Intuitivo**: Flujo de usuario lógico y simple
- **Visual**: Representación gráfica clara de la red

### Paleta de Colores
- Metro: Azul (#0066cc, #ff6600)
- Bus: Verde/Rosa (#00cc66, #cc0066)
- MetroCable: Morado/Rojo (#9933cc, #ff3366)
- Tranvía: Azul claro (#6699ff)

## 🚀 Cómo Usar

1. **Abrir la aplicación**: Cargar `index.html` en un navegador web
2. **Seleccionar origen**: Elegir estación de partida
3. **Seleccionar destino**: Elegir estación de llegada
4. **Elegir criterio**: Tiempo, costo o transbordos
5. **Calcular ruta**: Hacer clic en "Calcular Ruta Óptima"
6. **Ver resultados**: Analizar la ruta propuesta y estadísticas

### Funciones Adicionales
- **Eventos disruptivos**: Simular interrupciones del servicio
- **Selección visual**: Hacer clic en estaciones del grafo
- **Comparación**: Ver rutas alternativas automáticamente

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
- ✅ Visualización gráfica de la red
- ✅ Múltiples criterios de optimización
- ✅ Simulación de eventos disruptivos
- ✅ Predicción de tiempos de viaje
- ✅ Análisis de resiliencia del sistema
- ✅ Interfaz interactiva y responsive

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