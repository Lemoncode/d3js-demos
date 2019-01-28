import { select } from "d3-selection";
import { scaleTime, scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import { line } from "d3-shape";
import { axisBottom, axisLeft } from "d3-axis";
import { avgTemp } from "./data";

const d3 = {
  select, scaleTime, scaleLinear, extent, line,
  axisBottom, axisLeft
};

// ****************************************************************
// 1. Primera visualización básica. 

const width = 500;
const height = 300;

const card = d3.select("#root")
  .append("div")
    .attr("class", "card");

const svg = card
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`); // Definición del sistema de coordenadas interno.

// Creamos las escalas. Una escala transforma valores de entrada
// a valores de salida, o dicho de otro modo, convertimos el 
// dominio de los datos (valores de entrada) a un rango de salida
// en pantalla (pixels típicamente). Domain = entrada, range = salida.
const xScale = d3.scaleLinear()
  .domain([0, 11])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain(d3.extent(avgTemp))
  .range([height, 0]);
  
// D3 proporciona helpers para construir figuras (lineas, arcos,
// polígonos, etc). Usaremos un helper para construir una línea.
// Este helper es una función que, dado un valor entrada, devolverá
// la coordenada (x,y). El valor de entrada será la temperatura
// media en un mes concreto, la salida, la coordenada X,Y en el gráfico.
const lineCreator = d3.line<number>()
  .x((d, i) => xScale(i))
  .y(d => yScale(d));

// Vamos a pintar finalmente nuestra línea de temperatura media.
// Es un caso especial donde tenemos un único elemento y por tanto haremos
// un join directo con los datos que tenemos para tal elemento.
svg
  .append("path")
  .datum(avgTemp)
    .attr("d", lineCreator)
    .attr("fill", "none")
    .attr("stroke-width", "5px")
    .attr("stroke", "black");


// ****************************************************************    
// 2. MEJORA. Añadir padding interno al SVG para que la línea
// se vea de forma completa.
const width = 500;
const height = 300;
const padding = 20;

const svg = card
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `${-padding} ${-padding} ${width + 2*padding} ${height + 2*padding}`);


// ****************************************************************
// 3. MEJORA. Crear gradiente SVG para colorear la línea de temperatura.    
svg
  .append("path")
  .datum(avgTemp)
    .attr("d", lineCreator)
    .attr("fill", "none")
    .attr("stroke-width", "3px")
    .attr("stroke", "url(#temperatureGradient)"); // Linkamos el gradiente

// Creamos el gradiente como una definición de svg.
const gradient = svg    
  .append("defs")
  .append("linearGradient")
    .attr("id", "temperatureGradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", "0")
    .attr("y1", height)
    .attr("x2", "0")
    .attr("y2", "0");
gradient
  .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "blue");
gradient
  .append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "green");    
gradient
  .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "red");


// ****************************************************************
// 3. MEJORA. Vamos a crear ejes para el gráfico.

const padding = 50; // Para hacer hueco a los títulos

// Creamos los ejes.
const axisGroup = svg.append("g");    

axisGroup
  .append("g")
    // .attr("transform", `translate(0, 0)`)
    .call(d3.axisLeft(yScale))
axisGroup
  .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

// También títulos si queremos.
axisGroup
  .append("text")
    .text("Mes")
    .attr("transform", `translate(${width/2}, ${height+40})`)
    .attr("text-anchor", "middle");
axisGroup
  .append("text")
    .text("Temperatura (ºC)")
    .attr("transform", `translate(${-35}, ${height/2})rotate(-90)`)
    .attr("text-anchor", "middle");
axisGroup
  .append("text")
    .text("Clima en Málaga")
    .attr("transform", `translate(${width/2}, ${-30})`)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold");

// Mejoramos tb el eje X con una escala temporal.    
const xScale = d3.scaleTime()
  .domain([new Date(2018, 0), new Date(2018, 11)])
  .range([0, width]);    


// ****************************************************************
// 4. Añadamos también temperaturas máximas y mínimas.

import { avgTemp, minTemp, maxTemp } from "./data";

// Min/Avg/Max temp. Sin selección ni patrón enter/update/exit.
svg
  .append("path")
  .datum(minTemp)
    .attr("d", lineCreator)
    .attr("fill", "none")
    .attr("stroke-width", "3px")
    .attr("stroke", "#2aa4b3");
svg
  .append("path")
  .datum(avgTemp)
    .attr("d", lineCreator)
    .attr("fill", "none")
    .attr("stroke-width", "3px")
    .attr("stroke-dasharray", "10px 4px")
    .attr("stroke", "#87c298");
svg
  .append("path")
  .datum(maxTemp)
    .attr("d", lineCreator)
    .attr("fill", "none")
    .attr("stroke-width", "3px")
    .attr("stroke", "#ff9800");


// ****************************************************************
// 5. MEJORA. Vemos que las gráficas se salen ya que ahora hay nuevos
// datos y nuevos valores maximos y minimos de temperatura que no hemos
// tenido en cuenta en nuestras escalas. Además, el código es repetitivo,
// estamos creando paths de forma poco automatizada.
// Vamos a implementar un patrón enter. Para ello lo primero es tener una
// estructura de datos acorde. Vease el objeto malagaStats en data.ts.

import { malagaStats } from "./data";

// Ajustamos la escala Y para que automáticamente contemple todos los
// valores de temperatura disponibles en las stats.
const yScale = d3.scaleLinear()
  .domain(d3.extent(malagaStats.reduce((acc, s) => acc.concat(s.values), [])))
  .range([height, 0]);

// Vamos a crear además una escala para el color, en este caso de tipo
// ordinal. Los valores de entrada (ids), serán mapeados, por orden
// a los valores de salidas (colores de una paleta predefinida).
const colorScale = d3.scaleOrdinal(d3.schemeAccent)
  // .domain(["avg", "min", "max"]);

// Finalmente modificamos nuestra visualización implementando un patron
// enter.
svg
  .selectAll("path")
  .data(malagaStats, (d: TempStat) => d.id)
  .enter()
  .append("path")
    .attr("d", d => lineCreator(d.values))
    .attr("fill", "none")
    .attr("stroke-width", "3px")
    .attr("stroke", d => colorScale(d.id));