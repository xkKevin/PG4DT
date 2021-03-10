import {nodeSize,lineAttr} from '@/assets/js/config/config'
import * as d3 from 'd3'
function drawNode(g,specs,nodePos,specsInf,showTableFunc){
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
  
        let nodeRect = g.append('rect')
        .attr('x',nodePos[nodeName[idx]][0])
        .attr('y',nodePos[nodeName[idx]][1])
        .attr('width',nodeSize.width)
        .attr('height',nodeSize.height)
        // .attr('fill',nodeColor.background)
        .attr('fill',"transparent")
        .attr("stroke","gray")
        .attr("stroke-width","2")
        .attr('rx',`${nodeSize.height / 15}`)
        
        if(nodeName[idx][0] !== '*' && nodeName[idx][0] !== '#'){
            nodeRect.on('click',function(event){
                showTableFunc(nodeName[idx])
            })

            let lineNum = nodeName[idx].replace(/[^0-9]/ig,"")
            let letterWidth = nodeSize.width / (lineNum.length + 2)
            let midInY = (nodeSize.height - letterWidth) / 2 + letterWidth
            g.append('text')
            .attr('x',nodePos[nodeName[idx]][0])
            .attr('y',nodePos[nodeName[idx]][1] + midInY)
            .attr('dx',nodeSize.width / 4)
            // .attr('dy',nodeSize.height / 7 * 2)
            .attr('text-anchor', 'middle')
            .attr('fill','balck')
            .attr('font-size',`${letterWidth}px`)
            .text(`L${parseInt(lineNum,10)}`)
            .on('click',function(event){
                showTableFunc(nodeName[idx])
            })
            //最多显示六个字符
            let letters = 6
            let showText = ''
            if(letters >= specsInf[nodeName[idx]][0].length){
                showText = specsInf[nodeName[idx]][0]
            }else{
                showText = specsInf[nodeName[idx]][0].slice(0,letters - 3)
                showText += '...'
            }
     
            g.append('text')
            .attr('x',`${nodePos[nodeName[idx]][0] + nodeSize.width / 2}px`)
            .attr('y',nodePos[nodeName[idx]][1] + nodeSize.height / 2 - 5)
            .attr('text-anchor', 'start')
            .attr('fill','balck')
            .attr('font-size',`${nodeSize.width / (letters + 2)}px`)
            .text(showText)
            .on("mouseover",function(event){
                if(d3.select(`#table_name_${specsInf[nodeName[idx]][0]}`)['_groups'][0][0] === null){
                    g.append('text')
                    .attr('x',nodePos[nodeName[idx]][0])
                    .attr('y',nodePos[nodeName[idx]][1])
                    .attr('dx',1.1 * nodeSize.width)
                    .attr('dy',1.1 * nodeSize.height)
                    .attr('text-anchor', 'start')
                    .attr('fill','balck')
                    .attr('font-size',`${2 * nodeSize.width / letters}px`)
                    .text(specsInf[nodeName[idx]][0])
                    .attr("id",`table_name_${specsInf[nodeName[idx]][0]}`)
                }
                console.log("event",event)
            })
            .on("mouseout",function(event){
                g.select(`#table_name_${specsInf[nodeName[idx]][0]}`).remove()
            })
            .on('click',function(event){
                showTableFunc(nodeName[idx])
            })
           
            g.append('text')
            .attr('x',nodePos[nodeName[idx]][0] + nodeSize.width / 2)
            .attr('y',nodePos[nodeName[idx]][1] + nodeSize.height - 5)
            .attr('text-anchor', 'start')
            .attr('fill','gray')
            .attr('font-size',`${nodeSize.width / (letters + 2)}px`)
            .text(`${specsInf[nodeName[idx]][1] - 1}R*${specsInf[nodeName[idx]][2]}C`)
            .on('click',function(event){
                showTableFunc(nodeName[idx])
            })
        }else{
            nodeRect.style('stroke-dasharray', '5,5');
            g.append('text')
            .attr('x',nodePos[nodeName[idx]][0])
            .attr('y',nodePos[nodeName[idx]][1])
            .attr('dx',nodeSize.width / 2)
            .attr('dy',nodeSize.height * 0.8)
            .attr('text-anchor', 'middle')
            .attr('fill','gray')
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
        .attr("fill","gray");
    for(let idx = 0;idx < specs.length;idx++){
        if(typeof(specs[idx].input_table_file) === 'string'
         && typeof(specs[idx].output_table_file) === 'string'){
             g.append('line')
             .attr('x1',nodePos[specs[idx].input_table_file][0] + nodeSize.width)
             .attr('y1',nodePos[specs[idx].input_table_file][1] + nodeSize.height / 2)
             .attr('x2',nodePos[specs[idx].output_table_file][0])
             .attr('y2',nodePos[specs[idx].output_table_file][1] + nodeSize.height / 2)
             .attr('stroke',lineAttr.color)
             .attr('stroke-width',lineAttr.strokeWidth)
             .attr("marker-end","url(#arrow)")
         }else if(typeof(specs[idx].input_table_file) === 'string'){
            let meetingPosY = nodePos[specs[idx].input_table_file][1] + nodeSize.height / 2
            let meetingPosX = nodePos[specs[idx].input_table_file][0] + nodeSize.width
                + 0.8 * (Math.min(nodePos[specs[idx].output_table_file[0]][0], nodePos[specs[idx].output_table_file[1]][0]) - 
                nodePos[specs[idx].input_table_file][0] - nodeSize.width)

            g.append("circle")
            .attr("cx", meetingPosX)
            .attr("cy", meetingPosY)
            .attr("r", 2 * lineAttr.strokeWidth)
            .style("fill", lineAttr.color)       
            .style("stroke", lineAttr.color)    

            g.append('line')
            .attr('x1',nodePos[specs[idx].input_table_file][0] + nodeSize.width)
            .attr('y1',nodePos[specs[idx].input_table_file][1] + nodeSize.height / 2)
            .attr('x2',meetingPosX)
            .attr('y2',meetingPosY)
            .attr('stroke',lineAttr.color)
            .attr('stroke-width',lineAttr.strokeWidth)

            g.append('line')
            .attr('x1',meetingPosX)
            .attr('y1',meetingPosY)
            .attr('x2',nodePos[specs[idx].output_table_file[0]][0])
            .attr('y2',nodePos[specs[idx].output_table_file[0]][1] + nodeSize.height / 2)
            .attr('stroke',lineAttr.color)
            .attr('stroke-width',lineAttr.strokeWidth)
            .attr("marker-end","url(#arrow)")

            g.append('line')
            .attr('x1',meetingPosX)
            .attr('y1',meetingPosY)
            .attr('x2',nodePos[specs[idx].output_table_file[1]][0])
            .attr('y2',nodePos[specs[idx].output_table_file[1]][1] + nodeSize.height / 2)
            .attr('stroke',lineAttr.color)
            .attr('stroke-width',lineAttr.strokeWidth)
            .attr("marker-end","url(#arrow)")
         }else{
            let meetingPosY = nodePos[specs[idx].output_table_file][1] + nodeSize.height / 2
            let meetingPosX = Math.max(nodePos[specs[idx].input_table_file[0]][0],nodePos[specs[idx].input_table_file[1]][0])
                + nodeSize.width + 0.2 * (nodePos[specs[idx].output_table_file][0] - nodeSize.width 
                - Math.max(nodePos[specs[idx].input_table_file[0]][0],nodePos[specs[idx].input_table_file[1]][0]))
           
            g.append("circle")
            .attr("cx", meetingPosX)
            .attr("cy", meetingPosY)
            .attr("r", 2 * lineAttr.strokeWidth)
            .style("fill", lineAttr.color)       
            .style("stroke", "black")     

            g.append('line')
            .attr('x1',nodePos[specs[idx].input_table_file[0]][0] + nodeSize.width)
            .attr('y1',nodePos[specs[idx].input_table_file[0]][1] + nodeSize.height / 2)
            .attr('x2',meetingPosX)
            .attr('y2',meetingPosY)
            .attr('stroke',lineAttr.color)
            .attr('stroke-width',lineAttr.strokeWidth)

            g.append('line')
            .attr('x1',nodePos[specs[idx].input_table_file[1]][0] + nodeSize.width)
            .attr('y1',nodePos[specs[idx].input_table_file[1]][1] + nodeSize.height / 2)
            .attr('x2',meetingPosX)
            .attr('y2',meetingPosY)
            .attr('stroke',lineAttr.color)
            .attr('stroke-width',lineAttr.strokeWidth)
            
            g.append('line')
            .attr('x1',meetingPosX)
            .attr('y1',meetingPosY)
            .attr('x2',nodePos[specs[idx].output_table_file][0])
            .attr('y2',nodePos[specs[idx].output_table_file][1] + nodeSize.height / 2)
            .attr('stroke',lineAttr.color)
            .attr('stroke-width',lineAttr.strokeWidth)
            .attr("marker-end","url(#arrow)")
         }
    }

}

export {drawNode,drawEdge}