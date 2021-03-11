import * as d3 from "d3";
import {drawTable} from "../utils/common/createTable";
import {drawDashRect} from "../utils/common/dashedRect";
import {drawIcon} from "../utils/common/icon";
import {drawOperationName} from "../utils/common/operationName";
import {fontSize, svgSize} from "../config/config";
import {drawPcentBar} from "../utils/common/pcentBar"

export function delete_table(matrix,rule,t1_name,name,showTableName,pos,xPercents,yPercents) {
    //输入：
    //input和output的矩阵
    //input矩阵中的哪些列进行sum操作
    if(!showTableName){
        t1_name = ''
    }

    let width = svgSize.width
    let height = svgSize.height
    let colWidth =  width / (2 * matrix[0].length + 1)
    let colHeight = height / (matrix.length + 3)
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

    drawTable(g,matrix,[],[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,'col')
    drawPcentBar(g,[0,colHeight],matrix[0].length * colWidth,matrix.length * colHeight,colHeight,xPercents[0],yPercents[0])
    // 添加加号和箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(matrix[0].length + 0.1) * colWidth,(1 + matrix.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawDashRect(g,[(matrix[0].length + 1) * colWidth,colHeight],matrix.length * colHeight,matrix[0].length * colWidth)

    let yOfLine = (matrix.length + 2) * colHeight

    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}