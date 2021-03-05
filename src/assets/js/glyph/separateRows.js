import * as d3 from 'd3'
import {drawIcon} from "../utils/common/icon"
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForRow} from "../utils/common/createTableForRow";
import {fontSize, svgSize} from "../config/config";

export function separate_rows(m1, m2, rule, t1_name, t2_name,outColor,name,showTableName,pos) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }
    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // // svg.setAttribute('style', 'border: 1px solid black');
    // svg.setAttribute('id', `mainsvg${name}`);
    // svg.setAttribute('width', svgSize.width);
    // svg.setAttribute('height', svgSize.height);
    // svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.getElementById('glyphs').append(svg)

    // let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    // let height = d3.select(`#mainsvg${name}`).attr('height')
    // let colWidth = width / (2 * m1[0].length + 1)
    // let colHeight = height / (m1.length + 5)
    // let colFontSize = fontSize.colFontSize
    // let cellFontSize = fontSize.cellFontSize
    // const g = d3.select(`#mainsvg${name}`).append('g')
    //     .attr('transform',`translate(10,10)`)

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight =  height / (m1.length + 3)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize

    const g = d3.select(`#mainsvg`).append('g')
        .attr('transform',`translate(${pos[0]},${pos[1]})`)
        .attr("id",`glyph${name}`)


    drawTableForRow(g,m1,[0,2 * colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight + colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor)
    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}