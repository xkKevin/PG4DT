import * as d3 from 'd3'
import {drawIcon} from "../utils/common/icon"
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForRow} from "../utils/common/createTableForRow";
import {fontSize, svgSize} from "../config/config";
import {drawTableForColumn} from "../utils/common/createTableForColumn";
import {drawPcentBar} from "../utils/common/pcentBar"

function separate_tables_subset(m1,m2,m3,rule,t1_name,t2_name,t3_name,outColor1,outColor2,name,showTableName,pos,xPercents,yPercents){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
        t3_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (2 * m1[0].length + 1)
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

    drawTableForRow(g,m1,[0,2 * colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[0,2 * colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight + colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor1)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    drawTableForRow(g,m3,[(m1[0].length + 1) * colWidth,2.5* colHeight + m2.length * colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColor2)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,2.5* colHeight + m2.length * colHeight],m3[0].length * colWidth,m3.length * colHeight,colHeight,xPercents[2],yPercents[2])

    let yOfLine = (m1.length + 4) * colHeight

    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

function separate_tables_decompose(m1,m2s,rule,t1_name,name,showTableName,pos,xPercents,yPercents){
    if(!showTableName){
        t1_name = ''
    }
    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight =  height / (m1.length + m2s.length + 4)
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
    drawTableForRow(g,m1,[0, colHeight + (m2s.length - 1) / 2 * colHeight * 2],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[0, colHeight + (m2s.length - 1) / 2 * colHeight * 2],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + (m2s.length - 1) / 2 * colHeight * 2],0.8 * colWidth, colHeight,arrowUrl)

    for(let idx = 0;idx < m2s.length;idx++){
        drawTableForRow(g,m2s[idx],[(m1[0].length + 1) * colWidth,colHeight + 3 * idx * colHeight],colWidth,colHeight,'',colFontSize,cellFontSize,[idx])
        drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight + 3 * idx * colHeight],m2s[idx][0].length * colWidth,m2s[idx].length * colHeight,colHeight,xPercents[idx + 1],yPercents[idx + 1])
    }

    let yOfLine = (m1.length + 2 + m2s.length) * colHeight

    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

function separate_tables_split(m1,m2,m3,rule,t1_name,t2_name,t3_name,outColors1,outColors2,name,showTableName,pos,xPercents,yPercents){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
        t3_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (m1[0].length + m2[0].length + m3[0].length + 1.5)
    let colHeight =  height / (m1.length + 3)
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

    drawTableForColumn(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[0, colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForColumn(g,m2,[m1[0].length * colWidth + colWidth, colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColors1)
    drawPcentBar(g,[m1[0].length * colWidth + colWidth, colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    drawTableForColumn(g,m3,[(m1[0].length + m2[0].length + 1.5) * colWidth, colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColors2)
    drawPcentBar(g,[(m1[0].length + m2[0].length + 1.5) * colWidth, colHeight],m3[0].length * colWidth,m3.length * colHeight,colHeight,xPercents[2],yPercents[2])

    let yOfLine = (m1.length + 2) * colHeight

    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

export {separate_tables_split,separate_tables_decompose,separate_tables_subset}