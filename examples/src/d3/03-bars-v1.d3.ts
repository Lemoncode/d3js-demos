import { select, selectAll } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { randomData, startRealTimeDataV1 } from "./03-bars.data";

const width = 500;
const height = 300;
const padding = 50;

// Creamos la tarjeta.
const card = select("#root")
  .append("div")
    .attr("class", "card");

// Creamos el 'lienzo' svg.
const svg = card
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `${-padding} ${-padding} ${width + 2*padding} ${height + 2*padding}`);

// Creamos las escalas para nuestra visualización de barras.
// En el caso del eje X usaremos una escala un poco más específica para
// generar bandas. Esta escala tiene como dominio (valores de entrada)
// un array con todos los posibles valores (no me vale un rango como antes)
// y como valores de salida (rango) nos dará pixeles en escalones discretos
// (bandas) y también la anchura de cada banda (bandwith).
const scaleXPos = scaleBand<number>()
  .domain(randomData.map((d,i) => i))
  .rangeRound([0, width])
  .paddingInner(0.05) // OJO.Unidades en rango [0,1]
  .paddingOuter(0);

const scaleYPos = scaleLinear()
  .domain([0, 1])
  .range([height, 0]);  // Ojo a la inversión.

// Patrón ENTER(). Creamos las barras por primera vez.
const barGroup = svg
  .append("g");

barGroup
  .selectAll("rect")  // Selección
  .data(randomData)   // Data join
  .enter()            // Actuamos sobre el grupo enter.
  .append("rect")
    .attr("x", (d, i) => scaleXPos(i))
    .attr("y", d => scaleYPos(d))
    .attr("width", d => scaleXPos.bandwidth())
    .attr("height", d => height - scaleYPos(d))
    .attr("fill", "url(#barGradient)");

// OPCIONAL.
// Si tenemos datos en realtime, podemos implementar
// el patrón update.    
const updateChart = () => {
  // Patrón UPDATE().
  barGroup
    .selectAll("rect")
    .data(randomData)
      .transition()  
      .duration(750)
      .attr("y", d => scaleYPos(d))
      .attr("height", d => height - scaleYPos(d));
}

startRealTimeDataV1(updateChart);



// OPCIONAL
// Gradiente para colorear las barras.
const gradient = svg
  .append("defs")
    .append("linearGradient")
      .attr("id", "barGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0")
      .attr("y1", height)
      .attr("x2", "0")
      .attr("y2", "0");
gradient
  .append("stop")
    .attr("offset", "0")
    .attr("stop-color", "#185a9d");
gradient
  .append("stop")
    .attr("offset", "80%")
    .attr("stop-color", "#43cea2");
gradient
  .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#43cea2");