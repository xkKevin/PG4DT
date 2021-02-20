import * as d3 from 'd3'
import {drawHighLightCol} from "../utils/highLightCol"
import {drawLine} from "../utils/dashedLine"
import {drawIcon} from "../utils/icon"
import {drawOperationName} from "../utils/operationName";
import {drawTableForColumn} from "../utils/createTableForColumn";

export function combine_columns_merge(m1,m2,rule,t1_name,t2_name,inExpOrImp,outExpOrImp,outColors){
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
    let colWidth = width / (m1[0].length + m2[0].length + 1)
    let colHeight = height / (m1.length + 5)
    let colFontSize = 1.5
    let cellFontSize = 1
    const g = d3.select('#mainsvg').append('g')
        .attr('transform',`translate(10,10)`)

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
    drawOperationName(g,[width / 2,yOfLine],`Mutate:'${rule}'`,'1.2em',colFontSize)
}