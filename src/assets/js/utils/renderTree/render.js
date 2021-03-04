import {nodeSize} from '@/assets/js/config/config'
function drawNode(g,specs,nodePos){
    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute('id', `mainsvg`);
    // svg.setAttribute('width', 2000);
    // svg.setAttribute('height', 900);
    // svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.getElementById("graphs").appendChild(svg)

    // let width = d3.select(`#mainsvg`).attr('width') - 20
    // let height = d3.select('#mainsvg').attr('height')
    // const g = d3.select('#mainsvg').append('g')
    //     .attr('transform',`translate(10,10)`)
    let nodeName = []
    for(let idx = 0;idx < specs.length;idx++){
        if(typeof(specs[idx].input_table_file) === "string"){
            nodeName.push(specs[idx].input_table_file)
        }else{
            specs[idx].input_table_file.forEach(element => {
                nodeName.push(element)
            })
        }

        if(typeof(specs[idx].output_table_file) === "string"){
            nodeName.push(specs[idx].output_table_file)
        }else{
            specs[idx].output_table_file.forEach(element => {
                nodeName.push(element)
            });
        }
    }

    nodeName = Array.from(new Set(nodeName))
    for(let idx = 0;idx < nodeName.length;idx++){
        g.append('rect')
        .attr('x',nodePos[nodeName[idx]][0])
        .attr('y',nodePos[nodeName[idx]][1])
        .attr('width',nodeSize.width)
        .attr('height',nodeSize.height)
        .attr('fill','red')

        g.append('text')
        .attr('x',nodePos[nodeName[idx]][0])
        .attr('y',nodePos[nodeName[idx]][1])
        // .attr('width',nodeSize.width)
        // .attr('height',nodeSize.width)
        .attr('dx',nodeSize.width / 2)
        .attr('dy',nodeSize.height * 0.8)
        .attr('text-anchor', 'middle')
        .attr('fill','balck')
        .attr('font-size',`1em`)
        .text(nodeName[idx].split('.')[0])

        // g.append('text')
        // .attr('x',pos[0] + col * colWidth)
        // .attr('y',pos[1] + row * colHeight)
        // .attr('dx',colWidth / 2)
        // .attr('dy',colHeight / 3 * 2)
        // .attr('text-anchor', 'middle')
        // .text(matrix[row][col].length > maxCharsPerCol ?
        //     matrix[row][col].slice(0,maxCharsPerCol) : matrix[row][col])
        // .attr('fill','white')
        // .attr('font-size',`${colFontSize}em`)
    }
}

function drawEdge(g,specs,nodePos){
    var defs = g.append("defs");
    var arrowMarker = defs.append("marker")
        .attr("id","arrow")
        .attr("markerUnits","strokeWidth")
        .attr("markerWidth","10")
        .attr("markerHeight","10")
        .attr("viewBox","0 0 10 10") 
        .attr("refX","8")
        .attr("refY","4")
        .attr("orient","auto");
    var arrow_path = "M0,0 L8,4 L0,8 L4,4 L0,0";
    arrowMarker.append("path")
        .attr("d",arrow_path)
        .attr("fill","#000");
    for(let idx = 0;idx < specs.length;idx++){
        if(typeof(specs[idx].input_table_file) === 'string'
         && typeof(specs[idx].output_table_file) === 'string'){
             g.append('line')
             .attr('x1',nodePos[specs[idx].input_table_file][0] + nodeSize.width)
             .attr('y1',nodePos[specs[idx].input_table_file][1] + nodeSize.height / 2)
             .attr('x2',nodePos[specs[idx].output_table_file][0])
             .attr('y2',nodePos[specs[idx].output_table_file][1] + nodeSize.height / 2)
             .attr('stroke','blue')
             .attr('stroke-width',1)
             .attr("marker-end","url(#arrow)")
         }else if(typeof(specs[idx].input_table_file) === 'string'){
            let meetingPosY = nodePos[specs[idx].input_table_file][1] + nodeSize.height / 2
            let meetingPosX = nodePos[specs[idx].input_table_file][0] + nodeSize.width
                + 0.8 * (Math.min(nodePos[specs[idx].output_table_file[0]][0], nodePos[specs[idx].output_table_file[1]][0]) - 
                nodePos[specs[idx].input_table_file][0] - nodeSize.width)

            g.append('line')
            .attr('x1',nodePos[specs[idx].input_table_file][0] + nodeSize.width)
            .attr('y1',nodePos[specs[idx].input_table_file][1] + nodeSize.height / 2)
            .attr('x2',meetingPosX)
            .attr('y2',meetingPosY)
            .attr('stroke','blue')
            .attr('stroke-width',1)

            g.append('line')
            .attr('x1',meetingPosX)
            .attr('y1',meetingPosY)
            .attr('x2',nodePos[specs[idx].output_table_file[0]][0])
            .attr('y2',nodePos[specs[idx].output_table_file[0]][1] + nodeSize.height / 2)
            .attr('stroke','blue')
            .attr('stroke-width',1)
            .attr("marker-end","url(#arrow)")

            g.append('line')
            .attr('x1',meetingPosX)
            .attr('y1',meetingPosY)
            .attr('x2',nodePos[specs[idx].output_table_file[1]][0])
            .attr('y2',nodePos[specs[idx].output_table_file[1]][1] + nodeSize.height / 2)
            .attr('stroke','blue')
            .attr('stroke-width',1)
            .attr("marker-end","url(#arrow)")
         }else{
            let meetingPosY = nodePos[specs[idx].output_table_file][1] + nodeSize.height / 2
            let meetingPosX = Math.max(nodePos[specs[idx].input_table_file[0]][0],nodePos[specs[idx].input_table_file[1]][0])
                + nodeSize.width + 0.2 * (nodePos[specs[idx].output_table_file][0] - nodeSize.width 
                - Math.max(nodePos[specs[idx].input_table_file[0]][0],nodePos[specs[idx].input_table_file[1]][0]))

            g.append('line')
            .attr('x1',nodePos[specs[idx].input_table_file[0]][0] + nodeSize.width)
            .attr('y1',nodePos[specs[idx].input_table_file[0]][1] + nodeSize.height / 2)
            .attr('x2',meetingPosX)
            .attr('y2',meetingPosY)
            .attr('stroke','blue')
            .attr('stroke-width',1)

            g.append('line')
            .attr('x1',nodePos[specs[idx].input_table_file[1]][0] + nodeSize.width)
            .attr('y1',nodePos[specs[idx].input_table_file[1]][1] + nodeSize.height / 2)
            .attr('x2',meetingPosX)
            .attr('y2',meetingPosY)
            .attr('stroke','blue')
            .attr('stroke-width',1)
            
            g.append('line')
            .attr('x1',meetingPosX)
            .attr('y1',meetingPosY)
            .attr('x2',nodePos[specs[idx].output_table_file][0])
            .attr('y2',nodePos[specs[idx].output_table_file][1] + nodeSize.height / 2)
            .attr('stroke','blue')
            .attr('stroke-width',1)
            .attr("marker-end","url(#arrow)")
         }
    }

}

export {drawNode,drawEdge}