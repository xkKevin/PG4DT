import * as d3 from 'd3'
import {drawEdge} from './render'
function drawSvgAndEdge(specs,nodePos,svgWidth,svgHeight){
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('id', `mainsvg`);
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.getElementById("glyphs").appendChild(svg)

    // let width = d3.select(`#mainsvg`).attr('width') - 20
    // let height = d3.select('#mainsvg').attr('height')
    const g = d3.select('#mainsvg').append('g')
        // .attr('transform',`translate(10,10)`)

    drawEdge(g,specs,nodePos)
    // drawNode(g,specs,nodePos)

    return g
}
export {drawSvgAndEdge}