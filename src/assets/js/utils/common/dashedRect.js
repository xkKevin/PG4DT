export function drawDashRect(g,pos,height,width) {
    g.append('rect')
        .attr('x',pos[0])
        .attr('y',pos[1])
        .attr('width',width)
        .attr('height',height)
        .attr('fill','none')
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .style("stroke-dasharray","4,4")
}