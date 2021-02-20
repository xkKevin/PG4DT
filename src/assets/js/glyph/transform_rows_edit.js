import * as d3 from 'd3'
import {drawIcon} from "../utils/icon";
import {drawIndex} from "../utils/setIndex";
import {drawOperationName} from "../utils/operationName";
import {drawTableForRow} from "../utils/createTableForRow";

export function transform_rows_edit(m1,m2,rule,t1_name,t2_name,idx,name) {
    //输入：
    //input和output的矩阵
    //insertPos表示新行的位置，默认值为-1，表示在最后插入，0表示在首行，1表示在中间某行
    //在最后插入时，即insertPos为-1时，默认不显示行号
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.body.appendChild(svg);

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (m1[0].length + m2[0].length + 2)
    let colHeight = height / (m1.length + 5)
    let colFontSize = 1.5
    let cellFontSize = 1
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    let inputX = 0.5 * colWidth
    drawTableForRow(g,m1,[inputX,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.05) * colWidth + inputX,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth,colHeight,arrowUrl)
    let outputX = (m1[0].length + 1.5)* colWidth
    drawTableForRow(g,m2,[inputX + outputX,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize)
    drawIndex(g,[0,colHeight * 2],idx,colWidth / 2,colHeight,cellFontSize)
    drawIndex(g,[(m1[0].length + 1.2) * colWidth,colHeight * 2],idx,colWidth,colHeight,cellFontSize)

    drawOperationName(g,[width / 2, (m1.length + 2) * colHeight],rule,'1.2em',colFontSize)
}