import * as d3 from "d3";
import {drawTable} from "../utils/createTable";
import {drawDashRect} from "../utils/dashedRect";
import {drawIcon} from "../utils/icon";
import {drawOperationName} from "../utils/operationName";
import {drawTableForColumn} from "../utils/createTableForColumn";

export function delete_dropna(m1,m2,rule,t1_name,t2_name,inColors,outColors,naPos,name) {
    //输入：
    //input和output的矩阵
    //input矩阵中的哪些列进行sum操作
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('style', 'border: 1px solid black');
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

    // drawTable(g,m1,expOrImpCols,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,'col')
    drawTableForColumn(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColors,naPos)
    // 添加加号和箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    // drawTable(g,m1,[],[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,'col',-1,expOrImpCols[0])
    drawTableForColumn(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColors)
    drawDashRect(g,[(m1[0].length + 1) * colWidth,colHeight],m1.length * colHeight,(m2[0].length + 1) * colWidth)

    let yOfLine = (m1.length + 2) * colHeight

    drawOperationName(g,[width / 2,yOfLine],`Mutate:'${rule}'`,'1.2em',colFontSize)
}