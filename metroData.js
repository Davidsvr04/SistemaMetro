// Definición de todas las estaciones del sistema Metro de Medellín
const STATIONS = {
    // Línea A - vertical centrada
  'Niquía': { line: 'A', type: 'metro', x: 200, y: 0 },
  'Bello': { line: 'A', type: 'metro', x: 200, y: 50 },
  'Madera': { line: 'A', type: 'metro', x: 200, y: 90 },
  'Acevedo': { lines: ['A', 'K', 'P'], type: 'metro', x: 200, y: 130 }, // Multimodal
  'Tricentenario': { line: 'A', type: 'metro', x: 200, y: 180 },
  'Caribe': { line: 'A', type: 'metro', x: 200, y: 240 },
  'Universidad': { line: 'A', type: 'metro', x: 290, y: 240 },
  'Hospital': { lines: ['A', '1'], type: 'metro', x: 290, y: 280 }, // Multimodal
  'Prado': { line: 'A', type: 'metro', x: 290, y: 330 },
  'Parque Berrío': { line: 'A', type: 'metro', x: 290, y: 370 },
  'San Antonio': { lines: ['A', 'B', 'T'], type: 'metro', x: 290, y: 420 }, // Multimodal CLAVE
  'Alpujarra': { line: 'A', type: 'metro', x: 290, y: 460 },
  'Exposiciones': { line: 'A', type: 'metro', x: 290, y: 490 },
  'Industriales': { lines: ['A', '1', '2'], type: 'metro', x: 290, y: 545 }, // Multimodal
  'Poblado': { line: 'A', type: 'metro', x: 290, y: 600 },
  'Aguacatala': { line: 'A', type: 'metro', x: 290, y: 640 },
  'Ayurá': { line: 'A', type: 'metro', x: 290, y: 680 },
  'Envigado': { line: 'A', type: 'metro', x: 290, y: 720 },
  'Itagüí': { line: 'A', type: 'metro', x: 290, y: 760 },
  'Sabaneta': { line: 'A', type: 'metro', x: 290, y: 800 },
  'La Estrella': { line: 'A', type: 'metro', x: 290, y: 840 },

  // Línea B - horizontal desde San Antonio hacia el oeste
  // San Antonio ya está definida arriba como multimodal
  'Cisneros': { lines: ['B', '1'], type: 'metro', x: 250, y: 420 }, // Multimodal
  'Suramericana': { line: 'B', type: 'metro', x: 190, y: 420 },
  'Estadio': { line: 'B', type: 'metro', x: 138, y: 420 },
  'Floresta': { line: 'B', type: 'metro', x: 100, y: 420 },
  'Santa Lucía': { line: 'B', type: 'metro', x: 60, y: 420 },
  'San Javier': { lines: ['B', 'J'], type: 'metro', x: 25, y: 420 }, // Multimodal

  // Línea K - cable diagonal hacia el noreste desde Acevedo
  'Andalucía': { line: 'K', type: 'cable', x: 260, y: 140 },
  'Popular': { line: 'K', type: 'cable', x: 300, y: 135 },
  'Santo Domingo': { line: 'K', type: 'cable', x: 350, y: 130 },

  // Línea P - cable diagonal noreste desde Acevedo
  'SENA': { line: 'P', type: 'cable', x: 150, y: 130 },
  'Doce de Octubre': { line: 'P', type: 'cable', x: 90, y: 130 },
  'El Progreso': { line: 'P', type: 'cable', x: 40, y: 130 },

  // Línea J - cable diagonal desde San Javier
  'Juan XXIII': { line: 'J', type: 'cable', x: 25, y: 380 },
  'Vallejuelos': { line: 'J', type: 'cable', x: 25, y: 340 },
  'La Aurora': { line: 'J', type: 'cable', x: 25, y: 300 },

  // Tranvía T - horizontal hacia el oriente desde San Antonio
  'San José': { line: 'T', type: 'tranvia', x: 360, y: 410 },
  'Pabellón del Agua': { line: 'T', type: 'tranvia', x: 395, y: 410 },
  'Bicentenario': { line: 'T', type: 'tranvia', x: 448, y: 410 },
  'Buenos Aires': { line: 'T', type: 'tranvia', x: 495, y: 410 },
  'Miraflores': { lines: ['T', 'M'], type: 'tranvia', x: 535, y: 400 }, // Multimodal
  'Loyola': { line: 'T', type: 'tranvia', x: 580, y: 400 },
  'Alejandro Echavarría': { line: 'T', type: 'tranvia', x: 630, y: 400 },
  'Oriente': { lines: ['T', 'H'], type: 'tranvia', x: 675, y: 400 }, // Multimodal

  // Línea M - cable hacia el sur desde Miraflores
  'El Pinal': { line: 'M', type: 'cable', x: 560, y: 365 },
  'Trece de Noviembre': { line: 'M', type: 'cable', x: 585, y: 330 },

  // Línea H - cable desde Oriente
  'Las Torres': { line: 'H', type: 'cable', x: 710, y: 380 },
  'Villa Sierra': { line: 'H', type: 'cable', x: 740, y: 380 },

    // Línea 1 (Bus) - Ruta verde compleja
    'Parque Aranjuez': { line: '1', type: 'bus', x: 315, y: 170 },
    'Berlín': { line: '1', type: 'bus', x: 360, y: 174},
    'Las Esmeraldas': { line: '1', type: 'bus', x: 360, y: 195 },
    'Manrique': { line: '1', type: 'bus', x: 360, y: 228 },
    'Gardel': { line: '1', type: 'bus', x: 360, y: 250 },
    'Palos Verdes': { line: '1', type: 'bus', x: 360, y: 275 },
    'UdeA': { line: '1', type: 'bus', x: 250, y: 285 },
    'Chagualo': { line: '1', type: 'bus', x: 250, y: 328 },
    'Minorista': { line: '1', type: 'bus', x: 250, y: 370 },
    'Plaza Mayor': { line: '1', type: 'bus', x: 250, y: 470 },
    'Nutibara': { line: '1', type: 'bus', x: 240, y: 545 },
    'Fátima': { line: '1', type: 'bus', x: 200, y: 545 },
    'Rosales': { line: '1', type: 'bus', x: 162, y: 545 },
    'Parque Belén': { line: '1', type: 'bus', x: 122, y: 545 },
    'La Palma': { line: '1', type: 'bus', x: 92, y: 545 },
    'Los Alpes': { line: '1', type: 'bus', x: 62, y: 545 },
    'UdeM': { line: '1', type: 'bus', x: 32, y: 545 },

    // Línea 2 (Bus) - Ruta rosa alternativa
    'Prado (Bus)': { line: '2', type: 'bus', x: 360, y: 310 },
    'Catedral': { line: '2', type: 'bus', x: 360, y: 350 },
    'La Playa': { line: '2', type: 'bus', x: 360, y: 375 },
    'Barrio Colón': { line: '2', type: 'bus', x: 360, y: 465 },
    'Perpetuo Socorro': { line: '2', type: 'bus', x: 360, y: 500 },
    'Barrio Colombia': { line: '2', type: 'bus', x: 325, y: 520 }
};

