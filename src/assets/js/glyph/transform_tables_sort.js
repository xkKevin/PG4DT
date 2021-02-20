import * as d3 from 'd3'
import {drawIcon} from "../utils/icon"
import {drawOperationName} from "../utils/operationName";
import {drawTableForColumn} from "../utils/createTableForColumn";
import {fontSize, svgSize} from "../config/config";

export function transform_tables_sort(m1, m2, rule, t1_name, t2_name,name) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', svgSize.width);
    svg.setAttribute('height', svgSize.height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.getElementById('glyphs').appendChild(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight = height / (m1.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    drawTableForColumn(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForColumn(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize)
    let orderUrl = rule.indexOf("desc") === -1 ? require('../../images/asce.png') : require('../../images/desc.png')
    let sortedCol = 0
    for(let col = 0;col < m2[0].length;col++){
        if(m2[0][col] !== ''){
            sortedCol = col
            break
        }
    }
    drawIcon(g,[(m1[0].length + 1 + sortedCol + 0.6) * colWidth,1.4 * colHeight],0.5 * colWidth,0.5 * colHeight,orderUrl)
    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`Mutate:'${rule}'`,'1.2em',colFontSize)
}