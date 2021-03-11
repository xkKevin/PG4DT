import * as d3 from 'd3'
import {drawIcon} from "../utils/common/icon"
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForColumn} from "../utils/common/createTableForColumn";
import {fontSize, svgSize} from "../config/config";
import {drawTableForFold} from "../utils/common/createFoldTable";
import {drawTableForRow} from "../utils/common/createTableForRow";
import {drawPcentBar} from "../utils/common/pcentBar"

function transform_tables_rearrange(m1, m2, rule, t1_name, t2_name,inColor,outColor,name,showTableName,pos,xPercents,yPercents) {
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
    drawTableForColumn(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColor)
    drawPcentBar(g,[0,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForColumn(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    
    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

function transform_tables_sort(m1, m2, rule, t1_name, t2_name,outColor,name,showTableName,pos,xPercents,yPercents) {
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

    drawTableForRow(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[0,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    let orderUrl = rule.indexOf("desc") === -1 ? require('../../images/asce.png') : require('../../images/desc.png')
    let sortedCol = 0
    for(let col = 0;col < m2[0].length;col++){
        if(m2[0][col] !== ''){
            sortedCol = col
            break
        }
    }
    drawIcon(g,[(m1[0].length + 1 + sortedCol + 0.6) * colWidth,1.4 * colHeight],0.6 * colWidth,0.6 * colHeight,orderUrl)
    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

function transform_tables_fold(m1,m2,rule,t1_name,t2_name,inExpLen,name,showTableName,pos,xPercents,yPercents) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }
    
    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (m1[0].length + m2[0].length + 1)
    let colHeight = height / (m2.length + 3)
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
    drawTableForFold(g, m1, [0, (m2.length - 1) / 2 * colHeight], colWidth, colHeight, t1_name, colFontSize, cellFontSize, inExpLen)
    drawPcentBar(g,[0, (m2.length - 1) / 2 * colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])
    
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g, [(m1[0].length + 0.1) * colWidth, (1 + m1.length / 2) * colHeight + (m2.length - 3) / 2 * colHeight], 0.8 * colWidth, colHeight, arrowUrl)

    let tempColor = inExpLen > 2 ? [0,1] : []
    drawTableForColumn(g, m2, [(m1[0].length + 1) * colWidth, colHeight], colWidth, colHeight, t2_name, colFontSize, cellFontSize,tempColor)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth, colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    
    let yOfLine = (m2.length + 2) * colHeight
    drawOperationName(g, [width / 2, yOfLine], rule, '1.2em', colFontSize)
}

function transform_tables_unfold(m1,m2,rule,t1_name,t2_name,inExpLen,name,showTableName,pos,xPercents,yPercents){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (m1[0].length + m2[0].length + 1)
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
    drawTableForColumn(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[0, colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth, (1 + m2.length / 2) * colHeight + (m1.length - 3) / 2 * colHeight],0.8 * colWidth, colHeight,arrowUrl)
    drawTableForFold(g,m2,[(m1[0].length + 1) * colWidth,(m1.length - 1) / 2 * colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,inExpLen)
    drawPcentBar(g,[(m1[0].length + 1) * colWidth,(m1.length - 1) / 2 * colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])

    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}


export {transform_tables_sort,transform_tables_rearrange,transform_tables_fold,transform_tables_unfold}