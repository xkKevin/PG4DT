//参数：g、矩阵、explicit/implicit列、表格起始位置（左上角）、单元格长度和宽度、按行还是按列添加颜色
//pos中含有表格左上角的横坐标和纵坐标
//insertPos表示插入行的位置
//keepPos表示保存行的位置
//deletePos表示删除列的位置
import {tableRender} from '@/assets/js/config/config'
export function drawTableForFold(g,matrix,pos,colWidth,colHeight,table_name,colFontSize = 1.5,cellFontSize = 1,inExpLen = 2) {
    let maxCharsPerCol = Math.floor(colWidth /colFontSize)
    let maxCharsPerCell = Math.floor(colWidth / cellFontSize)
    let colors = tableRender.colors
    g.append('text')
        .attr('x',pos[0])
        .attr('y',pos[1] - colHeight)
        .attr('dy',colHeight / 3 * 2)
        .attr('text-anchor', 'start')
        .text(table_name)
        .attr('fill','black')
        .attr('font-size',`${colFontSize}px`)
    for(let row = 0; row < matrix.length; row++){
        if(row === 0){
            for(let col = 0; col < matrix[0].length; col ++){
                let color = col === 0 ? tableRender.firstRowColor : colors[1]
                if(inExpLen > 2)color = colors[0]
                g.append('rect')
                    .attr('width',colWidth)
                    .attr('height',colHeight)
                    .attr('fill',color)
                    .attr('opacity',tableRender.opacity)
                    .attr('stroke-width','1px')
                    .attr('stroke','black')
                    .attr('x',pos[0] + col * colWidth)
                    .attr('y',pos[1] + row * colHeight)
                // g.append('text')
                //     .attr('x',pos[0] + col * colWidth)
                //     .attr('y',pos[1] + row * colHeight)
                //     .attr('dx',colWidth / 2)
                //     .attr('dy',colHeight / 3 * 2)
                //     .attr('text-anchor', 'middle')
                //     .text(matrix[row][col].length > maxCharsPerCol ?
                //         matrix[row][col].slice(0,maxCharsPerCol) : matrix[row][col])
                //     .attr('fill','white')
                //     .attr('font-size',`${colFontSize}px`)
                if(matrix[row][col].length <= 5){
                    g.append('text')
                    .attr('x',pos[0] + col * colWidth)
                    .attr('y',pos[1] + row * colHeight)
                    .attr('dx',colWidth / 2)
                    .attr('dy',colHeight / 3 * 2)
                    .attr('text-anchor', 'middle')
                    .text(matrix[row][col])
                    .attr('fill','white')
                    .attr('font-size',`${colWidth / 4}px`)
                }else{
                    let textToShow = matrix[row][col].slice(0,4)
                    g.append('text')
                    .attr('x',pos[0] + col * colWidth)
                    .attr('y',pos[1] + row * colHeight)
                    .attr('dx',colWidth / 2)
                    .attr('dy',colHeight / 3 * 2)
                    .attr('text-anchor', 'middle')
                    .text(textToShow + '…')
                    .attr('fill','white')
                    .attr('font-size',`${colWidth / 4}px`)
                    .append("svg:title")
                    .text(matrix[row][col])
                }
            }
        }
        else{
            for(let col = 0; col < matrix[0].length; col ++){
                let color = col === 0 ? colors[0] : colors[2]
                if(inExpLen > 2)color = colors[1]
                g.append('rect')
                    .attr('width',colWidth)
                    .attr('height',colHeight)
                    .attr('fill',color)
                    .attr('stroke-width','1px')
                    .attr('stroke','black')
                    .attr('x',pos[0] + col * colWidth)
                    .attr('y',pos[1] + row * colHeight)
                    // .attr('opacity',0.8)
                if(matrix[row][col].length <= 5){
                    g.append('text')
                    .attr('x',pos[0] + col * colWidth)
                    .attr('y',pos[1] + row * colHeight)
                    .attr('dx',colWidth / 2)
                    .attr('dy',colHeight / 3 * 2)
                    .attr('text-anchor', 'middle')
                    .text(matrix[row][col])
                    .attr('fill','white')
                    .attr('font-size',`${colWidth / 4}px`)
                }else{
                    let textToShow = matrix[row][col].slice(0,4)
                    g.append('text')
                    .attr('x',pos[0] + col * colWidth)
                    .attr('y',pos[1] + row * colHeight)
                    .attr('dx',colWidth / 2)
                    .attr('dy',colHeight / 3 * 2)
                    .attr('text-anchor', 'middle')
                    .text(textToShow + '…')
                    .attr('fill','white')
                    .attr('font-size',`${colWidth / 4}px`)
                    .append("svg:title")
                    .text(matrix[row][col])
                }
            }
        }
    }
}