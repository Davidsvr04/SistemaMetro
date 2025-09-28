// Implementación del algoritmo de Dijkstra para encontrar rutas óptimas
class DijkstraPathfinder {
    constructor(graph) {
        this.graph = graph;
        this.originalGraph = JSON.parse(JSON.stringify(graph)); // Copia del grafo original
        this.closedStations = new Set();
        this.closedStationLines = new Map(); // Líneas específicas cerradas por estación
        this.closedLines = new Set(); // Líneas completamente cerradas
        this.delayFactor = 1.0;
    }

    // Aplicar factores de retraso a todo el sistema
    applyDelayFactor(factor) {
        this.delayFactor = factor;
        this.updateGraph();
    }

    // Cerrar una estación completamente (todas las líneas)
    closeStation(stationName) {
        if (stationName && this.graph[stationName]) {
            this.closedStations.add(stationName);
            this.updateGraph();
        }
    }

    // Cerrar una línea específica de una estación multimodal
    closeStationLine(stationName, lineId) {
        if (!this.closedStationLines.has(stationName)) {
            this.closedStationLines.set(stationName, new Set());
        }
        this.closedStationLines.get(stationName).add(lineId);
        this.updateGraph();
    }

    // Abrir una estación previamente cerrada
    openStation(stationName) {
        this.closedStations.delete(stationName);
        this.updateGraph();
    }

    // Abrir una línea específica de una estación
    openStationLine(stationName, lineId) {
        if (this.closedStationLines.has(stationName)) {
            this.closedStationLines.get(stationName).delete(lineId);
            if (this.closedStationLines.get(stationName).size === 0) {
                this.closedStationLines.delete(stationName);
            }
        }
        this.updateGraph();
    }

    // Restablecer todas las interrupciones (estaciones y líneas cerradas)
    resetAllClosures() {
        this.closedStations.clear();
        this.closedStationLines.clear();
        this.closedLines.clear();
        this.delayFactor = 1.0;
        this.updateGraph();
    }

    // Actualizar el grafo con interrupciones y factores de retraso
    updateGraph() {
        // Restaurar grafo original
        this.graph = JSON.parse(JSON.stringify(this.originalGraph));

        // Aplicar factor de retraso
        Object.keys(this.graph).forEach(station => {
            this.graph[station].forEach(connection => {
                connection.time = Math.round(connection.time * this.delayFactor);
            });
        });

        // Eliminar conexiones de estaciones completamente cerradas
        this.closedStations.forEach(closedStation => {
            if (this.graph[closedStation]) {
                this.graph[closedStation] = [];
                console.log(`Estación completamente cerrada: ${closedStation}`);
            }
            
            // Eliminar todas las conexiones hacia la estación cerrada
            Object.keys(this.graph).forEach(station => {
                const originalLength = this.graph[station].length;
                this.graph[station] = this.graph[station].filter(
                    connection => connection.station !== closedStation
                );
                
                const removedConnections = originalLength - this.graph[station].length;
                if (removedConnections > 0) {
                    console.log(`Eliminadas ${removedConnections} conexiones de ${station} hacia ${closedStation}`);
                }
            });
        });

        // Eliminar conexiones de líneas específicas cerradas
        this.closedStationLines.forEach((closedLines, stationName) => {
            if (this.graph[stationName]) {
                // Filtrar las conexiones que usan las líneas cerradas
                const originalLength = this.graph[stationName].length;
                this.graph[stationName] = this.graph[stationName].filter(
                    connection => !closedLines.has(connection.line)
                );
                
                const removedConnections = originalLength - this.graph[stationName].length;
                if (removedConnections > 0) {
                    console.log(`Eliminadas ${removedConnections} conexiones de líneas ${Array.from(closedLines).join(', ')} desde ${stationName}`);
                }
            }
            
            // Eliminar conexiones hacia la estación en las líneas cerradas
            Object.keys(this.graph).forEach(otherStation => {
                if (otherStation !== stationName) {
                    const originalLength = this.graph[otherStation].length;
                    this.graph[otherStation] = this.graph[otherStation].filter(
                        connection => !(connection.station === stationName && closedLines.has(connection.line))
                    );
                    
                    const removedConnections = originalLength - this.graph[otherStation].length;
                    if (removedConnections > 0) {
                        console.log(`Eliminadas ${removedConnections} conexiones hacia ${stationName} en líneas ${Array.from(closedLines).join(', ')} desde ${otherStation}`);
                    }
                }
            });
        });
    }

