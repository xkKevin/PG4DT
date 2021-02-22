import * as d3 from "d3";
import {drawTable} from "../utils/common/createTable";
import {drawDashRect} from "../utils/common/dashedRect";
import {drawIcon} from "../utils/common/icon";
import {drawOperationName} from "../utils/common/operationName";
import {fontSize, svgSize} from "../config/config";

export function delete_table(matrix,rule,t1_name,name,showTableName) {
    //输入：
    //input和output的矩阵
    //input矩阵中的哪些列进行sum操作
    if(!showTableName){
        t1_name = ''
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', svgSize.width);
    svg.setAttribute('height', svgSize.height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.getElementById('glyphs').append(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (2 * matrix[0].length + 1)
    let colHeight = height / (matrix.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    drawTable(g,matrix,[],[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,'col')
    // 添加加号和箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(matrix[0].length + 0.1) * colWidth,(1 + matrix.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawDashRect(g,[(matrix[0].length + 1) * colWidth,colHeight],matrix.length * colHeight,matrix[0].length * colWidth)

    let yOfLine = (matrix.length + 2) * colHeight

    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}