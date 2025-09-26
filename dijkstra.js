// Implementación del algoritmo de Dijkstra para encontrar rutas óptimas
class DijkstraPathfinder {
    constructor(graph) {
        this.graph = graph;
        this.originalGraph = JSON.parse(JSON.stringify(graph)); // Copia del grafo original
        this.closedStations = new Set();
        this.delayFactor = 1.0;
    }

    // Aplicar factores de retraso a todo el sistema
    applyDelayFactor(factor) {
        this.delayFactor = factor;
        this.updateGraph();
    }

    // Cerrar una estación (simular interrupción)
    closeStation(stationName) {
        if (stationName && this.graph[stationName]) {
            this.closedStations.add(stationName);
            this.updateGraph();
        }
    }

    // Abrir una estación previamente cerrada
    openStation(stationName) {
        this.closedStations.delete(stationName);
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

        // Eliminar conexiones de estaciones cerradas
        this.closedStations.forEach(closedStation => {
            // Vaciar las conexiones de la estación cerrada
            if (this.graph[closedStation]) {
                this.graph[closedStation] = [];
            }
            
            // Eliminar conexiones hacia la estación cerrada
            Object.keys(this.graph).forEach(station => {
                this.graph[station] = this.graph[station].filter(
                    connection => connection.station !== closedStation
                );
            });
        });
    }

    // Algoritmo de Dijkstra optimizado
    findShortestPath(start, end, criterion = 'tiempo') {
        if (!this.graph[start] || !this.graph[end]) {
            throw new Error('Estación de origen o destino no encontrada');
        }

        if (this.closedStations.has(start) || this.closedStations.has(end)) {
            throw new Error('La estación de origen o destino está cerrada');
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
                
                if (visited.has(neighborStation) || this.closedStations.has(neighborStation)) {
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