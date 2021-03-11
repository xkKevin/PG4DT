import * as d3 from 'd3'
import {drawDashRect} from "../utils/common/dashedRect"
import {drawIcon} from "../utils/common/icon"
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForColumn} from "../utils/common/createTableForColumn";
import {fontSize, svgSize} from "../config/config";
import {drawPcentBar} from '../utils/common/pcentBar'

export function create_table(matrix,rule,t1_name,name,showTableName,pos,xPercent,yPercent){
    if(!showTableName){
        t1_name = ''
    }
    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (matrix[0].length * 2 + 1)
    let colHeight = height / (matrix.length + 3)
    let colFontSize = fontSize.colFontSize
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
    // .attr('opacity','0.5')

    drawDashRect(g,[0,colHeight],matrix.length * colHeight,matrix[0].length * colWidth,"white")
    
    // 添加加号和箭头
    let plusUrl = require('../../images/plus.png')
    drawIcon(g,[0.1 * colWidth, 1.2 * colHeight],0.9 * matrix[0].length * colWidth,0.9 * matrix.length * colHeight,plusUrl)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(matrix[0].length + 0.1) * colWidth,(1 + matrix.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    // drawTableForCreateTable(g,matrix,[(matrix[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t1_name,colFontSize)
    drawTableForColumn(g,matrix,[(matrix[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t1_name,colFontSize)
    drawPcentBar(g,[(matrix[0].length + 1) * colWidth,colHeight],matrix[0].length * colWidth,matrix.length * colHeight,colHeight,xPercent,yPercent)
    let yOfLine = (matrix.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}
