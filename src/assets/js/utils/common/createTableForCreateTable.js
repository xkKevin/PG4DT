export function drawTableForCreateTable(g,matrix,pos,colWidth,colHeight,table_name,colFontSize = 1.5) {
    let colors = ['#5AABAC','#F07A66','#F8BA4B','#AAA1CC','#445050','#C9C9C9']
    g.append('text')
        .attr('x',pos[0])
        .attr('y',pos[1] - colHeight)
        .attr('dy',colHeight / 3 * 2)
        .attr('text-anchor', 'start')
        .text(table_name)
        .attr('fill','black')
        .attr('font-size',`${colFontSize}em`)
    for(let row = 0; row < matrix.length; row++){
        //dCol表示删除列时，output glyph中当前列需要左移的位置
        for(let col = 0; col < matrix[0].length; col ++){
            let color = colors[col]
            g.append('rect')
                .attr('width',colWidth)
                .attr('height',colHeight)
                .attr('fill',color)
                .attr('stroke-width','1px')
                .attr('stroke','black')
                .attr('x',pos[0] + col * colWidth)
                .attr('y',pos[1] + row * colHeight)
                .attr('opacity',0.8)
        }       
    }
}