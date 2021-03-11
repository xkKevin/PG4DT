import * as d3 from 'd3'
import {drawIcon} from "../utils/common/icon";
import {drawIndex} from "../utils/common/setIndex";
import {drawOperationName} from "../utils/common/operationName";
import {drawDashRect} from "../utils/common/dashedRect";
import {fontSize, svgSize} from "../config/config";
import {drawTableForRow} from "../utils/common/createTableForRow";
import { drawPcentBar } from '../utils/common/pcentBar';

function create_row(m1,m2,rule,t1_name,t2_name,insertPos = -1,name,showTableName,pos,xPercents,yPercents){
    //insertPos表示新行的位置，默认值为-1，表示在最后插入，0表示在首行，1表示在中间某行
    //在最后插入时，即insertPos为-1时，默认不显示行号
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = insertPos == -1 ? width / (m2[0].length * 2 + 1) : width / (m2[0].length * 2 + 2)
    let colHeight = height / (m1.length + 3)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize

    const g = d3.select(`#mainsvg`).append('g')
        .attr('transform',`translate(${pos[0]},${pos[1]})`)
        .attr("id",`glyph${name}`)
        g.append('rect')
        .attr('x',-10)
        .attr('y',0)
        .attr('width',parseInt(width) + 20)
        .attr('height',parseInt(height))
        .attr('stroke','gray')
        .attr('fill','transparent')
        g.append("path")
        .attr("d",`M${parseInt(width) / 2 - 4},${parseInt(height)} L${parseInt(width) / 2 + 4},${parseInt(height)}`)
        .attr('fill','none')
        .attr('stroke','white')
        .attr('stroke-width',"1px")
        g.append("path")
        .attr("d",`M${parseInt(width) / 2 - 4},${parseInt(height)} L${parseInt(width) / 2},${parseInt(height) + 4} L${parseInt(width) / 2 + 4},${parseInt(height)}`)
        // .attr('d',"M0,0 L8,4 L0,8 L4,4 L0,0")
        .attr('fill','white')
        .attr('stroke','gray')
        .attr('stroke-width',"1px")
        .style("stroke-linecap", "round")
    let inputX = insertPos === -1 ? 0 : 0.5 * colWidth
    // drawTable(g,m1,[],[inputX,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,'row')
    drawTableForRow(g,m1,[inputX,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[inputX,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
   
    drawDashRect(g,[inputX,(m1.length + 1) * colHeight],colHeight,m1[0].length * colWidth)
    let plusUrl = require('../../images/plus.png')
    drawIcon(g,[inputX + (m1[0].length - 0.8) * colWidth / 2,(m1.length + 1.1) * colHeight],0.8 * colWidth,0.8 * colHeight,plusUrl)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.05) * colWidth + inputX * 1.6,(1 + m2.length / 2) * colHeight - colHeight / 2],0.8 * colWidth,colHeight,arrowUrl)
    let outputX = insertPos === -1 ? (m1[0].length + 1) * colWidth : (m1[0].length + 1.5)* colWidth
    // drawTable(g,m2,[],[inputX + outputX,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,'row',insertPos)
    drawTableForRow(g,m2,[inputX + outputX,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize)
    drawPcentBar(g,[inputX + outputX,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
   
    if(insertPos != -1){
        drawIndex(g,[0,colHeight * 2],m1.length - 1,colWidth / 2,colHeight,cellFontSize)
        drawIndex(g,[(m1[0].length + 1.2) * colWidth,colHeight * 2],m2.length - 1,colWidth,colHeight,cellFontSize)
    }
    drawOperationName(g,[width / 2, (m2.length + 2) * colHeight],rule,'1.2em',colFontSize)
}


function create_row_insert(m1, m2, rule, t1_name, t2_name,inColor,outColor,inIdx,outIdx,name,showTableName,pos,xPercents,yPercents) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth =  width / (2 * m1[0].length + 2)
    let colHeight = height / (m1.length + 3)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize

    const g = d3.select(`#mainsvg`).append('g')
        .attr('transform',`translate(${pos[0]},${pos[1]})`)
        .attr("id",`glyph${name}`)
    g.append('rect')
    .attr('x',-10)
    .attr('y',0)
    .attr('width',parseInt(width) + 20)
    .attr('height',parseInt(height))
    .attr('stroke','gray')
    .attr('fill','transparent')

    // var arrow_path = "M0,0 L8,4 L0,8 L4,4 L0,0";
    // arrowMarker.append("path")
    //     .attr("d",arrow_path)
    //     .attr("fill","gray");
    g.append("path")
    .attr("d",`M${parseInt(width) / 2 - 4},${parseInt(height)} L${parseInt(width) / 2 + 4},${parseInt(height)}`)
    .attr('fill','none')
    .attr('stroke','white')
    .attr('stroke-width',"1px")

    g.append("path")
    .attr("d",`M${parseInt(width) / 2 - 4},${parseInt(height)} L${parseInt(width) / 2},${parseInt(height) + 4} L${parseInt(width) / 2 + 4},${parseInt(height)}`)
    // .attr('d',"M0,0 L8,4 L0,8 L4,4 L0,0")
    .attr('fill','white')
    .attr('stroke','gray')
    .attr('stroke-width',"1px")
    .style("stroke-linecap", "round")

    let inDx = 0.5 * colWidth
    let outDx = 0.5 * colWidth
    drawIndex(g,[0,2 * colHeight],inIdx,0.5 * colWidth,colHeight,cellFontSize)
    drawTableForRow(g,m1,[inDx,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColor)
    drawPcentBar(g,[inDx,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    drawDashRect(g,[inDx,(m1.length + 1) * colHeight],colHeight,m1[0].length * colWidth)

    let plusUrl = require('../../images/plus.png')
    drawIcon(g,[inDx + (m1[0].length - 1) * colWidth / 2,(m1.length + 1.1) * colHeight],colWidth, 0.8 * colHeight,plusUrl)
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[inDx + (m1[0].length + 0.1) * colWidth,(1 + m2.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawIndex(g,[inDx + (m1[0].length + 1) * colWidth,2 * colHeight],outIdx,0.5 * colWidth,colHeight,cellFontSize)
    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth + inDx + outDx,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth + inDx + outDx,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])

    let yOfLine = (m2.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

export {create_row,create_row_insert}