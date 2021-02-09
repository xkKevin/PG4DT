//参数：g、矩阵、explicit/implicit列、表格起始位置（左上角）、单元格长度和宽度、按行还是按列添加颜色
//pos中含有表格左上角的横坐标和纵坐标
export function drawTable(g,matrix,expOrImpCols,pos,colWidth,colHeight,table_name,colFontSize = 1.5,cellFontSize = 1,direction = 'col',insertPos = -1) {
    let maxCharsPerCol = Math.floor(colWidth / 16 / colFontSize)
    let maxCharsPerCell = Math.floor(colWidth / 16 / cellFontSize)
    let colors = ['#5AABAC','#F07A66','#F8BA4B','#AAA1CC','#445050','#C9C9C9']
    g.append('text')
        .attr('x',pos[0])
        .attr('y',pos[1] - colHeight)
        .attr('dx',colWidth / 2)
        .attr('dy',colHeight / 3 * 2)
        .attr('text-anchor', 'middle')
        .text(table_name)
        .attr('fill','black')
        .attr('font-size',`${colFontSize}em`)
    for(let row = 0; row < matrix.length; row++){
        if(row == 0){
            for(let col = 0; col < matrix[0].length; col ++){
                g.append('rect')
                    .attr('width',colWidth)
                    .attr('height',colHeight)
                    .attr('fill','gray')
                    .attr('opacity',0.8)
                    .attr('stroke-width','1px')
                    .attr('stroke','black')
                    .attr('x',pos[0] + col * colWidth)
                    .attr('y',pos[1] + row * colHeight)
                if(expOrImpCols.indexOf(col) !== -1){
                    g.append('text')
                        .attr('x',pos[0] + col * colWidth)
                        .attr('y',pos[1] + row * colHeight)
                        .attr('dx',colWidth / 2)
                        .attr('dy',colHeight / 3 * 2)
                        .attr('text-anchor', 'middle')
                        .text(matrix[row][col].length > maxCharsPerCol ?
                            matrix[row][col].slice(0,maxCharsPerCol) : matrix[row][col])
                        .attr('fill','white')
                        .attr('font-size',`${colFontSize}em`)
                }
            }
        }
        else{
            for(let col = 0; col < matrix[0].length; col ++){
                let color = direction == 'col' ? colors[col] :
                            insertPos == -1 ? colors[row] :
                            row - 1 == insertPos ? colors[matrix.length - 1] :
                            row - 1 < insertPos ? colors[row] : colors[row - 1]
                g.append('rect')
                    .attr('width',colWidth)
                    .attr('height',colHeight)
                    .attr('fill',color)
                    .attr('stroke-width','1px')
                    .attr('stroke','black')
                    .attr('x',pos[0] + col * colWidth)
                    .attr('y',pos[1] + row * colHeight)
                    .attr('opacity',0.8)
                //只有input中存在explicit/implicit并且当前列不是contextual列时，才会显示单元格的内容
                if(expOrImpCols.length != 1 && expOrImpCols.indexOf(col) != -1) {
                    g.append('text')
                        .attr('x',pos[0] + col * colWidth)
                        .attr('y',pos[1] + row * colHeight)
                        .attr('dx',colWidth / 2)
                        .attr('dy',colHeight / 3 * 2)
                        .attr('text-anchor', 'middle')
                        .text(matrix[row][col].length > maxCharsPerCell ?
                            matrix[row][col].slice(0,maxCharsPerCell) : matrix[row][col])
                        .attr('fill','white')
                        .attr('font-size',`${cellFontSize}em`)
                }
            }
        }
    }
}