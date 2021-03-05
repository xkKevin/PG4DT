import * as d3 from 'd3'
import {drawIcon} from "../utils/common/icon"
import {drawOperationName} from "../utils/common/operationName";
import {drawTableForRow} from "../utils/common/createTableForRow";
import {fontSize, svgSize} from "../config/config";

function combine_tables_extend(m1,m2,m3,rule,t1_name,t2_name,t3_name,outColors,name,showTableName,pos){
    if(!showTableName){
        t1_name = ''
        t2_name = ''
        t3_name = ''
    }
    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('id', `mainsvg${name}`);
    // svg.setAttribute('width', svgSize.width);
    // svg.setAttribute('height', svgSize.height);
    // svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.getElementById('glyphs').appendChild(svg)

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

    drawTableForRow(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawTableForRow(g,m2,[0, 2.5 * colHeight + m1.length * colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,outColors)

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(m1[0].length + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + colHeight * 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m3,[(m1[0].length + 1) * colWidth,2 * colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize)


    let yOfLine = (m1.length + m2.length + 3) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

function combine_tables_full_join(m1,m2,m3,rule,t1_name,t2_name,t3_name,naCol,naRow,inColors1,inColors2,outColors,name,showTableName,pos){
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
    // document.getElementById('glyphs').appendChild(svg)

    // let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    // let height = d3.select(`#mainsvg${name}`).attr('height')
    // let colWidth = width / (Math.max(m1[0].length,m2[0].length) + m3[0].length + 1)
    // let colHeight = height / (m1.length + 8)
    // let colFontSize = fontSize.colFontSize
    // let cellFontSize = fontSize.cellFontSize
    // const g = d3.select(`#mainsvg${name}`).append('g')
    //     .attr('transform',`translate(10,10)`)

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (Math.max(m1[0].length,m2[0].length) + m3[0].length + 1)
    let colHeight =  height / (m1.length + m2.length + 4)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize

    const g = d3.select(`#mainsvg`).append('g')
        .attr('transform',`translate(${pos[0]},${pos[1]})`)
        .attr("id",`glyph${name}`)

    drawTableForRow(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColors1)
    drawTableForRow(g,m2,[0, 2.5 * colHeight + m1.length * colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,inColors2)

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(Math.max(m1[0].length,m2[0].length) + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + colHeight * 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m3,[(Math.max(m1[0].length,m2[0].length) + 1) * colWidth,3 * colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColors,naRow,naCol)

    let yOfLine = (m1.length + m2.length + 3) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

function combine_tables_inner_join(m1,m2,m3,rule,t1_name,t2_name,t3_name,inColors2,outColor,name,showTableName,pos){
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
    // document.getElementById('glyphs').appendChild(svg)

    // let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    // let height = d3.select(`#mainsvg${name}`).attr('height')
    // let colWidth = width / (Math.max(m1[0].length,m2[0].length) + m3[0].length + 1)
    // let colHeight = height / (m1.length + 8)
    // let colFontSize = fontSize.colFontSize
    // let cellFontSize = fontSize.cellFontSize
    // const g = d3.select(`#mainsvg${name}`).append('g')
    //     .attr('transform',`translate(10,10)`)

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (Math.max(m1[0].length,m2[0].length) + m3[0].length + 1)
    let colHeight =  height / (m1.length + m2.length + 4)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize

    const g = d3.select(`#mainsvg`).append('g')
        .attr('transform',`translate(${pos[0]},${pos[1]})`)
        .attr("id",`glyph${name}`)

    drawTableForRow(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize)
    drawTableForRow(g,m2,[0, 2.5 * colHeight + m1.length * colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,inColors2)

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(Math.max(m1[0].length,m2[0].length) + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + colHeight * 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m3,[(Math.max(m1[0].length,m2[0].length) + 1) * colWidth,4 * colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColor)

    let yOfLine = (m1.length + m2.length + 3) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

function combine_tables_left_join(m1,m2,m3,rule,t1_name,t2_name,t3_name,naCol,naRow,inColors1,inColors2,outColors,name,showTableName,pos){

    if(!showTableName){
        t1_name = ''
        t2_name = ''
        t3_name = ''
    }
    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // // svg.setAttribute('style', 'border: 1px solid black');
    // svg.setAttribute('id', `mainsvg${name}`);
    // // svg.setAttribute('width', svgSize.width);
    // // svg.setAttribute('height', svgSize.height);
    // svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // svg.setAttribute('viewBox',[pos[0],pos[1],svgSize.width,svgSize.height])
    // document.getElementById('glyphs').appendChild(svg)

    // let width = d3.select(`#mainsvg${name}`).attr('width') - 20
    // let height = d3.select(`#mainsvg${name}`).attr('height')
    // let colWidth = width / (Math.max(m1[0].length,m2[0].length) + m3[0].length + 1)
    // let colHeight = height / (m1.length + 8)
    // let colFontSize = fontSize.colFontSize
    // let cellFontSize = fontSize.cellFontSize
    // const g = d3.select(`#mainsvg${name}`).append('g')
    // .attr('transform',`translate(10,10)`)

    let width = svgSize.width
    let height = svgSize.height
    let colWidth = width / (Math.max(m1[0].length,m2[0].length) + m3[0].length + 1)
    let colHeight = height / (m1.length + m2.length + 4)
    let colFontSize = fontSize.colFontSize
    let cellFontSize = fontSize.cellFontSize

    const g = d3.select(`#mainsvg`).append('g')
        .attr('transform',`translate(${pos[0]},${pos[1]})`)
        .attr("id",`glyph${name}`)

    drawTableForRow(g,m1,[0, colHeight],colWidth,colHeight,t1_name,colFontSize,cellFontSize,inColors1)
    drawTableForRow(g,m2,[0, 2.5 * colHeight + m1.length * colHeight],colWidth,colHeight,t2_name,colFontSize,cellFontSize,inColors2)

    let arrowUrl = require('../../images/arrow.png')
    drawIcon(g,[(Math.max(m1[0].length,m2[0].length) + 0.1) * colWidth,(1 + m1.length / 2) * colHeight - colHeight / 2 + colHeight * 2],0.8 * colWidth, colHeight,arrowUrl)

    drawTableForRow(g,m3,[(Math.max(m1[0].length,m2[0].length) + 1) * colWidth,3 * colHeight],colWidth,colHeight,t3_name,colFontSize,cellFontSize,outColors,naRow,naCol)

    let yOfLine = (m1.length + m2.length + 3) * colHeight
    drawOperationName(g,[width / 2,yOfLine],`${rule}`,'1.2em',colFontSize)
}

export {combine_tables_inner_join,combine_tables_full_join,combine_tables_left_join,combine_tables_extend}