// Definición de conexiones con tiempos entre estaciones
const CONNECTIONS = [
    // Línea A
    { from: 'Niquía', to: 'Bello', time: 108, line: 'A' },
    { from: 'Bello', to: 'Madera', time: 144, line: 'A' },
    { from: 'Madera', to: 'Acevedo', time: 144, line: 'A' },
    { from: 'Acevedo', to: 'Tricentenario', time: 126, line: 'A' },
    { from: 'Tricentenario', to: 'Caribe', time: 138, line: 'A' },
    { from: 'Caribe', to: 'Universidad', time: 90, line: 'A' },
    { from: 'Universidad', to: 'Hospital', time: 60, line: 'A' },
    { from: 'Hospital', to: 'Prado', time: 90, line: 'A' },
    { from: 'Prado', to: 'Parque Berrío', time: 78, line: 'A' },
    { from: 'Parque Berrío', to: 'San Antonio', time: 42, line: 'A' },
    { from: 'San Antonio', to: 'Alpujarra', time: 78, line: 'A' },
    { from: 'Alpujarra', to: 'Exposiciones', time: 78, line: 'A' },
    { from: 'Exposiciones', to: 'Industriales', time: 156, line: 'A' },
    { from: 'Industriales', to: 'Poblado', time: 240, line: 'A' },
    { from: 'Poblado', to: 'Aguacatala', time: 240, line: 'A' },
    { from: 'Aguacatala', to: 'Ayurá', time: 120, line: 'A' },
    { from: 'Ayurá', to: 'Envigado', time: 210, line: 'A' },
    { from: 'Envigado', to: 'Itagüí', time: 150, line: 'A' },
    { from: 'Itagüí', to: 'Sabaneta', time: 120, line: 'A' },
    { from: 'Sabaneta', to: 'La Estrella', time: 120, line: 'A' },

    // Línea B
    { from: 'San Antonio', to: 'Cisneros', time: 138, line: 'B' },
    { from: 'Cisneros', to: 'Suramericana', time: 163, line: 'B' },
    { from: 'Suramericana', to: 'Estadio', time: 87, line: 'B' },
    { from: 'Estadio', to: 'Floresta', time: 172, line: 'B' },
    { from: 'Floresta', to: 'Santa Lucía', time: 93, line: 'B' },
    { from: 'Santa Lucía', to: 'San Javier', time: 127, line: 'B' },

    // Línea 1
    { from: 'Parque Aranjuez', to: 'Berlín', time: 180, line: '1' },
    { from: 'Berlín', to: 'Las Esmeraldas', time: 156, line: '1' },
    { from: 'Las Esmeraldas', to: 'Manrique', time: 144, line: '1' },
    { from: 'Manrique', to: 'Gardel', time: 150, line: '1' },
    { from: 'Gardel', to: 'Palos Verdes', time: 150, line: '1' },
    { from: 'Palos Verdes', to: 'Hospital', time: 204, line: '1' },
    { from: 'Hospital', to: 'UdeA', time: 162, line: '1' },
    { from: 'UdeA', to: 'Chagualo', time: 156, line: '1' },
    { from: 'Chagualo', to: 'Minorista', time: 162, line: '1' },
    { from: 'Minorista', to: 'Cisneros', time: 174, line: '1' },
    { from: 'Cisneros', to: 'Plaza Mayor', time: 144, line: '1' },
    { from: 'Plaza Mayor', to: 'Industriales', time: 186, line: '1' },
    { from: 'Industriales', to: 'Nutibara', time: 174, line: '1' },
    { from: 'Nutibara', to: 'Fátima', time: 162, line: '1' },
    { from: 'Fátima', to: 'Rosales', time: 168, line: '1' },
    { from: 'Rosales', to: 'Parque Belén', time: 150, line: '1' },
    { from: 'Parque Belén', to: 'La Palma', time: 156, line: '1' },
    { from: 'La Palma', to: 'Los Alpes', time: 162, line: '1' },
    { from: 'Los Alpes', to: 'UdeM', time: 156, line: '1' },

    // Línea 2
    { from: 'Parque Aranjuez', to: 'Berlín', time: 180, line: '2' },
    { from: 'Berlín', to: 'Las Esmeraldas', time: 156, line: '2' },
    { from: 'Las Esmeraldas', to: 'Manrique', time: 144, line: '2' },
    { from: 'Manrique', to: 'Gardel', time: 150, line: '2' },
    { from: 'Gardel', to: 'Palos Verdes', time: 150, line: '2' },
    { from: 'Palos Verdes', to: 'Prado (Bus)', time: 204, line: '2' },
    { from: 'Prado (Bus)', to: 'Catedral', time: 180, line: '2' },
    { from: 'Catedral', to: 'La Playa', time: 156, line: '2' },
    { from: 'La Playa', to: 'San José', time: 138, line: '2' },
    { from: 'San José', to: 'Barrio Colón', time: 258, line: '2' },
    { from: 'Barrio Colón', to: 'Perpetuo Socorro', time: 222, line: '2' },
    { from: 'Perpetuo Socorro', to: 'Barrio Colombia', time: 246, line: '2' },
    { from: 'Barrio Colombia', to: 'Industriales', time: 234, line: '2' },
    { from: 'Industriales', to: 'Nutibara', time: 174, line: '2' },
    { from: 'Nutibara', to: 'Fátima', time: 162, line: '2' },
    { from: 'Fátima', to: 'Rosales', time: 168, line: '2' },
    { from: 'Rosales', to: 'Parque Belén', time: 150, line: '2' },
    { from: 'Parque Belén', to: 'La Palma', time: 156, line: '2' },
    { from: 'La Palma', to: 'Los Alpes', time: 162, line: '2' },
    { from: 'Los Alpes', to: 'UdeM', time: 156, line: '2' },

    // Línea P
    { from: 'Acevedo', to: 'SENA', time: 180, line: 'P' },
    { from: 'SENA', to: 'Doce de Octubre', time: 120, line: 'P' },
    { from: 'Doce de Octubre', to: 'El Progreso', time: 240, line: 'P' },

    // Línea J
    { from: 'San Javier', to: 'Juan XXIII', time: 210, line: 'J' },
    { from: 'Juan XXIII', to: 'Vallejuelos', time: 190, line: 'J' },
    { from: 'Vallejuelos', to: 'La Aurora', time: 320, line: 'J' },

    // Línea K
    { from: 'Acevedo', to: 'Andalucía', time: 240, line: 'K' },
    { from: 'Andalucía', to: 'Popular', time: 120, line: 'K' },
    { from: 'Popular', to: 'Santo Domingo', time: 180, line: 'K' },

    // Línea M
    { from: 'Miraflores', to: 'El Pinal', time: 220, line: 'M' },
    { from: 'El Pinal', to: 'Trece de Noviembre', time: 200, line: 'M' },

    // Línea H
    { from: 'Oriente', to: 'Las Torres', time: 250, line: 'H' },
    { from: 'Las Torres', to: 'Villa Sierra', time: 140, line: 'H' },

    // Línea T
    { from: 'San Antonio', to: 'San José', time: 156, line: 'T' },
    { from: 'San José', to: 'Pabellón del Agua', time: 126, line: 'T' },
    { from: 'Pabellón del Agua', to: 'Bicentenario', time: 138, line: 'T' },
    { from: 'Bicentenario', to: 'Buenos Aires', time: 144, line: 'T' },
    { from: 'Buenos Aires', to: 'Miraflores', time: 132, line: 'T' },
    { from: 'Miraflores', to: 'Loyola', time: 168, line: 'T' },
    { from: 'Loyola', to: 'Alejandro Echavarría', time: 108, line: 'T' },
    { from: 'Alejandro Echavarría', to: 'Oriente', time: 120, line: 'T' }
];


