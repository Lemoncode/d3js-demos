import { scaleBand, scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { startRealTimeDataV2 } from "./03-bars.data";

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
const scaleXPosCreator = (data: any[]) => scaleBand<number>()
  .domain(data.map((d,i) => i))
  .rangeRound([0, width])
  .paddingInner(0.05) // OJO.Unidades en rango [0,1]
  .paddingOuter(0);

const scaleYPos = scaleLinear()
  .domain([0, 1])
  .range([height, 0]);  // Ojo a la inversión.

// Creamos el grupo para las barras.
const barGroup = svg
  .append("g");

// Nuestra función "draw", implementa los 3 patrones.  
const updateChart = (newData: number[]) => {
  // Selección Bar
  const barSelection = barGroup
    .selectAll("rect")
    .data(newData);
  
  // Patrón EXIT().
  barSelection
    .exit()
    .transition()
    .duration(350)
      .attr("height", 0)
      .attr("fill", "red")
      .style("opacity", 0)
    .remove();

  const scaleXPos = scaleXPosCreator(newData);
  
  // Patron ENTER();
  const enter = barSelection
    .enter()
    .append("rect")
      .attr("x", (d, i) => scaleXPos(i))
      .attr("y", height)
      .attr("width", scaleXPos.bandwidth())
      .attr("height", 0);

  // Patrón UPDATE().
  barSelection
    .merge(enter)
    .transition()  
    .duration(450)
      .attr("x", (d, i) => scaleXPos(i))
      .attr("y", d => scaleYPos(d))
      .attr("width", scaleXPos.bandwidth())
      .attr("height", d => height - scaleYPos(d))
      .attr("fill", "url(#barGradient)");
}

startRealTimeDataV2(updateChart);

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