import { select } from "d3-selection";
import { scalePow, scaleLinear } from "d3-scale";
import { interpolateSpectral } from "d3-scale-chromatic";
import { drag } from "d3-drag";
import { event } from "d3"
import {
  forceSimulation,
  forceCenter,
  forceCollide,
  forceManyBody,
} from "d3-force";

import { randomParticles, RandomParticle } from "./05-force.data";


const width = 500;
const height = 500;
const padding = 10;

const card = select("#root")
  .append("div")
    .attr("class", "card");

card
  .append("h3")
    .text("Drag & Drop");    

const svg = card
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `${-padding} ${-padding} ${width + 2*padding} ${height + 2*padding}`);

const scaleXPos = scaleLinear().domain([0, 1]).range([0, width]);
const scaleYPos = scaleLinear().domain([0, 1]).range([0, height]);
const scaleSize = scaleLinear().domain([0, 1]).range([4, 21]);
const scaleColor = interpolateSpectral;
const scaleStrength = scalePow().domain([0, 1]).range([25, 105]);

svg
  .selectAll("circle")
  .data(randomParticles)
  .enter()
  .append("circle")
    .attr("r", d => scaleSize(d.size))
    .attr("cx", d => {d.x = scaleXPos(d.x); return d.x})
    .attr("cy", d => {d.y = scaleYPos(d.y); return d.y})
    .attr("fill", d => scaleColor(d.color))
    .call(drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded)
    )
      
const forceSimulator = forceSimulation(randomParticles)
  .force("center", forceCenter(width/2, height/2))
  .force("collide", forceCollide<RandomParticle>().radius(d => scaleSize(d.size)).iterations(10))
  .force("charge", forceManyBody<RandomParticle>().strength(d => scaleStrength(d.size)))
  .on("tick", () => {
    svg.selectAll("circle")
      .attr("cx", (d: RandomParticle) => d.x)
      .attr("cy", (d: RandomParticle) => d.y)
  })
  // .alpha(1)  // Default 1
  // .alphaTarget(0.01) // Default 0
  // .alphaMin(0.01)  // Default 0.0001 => 300 iterations
  // .alphaDecay(0.03) // Default 0.022

function dragStarted(d) {
  if (!event.active) forceSimulator.alphaTarget(0.5).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnded(d) {
  if (!event.active) forceSimulator.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// INSPO
// https://bl.ocks.org/mbostock/1276463
// https://bl.ocks.org/mbostock/c66ab1426f4b8945a7ef
// https://bl.ocks.org/mbostock/1062383