// Colores para las líneas
const LINE_COLORS = {
    'A': '#0066cc',
    'B': '#ff6600',
    '1': '#00cc66',
    '2': '#cc0066',
    'P': '#9933cc',
    'J': '#ff3366',
    'K': '#33cc99',
    'M': '#ffcc00',
    'H': '#cc3300',
    'T': '#6699ff'
};

// Costos base por tipo de transporte
const BASE_COSTS = {
    'metro': 2650,
    'bus': 2950,
    'cable': 2650,
    'tranvia': 2650
};

// Función para obtener todas las estaciones ordenadas alfabéticamente
function getAllStations() {
    return Object.keys(STATIONS).sort();
}

// Función para obtener información de una estación
function getStationInfo(stationName) {
    return STATIONS[stationName];
}

// Función para obtener el color de una línea
function getLineColor(line) {
    return LINE_COLORS[line] || '#666666';
}

// Función para obtener el costo base por tipo de transporte
function getBaseCost(type) {
    return BASE_COSTS[type] || 2650;
}

// Función auxiliar para obtener las líneas de una estación
function getStationLines(stationName) {
    const station = STATIONS[stationName];
    if (!station) return [];
    
    // Si tiene múltiples líneas, devolverlas
    if (station.lines) return station.lines;
    
    // Si tiene una sola línea, devolverla como array
    if (station.line) return [station.line];
    
    return [];
}

