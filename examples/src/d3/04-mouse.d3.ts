import { select, mouse } from "d3-selection";
import { hsl } from "d3-color";
import { symbol, symbolStar } from "d3-shape";


const width = 500;
const height = 500;

const card = select("#root")
  .append("div")
    .attr("class", "card");

card
  .append("h3")
    .text("Touch Me!");

const svg = card
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`);

// Suscribimos nuestra función que pinta en el event "mousemove". Para dispositivos
// táctiles "touchmove" ojo.
svg
  .on("mousemove", paintCircleOnMouseMove)
  .on("touchmove", paintCircleOnMouseMove)
  // .on("mousemove", paintStarOnMouseMove)


function paintCircleOnMouseMove() {
  const [mx, my] = mouse(this);
  svg
    .insert("circle") // insert en lugar de append para que aparezca encima del resto
      .attr("cx", mx)
      .attr("cy", my)
      .attr("r", 0)
      .style("fill", "none")
      .style("stroke", hsl((hue = (hue+1) % 360), 1, 0.4).toString())
      .style("stroke-opacity", 0.8)
    .transition()
      .duration(2000)
      .ease(Math.sqrt)
      .attr("r", 100)
      .style("stroke-opacity", 0)
      .remove()
}

// Versión alternativa con una estrella
const starGenerator = symbol().type(symbolStar).size(1e4);

function paintStarOnMouseMove() {
  const [mx, my] = mouse(this);
  svg
    .insert("path")
      .attr("d", starGenerator)
      .attr("transform", `translate(${mx},${my})scale(0)`)
      .style("fill", "none")
      .style("stroke", hsl((hue = (hue+1) % 360), 1, 0.4).toString())
      .style("stroke-width", 1.5)
      .style("stroke-opacity", 0.8)
    .transition()
      .duration(2000)
      .ease(Math.sqrt)
      .attr("transform", `translate(${mx},${my})scale(1)`)
      .style("stroke-opacity", 0)
      .remove()
}

let hue = 0;