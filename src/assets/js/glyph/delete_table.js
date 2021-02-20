import * as d3 from "d3";
import {drawTable} from "../utils/createTable";
import {drawDashRect} from "../utils/dashedRect";
import {drawIcon} from "../utils/icon";
import {drawOperationName} from "../utils/operationName";

export function delete_table(matrix,rule,t1_name) {
    //输入：
    //input和output的矩阵
    //input矩阵中的哪些列进行sum操作
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', 'mainsvg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.body.appendChild(svg);

    let width = d3.select('#mainsvg').attr('width') - 20
    let height = d3.select('#mainsvg').attr('height')
    let colWidth = width / (2 * matrix[0].length + 1)
    let colHeight = height / (matrix.length + 5)
    let colFontSize = 1.5
    let cellFontSize = 1
    const g = d3.select('#mainsvg').append('g')
        .attr('transform',`translate(10,10)`)

    drawTable(g,matrix,[],[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,'col')
    // 添加加号和箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(matrix[0].length + 0.1) * colWidth,(1 + matrix.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawDashRect(g,[(matrix[0].length + 1) * colWidth,colHeight],matrix.length * colHeight,matrix[0].length * colWidth)

    let yOfLine = (matrix.length + 2) * colHeight

    drawOperationName(g,[width / 2,yOfLine],`Mutate:'${rule}'`,'1.2em',colFontSize)
}