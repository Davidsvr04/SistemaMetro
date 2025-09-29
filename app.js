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

            // Selector de estación cerrada - incluir información de líneas
            const stationLines = window.METRO_DATA.getStationLines(station);
            const linesText = stationLines.length > 1 ? ` (${stationLines.join(', ')})` : ` (${stationLines[0] || ''})`;
            
            const cerradaOption = document.createElement('option');
            cerradaOption.value = station;
            cerradaOption.textContent = station + linesText;
            estacionCerradaSelect.appendChild(cerradaOption);
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
            
        // Botón reset disrupciones
        document.getElementById('resetDisrupciones').addEventListener('click', 
            () => this.resetDisruptions());

        // Cambio en selector de estación con problemas para filtrar líneas
        document.getElementById('estacionCerrada').addEventListener('change', 
            () => this.updateLineSelector());

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

        // Control de orientación de etiquetas
        const labelOrientationSelect = document.getElementById('labelOrientation');
        if (labelOrientationSelect) {
            labelOrientationSelect.addEventListener('change', () => {
                if (this.visualization) {
                    this.visualization.updateLabelOrientation(labelOrientationSelect.value);
                }
            });
        }

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
            
            // Análisis inteligente del error para proporcionar alternativas
            if (error.message.includes('No se encontró una ruta válida')) {
                this.handleBlockedRoute(origen, destino);
            } else if (error.message.includes('estación no válida')) {
                this.showError('⚠️ Una de las estaciones seleccionadas no es válida.');
            } else {
                this.showError(`Error: ${error.message}`);
            }
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

    // Aplicar disrupciones al sistema (actualizado)
    applyDisruptions() {
        try {
            const estacionCerrada = document.getElementById('estacionCerrada').value;
            const lineaCerrada = document.getElementById('lineaCerrada')?.value; // Nuevo selector
            let factorRetraso = parseFloat(document.getElementById('factorRetraso').value);
            const horarioPico = document.getElementById('horarioPico').checked;

            if(horarioPico) {
                factorRetraso += 1.5; 
            }
            console.log("factorRetraso:", factorRetraso);

            // Aplicar factor de retraso
            this.delayFactor = factorRetraso;
            this.pathfinder.applyDelayFactor(factorRetraso);

            // Manejar estaciones cerradas
            if (estacionCerrada) {
                const stationLines = window.METRO_DATA.getStationLines(estacionCerrada);
                
                if (lineaCerrada && stationLines.includes(lineaCerrada)) {
                    // Cerrar solo una línea específica
                    this.pathfinder.closeStationLine(estacionCerrada, lineaCerrada);
                    this.showSuccess(`Línea ${lineaCerrada} de ${estacionCerrada} cerrada`);
                } else {
                    // Cerrar toda la estación
                    if (!this.closedStations.has(estacionCerrada)) {
                        this.closedStations.add(estacionCerrada);
                        this.pathfinder.closeStation(estacionCerrada);
                        this.showSuccess(`Estación ${estacionCerrada} completamente cerrada`);
                    }
                }
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

        } catch (error) {
            console.error('Error al aplicar disrupciones:', error);
            this.showError('Error al aplicar disrupciones');
        }
    }

    // Manejar rutas bloqueadas con análisis inteligente
    handleBlockedRoute(origen, destino) {
        const closedStations = Array.from(this.pathfinder.closedStations);
        const closedLines = Array.from(this.pathfinder.closedLines);
        
        if (closedStations.length === 0 && closedLines.length === 0) {
            this.showError('🚫 No existe una ruta disponible entre estas estaciones.');
            return;
        }

        // Analizar cada estación cerrada para ver si es crítica
        let criticalStation = null;
        let alternativeMessage = '';

        for (const closedStation of closedStations) {
            const routeAnalysis = window.METRO_DATA.analyzeRouteForClosedStation(origen, destino, closedStation);
            
            for (const analysis of routeAnalysis) {
                if (analysis.blocked && analysis.alternativeNeeded) {
                    criticalStation = closedStation;
                    
                    // Obtener nombres de línea más descriptivos
                    const lineNames = {
                        'A': 'Metro A',
                        'B': 'Metro B', 
                        'T': 'Tranvía',
                        '1': 'Bus 1',
                        '2': 'Bus 2',
                        'P': 'MetroCable P',
                        'J': 'MetroCable J',
                        'K': 'MetroCable K',
                        'M': 'MetroCable M',
                        'H': 'MetroCable H'
                    };

                    const lineName = lineNames[analysis.line] || `Línea ${analysis.line}`;
                    
                    if (analysis.lastAccessible) {
                        alternativeMessage = `🚫 **Estación ${closedStation} no disponible**\n\n`;
                        alternativeMessage += `📍 **Máximo accesible:** ${analysis.lastAccessible} (${lineName})\n\n`;
                        alternativeMessage += `🚌 **Alternativas sugeridas:**\n`;
                        alternativeMessage += `• Toma el ${lineName} hasta ${analysis.lastAccessible}\n`;
                        alternativeMessage += `• Desde allí usa transporte alterno (bus, taxi) hasta ${destino}\n`;
                        alternativeMessage += `• O usa el botón "Restablecer" para habilitar todas las estaciones`;
                    } else {
                        alternativeMessage = `🚫 **Estación ${closedStation} no disponible**\n\n`;
                        alternativeMessage += `❌ No hay estaciones accesibles en la ${lineName} hacia ${destino}\n\n`;
                        alternativeMessage += `🚌 **Alternativas:**\n`;
                        alternativeMessage += `• Usa transporte alterno desde ${origen}\n`;
                        alternativeMessage += `• O usa el botón "Restablecer" para habilitar todas las estaciones`;
                    }
                    break;
                }
            }
            
            if (criticalStation) break;
        }

        // Si no encontramos análisis específico, dar mensaje genérico pero útil
        if (!alternativeMessage) {
            alternativeMessage = '🚫 **Ruta bloqueada por disrupciones**\n\n';
            
            if (closedStations.length > 0) {
                alternativeMessage += `🚇 **Estaciones cerradas:** ${closedStations.join(', ')}\n`;
            }
            
            if (closedLines.length > 0) {
                const lineNames = closedLines.map(line => {
                    const parts = line.split('_');
                    return `${parts[0]} (línea ${parts[1]})`;
                }).join(', ');
                alternativeMessage += `🚆 **Líneas cerradas:** ${lineNames}\n`;
            }
        }

        // Mostrar mensaje en formato HTML para mejor presentación
        this.showBlockedRouteMessage(alternativeMessage);
    }

    // Mostrar mensaje especializado para rutas bloqueadas
    showBlockedRouteMessage(message) {
        // Convertir el mensaje de markdown a HTML simple
        const htmlMessage = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/🚫/g, '<span style="color: #ef4444;">🚫</span>')
            .replace(/📍/g, '<span style="color: #3b82f6;">📍</span>')
            .replace(/🚌/g, '<span style="color: #10b981;">🚌</span>')
            .replace(/🔄/g, '<span style="color: #f59e0b;">🔄</span>');

        this.showMessage(htmlMessage, 'error', 8000); // Más tiempo para leer
    }

    // Restablecer todas las disrupciones
    resetDisruptions() {
        try {
            // Restablecer factor de retraso a normal
            this.delayFactor = 1.0;
            this.pathfinder.applyDelayFactor(1.0);

            // Reabrir todas las estaciones y líneas cerradas
            this.closedStations.clear();
            this.pathfinder.resetAllClosures();

            // Restablecer valores de los selectores
            document.getElementById('estacionCerrada').value = '';
            document.getElementById('factorRetraso').value = '1';
            
            // Limpiar selector de líneas
            const lineaCerradaSelect = document.getElementById('lineaCerrada');
            while (lineaCerradaSelect.children.length > 1) {
                lineaCerradaSelect.removeChild(lineaCerradaSelect.lastChild);
            }
            
            // Limpiar visualización de disrupciones
            this.visualization.showDisruptions([]);

            // Recalcular ruta actual si existe
            if (this.currentRoute) {
                const origen = document.getElementById('origen').value;
                const destino = document.getElementById('destino').value;
                
                if (origen && destino) {
                    this.calculateRoute();
                }
            }

            this.showSuccess('🔄 Todas las disrupciones han sido restablecidas');

        } catch (error) {
            console.error('Error al restablecer disrupciones:', error);
            this.showError('Error al restablecer las disrupciones');
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
    // Actualizar selector de líneas según la estación seleccionada
    updateLineSelector() {
        const estacionCerrada = document.getElementById('estacionCerrada').value;
        const lineaCerradaSelect = document.getElementById('lineaCerrada');
        
        // Limpiar opciones previas (excepto la primera)
        while (lineaCerradaSelect.children.length > 1) {
            lineaCerradaSelect.removeChild(lineaCerradaSelect.lastChild);
        }
        
        if (estacionCerrada) {
            // Obtener líneas de la estación seleccionada
            const stationLines = window.METRO_DATA.getStationLines(estacionCerrada);
            
            // Añadir solo las líneas disponibles para esta estación
            stationLines.forEach(lineId => {
                const option = document.createElement('option');
                option.value = lineId;
                
                // Nombres descriptivos para cada línea
                const lineNames = {
                    'A': 'Línea A (Metro)',
                    'B': 'Línea B (Metro)', 
                    'T': 'Línea T (Tranvía)',
                    '1': 'Línea 1 (Bus)',
                    '2': 'Línea 2 (Bus)',
                    'P': 'Línea P (MetroCable)',
                    'J': 'Línea J (MetroCable)',
                    'K': 'Línea K (MetroCable)',
                    'M': 'Línea M (MetroCable)',
                    'H': 'Línea H (MetroCable)'
                };
                
                option.textContent = lineNames[lineId] || `Línea ${lineId}`;
                lineaCerradaSelect.appendChild(option);
            });
        }
    }

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
            <div style="flex: 1; line-height: 1.4;">${message}</div>
        `;

        // Ajustar ancho para mensajes largos
        const isLongMessage = message.length > 100 || message.includes('<br>');
        const maxWidth = isLongMessage ? '500px' : '400px';

        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: ${isLongMessage ? '20px' : '15px 20px'};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-weight: 500;
            max-width: ${maxWidth};
            animation: slideIn 0.3s ease;
            font-size: ${isLongMessage ? '13px' : '14px'};
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