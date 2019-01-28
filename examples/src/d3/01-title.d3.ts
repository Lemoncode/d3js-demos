import { select } from "d3-selection";

const d3 = {select};


// D3 nos ofrece un módulo para gestionarl el DOM al estilo jQuery.
// Podemos hacer selecciones, añadir y eliminar nodos, modificar, etc.
// Lo aprovecharemos para crear 'tarjetas' en nuestro showcase.
const card = d3.select("#root")
  .append("div")
    .attr("class", "card");

// La primera tarjeta será un título, le añadimos por tanto un
// elemento h1 con texto. 
card
  .append("h1")
    .text("D3.js Samples");