// Función para verificar si una estación pertenece a una línea específica
function stationBelongsToLine(stationName, lineId) {
    const lines = getStationLines(stationName);
    return lines.includes(lineId);
}

// Función para construir el grafo como lista de adyacencia
function buildGraph() {
    const graph = {};
    
    // Inicializar el grafo con todas las estaciones
    Object.keys(STATIONS).forEach(station => {
        graph[station] = [];
    });
    
    // Agregar conexiones bidireccionales
    CONNECTIONS.forEach(connection => {
        const { from, to, time, line } = connection;
        
        if (graph[from] && graph[to]) {
            // Conexión ida
            graph[from].push({
                station: to,
                time: time,
                line: line,
                cost: getBaseCost(STATIONS[to].type)
            });
            
            // Conexión vuelta
            graph[to].push({
                station: from,
                time: time,
                line: line,
                cost: getBaseCost(STATIONS[from].type)
            });
        }
    });
    
    return graph;
}

function splitStationName(name) {
    // Lista de palabras que queremos mantener juntas
    const keepTogether = ['de', 'del', 'la', 'las', 'el', 'los'];
    
    // Casos especiales que queremos manejar de forma específica
    const specialCases = {
        'Juan XXIII': ['Juan', 'XXIII'],
        'Doce de Octubre': ['Doce de', 'Octubre'],
        'Trece de Noviembre': ['Trece de', 'Noviembre'],
        'Alejandro Echavarría': ['Alejandro', 'Echavarría'],
        'Pabellón del Agua': ['Pabellón', 'del Agua'],
        'La Aurora': ['La Aurora'],
        'La Playa': ['La Playa']

    };
    
    // Verificar si es un caso especial
    if (specialCases[name]) {
        return specialCases[name];
    }
    
    const words = name.split(' ');
    
    // Si solo hay una palabra, devolverla como está
    if (words.length === 1) {
        return [name];
    }
    
    // Si hay 2 palabras, dividir en dos líneas
    if (words.length === 2) {
        return words;
    }
    
    // Para nombres más largos, intentar dividir de manera inteligente
    const lines = [];
    let currentLine = [];
    
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        
        // Si es una palabra pequeña que debe mantenerse junta, agregarla a la línea actual
        if (keepTogether.includes(word.toLowerCase()) && currentLine.length > 0) {
            currentLine.push(word);
        }
        // Si la línea actual está vacía o tiene solo una palabra, agregar
        else if (currentLine.length <= 1) {
            currentLine.push(word);
        }
        // Si ya tenemos palabras suficientes, crear nueva línea
        else {
            lines.push(currentLine.join(' '));
            currentLine = [word];
        }
    }
    
    // Agregar la última línea si queda algo
    if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
    }
    
    return lines;
}