    // Verificar si una estación está disponible para ser origen o destino
    isStationAccessible(stationName) {
        // Si la estación está completamente cerrada
        if (this.closedStations.has(stationName)) {
            return false;
        }
        
        // Si tiene líneas específicas cerradas, verificar si queda alguna línea abierta
        if (this.closedStationLines.has(stationName)) {
            const stationLines = window.METRO_DATA.getStationLines(stationName);
            const closedLines = this.closedStationLines.get(stationName);
            
            // Si todas las líneas están cerradas, la estación no es accesible
            const openLines = stationLines.filter(line => !closedLines.has(line));
            return openLines.length > 0;
        }
        
        return true;
    }

    // Algoritmo de Dijkstra optimizado
    findShortestPath(start, end, criterion = 'tiempo') {
        if (!this.graph[start] || !this.graph[end]) {
            throw new Error('Estación de origen o destino no encontrada');
        }

        // Verificar si las estaciones están accesibles
        if (!this.isStationAccessible(start)) {
            throw new Error(`La estación de origen "${start}" no está disponible debido a interrupciones`);
        }
        
        if (!this.isStationAccessible(end)) {
            throw new Error(`La estación de destino "${end}" no está disponible debido a interrupciones`);
        }

        const distances = {};
        const previous = {};
        const visited = new Set();
        const priorityQueue = new MinHeap();

        // Inicializar distancias
        Object.keys(this.graph).forEach(station => {
            distances[station] = Infinity;
        });
        distances[start] = 0;

        priorityQueue.insert({ station: start, distance: 0, path: [start], lines: [], transfers: 0 });

        while (!priorityQueue.isEmpty()) {
            const current = priorityQueue.extractMin();
            const currentStation = current.station;

            if (visited.has(currentStation)) continue;
            visited.add(currentStation);

            if (currentStation === end) {
                return this.buildPathResult(current, criterion);
            }

            // Explorar vecinos
            this.graph[currentStation].forEach(neighbor => {
                const neighborStation = neighbor.station;
                
                if (visited.has(neighborStation)) {
                    return;
                }

                // Verificar si el vecino está accesible
                if (!this.isStationAccessible(neighborStation)) {
                    return;
                }

                const weight = this.calculateWeight(neighbor, criterion);
                const newDistance = distances[currentStation] + weight;
                
                // Calcular transbordos
                const currentLine = neighbor.line;
                const lastLine = current.lines.length > 0 ? current.lines[current.lines.length - 1] : currentLine;
                const newTransfers = current.transfers + (currentLine !== lastLine ? 1 : 0);

                if (newDistance < distances[neighborStation]) {
                    distances[neighborStation] = newDistance;
                    previous[neighborStation] = {
                        station: currentStation,
                        line: neighbor.line,
                        time: neighbor.time,
                        cost: neighbor.cost
                    };

                    const newPath = [...current.path, neighborStation];
                    const newLines = [...current.lines, neighbor.line];

                    priorityQueue.insert({
                        station: neighborStation,
                        distance: newDistance,
                        path: newPath,
                        lines: newLines,
                        transfers: newTransfers
                    });
                }
            });
        }

        throw new Error('No se encontró una ruta válida entre las estaciones especificadas');
    }

    // Calcular peso según el criterio seleccionado
    calculateWeight(connection, criterion) {
        switch (criterion) {
            case 'tiempo':
                return connection.time;
            case 'costo':
                return connection.cost;
            case 'transbordos':
                return 1; // Cada conexión cuenta como 1 para minimizar transbordos
            default:
                return connection.time;
        }
    }

