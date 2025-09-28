// Clase para la visualización del grafo de la red de transporte
class MetroVisualization {
    constructor(svgId) {
        this.svg = d3.select(`#${svgId}`);
        this.width = 800;
        this.height = 700;
        this.stations = window.METRO_DATA.STATIONS;
        this.connections = window.METRO_DATA.CONNECTIONS;
        this.lineColors = window.METRO_DATA.LINE_COLORS;
        
        this.setupSVG();
        this.initializeVisualization();
    }

    setupSVG() {
        this.svg
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');
    }

    initializeVisualization() {
        // Limpiar SVG
        this.svg.selectAll('*').remove();

        // Crear grupos para organizar elementos
        this.connectionsGroup = this.svg.append('g').attr('class', 'connections');
        this.stationsGroup = this.svg.append('g').attr('class', 'stations');
        this.labelsGroup = this.svg.append('g').attr('class', 'labels');

        this.drawConnections();
        this.drawStations();
        this.drawLabels();
    }

    drawConnections() {
        const connections = this.connectionsGroup
            .selectAll('.connection-line')
            .data(this.connections)
            .enter()
            .append('line')
            .attr('class', 'connection-line')
            .attr('x1', d => this.stations[d.from].x)
            .attr('y1', d => this.stations[d.from].y)
            .attr('x2', d => this.stations[d.to].x)
            .attr('y2', d => this.stations[d.to].y)
            .attr('stroke', d => this.lineColors[d.line])
            .attr('stroke-width', 3)
            .attr('opacity', 0.8)
            .attr('data-line', d => d.line)
            .attr('data-from', d => d.from)
            .attr('data-to', d => d.to);
    }

    drawStations() {
        const stations = this.stationsGroup
            .selectAll('.station-node')
            .data(Object.entries(this.stations))
            .enter()
            .append('circle')
            .attr('class', d => {
                const isMultimodal = d[1].lines && d[1].lines.length > 1;
                return isMultimodal ? 'station-node multimodal-station' : 'station-node';
            })
            .attr('cx', d => d[1].x)
            .attr('cy', d => d[1].y)
            .attr('r', d => {
                const isMultimodal = d[1].lines && d[1].lines.length > 1;
                return this.getStationRadius(d[1].type, isMultimodal);
            })
            .attr('fill', d => this.getStationColor(d[1]))
            .attr('stroke', '#ffffff')
            .attr('stroke-width', d => {
                const isMultimodal = d[1].lines && d[1].lines.length > 1;
                return isMultimodal ? 3 : 2;
            })
            .attr('data-station', d => d[0])
            .on('click', (event, d) => this.onStationClick(d[0]))
            .on('mouseover', (event, d) => this.showStationTooltip(event, d))
            .on('mouseout', () => this.hideTooltip());
    }

    drawLabels() {
        const labels = this.labelsGroup
            .selectAll('.station-label')
            .data(Object.entries(this.stations))
            .enter()
            .append('text')
            .attr('class', 'station-label')
            .attr('x', d => d[1].x)
            .attr('y', d => d[1].y + this.getStationRadius(d[1].type) + 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '9px')
            .attr('font-weight', '600')
            .attr('fill', '#1f2937')
            .text(d => d[0]);
    }

    getStationRadius(type) {
        const radii = {
            'metro': 6,
            'bus': 4,
            'cable': 5,
            'tranvia': 5
        };
        return radii[type] || 4;
    }

    getStationColor(stationData) {
        // Si la estación tiene múltiples líneas, usar un color especial
        if (stationData.lines && stationData.lines.length > 1) {
            return '#6366f1'; // Color especial para estaciones multimodales
        }
        
        const colors = {
            'metro': '#3b82f6',
            'bus': '#10b981',
            'cable': '#8b5cf6',
            'tranvia': '#f59e0b'
        };
        return colors[stationData.type] || '#6b7280';
    }

