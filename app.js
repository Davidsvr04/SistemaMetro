// Aplicación principal del Sistema Metro de Medellín
class MetroApp {
    constructor() {
        this.pathfinder = null;
        this.visualization = null;
        this.currentRoute = null;
        this.closedStations = new Set();
        this.delayFactor = 1.0;
        
        this.initializeApp();
        this.setupEventListeners();
    }

    // Inicializar la aplicación
    initializeApp() {
        try {
            // Inicializar pathfinder con el grafo del metro
            const graph = window.METRO_DATA.buildGraph();
            this.pathfinder = new window.DIJKSTRA.DijkstraPathfinder(graph);
            
            // Inicializar visualización
            this.visualization = new window.VISUALIZATION.SimpleMetroVisualization('metroSvg');
            
            // Poblar selectores de estaciones
            this.populateStationSelectors();
            
            console.log('Sistema Metro de Medellín inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
            this.showError('Error al cargar el sistema. Por favor recarga la página.');
        }
    }

    // Poblar los selectores de estaciones
    populateStationSelectors() {
        const stations = window.METRO_DATA.getAllStations();
        const origenSelect = document.getElementById('origen');
        const destinoSelect = document.getElementById('destino');
        const estacionCerradaSelect = document.getElementById('estacionCerrada');

        stations.forEach(station => {
            // Selector de origen
            const origenOption = document.createElement('option');
            origenOption.value = station;
            origenOption.textContent = station;
            origenSelect.appendChild(origenOption);

            // Selector de destino
            const destinoOption = document.createElement('option');
            destinoOption.value = station;
            destinoOption.textContent = station;
            destinoSelect.appendChild(destinoOption);

            // Selector de estación cerrada
            const cerradaOption = document.createElement('option');
            cerradaOption.value = station;
            cerradaOption.textContent = station;
            estacionCerradaSelect.appendChild(cerradaOption);
        });
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botón calcular ruta
        document.getElementById('calcularRuta').addEventListener('click', 
            () => this.calculateRoute());

        // Botón limpiar ruta
        document.getElementById('limpiarRuta').addEventListener('click', 
            () => this.clearRoute());

        // Botón aplicar disrupciones
        document.getElementById('aplicarDisrupciones').addEventListener('click', 
            () => this.applyDisruptions());

        // Evento personalizado para selección de estación en el grafo
        document.addEventListener('stationSelected', (event) => {
            this.handleStationSelection(event.detail.station);
        });

        // Detectar cambios en los selectores
        document.getElementById('origen').addEventListener('change', 
            () => this.onSelectionChange());
        document.getElementById('destino').addEventListener('change', 
            () => this.onSelectionChange());

        // Redimensionar visualización cuando cambie el tamaño de ventana
        window.addEventListener('resize', () => {
            if (this.visualization && this.visualization.resize) {
                this.visualization.resize();
            }
        });

        // Atajos de teclado
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                this.calculateRoute();
            } else if (event.key === 'Escape') {
                this.clearRoute();
            }
        });
    }

    // Calcular ruta óptima
    async calculateRoute() {
        try {
            const origen = document.getElementById('origen').value;
            const destino = document.getElementById('destino').value;
            const criterio = document.getElementById('criterio').value;

            if (!origen || !destino) {
                this.showError('Por favor selecciona estaciones de origen y destino');
                return;
            }

            if (origen === destino) {
                this.showError('La estación de origen y destino no pueden ser la misma');
                return;
            }

            // Mostrar indicador de carga
            this.showLoading('Calculando ruta óptima...');

            // Simular un pequeño retraso para mostrar la carga
            await new Promise(resolve => setTimeout(resolve, 500));

            // Calcular ruta principal
            const route = this.pathfinder.findShortestPath(origen, destino, criterio);
            this.currentRoute = route;

            // Mostrar resultados
            this.displayRouteResults(route);
            
            // Resaltar ruta en la visualización
            this.visualization.highlightPath(route);

            // Ocultar indicador de carga
            this.hideLoading();

            // Mostrar análisis adicional
            this.showRouteAnalysis(route, origen, destino, criterio);

            // Mostrar botón limpiar ruta y ocultar calcular
            document.getElementById('calcularRuta').style.display = 'none';
            document.getElementById('limpiarRuta').style.display = 'flex';

        } catch (error) {
            console.error('Error al calcular ruta:', error);
            this.hideLoading();
            this.showError(`Error: ${error.message}`);
        }
    }

    // Limpiar ruta actual y mostrar mapa completo
    clearRoute() {
        // Limpiar visualización
        this.visualization.clearHighlight();

        // Ocultar resultados
        document.getElementById('routeResults').classList.add('hidden');

        // Limpiar ruta actual
        this.currentRoute = null;

        // Mostrar botón calcular ruta y ocultar limpiar
        document.getElementById('calcularRuta').style.display = 'flex';
        document.getElementById('limpiarRuta').style.display = 'none';

        this.showInfo('Ruta limpiada - Mostrando mapa completo');
    }

    // Mostrar resultados de la ruta
    displayRouteResults(route) {
        const resultsDiv = document.getElementById('routeResults');
        const routeInfo = document.getElementById('routeInfo');
        const routePath = document.getElementById('routePath');
        const routeStats = document.getElementById('routeStats');

        // Información general
        routeInfo.innerHTML = `
            <h3><i class="fas fa-info-circle"></i> Información General</h3>
            <p><strong>Criterio de optimización:</strong> ${this.getCriterionName(route.criterion)}</p>
            <p><strong>Total de estaciones:</strong> ${route.path.length}</p>
            <p><strong>Líneas utilizadas:</strong> ${route.lines.join(', ')}</p>
        `;

        // Ruta paso a paso
        let pathHTML = '<h3><i class="fas fa-route"></i> Ruta Detallada</h3>';
        
        route.detailedPath.forEach((step, index) => {
            const lineColor = window.METRO_DATA.getLineColor(step.line);
            const transferIcon = step.isTransfer ? '<i class="fas fa-exchange-alt" style="color: #f59e0b;"></i>' : '';
            
            pathHTML += `
                <div class="route-step">
                    <i class="fas fa-arrow-right"></i>
                    ${transferIcon}
                    <span style="color: ${lineColor}; font-weight: bold;">Línea ${step.line}</span>
                    <span>${step.from} → ${step.to}</span>
                    <span class="step-time">(${window.DIJKSTRA.formatTime(step.time)})</span>
                </div>
            `;
        });
        
        routePath.innerHTML = pathHTML;

        // Estadísticas
        routeStats.innerHTML = `
            <div class="stat-card">
                <h4><i class="fas fa-clock"></i> Tiempo Total</h4>
                <div class="value">${window.DIJKSTRA.formatTime(route.totalTime)}</div>
            </div>
            <div class="stat-card">
                <h4><i class="fas fa-money-bill-wave"></i> Costo Total</h4>
                <div class="value">${window.DIJKSTRA.formatCost(route.totalCost)}</div>
            </div>
            <div class="stat-card">
                <h4><i class="fas fa-exchange-alt"></i> Transbordos</h4>
                <div class="value">${route.transfers}</div>
            </div>
            <div class="stat-card">
                <h4><i class="fas fa-tachometer-alt"></i> Velocidad Promedio</h4>
                <div class="value">${this.calculateAverageSpeed(route)} km/h</div>
            </div>
        `;

        // Mostrar panel de resultados
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Análisis adicional de la ruta
    showRouteAnalysis(route, origen, destino, criterio) {
        try {
            // Buscar rutas alternativas si es posible
            const alternativeRoutes = this.pathfinder.findAlternativeRoutes(origen, destino, criterio, 2);
            
            if (alternativeRoutes.length > 1) {
                const comparison = this.compareRoutes(alternativeRoutes);
                this.displayRouteComparison(comparison);
            }
        } catch (error) {
            console.log('No se pudieron encontrar rutas alternativas');
        }
    }

    // Comparar múltiples rutas
    compareRoutes(routes) {
        return routes.map((route, index) => ({
            index: index,
            name: index === 0 ? 'Principal' : `Alternativa ${index}`,
            time: route.totalTime,
            cost: route.totalCost,
            transfers: route.transfers,
            lines: route.lines.length,
            efficiency: this.calculateEfficiency(route)
        }));
    }

    // Mostrar comparación de rutas
    displayRouteComparison(comparison) {
        const routeInfo = document.getElementById('routeInfo');
        let comparisonHTML = '<h4><i class="fas fa-chart-bar"></i> Comparación de Rutas</h4>';
        comparisonHTML += '<div class="route-comparison">';
        
        comparison.forEach(route => {
            const isMain = route.index === 0;
            comparisonHTML += `
                <div class="comparison-item ${isMain ? 'main-route' : ''}">
                    <strong>${route.name}</strong><br>
                    <small>
                        Tiempo: ${window.DIJKSTRA.formatTime(route.time)} | 
                        Costo: ${window.DIJKSTRA.formatCost(route.cost)} | 
                        Transbordos: ${route.transfers}
                    </small>
                </div>
            `;
        });
        
        comparisonHTML += '</div>';
        routeInfo.innerHTML += comparisonHTML;
    }

    // Aplicar disrupciones al sistema
    applyDisruptions() {
        try {
            const estacionCerrada = document.getElementById('estacionCerrada').value;
            const factorRetraso = parseFloat(document.getElementById('factorRetraso').value);

            // Aplicar factor de retraso
            this.delayFactor = factorRetraso;
            this.pathfinder.applyDelayFactor(factorRetraso);

            // Manejar estaciones cerradas
            if (estacionCerrada && !this.closedStations.has(estacionCerrada)) {
                this.closedStations.add(estacionCerrada);
                this.pathfinder.closeStation(estacionCerrada);
            }

            // Actualizar visualización
            this.visualization.showDisruptions(Array.from(this.closedStations));

            // Recalcular ruta actual si existe
            if (this.currentRoute) {
                const origen = document.getElementById('origen').value;
                const destino = document.getElementById('destino').value;
                const criterio = document.getElementById('criterio').value;
                
                if (origen && destino) {
                    this.calculateRoute();
                }
            }

            this.showSuccess('Disrupciones aplicadas correctamente');

        } catch (error) {
            console.error('Error al aplicar disrupciones:', error);
            this.showError('Error al aplicar disrupciones');
        }
    }

    // Manejar selección de estación en el grafo
    handleStationSelection(stationName) {
        const origenSelect = document.getElementById('origen');
        const destinoSelect = document.getElementById('destino');

        if (!origenSelect.value) {
            origenSelect.value = stationName;
            this.showInfo(`Estación de origen seleccionada: ${stationName}`);
        } else if (!destinoSelect.value && origenSelect.value !== stationName) {
            destinoSelect.value = stationName;
            this.showInfo(`Estación de destino seleccionada: ${stationName}`);
            
            // Auto-calcular ruta si ambas están seleccionadas
            setTimeout(() => this.calculateRoute(), 500);
        } else {
            this.showInfo(`Estación seleccionada: ${stationName}`);
        }
    }

    // Manejar cambios en los selectores
    onSelectionChange() {
        // Limpiar visualización anterior si hay cambios
        if (this.currentRoute) {
            this.visualization.clearHighlight();
            this.currentRoute = null;
            
            // Mostrar botón calcular ruta y ocultar limpiar
            document.getElementById('calcularRuta').style.display = 'flex';
            document.getElementById('limpiarRuta').style.display = 'none';
        }
    }

    // Calcular velocidad promedio (estimada)
    calculateAverageSpeed(route) {
        // Estimación basada en distancia aproximada y tiempo
        const estimatedDistance = route.path.length * 1.5; // km aproximados
        const timeInHours = route.totalTime / 3600;
        return Math.round(estimatedDistance / timeInHours);
    }

    // Calcular eficiencia de la ruta
    calculateEfficiency(route) {
        // Métrica combinada de tiempo, costo y transbordos
        const timeWeight = 0.5;
        const costWeight = 0.3;
        const transferWeight = 0.2;
        
        const normalizedTime = route.totalTime / 3600; // a horas
        const normalizedCost = route.totalCost / 10000; // normalizar costo
        const normalizedTransfers = route.transfers;
        
        return timeWeight * normalizedTime + 
               costWeight * normalizedCost + 
               transferWeight * normalizedTransfers;
    }

    // Obtener nombre legible del criterio
    getCriterionName(criterion) {
        const names = {
            'tiempo': 'Menor tiempo de viaje',
            'costo': 'Menor costo económico',
            'transbordos': 'Menos transbordos'
        };
        return names[criterion] || criterion;
    }

    // Limpiar todo
    clearAll() {
        // Limpiar selectores
        document.getElementById('origen').value = '';
        document.getElementById('destino').value = '';
        document.getElementById('estacionCerrada').value = '';
        document.getElementById('factorRetraso').value = '1';

        // Limpiar visualización
        this.visualization.clearHighlight();
        this.visualization.clearDisruptions();

        // Ocultar resultados
        document.getElementById('routeResults').classList.add('hidden');

        // Mostrar botón calcular ruta y ocultar limpiar
        document.getElementById('calcularRuta').style.display = 'flex';
        document.getElementById('limpiarRuta').style.display = 'none';

        // Resetear pathfinder
        this.closedStations.clear();
        this.delayFactor = 1.0;
        this.currentRoute = null;
        
        if (this.pathfinder) {
            const graph = window.METRO_DATA.buildGraph();
            this.pathfinder = new window.DIJKSTRA.DijkstraPathfinder(graph);
        }

        this.showInfo('Sistema reiniciado');
    }

    // Funciones de utilidad para mostrar mensajes
    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showInfo(message) {
        this.showMessage(message, 'info');
    }

    showLoading(message) {
        this.showMessage(message, 'loading', 0); // No auto-hide
    }

    hideLoading() {
        const existingMessage = document.querySelector('.app-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    showMessage(message, type = 'info', duration = 3000) {
        // Remover mensaje anterior si existe
        const existingMessage = document.querySelector('.app-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Crear nuevo mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `app-message app-message-${type}`;
        
        const icons = {
            'error': 'fas fa-exclamation-triangle',
            'success': 'fas fa-check-circle',
            'info': 'fas fa-info-circle',
            'loading': 'fas fa-spinner fa-spin'
        };

        const colors = {
            'error': '#ef4444',
            'success': '#10b981',
            'info': '#3b82f6',
            'loading': '#f59e0b'
        };

        messageDiv.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;

        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(messageDiv);

        // Auto-ocultar después del tiempo especificado
        if (duration > 0) {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => messageDiv.remove(), 300);
                }
            }, duration);
        }
    }
}

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .route-comparison {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
        margin-top: 10px;
    }

    .comparison-item {
        padding: 10px;
        background: #f3f4f6;
        border-radius: 6px;
        border: 2px solid transparent;
    }

    .comparison-item.main-route {
        background: #dbeafe;
        border-color: #3b82f6;
    }
`;
document.head.appendChild(style);

// Inicializar la aplicación cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que todas las dependencias estén cargadas
    if (window.METRO_DATA && window.DIJKSTRA && window.VISUALIZATION) {
        window.metroApp = new MetroApp();
    } else {
        console.error('Error: No se pudieron cargar todas las dependencias necesarias');
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #ef4444;">
                <h2>Error de Carga</h2>
                <p>No se pudieron cargar todos los componentes necesarios. Por favor recarga la página.</p>
            </div>
        `;
    }
});

// Exportar para depuración
if (typeof window !== 'undefined') {
    window.MetroApp = MetroApp;
}