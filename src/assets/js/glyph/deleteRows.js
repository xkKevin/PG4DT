import * as d3 from 'd3'
import {drawTable} from "../utils/common/createTable";
import {drawIcon} from "../utils/common/icon";
import {drawIndex} from "../utils/common/setIndex";
import {drawOperationName} from "../utils/common/operationName";
import {drawDashRect} from "../utils/common/dashedRect";
import {fontSize, svgSize} from "../config/config";
import {drawTableForRow} from "../utils/common/createTableForRow";

function delete_row(m1,m2,rule,t1_name,t2_name,deletePos = -1,keepPos = -1,inIds,outIds,name,showTableName) {
    //输入：
    //input和output的矩阵
    //insertPos表示新行的位置，默认值为-1，表示在最后插入，0表示在首行，1表示在中间某行
    //在最后插入时，即insertPos为-1时，默认不显示行号
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', svgSize.width);
    svg.setAttribute('height', svgSize.height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.body.appendChild(svg);
    document.getElementById('glyphs').appendChild(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth =  width / (m2[0].length * 2 + 2)
    let colHeight = height / (m1.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    let inputX = 0.5 * colWidth
    drawTable(g,m1,[],[inputX,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,'row',deletePos)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.05) * colWidth + inputX,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth,colHeight,arrowUrl)
    let outputX = (m1[0].length + 1.5)* colWidth
    drawTable(g,m2,[],[inputX + outputX,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,'row',-1,-1,keepPos)
    drawDashRect(g,[inputX + outputX,colHeight],m1.length * colHeight,m1[0].length * colWidth)
    drawIndex(g,[0,colHeight * 2],inIds,colWidth / 2,colHeight,cellFontSize)
    drawIndex(g,[(m1[0].length + 1.2) * colWidth,colHeight * 2],outIds,colWidth,colHeight,cellFontSize)

    drawOperationName(g,[width / 2, (m1.length + 2) * colHeight],rule,'1.2em',colFontSize)
}


function delete_duplicate_row_fullColumn(m1, m2, rule, t1_name, t2_name,inColor,outColor,name,showTableName) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
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
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight = height / (m1.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)


    drawTableForRow(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColor)
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor)
    drawDashRect(g,[(m1[0].length + 1) * colWidth,colHeight],m1.length * colHeight,m1[0].length * colWidth)

    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

function delete_duplicate_row_partColumn(m1, m2, rule, t1_name, t2_name,outColors,name,showTableName) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', svgSize.width);
    svg.setAttribute('height', svgSize.height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.getElementById('glyphs').appendChild(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight = height / (m1.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    drawTableForRow(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColors)
    drawDashRect(g,[(m1[0].length + 1) * colWidth,colHeight],m1.length * colHeight,m1[0].length * colWidth)

    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

function delete_filter(m1, m2, rule, t1_name, t2_name,outColor,name,showTableName) {
    if(!showTableName){
        t1_name = ''
        t2_name = ''
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
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight = height / (m1.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)
    
    drawTableForRow(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor)
    drawDashRect(g,[(m1[0].length + 1) * colWidth,colHeight],m1.length * colHeight,m1[0].length * colWidth)

    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}
export {delete_row,delete_duplicate_row_fullColumn,delete_duplicate_row_partColumn,delete_filter}