    // Resaltar ruta en el grafo
    highlightPath(pathResult) {
        // Limpiar resaltado anterior
        this.clearHighlight();

        if (!pathResult || !pathResult.path) return;

        const path = pathResult.path;
        const detailedPath = pathResult.detailedPath;

        // Primero poner todo en gris
        this.grayOutAll();

        // Obtener todas las líneas usadas en la ruta
        const usedLines = new Set();
        detailedPath.forEach(step => {
            usedLines.add(step.line);
        });

        // Resaltar solo las conexiones de la ruta calculada
        detailedPath.forEach(step => {
            this.connectionsGroup
                .selectAll('.connection-line')
                .filter((d, i, nodes) => {
                    const line = d3.select(nodes[i]);
                    const from = line.attr('data-from');
                    const to = line.attr('data-to');
                    const lineType = line.attr('data-line');
                    return ((from === step.from && to === step.to) || 
                           (from === step.to && to === step.from)) &&
                           lineType === step.line;
                })
                .classed('path grayed-out', false)
                .classed('path', true);
        });

        // Resaltar estaciones de la ruta
        path.forEach((stationName, index) => {
            this.stationsGroup
                .selectAll('.station-node')
                .filter((d, i, nodes) => {
                    return d3.select(nodes[i]).attr('data-station') === stationName;
                })
                .classed('grayed-out', false);

            // Aplicar clases específicas según posición en la ruta
            if (index === 0) {
                this.stationsGroup
                    .selectAll('.station-node')
                    .filter((d, i, nodes) => {
                        return d3.select(nodes[i]).attr('data-station') === stationName;
                    })
                    .classed('origin', true);
            } else if (index === path.length - 1) {
                this.stationsGroup
                    .selectAll('.station-node')
                    .filter((d, i, nodes) => {
                        return d3.select(nodes[i]).attr('data-station') === stationName;
                    })
                    .classed('destination', true);
            } else {
                this.stationsGroup
                    .selectAll('.station-node')
                    .filter((d, i, nodes) => {
                        return d3.select(nodes[i]).attr('data-station') === stationName;
                    })
                    .classed('path', true);
            }
        });

        // Resaltar labels de estaciones en la ruta
        this.labelsGroup
            .selectAll('.station-label')
            .filter((d, i, nodes) => {
                const labelText = d3.select(nodes[i]).text();
                return path.includes(labelText);
            })
            .classed('grayed-out', false);
    }

    // Poner todo el grafo en gris
    grayOutAll() {
        // Poner todas las estaciones en gris
        this.stationsGroup.selectAll('.station-node')
            .classed('grayed-out', true);
        
        // Poner todas las conexiones en gris
        this.connectionsGroup.selectAll('.connection-line')
            .classed('grayed-out', true);

        // Poner todas las etiquetas en gris
        this.labelsGroup.selectAll('.station-label')
            .classed('grayed-out', true);
    }

    // Mostrar estaciones interrumpidas
    showDisruptions(closedStations) {
        // Limpiar interrupciones anteriores
        this.clearDisruptions();

        closedStations.forEach(stationName => {
            // Marcar estación como interrumpida
            this.stationsGroup
                .selectAll('.station-node')
                .filter((d, i, nodes) => {
                    return d3.select(nodes[i]).attr('data-station') === stationName;
                })
                .classed('disrupted', true);

            // Marcar conexiones como interrumpidas
            this.connectionsGroup
                .selectAll('.connection-line')
                .filter((d, i, nodes) => {
                    const line = d3.select(nodes[i]);
                    const from = line.attr('data-from');
                    const to = line.attr('data-to');
                    return from === stationName || to === stationName;
                })
                .classed('disrupted', true);
        });
    }

    // Limpiar resaltado de rutas
    clearHighlight() {
        this.stationsGroup.selectAll('.station-node')
            .classed('origin destination path grayed-out', false);
        
        this.connectionsGroup.selectAll('.connection-line')
            .classed('path grayed-out', false);

        this.labelsGroup.selectAll('.station-label')
            .classed('grayed-out', false);
    }

    // Limpiar marcado de interrupciones
    clearDisruptions() {
        this.stationsGroup.selectAll('.station-node')
            .classed('disrupted', false);
        
        this.connectionsGroup.selectAll('.connection-line')
            .classed('disrupted', false);
    }