    // Construir resultado final del camino
    buildPathResult(finalNode, criterion) {
        const path = finalNode.path;
        const lines = finalNode.lines;
        
        let totalTime = 0;
        let totalCost = 0;
        let transfers = 0;
        
        const detailedPath = [];
        let currentLine = null;

        // Calcular estadísticas detalladas
        for (let i = 0; i < path.length - 1; i++) {
            const currentStation = path[i];
            const nextStation = path[i + 1];
            const connection = this.findConnection(currentStation, nextStation);
            
            if (connection) {
                totalTime += connection.time;
                totalCost += connection.cost;
                
                // Detectar transbordo
                if (currentLine && currentLine !== connection.line) {
                    transfers++;
                }
                currentLine = connection.line;

                detailedPath.push({
                    from: currentStation,
                    to: nextStation,
                    line: connection.line,
                    time: connection.time,
                    cost: connection.cost,
                    isTransfer: i > 0 && lines[i-1] !== connection.line
                });
            }
        }

        return {
            path: path,
            detailedPath: detailedPath,
            totalTime: totalTime,
            totalCost: totalCost,
            transfers: transfers,
            distance: finalNode.distance,
            criterion: criterion,
            lines: this.getUniqueLines(lines)
        };
    }

    // Encontrar conexión específica entre dos estaciones
    findConnection(from, to) {
        const connections = this.graph[from] || [];
        return connections.find(conn => conn.station === to);
    }

    // Obtener líneas únicas en el recorrido
    getUniqueLines(lines) {
        return [...new Set(lines)];
    }

    // Encontrar la estación más lejana accesible hacia un destino
    findFarthestAccessibleStation(start, targetDirection) {
        if (!this.graph[start]) {
            throw new Error(`Estación de origen ${start} no válida`);
        }

        const distances = {};
        const previous = {};
        const visited = new Set();
        const priorityQueue = new MinHeap();

        // Inicializar distancias
        Object.keys(this.graph).forEach(station => {
            distances[station] = Infinity;
        });
        distances[start] = 0;

        priorityQueue.insert({ station: start, distance: 0, path: [start] });

        let farthestStation = start;
        let maxDistance = 0;

        while (!priorityQueue.isEmpty()) {
            const current = priorityQueue.extractMin();
            const currentStation = current.station;

            if (visited.has(currentStation)) continue;
            visited.add(currentStation);

            // Si llegamos más lejos que antes, actualizar
            if (current.distance > maxDistance) {
                maxDistance = current.distance;
                farthestStation = currentStation;
            }

            // Explorar vecinos accesibles
            if (this.graph[currentStation]) {
                this.graph[currentStation].forEach(neighbor => {
                    const newDistance = current.distance + neighbor.time;
                    
                    if (newDistance < distances[neighbor.station]) {
                        distances[neighbor.station] = newDistance;
                        previous[neighbor.station] = currentStation;
                        
                        priorityQueue.insert({
                            station: neighbor.station,
                            distance: newDistance,
                            path: [...current.path, neighbor.station]
                        });
                    }
                });
            }
        }

        return {
            station: farthestStation,
            distance: maxDistance,
            accessible: visited
        };
    }

    // Verificar si una ruta directa es posible (sin calcular completamente)
    isDirectRouteBlocked(start, end) {
        try {
            // Intentar una búsqueda limitada
            this.findShortestPath(start, end);
            return false;
        } catch (error) {
            if (error.message.includes('No se encontró una ruta válida')) {
                return true;
            }
            throw error;
        }
    }

