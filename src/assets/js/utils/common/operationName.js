export function drawOperationName(g,pos,name,dy='1.2em',colFontSize) {
    g.append("text")
        .text(name)
        .attr("x", pos[0])
        .attr("y", pos[1])
        .attr('text-anchor','middle')
        .attr('dy',dy)
        .attr('font-size',`${colFontSize}px`)
}