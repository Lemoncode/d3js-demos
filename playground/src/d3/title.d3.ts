import { select } from "d3-selection";

const d3 = {select};

const card = d3.select("#root")
  .append("div")
    .attr("class", "card");

card
  .append("h1")
    .text("D3.js Playground");

