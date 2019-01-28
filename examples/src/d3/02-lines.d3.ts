import { select } from "d3-selection";
import { scaleTime, scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeAccent } from "d3-scale-chromatic";
import { extent } from "d3-array";
import { line } from "d3-shape";
import { axisBottom, axisLeft } from "d3-axis";
import { malagaStats, TempStat } from "./02-lines.data";

const d3 = {
  select, scaleTime, scaleLinear, scaleOrdinal, extent, line,
  axisBottom, axisLeft, schemeAccent
};


const width = 500;
const height = 300;
const padding = 50;

const card = d3.select("#root")
  .append("div")
    .attr("class", "card");

const svg = card
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `${-padding} ${-padding} ${width + 2*padding} ${height + 2*padding}`);

const xScale = d3.scaleTime()
  .domain([new Date(2018, 0), new Date(2018, 11)])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain(d3.extent(malagaStats.reduce((acc, s) => acc.concat(s.values), [])))
  .range([height, 0]);

const colorScale = d3.scaleOrdinal(d3.schemeAccent)
  // .domain(["avg", "min", "max"]);
  
const lineCreator = d3.line<number>()
  .x((d, i) => xScale(new Date(2018, i)))
  .y(d => yScale(d)); 

// Min/Avg/Max temp. Sin selección ni patrón enter/update/exit.
svg
  .selectAll("path")
  .data(malagaStats, (d: TempStat) => d.id)
  .enter()
  .append("path")
    .attr("d", d => lineCreator(d.values))
    .attr("fill", "none")
    .attr("stroke-width", "3px")
    .attr("stroke", d => colorScale(d.id));

// Crear gradiente SVG para colorear líneas de temperatura.    
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
