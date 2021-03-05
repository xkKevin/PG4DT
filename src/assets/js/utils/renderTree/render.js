import {nodeSize} from '@/assets/js/config/config'
function drawNode(g,specs,nodePos,specsInf){
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
        .attr('opacity',0.6)

        if(nodeName[idx][0] !== '*' && nodeName[idx][0] !== '#'){
            g.append('text')
            .attr('x',nodePos[nodeName[idx]][0])
            .attr('y',nodePos[nodeName[idx]][1])
            .attr('dx',nodeSize.width / 2)
            .attr('dy',nodeSize.height / 7 * 2)
            .attr('text-anchor', 'middle')
            .attr('fill','balck')
            .attr('font-size',`0.8em`)
            .text(`L${parseInt(nodeName[idx].replace(/[^0-9]/ig,""),10)}`)

            g.append('text')
            .attr('x',nodePos[nodeName[idx]][0])
            .attr('y',nodePos[nodeName[idx]][1])
            .attr('dx',nodeSize.width / 2)
            .attr('dy',nodeSize.height / 7 * 4)
            .attr('text-anchor', 'middle')
            .attr('fill','balck')
            .attr('font-size',`0.8em`)
            .text(`${specsInf[nodeName[idx]][0]}`)

            g.append('text')
            .attr('x',nodePos[nodeName[idx]][0])
            .attr('y',nodePos[nodeName[idx]][1])
            .attr('dx',nodeSize.width / 2)
            .attr('dy',nodeSize.height / 7 * 6)
            .attr('text-anchor', 'middle')
            .attr('fill','balck')
            .attr('font-size',`0.8em`)
            .text(`${specsInf[nodeName[idx]][1]}*${specsInf[nodeName[idx]][2]}`)

        }else{
            g.append('text')
            .attr('x',nodePos[nodeName[idx]][0])
            .attr('y',nodePos[nodeName[idx]][1])
            .attr('dx',nodeSize.width / 2)
            .attr('dy',nodeSize.height * 0.7)
            .attr('text-anchor', 'middle')
            .attr('fill','balck')
            .attr('font-size',`2em`)
            .text(`Ø`)
        }
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