    // Obtener rutas alternativas
    findAlternativeRoutes(start, end, criterion = 'tiempo', maxRoutes = 3) {
        const routes = [];
        const originalGraph = JSON.parse(JSON.stringify(this.graph));

        try {
            // Encontrar ruta principal
            const mainRoute = this.findShortestPath(start, end, criterion);
            routes.push(mainRoute);

            // Encontrar rutas alternativas eliminando conexiones de la ruta principal
            for (let i = 0; i < Math.min(maxRoutes - 1, mainRoute.detailedPath.length); i++) {
                const connectionToRemove = mainRoute.detailedPath[i];
                
                // Temporalmente eliminar la conexión
                this.removeConnection(connectionToRemove.from, connectionToRemove.to);
                
                try {
                    const alternativeRoute = this.findShortestPath(start, end, criterion);
                    
                    // Verificar que sea suficientemente diferente
                    if (this.isRouteDifferent(mainRoute, alternativeRoute)) {
                        routes.push(alternativeRoute);
                    }
                } catch (error) {
                    // No se pudo encontrar ruta alternativa
                }
                
                // Restaurar conexión
                this.graph = JSON.parse(JSON.stringify(originalGraph));
                this.updateGraph(); // Aplicar factores actuales
            }
        } catch (error) {
            throw error;
        }

        return routes;
    }

    // Eliminar conexión temporalmente
    removeConnection(from, to) {
        if (this.graph[from]) {
            this.graph[from] = this.graph[from].filter(conn => conn.station !== to);
        }
        if (this.graph[to]) {
            this.graph[to] = this.graph[to].filter(conn => conn.station !== from);
        }
    }

    // Verificar si las rutas son suficientemente diferentes
    isRouteDifferent(route1, route2, threshold = 0.3) {
        const path1 = new Set(route1.path);
        const path2 = new Set(route2.path);
        
        const intersection = new Set([...path1].filter(x => path2.has(x)));
        const union = new Set([...path1, ...path2]);
        
        const similarity = intersection.size / union.size;
        return similarity < (1 - threshold);
    }

    // Análisis de resiliencia del sistema
    analyzeResilience(criticalStations = []) {
        const analysis = {
            criticalConnections: [],
            redundantPaths: 0,
            isolatedStations: [],
            networkEfficiency: 0
        };

        // Analizar cada estación crítica
        criticalStations.forEach(station => {
            const originalConnections = this.graph[station].length;
            this.closeStation(station);
            
            let affectedRoutes = 0;
            const allStations = Object.keys(this.graph);
            
            // Probar conectividad sin esta estación
            for (let i = 0; i < allStations.length; i++) {
                for (let j = i + 1; j < allStations.length; j++) {
                    try {
                        this.findShortestPath(allStations[i], allStations[j]);
                    } catch (error) {
                        affectedRoutes++;
                    }
                }
            }
            
            analysis.criticalConnections.push({
                station: station,
                originalConnections: originalConnections,
                affectedRoutes: affectedRoutes,
                criticality: affectedRoutes / (allStations.length * (allStations.length - 1) / 2)
            });
            
            this.openStation(station);
        });

        return analysis;
    }
}

// Implementación de Min-Heap para el algoritmo de Dijkstra
class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(node) {
        this.heap.push(node);
        this.heapifyUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    heapifyUp(index) {
        const parentIndex = Math.floor((index - 1) / 2);
        
        if (parentIndex >= 0 && this.heap[parentIndex].distance > this.heap[index].distance) {
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            this.heapifyUp(parentIndex);
        }
    }

    heapifyDown(index) {
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        let smallest = index;

        if (leftChild < this.heap.length && this.heap[leftChild].distance < this.heap[smallest].distance) {
            smallest = leftChild;
        }

        if (rightChild < this.heap.length && this.heap[rightChild].distance < this.heap[smallest].distance) {
            smallest = rightChild;
        }

        if (smallest !== index) {
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            this.heapifyDown(smallest);
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

// Función de utilidad para formatear tiempo
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
        return `${minutes} min ${remainingSeconds} seg`;
    }
    return `${remainingSeconds} seg`;
}

// Función de utilidad para formatear costo
function formatCost(cost) {
    return `$${cost.toLocaleString('es-CO')}`;
}

// Exportar para uso en otros archivos
if (typeof window !== 'undefined') {
    window.DIJKSTRA = {
        DijkstraPathfinder,
        formatTime,
        formatCost
    };
}