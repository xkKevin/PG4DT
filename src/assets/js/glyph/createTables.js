import * as d3 from 'd3'
import {drawDashRect} from "../utils/common/dashedRect"
import {drawTableForCreateTable} from "../utils/common/createTableForCreateTable"
import {drawIcon} from "../utils/common/icon"
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForColumn} from "../utils/common/createTableForColumn";
import {fontSize, svgSize} from "../config/config";

export function create_table(matrix,rule,t1_name,name,showTableName,pos){
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

    drawDashRect(g,[0,colHeight],matrix.length * colHeight,matrix[0].length * colWidth)

    // 添加加号和箭头
    let plusUrl = require('../../images/plus.png')
    drawIcon(g,[0.1 * colWidth, 1.2 * colHeight],0.9 * matrix[0].length * colWidth,0.9 * matrix.length * colHeight,plusUrl)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(matrix[0].length + 0.1) * colWidth,(1 + matrix.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForCreateTable(g,matrix,[(matrix[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t1_name,colFontSize)

    let yOfLine = (matrix.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}
