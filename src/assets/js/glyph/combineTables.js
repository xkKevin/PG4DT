import * as d3 from 'd3'
import {drawIcon} from "../utils/common/icon"
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForRow} from "../utils/common/createTableForRow";
import {fontSize, svgSize} from "../config/config";
import {drawPcentBar} from '../utils/common/pcentBar'

function combine_tables_extend(m1,m2,m3,rule,t1_name,t2_name,t3_name, inColors1,inColors2,outColors,name,showTableName,pos,xPercents,yPercents){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
        t3_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (Math.max(m1[0].length,m2[0].length) + m3[0].length + 1)
    let colHeight =  height / (m1.length + m2.length + 4)
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
    drawTableForRow(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColors1)
    drawPcentBar(g,[0, colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    drawTableForRow(g,m2,[0, 2.5 * colHeight + m1.length * colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,inColors2)
    drawPcentBar(g,[0, 2.5 * colHeight + m1.length * colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
   
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + colHeight * 3],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m3,[(m1[0].length + 1) * colWidth,4 * colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColors)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,4 * colHeight],m3[0].length * colWidth,m3.length * colHeight,colHeight,xPercents[2],yPercents[2])

    let yOfLine = (m1.length + m2.length + 3) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

function combine_tables_full_join(m1,m2,m3,rule,t1_name,t2_name,t3_name,naCol,naRow,inColors1,inColors2,outColors,name,showTableName,pos,xPercents,yPercents){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
        t3_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (Math.max(m1[0].length,m2[0].length) + m3[0].length + 1)
    let colHeight =  height / (m1.length + m2.length + 4)
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

    drawTableForRow(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColors1)
    drawPcentBar(g,[0, colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    drawTableForRow(g,m2,[0, 2.5 * colHeight + m1.length * colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,inColors2)
    drawPcentBar(g,[0, 2.5 * colHeight + m1.length * colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(Math.max(m1[0].length,m2[0].length) + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + colHeight * 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m3,[(Math.max(m1[0].length,m2[0].length) + 1) * colWidth,3 * colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColors,naRow,naCol)
    drawPcentBar(g,[(Math.max(m1[0].length,m2[0].length) + 1) * colWidth,3 * colHeight],m3[0].length * colWidth,m3.length * colHeight,colHeight,xPercents[2],yPercents[2])

    let yOfLine = (m1.length + m2.length + 3) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

function combine_tables_inner_join(m1,m2,m3,rule,t1_name,t2_name,t3_name,inColors2,outColor,name,showTableName,pos,xPercents,yPercents){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
        t3_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (Math.max(m1[0].length,m2[0].length) + m3[0].length + 1)
    let colHeight =  height / (m1.length + m2.length + 4)
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
    drawTableForRow(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[0, colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    drawTableForRow(g,m2,[0, 2.5 * colHeight + m1.length * colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,inColors2)
    drawPcentBar(g,[0, 2.5 * colHeight + m1.length * colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(Math.max(m1[0].length,m2[0].length) + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + colHeight * 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m3,[(Math.max(m1[0].length,m2[0].length) + 1) * colWidth,4 * colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColor)
    drawPcentBar(g,[(Math.max(m1[0].length,m2[0].length) + 1) * colWidth,4 * colHeight],m3[0].length * colWidth,m3.length * colHeight,colHeight,xPercents[2],yPercents[2])

    let yOfLine = (m1.length + m2.length + 3) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

function combine_tables_left_join(m1,m2,m3,rule,t1_name,t2_name,t3_name,naCol,naRow,inColors1,inColors2,outColors,name,showTableName,pos,xPercents,yPercents){

    if(!showTableName){
        t1_name = ''
        t2_name = ''
        t3_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (Math.max(m1[0].length,m2[0].length) + m3[0].length + 1)
    let colHeight = height / (m1.length + m2.length + 4)
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

    drawTableForRow(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColors1)
    drawPcentBar(g,[0, colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    drawTableForRow(g,m2,[0, 2.5 * colHeight + m1.length * colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,inColors2)
    drawPcentBar(g,[0, 2.5 * colHeight + m1.length * colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(Math.max(m1[0].length,m2[0].length) + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + colHeight * 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m3,[(Math.max(m1[0].length,m2[0].length) + 1) * colWidth,3 * colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColors,naRow,naCol)
    drawPcentBar(g,[(Math.max(m1[0].length,m2[0].length) + 1) * colWidth,3 * colHeight],m3[0].length * colWidth,m3.length * colHeight,colHeight,xPercents[2],yPercents[2])
    
    let yOfLine = (m1.length + m2.length + 3) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

export {combine_tables_inner_join,combine_tables_full_join,combine_tables_left_join,combine_tables_extend}