import * as d3 from 'd3'
import {drawEdge} from './render'
function drawSvgAndEdge(specs,nodePos,svgWidth,svgHeight){
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('id', `mainsvg`);
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    
    d3.select("#mainsvg").style("transform-origin","0 0 1")

    document.getElementById("glyphs").appendChild(svg)

    // d3.select("#mainsvg").style("transform-origin","50% 50% 0")
    var zoom = d3.zoom()//缩放配置
        .scaleExtent([0.5, 5])//缩放比例
        .translateExtent([[0,0],[1750,650]])
        .on("zoom", zoomFn);

    function zoomFn(event) {//缩放函数
        var t = event.transform
        // console.log(t)
        // t.x = t.x < 0 ? 0 :
        //     t.x > 1750 ? 1750 : t.x
        // t.y = t.y < 0 ? 0 :
        //     t.y > 650 ? 650 : t.y
        console.log(t)
        d3.select("#mainsvg").style("transform", `translate(${t.x}px,${t.y}px)scale(${t.k})`);
    }
   
    // d3.select('#mainsvg').call(zoom);
    const g = d3.select('#mainsvg').append('g')
    drawEdge(g,specs,nodePos)

    return g
}

// function zoom(svg){
//     svg.call(d3.zoom()
//         .scaleExtent([1, 10])
//         .on("zoom", zoomed)
//     )  
//     function zoomed(event) {
//         svg.attr("transform", 
//             `scale(${1})`);
//     }
// }

export {drawSvgAndEdge}