export function drawDashRect(g,pos,height,width,color='none') {
    g.append('rect')
        .attr('x',pos[0])
        .attr('y',pos[1])
        .attr('width',width)
        .attr('height',height)
        .attr('fill',color)
        .attr("stroke", "gray")
        .attr("stroke-width", "1px")
        .style("stroke-dasharray","4,4")
}