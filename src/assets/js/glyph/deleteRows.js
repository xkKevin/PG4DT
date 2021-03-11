import * as d3 from 'd3'
import {drawIcon} from "../utils/common/icon";
import {drawOperationName} from "../utils/common/operationName";
import {drawDashRect} from "../utils/common/dashedRect";
import {fontSize, svgSize} from "../config/config";
import {drawTableForRow} from "../utils/common/createTableForRow";
import {drawPcentBar} from "../utils/common/pcentBar"

function delete_row(m1,m2,rule,t1_name,t2_name,outColors,name,showTableName,pos,xPercents,yPercents) {
    //输入：
    //input和output的矩阵
    //insertPos表示新行的位置，默认值为-1，表示在最后插入，0表示在首行，1表示在中间某行
    //在最后插入时，即insertPos为-1时，默认不显示行号
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (m2[0].length * 2 + 2)
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

    drawTableForRow(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[0,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.05) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth,colHeight,arrowUrl)
    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColors)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    
    drawDashRect(g,[(m1[0].length + 1) * colWidth,colHeight],m1.length * colHeight,m1[0].length * colWidth)
    drawOperationName(g,[width / 2, (m1.length + 2) * colHeight],rule,'1.2em',colFontSize)
}


function delete_duplicate_row_fullColumn(m1, m2, rule, t1_name, t2_name,inColor,outColor,name,showTableName,pos,xPercents,yPercents) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (2 * m1[0].length + 1)
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
    drawTableForRow(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColor)
    drawPcentBar(g,[0,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    
    drawDashRect(g,[(m1[0].length + 1) * colWidth,colHeight],m1.length * colHeight,m1[0].length * colWidth)

    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

function delete_duplicate_row_partColumn(m1, m2, rule, t1_name, t2_name,inColors,outColors,name,showTableName,pos,xPercents,yPercents) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth =  width / (m1[0].length + m2[0].length + 1)
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
    
    drawTableForRow(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColors)
    drawPcentBar(g,[0,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColors)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    
    drawDashRect(g,[(m1[0].length + 1) * colWidth,colHeight],m1.length * colHeight,m2[0].length * colWidth)

    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

function delete_filter(m1, m2, rule, t1_name, t2_name,outColor,name,showTableName,pos,xPercents,yPercents) {
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
    drawTableForRow(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[0,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    
    drawDashRect(g,[(m1[0].length + 1) * colWidth,colHeight],m1.length * colHeight,m1[0].length * colWidth)

    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}
export {delete_row,delete_duplicate_row_fullColumn,delete_duplicate_row_partColumn,delete_filter}