// Encontrar estaciones en una línea específica ordenadas por conexión
function getStationsInLine(lineId) {
    const lineStations = [];
    const lineConnections = CONNECTIONS.filter(conn => conn.line === lineId);
    
    if (lineConnections.length === 0) return [];
    
    // Construir secuencia de estaciones en la línea
    const stationOrder = [];
    let currentStation = lineConnections[0].from;
    stationOrder.push(currentStation);
    
    while (true) {
        const nextConnection = lineConnections.find(conn => conn.from === currentStation);
        if (!nextConnection) break;
        
        currentStation = nextConnection.to;
        stationOrder.push(currentStation);
    }
    
    return stationOrder;
}

// Encontrar la estación anterior en una línea específica
function getPreviousStationInLine(stationName, lineId, direction = 'forward') {
    const stationsInLine = getStationsInLine(lineId);
    const stationIndex = stationsInLine.indexOf(stationName);
    
    if (stationIndex === -1) return null;
    
    if (direction === 'backward' && stationIndex > 0) {
        return stationsInLine[stationIndex - 1];
    } else if (direction === 'forward' && stationIndex < stationsInLine.length - 1) {
        return stationsInLine[stationIndex + 1];
    }
    
    return null;
}

// Analizar ruta para encontrar puntos críticos
function analyzeRouteForClosedStation(start, end, closedStation) {
    // Primero verificar si hay ruta directa sin la estación cerrada
    const possibleRoutes = [];
    
    // Buscar todas las líneas que conectan origen y destino
    const startLines = getStationLines(start);
    const endLines = getStationLines(end);
    
    startLines.forEach(startLine => {
        endLines.forEach(endLine => {
            if (startLine === endLine) {
                // Misma línea - verificar si la estación cerrada está en el camino
                const stationsInLine = getStationsInLine(startLine);
                const startIndex = stationsInLine.indexOf(start);
                const endIndex = stationsInLine.indexOf(end);
                const closedIndex = stationsInLine.indexOf(closedStation);
                
                if (startIndex !== -1 && endIndex !== -1) {
                    const minIndex = Math.min(startIndex, endIndex);
                    const maxIndex = Math.max(startIndex, endIndex);
                    
                    if (closedIndex >= minIndex && closedIndex <= maxIndex) {
                        // La estación cerrada está en el camino directo
                        const lastAccessible = startIndex < endIndex ? 
                            stationsInLine[closedIndex - 1] : 
                            stationsInLine[closedIndex + 1];
                            
                        possibleRoutes.push({
                            line: startLine,
                            lastAccessible: lastAccessible,
                            blocked: true,
                            alternativeNeeded: true
                        });
                    } else {
                        possibleRoutes.push({
                            line: startLine,
                            lastAccessible: end,
                            blocked: false,
                            alternativeNeeded: false
                        });
                    }
                }
            }
        });
    });
    
    return possibleRoutes;
}

// Exportar para uso en otros archivos
if (typeof window !== 'undefined') {
    window.METRO_DATA = {
        STATIONS,
        CONNECTIONS,
        LINE_COLORS,
        BASE_COSTS,
        getAllStations,
        getStationInfo,
        getLineColor,
        getBaseCost,
        buildGraph,
        splitStationName,
        getStationLines,        // Nueva función
        stationBelongsToLine,   // Nueva función
        getStationsInLine,
        getPreviousStationInLine,
        analyzeRouteForClosedStation,
        createGraph: buildGraph
    };
}