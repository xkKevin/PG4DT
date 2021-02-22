import * as d3 from 'd3'
import {drawDashRect} from "../utils/dashedRect"
import {drawIcon} from "../utils/icon"
import {drawOperationName} from "../utils/operationName";
import {drawTableForColumn} from "../utils/createTableForColumn";
import {fontSize, svgSize} from "../config/config";

export function create_table(matrix,rule,t1_name,name,showTableName){
    if(!showTableName){
        t1_name = ''
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', svgSize.width);
    svg.setAttribute('height', svgSize.height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.body.appendChild(svg);
    document.getElementById('glyphs').appendChild(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (matrix[0].length * 2 + 1)
    let colHeight = height / (matrix.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    drawDashRect(g,[0,colHeight],matrix.length * colHeight,matrix[0].length * colWidth)

    // 添加加号和箭头
    let plusUrl = require('../../images/plus.png')
    drawIcon(g,[0.1 * colWidth, 1.2 * colHeight],0.9 * matrix[0].length * colWidth,0.9 * matrix.length * colHeight,plusUrl)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(matrix[0].length + 0.1) * colWidth,(1 + matrix.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForColumn(g,matrix,[(matrix[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)

    let yOfLine = (matrix.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}
