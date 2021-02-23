import * as d3 from 'd3'
import {drawIcon} from "../utils/common/icon"
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForColumn} from "../utils/common/createTableForColumn";
import {fontSize, svgSize} from "../config/config";
import {drawTableForFold} from "../utils/common/createFoldTable";

function transform_tables_rearrange(m1, m2, rule, t1_name, t2_name,inColor,outColor,name,showTableName) {
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
    document.getElementById('glyphs').appendChild(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight = height / (m1.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    drawTableForColumn(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColor)
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForColumn(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor)
    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

function transform_tables_sort(m1, m2, rule, t1_name, t2_name,name,showTableName) {
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
    document.getElementById('glyphs').appendChild(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight = height / (m1.length + 5)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    drawTableForColumn(g,m1,[0,colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    // 添加箭头
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForColumn(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize)
    let orderUrl = rule.indexOf("desc") === -1 ? require('../../images/asce.png') : require('../../images/desc.png')
    let sortedCol = 0
    for(let col = 0;col < m2[0].length;col++){
        if(m2[0][col] !== ''){
            sortedCol = col
            break
        }
    }
    drawIcon(g,[(m1[0].length + 1 + sortedCol + 0.6) * colWidth,1.4 * colHeight],0.5 * colWidth,0.5 * colHeight,orderUrl)
    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

function transform_tables_fold(m1,m2,rule,t1_name,t2_name,inExpLen,name,showTableName) {
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
    document.getElementById('glyphs').appendChild(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (m1[0].length + m2[0].length + 1)
    let colHeight = height / (m2.length + 7)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform', `translate(10,10)`)

    drawTableForFold(g, m1, [0, (m2.length - 1) / 2 * colHeight], colWidth, colHeight, t1_name, colFontSize, cellFontSize, inExpLen)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g, [(m1[0].length + 0.1) * colWidth, (1 + m1.length / 2) * colHeight + (m2.length - 3) / 2 * colHeight], 0.8 * colWidth, colHeight, arrowUrl)

    drawTableForColumn(g, m2, [(m1[0].length + 1) * colWidth, colHeight], colWidth, colHeight, t2_name, colFontSize, cellFontSize)

    let yOfLine = (m2.length + 2) * colHeight
    drawOperationName(g, [width / 2, yOfLine], rule, '1.2em', colFontSize)
}

function transform_tables_unfold(m1,m2,rule,t1_name,t2_name,inExpLen,name,showTableName){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
    }
    console.log("t1Name: ",t1_name)
    console.log("t2Name: ",t2_name)
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', `mainsvg${name}`);
    svg.setAttribute('width', svgSize.width);
    svg.setAttribute('height', svgSize.height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.getElementById('glyphs').appendChild(svg)

    let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    let height = d3.select(`#mainsvg${name}`).attr('height')
    let colWidth = width / (m1[0].length + m2[0].length + 1)
    let colHeight = height / (m1.length + 7)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize
    const g = d3.select(`#mainsvg${name}`).append('g')
        .attr('transform',`translate(10,10)`)

    drawTableForColumn(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth, (1 + m2.length / 2) * colHeight + (m1.length - 3) / 2 * colHeight],0.8 * colWidth, colHeight,arrowUrl)
    drawTableForFold(g,m2,[(m1[0].length + 1) * colWidth,(m1.length - 1) / 2 * colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,inExpLen)

    let yOfLine = (m1.length + 2) * colHeight
    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}


export {transform_tables_sort,transform_tables_rearrange,transform_tables_fold,transform_tables_unfold}