    // Manejar clic en estación
    onStationClick(stationName) {
        const event = new CustomEvent('stationSelected', { 
            detail: { station: stationName } 
        });
        document.dispatchEvent(event);
    }

    // Mostrar tooltip de estación
    showStationTooltip(event, stationData) {
        const stationName = stationData[0];
        const stationInfo = stationData[1];
        
        // Crear tooltip si no existe
        if (!this.tooltip) {
            this.tooltip = d3.select('body')
                .append('div')
                .attr('class', 'metro-tooltip')
                .style('opacity', 0)
                .style('position', 'absolute')
                .style('background', 'rgba(0, 0, 0, 0.8)')
                .style('color', 'white')
                .style('padding', '10px')
                .style('border-radius', '5px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('z-index', '1000');
        }

        this.tooltip.transition()
            .duration(200)
            .style('opacity', .9);
        
        this.tooltip.html(`
            <strong>${stationName}</strong><br/>
            Línea: ${stationInfo.line}<br/>
            Tipo: ${this.getTransportTypeName(stationInfo.type)}
        `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    }

    // Ocultar tooltip
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        }
    }

    // Obtener nombre legible del tipo de transporte
    getTransportTypeName(type) {
        const names = {
            'metro': 'Metro',
            'bus': 'Bus',
            'cable': 'MetroCable',
            'tranvia': 'Tranvía'
        };
        return names[type] || type;
    }

    // Redimensionar visualización
    resize() {
        const container = this.svg.node().parentElement;
        const containerWidth = container.clientWidth;
        const aspectRatio = this.height / this.width;
        const newHeight = containerWidth * aspectRatio;
        
        this.svg
            .attr('width', containerWidth)
            .attr('height', newHeight);
    }

    // Animar ruta progresivamente
    animateRoute(pathResult, duration = 3000) {
        if (!pathResult || !pathResult.detailedPath) return;

        const steps = pathResult.detailedPath;
        const stepDuration = duration / steps.length;

        // Limpiar animaciones anteriores
        this.clearHighlight();

        // Animar cada paso
        steps.forEach((step, index) => {
            setTimeout(() => {
                // Resaltar conexión actual
                this.connectionsGroup
                    .selectAll('.connection-line')
                    .filter((d, i, nodes) => {
                        const line = d3.select(nodes[i]);
                        const from = line.attr('data-from');
                        const to = line.attr('data-to');
                        return (from === step.from && to === step.to) || 
                               (from === step.to && to === step.from);
                    })
                    .classed('path', true);

                // Resaltar estación actual
                this.stationsGroup
                    .selectAll('.station-node')
                    .filter((d, i, nodes) => {
                        const stationName = d3.select(nodes[i]).attr('data-station');
                        return stationName === step.to;
                    })
                    .classed('path', true);

            }, index * stepDuration);
        });

        // Al final, marcar origen y destino
        setTimeout(() => {
            const path = pathResult.path;
            
            this.stationsGroup
                .selectAll('.station-node')
                .filter((d, i, nodes) => {
                    const stationName = d3.select(nodes[i]).attr('data-station');
                    return stationName === path[0];
                })
                .classed('origin', true)
                .classed('path', false);

            this.stationsGroup
                .selectAll('.station-node')
                .filter((d, i, nodes) => {
                    const stationName = d3.select(nodes[i]).attr('data-station');
                    return stationName === path[path.length - 1];
                })
                .classed('destination', true)
                .classed('path', false);
                
        }, duration);
    }
}

// Funciones de utilidad para trabajar sin D3.js (alternativa manual)
class SimpleMetroVisualization {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.width = 800;
        this.height = 700;
        this.stations = window.METRO_DATA.STATIONS;
        this.connections = window.METRO_DATA.CONNECTIONS;
        this.lineColors = window.METRO_DATA.LINE_COLORS;
        
