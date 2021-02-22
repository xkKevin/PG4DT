import * as d3 from 'd3'
import {drawHighLightCol} from "../utils/highLightCol"
import {drawDashRect} from "../utils/dashedRect"
import {drawLine} from "../utils/dashedLine"
import {drawIcon} from "../utils/icon"
import {drawOperationName} from "../utils/operationName";
import {drawTableForColumn} from "../utils/createTableForColumn";
import {fontSize, svgSize} from "../config/config";

export function create_column(m1,m2,rule,t1_name,t2_name,inExp,outExp,name,showTableName){

    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', svgSize.width);
    svg.setAttribute('height', svgSize.height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.body.appendChild(svg);
    document.getElementById('glyphs').appendChild(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (m2[0].length * 2 + 1)
    let colHeight = height / (m1.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    // drawTable(g,m1,inExpOrImp,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,'col')
    drawTableForColumn(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawDashRect(g,[m1[0].length * colWidth,colHeight],m1.length * colHeight,colWidth)

    // 添加加号和箭头
    let plusUrl = require('../../images/plus.png')
    drawIcon(g,[m1[0].length * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],colWidth,colHeight,plusUrl)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 1.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    // drawTable(g,m2,outputExpOrImp,[(m2[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,'col')
    drawTableForColumn(g,m2,[(m2[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize)

    let inColLenAndMid = drawHighLightCol(g,m1,inExp,[0,colHeight],colWidth,colHeight)
    let yOfLine = (m1.length + 2) * colHeight
    //画两个表之间的连线
    if(inColLenAndMid.len !== 0){
        let outColLenAndMid = drawHighLightCol(g,m2,outExp,[(m2[0].length + 1) * colWidth,colHeight],colWidth,colHeight)
        yOfLine = inColLenAndMid.len === 1 ? (m1.length + 2) * colHeight : (m1.length + 3) * colHeight
        drawLine(g,[inColLenAndMid.midPoint,yOfLine],[outColLenAndMid.midPoint,yOfLine],true)
        if(inColLenAndMid.len !== 1){
            drawLine(g,[outColLenAndMid.midPoint,yOfLine],[outColLenAndMid.midPoint,yOfLine - colHeight],true)
        }
    }
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}
