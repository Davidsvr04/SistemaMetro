// Definición de todas las estaciones del sistema Metro de Medellín
const STATIONS = {
    // Línea A - vertical centrada
  'Niquía': { line: 'A', type: 'metro', x: 400, y: 40 },
  'Bello': { line: 'A', type: 'metro', x: 400, y: 80 },
  'Madera': { line: 'A', type: 'metro', x: 400, y: 120 },
  'Acevedo': { line: 'A', type: 'metro', x: 400, y: 160 },
  'Tricentenario': { line: 'A', type: 'metro', x: 400, y: 200 },
  'Caribe': { line: 'A', type: 'metro', x: 400, y: 240 },
  'Universidad': { line: 'A', type: 'metro', x: 400, y: 280 },
  'Hospital': { line: 'A', type: 'metro', x: 400, y: 320 },
  'Prado': { line: 'A', type: 'metro', x: 400, y: 360 },
  'Parque Berrío': { line: 'A', type: 'metro', x: 400, y: 400 },
  'San Antonio': { line: 'A', type: 'metro', x: 400, y: 440 },
  'Alpujarra': { line: 'A', type: 'metro', x: 400, y: 480 },
  'Exposiciones': { line: 'A', type: 'metro', x: 400, y: 520 },
  'Industriales': { line: 'A', type: 'metro', x: 400, y: 560 },
  'Poblado': { line: 'A', type: 'metro', x: 400, y: 600 },
  'Aguacatala': { line: 'A', type: 'metro', x: 400, y: 640 },
  'Ayurá': { line: 'A', type: 'metro', x: 400, y: 680 },
  'Envigado': { line: 'A', type: 'metro', x: 400, y: 720 },
  'Itagüí': { line: 'A', type: 'metro', x: 400, y: 760 },
  'Sabaneta': { line: 'A', type: 'metro', x: 400, y: 800 },
  'La Estrella': { line: 'A', type: 'metro', x: 400, y: 840 },

  // Línea B - horizontal desde San Antonio hacia el oeste
  'San Antonio': { line: 'B', type: 'metro', x: 400, y: 440 },
  'Cisneros': { line: 'B', type: 'metro', x: 340, y: 440 },
  'Suramericana': { line: 'B', type: 'metro', x: 280, y: 440 },
  'Estadio': { line: 'B', type: 'metro', x: 220, y: 440 },
  'Floresta': { line: 'B', type: 'metro', x: 160, y: 440 },
  'Santa Lucía': { line: 'B', type: 'metro', x: 100, y: 440 },
  'San Javier': { line: 'B', type: 'metro', x: 40, y: 440 },

  // Línea K - cable diagonal hacia el noreste desde Acevedo
  'Andalucía': { line: 'K', type: 'cable', x: 360, y: 120 },
  'Popular': { line: 'K', type: 'cable', x: 330, y: 90 },
  'Santo Domingo': { line: 'K', type: 'cable', x: 300, y: 60 },

  // Línea P - cable diagonal noreste desde Acevedo
  'SENA': { line: 'P', type: 'cable', x: 440, y: 120 },
  'Doce de Octubre': { line: 'P', type: 'cable', x: 480, y: 90 },
  'El Progreso': { line: 'P', type: 'cable', x: 520, y: 60 },

  // Línea J - cable diagonal desde San Javier
  'Juan XXIII': { line: 'J', type: 'cable', x: 20, y: 480 },
  'Vallejuelos': { line: 'J', type: 'cable', x: 0, y: 520 },
  'La Aurora': { line: 'J', type: 'cable', x: -20, y: 560 },

  // Tranvía T - horizontal hacia el oriente desde San Antonio
  'San José': { line: 'T', type: 'tranvia', x: 460, y: 440 },
  'Pabellón del Agua': { line: 'T', type: 'tranvia', x: 500, y: 440 },
  'Bicentenario': { line: 'T', type: 'tranvia', x: 540, y: 440 },
  'Buenos Aires': { line: 'T', type: 'tranvia', x: 580, y: 440 },
  'Miraflores': { line: 'T', type: 'tranvia', x: 620, y: 440 },
  'Loyola': { line: 'T', type: 'tranvia', x: 660, y: 440 },
  'Alejandro Echavarría': { line: 'T', type: 'tranvia', x: 700, y: 440 },
  'Oriente': { line: 'T', type: 'tranvia', x: 740, y: 440 },

  // Línea M - cable hacia el sur desde Miraflores
  'El Pinal': { line: 'M', type: 'cable', x: 620, y: 480 },
  'Trece de Noviembre': { line: 'M', type: 'cable', x: 620, y: 520 },

  // Línea H - cable desde Oriente
  'Las Torres': { line: 'H', type: 'cable', x: 780, y: 420 },
  'Villa Sierra': { line: 'H', type: 'cable', x: 820, y: 400 },

    // Línea 1 (Bus) - Ruta verde compleja
    'Aranjuez': { line: '1', type: 'bus', x: 500, y: 200 },
    'Berlín': { line: '1', type: 'bus', x: 530, y: 220 },
    'Las Esmeraldas': { line: '1', type: 'bus', x: 560, y: 250 },
    'Manrique': { line: '1', type: 'bus', x: 580, y: 290 },
    'Gardel': { line: '1', type: 'bus', x: 590, y: 330 },
    'Palos Verdes': { line: '1', type: 'bus', x: 580, y: 370 },
    'UdeA': { line: '1', type: 'bus', x: 550, y: 400 },
    'Chagualo': { line: '1', type: 'bus', x: 500, y: 420 },
    'Minorista': { line: '1', type: 'bus', x: 460, y: 440 },
    'Plaza Mayor': { line: '1', type: 'bus', x: 420, y: 520 },
    'Nutibara': { line: '1', type: 'bus', x: 380, y: 580 },
    'Fátima': { line: '1', type: 'bus', x: 340, y: 620 },
    'Rosales': { line: '1', type: 'bus', x: 300, y: 660 },
    'Parque Belén': { line: '1', type: 'bus', x: 260, y: 700 },
    'La Palma': { line: '1', type: 'bus', x: 220, y: 740 },
    'Los Alpes': { line: '1', type: 'bus', x: 180, y: 780 },
    'UdeM': { line: '1', type: 'bus', x: 140, y: 820 },

    // Línea 2 (Bus) - Ruta rosa alternativa
    'Catedral': { line: '2', type: 'bus', x: 350, y: 350 },
    'La Playa': { line: '2', type: 'bus', x: 320, y: 380 },
    'Barrio Colón': { line: '2', type: 'bus', x: 250, y: 520 },
    'Perpetuo Socorro': { line: '2', type: 'bus', x: 200, y: 580 },
    'Barrio Colombia': { line: '2', type: 'bus', x: 150, y: 640 }
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
    { from: 'Aranjuez', to: 'Berlín', time: 180, line: '1' },
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
    { from: 'Aranjuez', to: 'Berlín', time: 180, line: '2' },
    { from: 'Berlín', to: 'Las Esmeraldas', time: 156, line: '2' },
    { from: 'Las Esmeraldas', to: 'Manrique', time: 144, line: '2' },
    { from: 'Manrique', to: 'Gardel', time: 150, line: '2' },
    { from: 'Gardel', to: 'Palos Verdes', time: 150, line: '2' },
    { from: 'Palos Verdes', to: 'Prado', time: 204, line: '2' },
    { from: 'Prado', to: 'Catedral', time: 180, line: '2' },
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
        buildGraph
    };
}