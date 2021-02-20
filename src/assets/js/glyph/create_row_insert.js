import * as d3 from 'd3'
import {drawDashRect} from "../utils/dashedRect"
import {drawIcon} from "../utils/icon"
import {drawOperationName} from "../utils/operationName";
import {drawTableForRow} from "../utils/createTableForRow";
import {drawIndex} from "../utils/setIndex";

export function create_row_insert(m1, m2, rule, t1_name, t2_name,inColor,outColor,inIdx,outIdx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', 'mainsvg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.body.appendChild(svg);

    let width = d3.select('#mainsvg').attr('width') - 20
    let height = d3.select('#mainsvg').attr('height')
    let colWidth = width / (2 * m1[0].length + 2)
    let colHeight = height / (m1.length + 5)
    let colFontSize = 1.5
    let cellFontSize = 1
    const g = d3.select('#mainsvg').append('g')
        .attr('transform',`translate(10,10)`)

    let inDx = 0.5 * colWidth
    let outDx = 0.5 * colWidth
    drawIndex(g,[0,2 * colHeight],inIdx,0.5 * colWidth,colHeight,cellFontSize)
    drawTableForRow(g,m1,[inDx,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColor)
    drawDashRect(g,[inDx,(m1.length + 1) * colHeight],colHeight,m1[0].length * colWidth)

    let plusUrl = require('../../images/plus.png')
    drawIcon(g,[inDx + (m1[0].length - 1) * colWidth / 2,(m1.length + 1.1) * colHeight],colWidth, 0.8 * colHeight,plusUrl)
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[inDx + (m1[0].length + 0.1) * colWidth,(1 + m2.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawIndex(g,[inDx + (m1[0].length + 1) * colWidth,2 * colHeight],outIdx,0.5 * colWidth,colHeight,cellFontSize)
    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth + inDx + outDx,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor)

    let yOfLine = (m2.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`Mutate:'${rule}'`,'1.2em',colFontSize)
}