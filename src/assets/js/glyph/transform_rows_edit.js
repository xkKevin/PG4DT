import * as d3 from 'd3'
import {drawIcon} from "../utils/icon";
import {drawIndex} from "../utils/setIndex";
import {drawOperationName} from "../utils/operationName";
import {drawTableForRow} from "../utils/createTableForRow";
import {fontSize, svgSize} from "../config/config";

export function transform_rows_edit(m1,m2,rule,t1_name,t2_name,idx,name,showTableName) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', svgSize.width);
    svg.setAttribute('height', svgSize.height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.getElementById('glyphs').append(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (m1[0].length + m2[0].length + 2)
    let colHeight = height / (m1.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    let inputX = 0.5 * colWidth
    drawTableForRow(g,m1,[inputX,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.05) * colWidth + inputX,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth,colHeight,arrowUrl)
    let outputX = (m1[0].length + 1.5)* colWidth
    drawTableForRow(g,m2,[inputX + outputX,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize)
    drawIndex(g,[0,colHeight * 2],idx,colWidth / 2,colHeight,cellFontSize)
    drawIndex(g,[(m1[0].length + 1.2) * colWidth,colHeight * 2],idx,colWidth,colHeight,cellFontSize)

    drawOperationName(g,[width / 2, (m1.length + 2) * colHeight],rule,'1.2em',colFontSize)
}