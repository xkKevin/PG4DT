import * as d3 from "d3";
import {drawDashRect} from "../utils/common/dashedRect";
import {drawIcon} from "../utils/common/icon";
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForColumn} from "../utils/common/createTableForColumn";
import {fontSize, svgSize} from "../config/config";
import {drawTable} from "../utils/common/createTable";
import {drawHighLightCol} from "../utils/common/highLightCol";
import {drawLine} from "../utils/common/dashedLine";
import {drawPcentBar} from '../utils/common/pcentBar'

function delete_column(m1,m2,rule,t1_name,t2_name,outColors,name,showTableName,pos,xPercents,yPercents) {
    //输入：
    //input和output的矩阵
    //input矩阵中的哪些列进行sum操作
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', svgSize.width);
    svg.setAttribute('height', svgSize.height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.getElementById('glyphs').appendChild(svg)

    let width = svgSize.width
    let height = svgSize.height
    let colWidth =  width / (m1[0].length + m2[0].length + 2)
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
    // drawTable(g,m1,expOrImpCols,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,'col')
    drawTableForColumn(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[0,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    // 添加加号和箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    // drawTable(g,m2,expOrImpCols,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,'col')
    drawTableForColumn(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColors)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])

    drawDashRect(g,[(m1[0].length + m2[0].length + 1) * colWidth,colHeight],m1.length * colHeight,colWidth)

    let yOfLine = (m1.length + 2) * colHeight

    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

function delete_duplicate(m1,m2,oriExpOrImpCols,rule,t1_name,t2_name,name,showTableName,pos,xPercents,yPercents) {
    //输入：
    //
    //
    //oriExpOrImpCols中可能含有重复值，因为用indexOf找下标时，只会找到第一个
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth =  width / (2 * m1[0].length + 1)
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
    //找出每一个重复值的下标
    let duplicatedVal = m2[0][oriExpOrImpCols[0]]
    let expOrImpCols = []
    for(let col = 0; col < m1[0].length; col++){
        if(m1[0][col] == duplicatedVal)expOrImpCols.push(col)
    }
    drawTable(g,m1,expOrImpCols,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,'col')
    drawPcentBar(g,[0,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTable(g,m2,oriExpOrImpCols,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,'col')
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    
    drawDashRect(g,[(m1[0].length + 1) * colWidth,colHeight],m2.length * colHeight,m1[0].length * colWidth)

    let inColLenAndMid = drawHighLightCol(g,m1,expOrImpCols,[0,colHeight],colWidth,colHeight)
    let yOfLine = (m1.length + 2) * colHeight
    //画两个表之间的连线
    // let outColLenAndMid = drawHighLightCol(g,m2,oriExpOrImpCols,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight)
    // yOfLine = inColLenAndMid.len === 1 ? (m1.length + 2) * colHeight : (m1.length + 3) * colHeight
    // drawLine(g,[inColLenAndMid.midPoint,yOfLine],[outColLenAndMid.midPoint,yOfLine],true)
    // if(inColLenAndMid.len != 1){
    //     drawLine(g,[outColLenAndMid.midPoint,yOfLine],[outColLenAndMid.midPoint,yOfLine - colHeight],true)
    // }
    if(inColLenAndMid.len != 0){
        let outColLenAndMid = drawHighLightCol(g,m2,oriExpOrImpCols,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight)
        yOfLine = inColLenAndMid.len == 1 ? (m1.length + 2) * colHeight : (m1.length + 3) * colHeight
        drawLine(g,[inColLenAndMid.midPoint,yOfLine],[outColLenAndMid.midPoint,yOfLine],true)
        if(inColLenAndMid.len != 1){
            drawLine(g,[outColLenAndMid.midPoint,yOfLine],[outColLenAndMid.midPoint,yOfLine - colHeight],true)
        }
    }
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

function delete_dropna(m1,m2,rule,t1_name,t2_name,inColors,outColors,naPos,name,showTableName,pos,xPercents,yPercents) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth =  width / (m1[0].length + m2[0].length + 2)
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

    // drawTable(g,m1,expOrImpCols,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,'col')
    drawTableForColumn(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColors,naPos)
    drawPcentBar(g,[0,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    // 添加加号和箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    // drawTable(g,m1,[],[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,'col',-1,expOrImpCols[0])
    drawTableForColumn(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColors)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])

    drawDashRect(g,[(m1[0].length + 1) * colWidth,colHeight],m1.length * colHeight,(m2[0].length + 1) * colWidth)

    let yOfLine = (m1.length + 2) * colHeight

    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

export {delete_column,delete_dropna,delete_duplicate}