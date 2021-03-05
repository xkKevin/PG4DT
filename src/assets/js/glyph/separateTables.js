import * as d3 from 'd3'
import {drawIcon} from "../utils/common/icon"
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForRow} from "../utils/common/createTableForRow";
import {fontSize, svgSize} from "../config/config";
import {drawTableForColumn} from "../utils/common/createTableForColumn";

function separate_tables_subset(m1,m2,m3,rule,t1_name,t2_name,t3_name,outColor1,outColor2,name,showTableName,pos){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
        t3_name = ''
    }
    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // // svg.setAttribute('style', 'border: 1px solid black');
    // svg.setAttribute('id', `mainsvg${name}`);
    // svg.setAttribute('width', svgSize.width);
    // svg.setAttribute('height', svgSize.height);
    // svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.getElementById('glyphs').append(svg)

    // let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    // let height = d3.select(`#mainsvg${name}`).attr('height')
    // let colWidth = width / (2 * m1[0].length + 1)
    // let colHeight = height / (m1.length + 7)
    // let colFontSize = fontSize.colFontSize
    // let cellFontSize = fontSize.cellFontSize
    // const g = d3.select(`#mainsvg${name}`).append('g')
    //     .attr('transform',`translate(10,10)`)

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight =  height / (m1.length + m2.length + 4)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize

    const g = d3.select(`#mainsvg`).append('g')
        .attr('transform',`translate(${pos[0]},${pos[1]})`)
        .attr("id",`glyph${name}`)


    drawTableForRow(g,m1,[0,2 * colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight + colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m2,[(m1[0].length + 1) * colWidth,colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColor1)
    drawTableForRow(g,m3,[(m1[0].length + 1) * colWidth,2.5* colHeight + m2.length * colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColor2)

    let yOfLine = (m1.length + 4) * colHeight

    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

function separate_tables_decompose(m1,m2s,rule,t1_name,name,showTableName,pos){
    if(!showTableName){
        t1_name = ''
    }
    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // // svg.setAttribute('style', 'border: 1px solid black');
    // svg.setAttribute('id', `mainsvg${name}`);
    // svg.setAttribute('width', svgSize.width);
    // svg.setAttribute('height', svgSize.height);
    // svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.getElementById('glyphs').append(svg)

    // let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    // let height = d3.select(`#mainsvg${name}`).attr('height')
    // let colWidth = width / (2 * m1[0].length + 1)
    // let colHeight = height / (m1.length + m2s.length + 5)
    // let colFontSize = fontSize.colFontSize
    // let cellFontSize = fontSize.cellFontSize
    // const g = d3.select(`#mainsvg${name}`).append('g')
    //     .attr('transform',`translate(10,10)`)

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (2 * m1[0].length + 1)
    let colHeight =  height / (m1.length + m2s.length + 4)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize

    const g = d3.select(`#mainsvg`).append('g')
        .attr('transform',`translate(${pos[0]},${pos[1]})`)
        .attr("id",`glyph${name}`)

    drawTableForRow(g,m1,[0, colHeight + (m2s.length - 1) / 2 * colHeight * 2],colWidth,colHeight,t1_name,colFontSize,cellFontSize)

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + (m2s.length - 1) / 2 * colHeight * 2],0.8 * colWidth, colHeight,arrowUrl)

    for(let idx = 0;idx < m2s.length;idx++){
        drawTableForRow(g,m2s[idx],[(m1[0].length + 1) * colWidth,colHeight + 3 * idx * colHeight],colWidth,colHeight,'',colFontSize,cellFontSize,[idx])
    }

    let yOfLine = (m1.length + 2 + m2s.length) * colHeight

    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

function separate_tables_split(m1,m2,m3,rule,t1_name,t2_name,t3_name,outColors1,outColors2,name,showTableName,pos){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
        t3_name = ''
    }
    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // // svg.setAttribute('style', 'border: 1px solid black');
    // svg.setAttribute('id', `mainsvg${name}`);
    // svg.setAttribute('width', svgSize.width);
    // svg.setAttribute('height', svgSize.height);
    // svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.getElementById('glyphs').append(svg)

    // let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    // let height = d3.select(`#mainsvg${name}`).attr('height')
    // let colWidth = width / (m1[0].length + m2[0].length + m3[0].length + 1.5)
    // let colHeight = height / (m1.length + 5)
    // let colFontSize = fontSize.colFontSize
    // let cellFontSize = fontSize.cellFontSize
    // const g = d3.select(`#mainsvg${name}`).append('g')
    //     .attr('transform',`translate(10,10)`)

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (m1[0].length + m2[0].length + m3[0].length + 1.5)
    let colHeight =  height / (m1.length + 3)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize

    const g = d3.select(`#mainsvg`).append('g')
        .attr('transform',`translate(${pos[0]},${pos[1]})`)
        .attr("id",`glyph${name}`)

    drawTableForColumn(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForColumn(g,m2,[m1[0].length * colWidth + colWidth, colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColors1)
    drawTableForColumn(g,m3,[(m1[0].length + m2[0].length + 1.5) * colWidth, colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColors2)

    let yOfLine = (m1.length + 2) * colHeight

    drawOperationName(g,[width / 2,yOfLine],rule,'1.2em',colFontSize)
}

export {separate_tables_split,separate_tables_decompose,separate_tables_subset}