        this.initializeVisualization();
    }

    initializeVisualization() {
        // Limpiar SVG
        this.svg.innerHTML = '';
        
        // Configurar viewBox
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        this.drawConnections();
        this.drawStations();
        this.drawLabels();
    }

    drawConnections() {
        this.connections.forEach(connection => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const fromStation = this.stations[connection.from];
            const toStation = this.stations[connection.to];
            
            if (fromStation && toStation) {
                line.setAttribute('x1', fromStation.x);
                line.setAttribute('y1', fromStation.y);
                line.setAttribute('x2', toStation.x);
                line.setAttribute('y2', toStation.y);
                line.setAttribute('stroke', this.lineColors[connection.line]);
                line.setAttribute('stroke-width', '3');
                line.setAttribute('opacity', '0.8');
                line.setAttribute('class', 'connection-line');
                line.setAttribute('data-line', connection.line);
                line.setAttribute('data-from', connection.from);
                line.setAttribute('data-to', connection.to);
                
                this.svg.appendChild(line);
            }
        });
    }

    drawStations() {
        Object.entries(this.stations).forEach(([name, station]) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            
            circle.setAttribute('cx', station.x);
            circle.setAttribute('cy', station.y);
            circle.setAttribute('r', this.getStationRadius(station.type));
            circle.setAttribute('fill', this.getStationColor(station));
            circle.setAttribute('stroke', '#ffffff');
            circle.setAttribute('stroke-width', '2');
            circle.setAttribute('class', 'station-node');
            circle.setAttribute('data-station', name);
            
            // Agregar eventos
            circle.addEventListener('click', () => this.onStationClick(name));
            circle.addEventListener('mouseover', (e) => this.showStationTooltip(e, name, station));
            circle.addEventListener('mouseout', () => this.hideTooltip());
            
            this.svg.appendChild(circle);
        });
    }

    drawLabels() {
        Object.entries(this.stations).forEach(([name, station]) => {
            this.drawStationLabel(name, station);
        });
    }

    // Dibujar etiqueta de estación con múltiples opciones de orientación
    drawStationLabel(stationName, stationData) {
        const isMultimodal = stationData.lines && stationData.lines.length > 1;
        const radius = this.getStationRadius(stationData.type, isMultimodal);
        
        // Obtener orientación basada en la posición de la estación
        const orientation = this.getLabelOrientation(stationName, stationData);
        
        // Usar splitStationName para dividir nombres largos
        const nameLines = window.METRO_DATA.splitStationName(stationName);
        
        if (nameLines.length === 1 && orientation === 'horizontal') {
            // Nombre simple horizontal
            this.createSingleLineLabel(stationName, stationData, radius, orientation);
        } else {
            // Nombre múltiple líneas o con orientación especial
            this.createMultiLineLabel(nameLines, stationData, radius, orientation);
        }
    }

    // Determinar orientación del texto basada en la posición y densidad
    getLabelOrientation(stationName, stationData) {
        // Si hay una orientación forzada por el usuario, usarla (excepto 'auto')
        if (this.forceOrientation && this.forceOrientation !== 'auto') {
            return this.forceOrientation;
        }
        
        const x = stationData.x;
        const y = stationData.y;
        
        // Zonas especiales donde necesitamos orientación diferente
        const densityZones = {
            
            // Zona del tranvía - diagonal
            tranvia: { minX: 350, maxX: 700, minY: 410, maxY: 420 },
            // Zona línea 1 y 2 (buses) - vertical
            
        };
        return 'horizontal';
    }

    // Verificar si una posición está en una zona
    isInZone(x, y, zone) {
        return x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY;
    }

    // Crear etiqueta de una sola línea
    createSingleLineLabel(text, stationData, radius, orientation) {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        
        const { x, y, transform } = this.getLabelPosition(stationData, radius, orientation, 1);
        
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('font-size', '8px');
        textElement.setAttribute('font-weight', '600');
        textElement.setAttribute('fill', '#1f2937');
        textElement.setAttribute('class', 'station-label');
        
        if (transform) {
            textElement.setAttribute('transform', transform);
        }
        
        textElement.textContent = text;
        this.svg.appendChild(textElement);
    }

    // Crear etiqueta multilínea
    createMultiLineLabel(lines, stationData, radius, orientation) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'station-label-group');
        
        lines.forEach((line, index) => {
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            
            const { x, y, transform } = this.getLabelPosition(stationData, radius, orientation, lines.length, index);
            
            textElement.setAttribute('x', x);
            textElement.setAttribute('y', y);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('font-size', '7px');
            textElement.setAttribute('font-weight', '600');
            textElement.setAttribute('fill', '#1f2937');
            textElement.setAttribute('class', 'station-label');
            
            if (transform) {
                textElement.setAttribute('transform', transform);
            }
            
            textElement.textContent = line;
            group.appendChild(textElement);
        });
        
        this.svg.appendChild(group);
    }

    // Calcular posición y transformación del texto
    getLabelPosition(stationData, radius, orientation, totalLines = 1, lineIndex = 0) {
        let x = stationData.x;
        let y = stationData.y;
        let transform = null;
        
        const lineHeight = 10;
        const offset = 10;
        
        switch (orientation) {
            case 'vertical':
                // Texto vertical (rotado -90 grados)
                x = stationData.x - offset - radius;
                y = stationData.y + (lineHeight * (lineIndex - (totalLines - 1) / 2));
                transform = `rotate(-90 ${x} ${y})`;
                break;
                
            case 'diagonal':
                // Texto diagonal (rotado -45 grados)
                x = stationData.x + offset + radius;
                y = stationData.y - offset - radius + (lineHeight * lineIndex);
                transform = `rotate(-45 ${x} ${y})`;
                break;
                
            case 'horizontal':
            default:
                // Texto horizontal (default)
                x = stationData.x;
                y = stationData.y + radius + offset + (lineHeight * lineIndex);
                break;
        }
        
        return { x, y, transform };
    }

    getStationRadius(type, isMultimodal = false) {
        const baseRadii = {
            'metro': 6,
            'bus': 4,
            'cable': 5,
            'tranvia': 5
        };
        
        const radius = baseRadii[type] || 4;
        
        // Las estaciones multimodales son más grandes
        return isMultimodal ? radius + 2 : radius;
    }

    getStationColor(stationData) {
        const colors = {
            'metro': '#3b82f6',
            'bus': '#10b981',
            'cable': '#8b5cf6',
            'tranvia': '#f59e0b'
        };
        return colors[stationData.type] || '#6b7280';
    }

    highlightPath(pathResult) {
        // Limpiar resaltado anterior
        this.clearHighlight();

        if (!pathResult || !pathResult.path) return;

        const path = pathResult.path;
        const detailedPath = pathResult.detailedPath;

        // Primero poner todo en gris
        this.grayOutAll();

        // Resaltar solo las conexiones de la ruta calculada
        detailedPath.forEach(step => {
            const connections = this.svg.querySelectorAll('.connection-line');
            connections.forEach(conn => {
                const from = conn.getAttribute('data-from');
                const to = conn.getAttribute('data-to');
                const lineType = conn.getAttribute('data-line');
                if (((from === step.from && to === step.to) || 
                    (from === step.to && to === step.from)) &&
                    lineType === step.line) {
                    conn.classList.remove('grayed-out');
                    conn.classList.add('path');
                }
            });
        });

        // Resaltar estaciones de la ruta
        path.forEach((stationName, index) => {
            const stationNode = this.svg.querySelector(`[data-station="${stationName}"]`);
            if (stationNode) {
                stationNode.classList.remove('grayed-out');
                
                if (index === 0) {
                    stationNode.classList.add('origin');
                } else if (index === path.length - 1) {
                    stationNode.classList.add('destination');
                } else {
                    stationNode.classList.add('path');
                }
            }
        });

        // Resaltar labels de estaciones en la ruta
        const labels = this.svg.querySelectorAll('.station-label, .station-label-group');
        labels.forEach(labelElement => {
            // Verificar si es un grupo o etiqueta individual
            if (labelElement.classList.contains('station-label-group')) {
                // Es un grupo, verificar el contenido de sus hijos
                const textElements = labelElement.querySelectorAll('.station-label');
                const combinedText = Array.from(textElements).map(el => el.textContent).join(' ');
                if (path.some(stationName => combinedText.includes(stationName) || stationName.includes(combinedText))) {
                    labelElement.classList.remove('grayed-out');
                }
            } else {
                // Es una etiqueta individual
                if (path.includes(labelElement.textContent)) {
                    labelElement.classList.remove('grayed-out');
                }
            }
        });
    }

    // Poner todo el grafo en gris
    grayOutAll() {
        // Poner todas las estaciones en gris
        const nodes = this.svg.querySelectorAll('.station-node');
        nodes.forEach(node => {
            node.classList.add('grayed-out');
        });
        
        // Poner todas las conexiones en gris
        const connections = this.svg.querySelectorAll('.connection-line');
        connections.forEach(conn => {
            conn.classList.add('grayed-out');
        });

        // Poner todas las etiquetas en gris
        const labels = this.svg.querySelectorAll('.station-label, .station-label-group');
        labels.forEach(label => {
            label.classList.add('grayed-out');
        });
    }

    clearHighlight() {
        const nodes = this.svg.querySelectorAll('.station-node');
        nodes.forEach(node => {
            node.classList.remove('origin', 'destination', 'path', 'grayed-out');
        });
        
        const connections = this.svg.querySelectorAll('.connection-line');
        connections.forEach(conn => {
            conn.classList.remove('path', 'grayed-out');
        });

        const labels = this.svg.querySelectorAll('.station-label, .station-label-group');
        labels.forEach(label => {
            label.classList.remove('grayed-out');
        });
    }

    showDisruptions(closedStations) {
        this.clearDisruptions();

        closedStations.forEach(stationName => {
            const stationNode = this.svg.querySelector(`[data-station="${stationName}"]`);
            if (stationNode) {
                stationNode.classList.add('disrupted');
            }

            const connections = this.svg.querySelectorAll('.connection-line');
            connections.forEach(conn => {
                const from = conn.getAttribute('data-from');
                const to = conn.getAttribute('data-to');
                if (from === stationName || to === stationName) {
                    conn.classList.add('disrupted');
                }
            });
        });
    }

    clearDisruptions() {
        const nodes = this.svg.querySelectorAll('.station-node');
        nodes.forEach(node => {
            node.classList.remove('disrupted');
        });
        
        const connections = this.svg.querySelectorAll('.connection-line');
        connections.forEach(conn => {
            conn.classList.remove('disrupted');
        });
    }

    onStationClick(stationName) {
        const event = new CustomEvent('stationSelected', { 
            detail: { station: stationName } 
        });
        document.dispatchEvent(event);
    }

    showStationTooltip(event, stationName, stationInfo) {
        // Implementación simple de tooltip
        let tooltip = document.getElementById('metro-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'metro-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.2s;
            `;
            document.body.appendChild(tooltip);
        }

        // Mostrar todas las líneas de la estación
        const lines = window.METRO_DATA.getStationLines(stationName);
        const linesText = lines.length > 1 ? `Líneas: ${lines.join(', ')}` : `Línea: ${lines[0] || 'N/A'}`;

        tooltip.innerHTML = `
            <strong>${stationName}</strong><br/>
            ${linesText}<br/>
            Tipo: ${this.getTransportTypeName(stationInfo.type)}
            ${lines.length > 1 ? '<br/><em>Estación multimodal</em>' : ''}
        `;
        
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY - 28) + 'px';
        tooltip.style.opacity = '1';
    }

    hideTooltip() {
        const tooltip = document.getElementById('metro-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }

    getTransportTypeName(type) {
        const names = {
            'metro': 'Metro',
            'bus': 'Bus',
            'cable': 'MetroCable',
            'tranvia': 'Tranvía'
        };
        return names[type] || type;
    }

    // Actualizar orientación de todas las etiquetas
    updateLabelOrientation(newOrientation) {
        this.forceOrientation = newOrientation;
        
        // Limpiar etiquetas existentes
        const existingLabels = this.svg.querySelectorAll('.station-label, .station-label-group');
        existingLabels.forEach(label => label.remove());
        
        // Redibujar etiquetas con nueva orientación
        this.drawLabels();
    }


}

// Exportar para uso en otros archivos
if (typeof window !== 'undefined') {
    window.VISUALIZATION = {
        SimpleMetroVisualization
    };
}