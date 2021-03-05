import * as d3 from 'd3'
import {drawHighLightCol} from "../utils/common/highLightCol"
import {drawLine} from "../utils/common/dashedLine"
import {drawIcon} from "../utils/common/icon"
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForColumn} from "../utils/common/createTableForColumn";
import {fontSize, svgSize} from "../config/config";

export function combine_columns_merge(m1,m2,rule,t1_name,t2_name,inExpOrImp,outExpOrImp,outColors,name,showTableName,pos){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }
    //输入：
    //input和output的矩阵
    //input矩阵中的哪些列进行sum操作
    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('id', `mainsvg${name}`);
    // svg.setAttribute('width', svgSize.width);
    // svg.setAttribute('height', svgSize.height);
    // svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.getElementById('glyphs').appendChild(svg)

    // let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    // let height = d3.select('#mainsvg').attr('height')
    // let colWidth = width / (m1[0].length + m2[0].length + 1)
    // let colHeight = height / (m1.length + 5)
    // let colFontSize = fontSize.colFontSize
    // let cellFontSize = fontSize.cellFontSize
    // const g = d3.select('#mainsvg').append('g')
    //     .attr('transform',`translate(10,10)`)

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (m1[0].length + m2[0].length + 1)
    let colHeight = height / (m1.length + 3)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize

    const g = d3.select(`#mainsvg`).append('g')
        .attr('transform',`translate(${pos[0]},${pos[1]})`)
        .attr("id",`glyph${name}`)

    drawTableForColumn(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)

    // 添加加号和箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForColumn(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColors)

    let inColLenAndMid = drawHighLightCol(g,m1,inExpOrImp,[0,colHeight],colWidth,colHeight)
    let yOfLine = (m1.length + 2) * colHeight
    //画两个表之间的连线
    if(inColLenAndMid.len != 0){
        let outColLenAndMid = drawHighLightCol(g,m2,outExpOrImp,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight)
        yOfLine = inColLenAndMid.len == 1 ? (m1.length + 2) * colHeight : (m1.length + 3) * colHeight
        drawLine(g,[inColLenAndMid.midPoint,yOfLine],[outColLenAndMid.midPoint,yOfLine],true)
        if(inColLenAndMid.len != 1){
            drawLine(g,[outColLenAndMid.midPoint,yOfLine],[outColLenAndMid.midPoint,yOfLine - colHeight],true)
        }
    }
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}
