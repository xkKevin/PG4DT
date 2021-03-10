//参数：g、explicit\implicit列、单元格的长和宽
export function drawHighLightCol(g,matrix,expOrImpCols,pos,colWidth,colHeight,borderColor='#92D882') {
    expOrImpCols = Array.from(new Set(expOrImpCols))
    let highlightCols = []
    let start = 0,end = 1
    let len = 0,midPoint = 0
    //在调用函数时已经进行了判断，保险起见，再函数内部再判断一次
    if(expOrImpCols.length == 0)return {len,midPoint}

    if(expOrImpCols.length == 1)highlightCols.push([expOrImpCols[start],expOrImpCols[end - 1]])
    while(start <= end && end < expOrImpCols.length){
        while((start == end) || ((expOrImpCols[end - 1] == expOrImpCols[end] - 1) && (end < expOrImpCols.length))){
            end++
        }
        highlightCols.push([expOrImpCols[start],expOrImpCols[end - 1]])
        start = end
    }

    for(let group = 0; group < highlightCols.length; group++){
        //高亮框
        g.append('rect')
            .attr('width',(highlightCols[group][1] - highlightCols[group][0] + 1) * colWidth)
            .attr('height',colHeight * matrix.length)
            .attr('stroke-width','4px')
            .attr('stroke',borderColor)
            .attr('fill','none')
            .attr('x',pos[0] + highlightCols[group][0] * colWidth)
            .attr('y',pos[1])

        //每个组的竖线
        g.append("line")
            .attr("x1", pos[0] + (highlightCols[group][1] + highlightCols[group][0] + 1) / 2 * colWidth)
            .attr("y1", pos[1] + colHeight * matrix.length)
            .attr("x2", pos[0] + (highlightCols[group][1] + highlightCols[group][0] + 1) / 2 * colWidth)
            .attr("y2", pos[1] + colHeight * matrix.length + colHeight)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .style("stroke-dasharray","4,4")
    }

    midPoint = pos[0] + (highlightCols[0][1] + highlightCols[0][0] + 1) / 2 * colWidth
    //画表的水平线
    if(highlightCols.length != 1){
        //把每一个组的竖线用水平线连起来
        g.append("line")
            .attr("x1", pos[0] + (highlightCols[0][1] + highlightCols[0][0] + 1) / 2 * colWidth)
            .attr("y1", pos[1] + colHeight * matrix.length + colHeight)
            .attr("x2", pos[0] + (highlightCols[highlightCols.length - 1][1] + highlightCols[highlightCols.length - 1][0] + 1) / 2 * colWidth)
            .attr("y2", pos[1] + colHeight * matrix.length + colHeight)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .style("stroke-dasharray","4,4")
        let start = pos[0] + (highlightCols[0][1] + highlightCols[0][0] + 1) / 2 * colWidth
        let end = pos[0] + (highlightCols[highlightCols.length - 1][1] + highlightCols[highlightCols.length - 1][0] + 1) / 2 * colWidth
        midPoint = (start + end) / 2
        //连接组的水平线之下再画一条竖线
        g.append("line")
            .attr("x1", midPoint)
            .attr("y1", pos[1] + colHeight * matrix.length + colHeight)
            .attr("x2", midPoint)
            .attr("y2", pos[1] + colHeight * matrix.length + 2 * colHeight)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .style("stroke-dasharray","4,4")
    }
    len = highlightCols.length
    return {len,midPoint}
}