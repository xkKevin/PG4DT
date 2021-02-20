import * as d3 from 'd3'
import {drawIcon} from "../utils/icon"
import {drawOperationName} from "../utils/operationName";
import {drawTableForRow} from "../utils/createTableForRow";

export function separate_tables_decompose(m1,m2s,rule,t1_name,name){
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.body.appendChild(svg);

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight = height / (m1.length + m2s.length + 5)
    let colFontSize = 1.5
    let cellFontSize = 1
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    drawTableForRow(g,m1,[0, colHeight + (m2s.length - 1) / 2 * colHeight * 2],colWidth,colHeight,t1_name,colFontSize,cellFontSize)

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + (m2s.length - 1) / 2 * colHeight * 2],0.8 * colWidth, colHeight,arrowUrl)

    for(let idx = 0;idx < m2s.length;idx++){
        drawTableForRow(g,m2s[idx],[(m1[0].length + 1) * colWidth,colHeight + 3 * idx * colHeight],colWidth,colHeight,'',colFontSize,cellFontSize,[idx])
    }

    let yOfLine = (m1.length + 2 + m2s.length) * colHeight

    drawOperationName(g,[width / 2,yOfLine],`Mutate:'${rule}'`,'1.2em',colFontSize)
}
