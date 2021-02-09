export function drawIndex(g,pos,len,colWidth,colHeight,cellFontSize){
    for (let row = 0;row < len; row++){
        g.append('text')
            .attr('x',pos[0])
            .attr('y',pos[1] + row * colHeight)
            .attr('dx',colWidth / 2)
            .attr('dy',colHeight / 3 * 2)
            .attr('text-anchor', 'middle')
            .text(`${row + 1}`)
            .attr('fill','black')
            .attr('font-size',`${cellFontSize}em`)
    }
}