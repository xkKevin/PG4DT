import * as d3 from 'd3'
import {drawIcon} from "../utils/common/icon";
import {drawIndex} from "../utils/common/setIndex";
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForRow} from "../utils/common/createTableForRow";
import {fontSize, svgSize} from "../config/config";
import {drawPcentBar} from "../utils/common/pcentBar"

export function transform_rows_edit(m1,m2,rule,t1_name,t2_name,idx,name,showTableName,pos,xPercents,yPercents) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (m1[0].length + m2[0].length + 2)
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

    let inputX = 0.5 * colWidth
    drawTableForRow(g,m1,[inputX,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawPcentBar(g,[inputX,colHeight],m1[0].length * colWidth,m1.length * colHeight,colHeight,xPercents[0],yPercents[0])

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.05) * colWidth + inputX,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth,colHeight,arrowUrl)
    let outputX = (m1[0].length + 1.5)* colWidth
    drawTableForRow(g,m2,[inputX + outputX,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize)
    drawPcentBar(g,[inputX + outputX,colHeight],m2[0].length * colWidth,m2.length * colHeight,colHeight,xPercents[1],yPercents[1])
    
    drawIndex(g,[0,colHeight * 2],idx,colWidth / 2,colHeight,cellFontSize)
    drawIndex(g,[(m1[0].length + 1.2) * colWidth,colHeight * 2],idx,colWidth,colHeight,cellFontSize)

    drawOperationName(g,[width / 2, (m1.length + 2) * colHeight],rule,'1.2em',colFontSize)
}