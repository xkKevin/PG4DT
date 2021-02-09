import * as d3 from 'd3'
import {drawTable} from "../utils/createTable"
import {drawHighLightCol} from "../utils/highLightCol"
import {drawDashRect} from "../utils/dashedRect"
import {drawLine} from "../utils/dashedLine"
import {drawArrow} from "../utils/arrow"
import {drawOperationName} from "../utils/operationName";

export function create_column(m1,m2,expOrImpCols,rule,t1_name,t2_name){
    //输入：
    //input和output的矩阵
    //input矩阵中的哪些列进行sum操作
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', 'mainsvg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.body.appendChild(svg);

    let width = d3.select('#mainsvg').attr('width') - 20
    let height = d3.select('#mainsvg').attr('height')
    let colWidth = width / (m2[0].length * 2 + 1)
    let colHeight = height / (m1.length + 5)

    let colFontSize = 1.5
    let cellFontSize = 1
    const g = d3.select('#mainsvg').append('g')
        .attr('transform',`translate(10,10)`)

    drawTable(g,m1,expOrImpCols,[0,colHeight],colWidth,colHeight,"t1",colFontSize,cellFontSize)
    drawDashRect(g,[m1[0].length * colWidth,colHeight],m1.length * colHeight,colWidth)

    // 添加加号和箭头
    let plusUrl = require('../../images/plus.png')
    drawArrow(g,[m1[0].length * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],colWidth,colHeight,plusUrl)
    let arrowUrl = require('../../images/arrow.png')
    drawArrow(g,[(m1[0].length + 1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],colWidth,colHeight,arrowUrl)

    let inColLenAndMid = drawHighLightCol(g,m1,expOrImpCols,[0,colHeight],colWidth,colHeight)
    let outputExpOrImp = Array.from(expOrImpCols)
    outputExpOrImp.push(m2[0].length - 1)
    drawTable(g,m2,outputExpOrImp,[(m2[0].length + 1) * colWidth,colHeight],colWidth,colHeight,"t2",colFontSize,cellFontSize)
    let outColLenAndMid = drawHighLightCol(g,m2,[m2[0].length - 1],[(m2[0].length + 1) * colWidth,colHeight],colWidth,colHeight)

    //画两个表之间的连线
    let yOfLine = inColLenAndMid.len == 1 ? (m1.length + 2) * colHeight : (m1.length + 3) * colHeight
    drawLine(g,[inColLenAndMid.midPoint,yOfLine],[outColLenAndMid.midPoint,yOfLine],true)
    if(inColLenAndMid.len != 1){
        drawLine(g,[outColLenAndMid.midPoint,yOfLine],[outColLenAndMid.midPoint,yOfLine - colHeight],true)
    }
    drawOperationName(g,[width / 2,yOfLine],`Mutate:'${rule}'`,'1.2em',colFontSize)
}
