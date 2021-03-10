export function drawLine(g,startPos,endPos,dashed = false) {
    var line = g.append("line")
        .attr("x1", startPos[0])
        .attr("y1", startPos[1])
        .attr("x2", endPos[0])
        .attr("y2", endPos[1])
        .attr("stroke", "gray")
        .attr("stroke-width", "1px")

    if(dashed)
        line.style("stroke-dasharray","4,4")
}