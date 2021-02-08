import * as d3 from 'd3'
export function mutate(m1,m2,expOrImpCols,rule,t1_name,t2_name){
    //输入：
    //input和output的矩阵
    //input矩阵中的哪些列进行sum操作
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('style', 'border: 1px solid black');
    svg.setAttribute('id', 'mainsvg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.body.appendChild(svg);

    let width = d3.select('#mainsvg').attr('width') - 20
    let height = d3.select('#mainsvg').attr('height')

    let colors = ['#5AABAC','#F07A66','#F8BA4B','#AAA1CC','#445050','#C9C9C9']
    let borderColor = '#92D882'

    console.log(m2)

    //单元格的长和宽
    let colWidth = width / (m2[0].length * 2 + 1)
    let colHeight = height / (m1.length + 5)
    //每个单元格最多可以容纳的字符数
    let colFontSize = 1.5
    let cellFontSize = 1
    let maxCharsPerCol = Math.floor(colWidth / 16 / colFontSize)
    let maxCharsPerCell = Math.floor(colWidth / 16 / cellFontSize)

    const g = d3.select('#mainsvg').append('g')
        .attr('transform',`translate(10,10)`)

    //input table name
    g.append('text')
        .attr('x',0)
        .attr('y',0)
        .attr('dx',colWidth / 2)
        .attr('dy',colHeight / 3 * 2)
        .attr('text-anchor', 'middle')
        .text(t1_name)
        .attr('fill','black')
        .attr('font-size','1.5em')
    //画input表格
    for(let row = 0; row < m1.length; row++){
        if(row == 0){
            for(let col = 0; col < m1[0].length; col ++){
                g.append('rect')
                    // .attr('width',width / (2 * m2[0].length + 3))
                    .attr('width',colWidth)
                    // .attr('height',height / 2 / 4)
                    .attr('height',colHeight)
                    .attr('fill','gray')
                    .attr('opacity',0.8)
                    .attr('stroke-width','1px')
                    .attr('stroke','black')
                    // .attr('x',col * width / (2 * m2[0].length + 3))
                    .attr('x',col * colWidth)
                    // .attr('y',row * height / 2 / 4)
                    .attr('y',(row + 1) * colHeight)
                if(expOrImpCols.indexOf(col) != -1){
                    g.append('text')
                        // .attr('x',col * width / (2 * m2[0].length + 3))
                        .attr('x',col * colWidth)
                        // .attr('y',row * height / 2 / 4)
                        .attr('y',(row + 1) * colHeight)
                        // .attr('dx',width / (2 * m2[0].length + 3) / 2)
                        .attr('dx',colWidth / 2)
                        // .attr('dy',height / 2 / 4 / 3 * 2)
                        .attr('dy',colHeight / 3 * 2)
                        .attr('text-anchor', 'middle')
                        .text(m1[row][col].length > maxCharsPerCol ?
                            m1[row][col].slice(0,maxCharsPerCol) : m1[row][col])
                        .attr('fill','white')
                        .attr('font-size',`${colFontSize}em`)
                }
            }
        }
        else{
            for(let col = 0; col < m1[0].length; col ++){
                g.append('rect')
                    // .attr('width',width / (2 * m2[0].length + 3))
                    .attr('width',colWidth)
                    // .attr('height',height / 2 / 4)
                    .attr('height',colHeight)
                    .attr('fill',colors[col])
                    .attr('stroke-width','1px')
                    .attr('stroke','black')
                    // .attr('x',col * width / (2 * m2[0].length + 3))
                    .attr('x',col * colWidth)
                    // .attr('y',row * height / 2 / 4)
                    .attr('y',(row + 1) * colHeight)
                    .attr('opacity',0.8)
                if(expOrImpCols.indexOf(col) != -1) {
                    g.append('text')
                    // .attr('x',col * width / (2 * m2[0].length + 3))
                    .attr('x',col * colWidth)
                    // .attr('y',row * height / 2 / 4)
                    .attr('y',(row + 1) * colHeight)
                    // .attr('dx',width / (2 * m2[0].length + 3) / 2)
                    .attr('dx',colWidth / 2)
                    // .attr('dy',height / 2 / 4 / 3 * 2)
                    .attr('dy',colHeight / 3 * 2)
                    .attr('text-anchor', 'middle')
                    .text(m1[row][col].length > maxCharsPerCell ?
                        m1[row][col].slice(0,maxCharsPerCell) : m1[row][col])
                    .attr('fill','white')
                    .attr('font-size',`${cellFontSize}em`)
                }
            }
        }
    }
    //虚线框
    g.append('rect')
        // .attr('x',m1[0].length * width / (2 * m2[0].length + 3))
        .attr('x',m1[0].length * colWidth)
        // .attr('y',0)
        .attr('y',colHeight)
        // .attr('width',width / (2 * m2[0].length + 3))
        .attr('width',colWidth)
        // .attr('height',height / 2 / 4 * m1.length)
        .attr('height',colHeight * m1.length)
        .attr('fill','none')
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .style("stroke-dasharray","4,4")

    // 添加加号和箭头
    let plusUrl = require('../../images/plus.png')
    g.append('image')
        .attr('href',plusUrl)
        // .attr('x',m1[0].length * width / (2 * m2[0].length + 3))
        .attr('x',m1[0].length * colWidth)
        // .attr('y',height / 4 - height / 2 / 4 / 2)
        .attr('y',(1 + m1.length / 2) * colHeight - colHeight / 2)
        // .attr('width',width / (2 * m2[0].length + 3))
        .attr('width',colWidth)
        // .attr('height',height / 2 / 4)
        .attr('height',colHeight)

    let arrowUrl = require('../../images/arrow.png')
    g.append('image')
        .attr('href',arrowUrl)
        // .attr('x',(m1[0].length + 2) * width / (2 * m2[0].length + 3))
        .attr('x',(m1[0].length + 1) * colWidth * 1.05)
        // .attr('y',height / 4 - height / 2 / 4 / 2)
        .attr('y',(1 + m1.length / 2) * colHeight - colHeight / 2)
        // .attr('width',width / (2 * m2[0].length + 3))
        .attr('width',colWidth * 0.9)
        // .attr('height',height / 2 / 4)
        .attr('height',colHeight * 0.9)

    //分组
    let highlightCols = []
    let start = 0,end = 1;
    if(expOrImpCols.length != 0){
        if(expOrImpCols.length == 1)highlightCols.push([start,end - 1])
        while(start <= end && end < expOrImpCols.length){
            while((start == end) || ((expOrImpCols[end - 1] == expOrImpCols[end] - 1) && (end < expOrImpCols.length))){
                end++
            }
            highlightCols.push([start,end - 1])
            start = end
        }
    }

    for(let group = 0; group < highlightCols.length; group++){
        //高亮框
        g.append('rect')
            // .attr('width',(highlightCols[group][1] - highlightCols[group][0] + 1) * width / (2 * m2[0].length + 3))
            .attr('width',(highlightCols[group][1] - highlightCols[group][0] + 1) * colWidth)
            // .attr('height',height / 2 / 4 * m1.length)
            .attr('height',colHeight * m1.length)
            .attr('stroke-width','2px')
            .attr('stroke',borderColor)
            .attr('fill','none')
            // .attr('x',highlightCols[group][0] * width / (2 * m2[0].length + 3))
            .attr('x',highlightCols[group][0] * colWidth)
            .attr('y',colHeight)

        //每个组的竖线
        g.append("line")
            // .attr("x1", (highlightCols[group][1] + highlightCols[group][0] + 1) / 2 * width / (2 * m2[0].length + 3))
            .attr("x1", (highlightCols[group][1] + highlightCols[group][0] + 1) / 2 * colWidth)
            // .attr("y1", height / 2 / 4 * m1.length)
            .attr("y1", colHeight * m1.length + colHeight)
            // .attr("x2", (highlightCols[group][1] + highlightCols[group][0] + 1) / 2 * width / (2 * m2[0].length + 3))
            .attr("x2", (highlightCols[group][1] + highlightCols[group][0] + 1) / 2 * colWidth)
            // .attr("y2", height / 2 /4 * m1.length + height / 2 / 4)
            .attr("y2", colHeight * m1.length + 2 * colHeight)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .style("stroke-dasharray","4,4")
    }
    let midPoint = 0
    //画input表的水平线
    if(highlightCols.length == 1){
        g.append("line")
            // .attr("x1", (highlightCols[0][1] + highlightCols[0][0] + 1) / 2 * width / (2 * m2[0].length + 3))
            .attr("x1", (highlightCols[0][1] + highlightCols[0][0] + 1) / 2 * colWidth)
            // .attr("y1", height / 2 /4 * m1.length + height / 2 / 4)
            .attr("y1", colHeight * m1.length + 2 * colHeight)
            // .attr("x2", (2 * m2[0].length + 2.5) * width / (2 * m2[0].length + 3))
            .attr("x2", (2 * m2[0].length + 0.5) * colWidth)
            // .attr("y2", height / 2 /4 * m1.length + height / 2 / 4)
            .attr("y2", colHeight * m1.length + 2 * colHeight)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .style("stroke-dasharray","4,4")
    }
    else{
        //把每一个组的竖线用水平线连起来
        g.append("line")
            // .attr("x1", (highlightCols[0][1] + highlightCols[0][0] + 1) / 2 * width / (2 * m2.length + 3))
            .attr("x1", (highlightCols[0][1] + highlightCols[0][0] + 1) / 2 * colWidth)
            // .attr("y1", height / 2 /4 * m1.length + height / 2 / 4)
            .attr("y1", colHeight * m1.length + 2 * colHeight)
            // .attr("x2", (highlightCols[highlightCols.length - 1][1] + highlightCols[highlightCols.length - 1][0] + 1) / 2 * width / (2 * m2.length + 3))
            .attr("x2", (highlightCols[highlightCols.length - 1][1] + highlightCols[highlightCols.length - 1][0] + 1) / 2 * colWidth)
            // .attr("y2", height / 2 /4 * m1.length + height / 2 / 4)
            .attr("y2", colHeight * m1.length + 2 * colHeight)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .style("stroke-dasharray","4,4")
        let start = (highlightCols[0][1] + highlightCols[0][0] + 1) / 2 * width / (2 * m2.length + 3)
        let end = (highlightCols[highlightCols.length - 1][1] + highlightCols[highlightCols.length - 1][0] + 1) / 2 * width / (2 * m2.length + 3)
        midPoint = (start + end) / 2

        //连接组的水平线之下再画一条竖线
        g.append("line")
            .attr("x1", midPoint)
            // .attr("y1", height / 2 /4 * m1.length + height / 2 / 4)
            .attr("y1", colHeight * m1.length + 2 * colHeight)
            .attr("x2", midPoint)
            // .attr("y2", height / 2 /4 * m1.length + 2 * height / 2 / 4)
            .attr("y2", colHeight * m1.length + 3 * colHeight)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .style("stroke-dasharray","4,4")

        g.append("line")
            .attr("x1", midPoint)
            // .attr("y1", height / 2 + 2 * height / 2 / 4)
            .attr("y1", colHeight * m1.length + 3 * colHeight)
            // .attr("x2", (2 * m2.length + 2.5) * width / (2 * m2.length + 3))
            .attr("x2", (2 * m2.length + 0.5) * colWidth)
            // .attr("y2", height / 2 + 2 * height / 2 / 4)
            .attr("y2", colHeight * m1.length + 3 * colHeight)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .style("stroke-dasharray","4,4")
    }

    //画output表的竖直线
    g.append("line")
        // .attr("x1", (2 * m2[0].length + 2.5) * width / (2 * m2[0].length + 3))
        .attr("x1", (2 * m2[0].length + 0.5) * colWidth)
        // .attr("y1", highlightCols.length == 1 ? height / 2 /4 * m1.length + height / 2 / 4 : height / 2 /4 * m1.length + 2 * height / 2 / 4)
        .attr("y1", highlightCols.length == 1 ? colHeight * m1.length + 2 * colHeight : colHeight * m1.length + 3 * colHeight)
        // .attr("x2", (2 * m2[0].length + 2.5) * width / (2 * m2[0].length + 3))
        .attr("x2", (2 * m2[0].length + 0.5) * colWidth)
        // .attr("y2", height / 2 /4 * m1.length)
        .attr("y2", colHeight * m1.length + colHeight)
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .style("stroke-dasharray","4,4")

    //写操作名称
    g.append("text")
        .text(`Mutate:'${rule}'`)
        // .attr("x", (midPoint + (2 * m2[0].length + 2.5) * width / (2 * m2[0].length + 3)) / 2)
        .attr("x", (midPoint + (2 * m2[0].length + 0.5) * colWidth) / 2)
        // .attr("y", highlightCols.length == 1 ? height / 2 + height / 2 / 4 : height / 2 + 2 * height / 2 / 4)
        .attr("y", highlightCols.length == 1 ? colHeight * m1.length + 2 * colHeight : colHeight * m1.length + 3 * colHeight)
        .attr('text-anchor','middle')
        .attr('dy','1.2em')
        .attr('font-size',`${colFontSize}em`)

    //output table name
    g.append('text')
        .attr('x',(m2[0].length + 1) * colWidth)
        .attr('y',0)
        .attr('dx',colWidth / 2)
        .attr('dy',colHeight / 3 * 2)
        .attr('text-anchor', 'middle')
        .text(t2_name)
        .attr('fill','black')
        .attr('font-size',`${colFontSize}em`)
    //画output表格
    for(let row = 0; row < m2.length; row++){
        if(row == 0){
            for(let col = 0; col < m2[0].length; col ++){
                g.append('rect')
                    // .attr('width',width / (2 * m2[0].length + 3))
                    .attr('width',colWidth)
                    // .attr('height',height / 2 / 4)
                    .attr('height',colHeight)
                    .attr('fill','gray')
                    .attr('opacity',0.8)
                    .attr('stroke-width','1px')
                    // .attr('stroke-dasharray','5,5')
                    .attr('stroke','black')
                    // .attr('x',(m2[0].length + 3 + col) * width / (2 * m2[0].length +
                    .attr('x',(m2[0].length + 1 + col) * colWidth)
                    // .attr('y',row * height / 2 / 4)
                    .attr('y',(row + 1) * colHeight)
                if(expOrImpCols.indexOf(col) != -1 || col == m2[0].length - 1){
                    g.append('text')
                        // .attr('x',(m2[0].length + 3 + col) * width / (2 * m2[0].length + 3))
                        .attr('x',(m2[0].length + 1 + col) * colWidth)
                        // .attr('y',row * height / 2 / 4)
                        .attr('y',(row + 1) * colHeight)
                        // .attr('dx',width / (2 * m2[0].length + 3) / 2)
                        .attr('dx',colWidth / 2)
                        // .attr('dy',height / 2 / 4 / 3 * 2)
                        .attr('dy',colHeight / 3 * 2)
                        .attr('text-anchor', 'middle')
                        .text(m2[row][col].length > maxCharsPerCol ?
                            m2[row][col].slice(0,maxCharsPerCol) : m2[row][col])
                        .attr('fill','white')
                        .attr('font-size',`${colFontSize}em`)
                }
            }
        }
        else{
            for(let col = 0; col < m2[0].length; col ++){
                g.append('rect')
                    // .attr('width',width / (2 * m2[0].length + 3))
                    .attr('width',colWidth)
                    // .attr('height',height / 2 / 4)
                    .attr('height',colHeight)
                    .attr('fill',colors[col])
                    .attr('stroke-width','1px')
                    // .attr('stroke-dasharray','5,5')
                    .attr('stroke','black')
                    // .attr('x',(m2[0].length + 3 + col) * width / (2 * m2[0].length + 3))
                    .attr('x',(m2[0].length + 1 + col) * colWidth)
                    // .attr('y',row * height / 2 / 4)
                    .attr('y',(row + 1) * colHeight)
                    .attr('opacity',0.8)
                if(expOrImpCols.indexOf(col) != -1 || col == m2[0].length - 1) {
                    g.append('text')
                    // .attr('x',(m2[0].length + 3 + col) * width / (2 * m2[0].length + 3))
                    .attr('x',(m2[0].length + 1 + col) * colWidth)
                    // .attr('y',row * height / 2 / 4)
                    .attr('y',(row + 1) * colHeight)
                    // .attr('dx',width / (2 * m2[0].length + 3) / 2)
                    .attr('dx',colWidth / 2)
                    // .attr('dy',height / 2 / 4 / 3 * 2)
                    .attr('dy',colHeight / 3 * 2)
                    .attr('text-anchor', 'middle')
                    .text(m2[row][col].length > maxCharsPerCell ?
                        m2[row][col].slice(0,maxCharsPerCell) : m2[row][col])
                    .attr('fill','white')
                    .attr('font-size',`${cellFontSize}em`)
                }
            }
        }
    }

    //框
    g.append('rect')
        // .attr('width', width / (2 * m2[0].length + 3))
        .attr('width', colWidth)
        // .attr('height',height / 2 / 4 * m2.length)
        .attr('height',colHeight * m2.length)
        .attr('stroke-width','2px')
        .attr('stroke',borderColor)
        .attr('fill','none')
        // .attr('x',(2 * m2[0].length + 2) * width / (2 * m2[0].length + 3))
        .attr('x',(2 * m2[0].length) * colWidth)
        .attr('y',colHeight)
}

// function renderTable(data,group,isRes){
//     let innerHeight = group.attr('height')
//     let innerWidth = group.attr('width')
//     let columns = data.columns
//     let cols = []
//
//     columns.forEach(d => {
//         cols.push([])
//     })
//     data.forEach(row => {
//         Object.keys(row).forEach(key => {
//             cols[columns.indexOf(key)].push(row[key])
//         })
//     })
//
//     const color = d3.scaleOrdinal()
//         .domain(columns)
//         .range(d3.schemeSet3)
//
//     const xScale = d3.scaleBand()
//         .domain(columns)
//         .range([0,innerWidth])
//     // .padding(0.005)
//
//     const padding = xScale(columns[0])
//
//     let len = data.length + 1
//     const yList = Array.from({length: len}, (x,i) => i);
//     const yScale = d3.scaleBand()
//         .domain(yList)
//         .range([0,innerHeight])
//     // .padding(0.005)
//
//     group.selectAll(".columns").data(columns)
//         .join('rect')
//         .attr('class','columns')
//         .attr('stroke','black')
//         .attr('stroke-width',1)
//         .attr('x',d => xScale(d))
//         .attr('y',d => yScale(d))
//         .attr('width',xScale.bandwidth())
//         .attr('height',yScale.bandwidth())
//         .attr('fill','white')
//     // .attr('opacity',0.5)
//
//     group.selectAll(".rectText").data(columns)
//         .join('text')
//         .attr('class','rectText')
//         .attr('x',d => xScale(d))
//         .attr('dx',xScale.bandwidth() / 2)
//         .attr('y',d => yScale(d))
//         .attr('dy',yScale.bandwidth() / 2)
//         .text(d => d)
//         .attr('font-size','2em')
//         .attr('text-anchor', 'middle')
//         .attr('fill','red')
//
//     group.selectAll(".dataCol").data(cols)
//         .join('g').attr('class','dataCol')
//         .attr('transform',(col,i) => `translate(${xScale(columns[i])},0)`)
//         .attr('fill',(col,i) => color(columns[i]))
//         .selectAll('.dataCell').data(col => col)
//         .join('rect').attr('class','dataCell')
//         .attr('y',(cell,i) => yScale(i + 1))
//         .attr('fill',(cell,i) => {
//             if(isRes && i < cols[0].length - 1){
//                 return "white"
//             }
//         })
//         .attr('width',xScale.bandwidth())
//         .attr('height',yScale.bandwidth())
//         .attr('stroke','black')
//         .attr('stroke-width',1)
//
//     group.selectAll(".textCol").data(cols)
//         .join('g').attr('class','textCol')
//         .attr('transform',(col,i) => `translate(${i * xScale.bandwidth()},0)`)
//         .selectAll('.cellText').data(col => col)
//         .join('text').attr('class','cellText')
//         .attr('y',(cell,i) => yScale(i + 1))
//         .attr('dx',xScale.bandwidth() / 2)
//         .attr('dy',yScale.bandwidth() / 2)
//         .text(d => d)
//         .attr('font-size','2em')
//         .attr('text-anchor', 'middle')
// }
//
// export function glyphSum(t1,t2){
//     var body = d3.select('body')
//     var svg = body.append('svg').attr('width',1600).attr('height',1100)
//     let margin = {left:200,right:100,top:100,bottom:100}
//     let width = svg.attr("width")
//     let height = svg.attr("height")
//
//     console.log(width)
//
//     d3.csv(t1).then(data => {
//
//         console.log(data)
//
//         const g1 = svg.append('g')
//             .attr('id','maingroup1')
//             .attr('transform',`translate(${margin.left},${margin.top + 100})`)
//             .attr('width',400)
//             .attr('height',600)
//
//         renderTable(data,g1,false)
//     })
//
//     d3.csv(t2).then(data => {
//         const g2 = svg.append('g')
//             .attr('id','maingroup2')
//             .attr('transform',`translate(${margin.left + 800},${margin.top})`)
//             .attr('width',400)
//             .attr('height',800)
//
//         renderTable(data,g2,true)
//     })
//
// //箭头
//     var marker =
//         svg.append("marker")
//             .attr("id", "arrow")
//             .attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
//             .attr("viewBox", "0 0 12 12")//坐标系的区域
//             .attr("refX", 6)//箭头坐标
//             .attr("refY", 6)
//             .attr("markerWidth", 12)
//             .attr("markerHeight", 12)
//             .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
//             .append("path")
//             .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")//箭头的路径
//             .attr('fill', 'black');//箭头颜色
//
//     var line1 = svg.append("line")
//         .attr("x1",300)
//         .attr("y1",200)
//         .attr("x2",300)
//         .attr("y2",100)
//         .attr("stroke","black")
//         .attr("stroke-width",2)
//     var line2 = svg.append("line")
//         .attr("x1",500)
//         .attr("y1",200)
//         .attr("x2",500)
//         .attr("y2",100)
//         .attr("stroke","black")
//         .attr("stroke-width",2)
//     var line3 = svg.append("line")
//         .attr("x1",500)
//         .attr("y1",100)
//         .attr("x2",100)
//         .attr("y2",100)
//         .attr("stroke","black")
//         .attr("stroke-width",2)
//     var line4 = svg.append("line")
//         .attr("x1",100)
//         .attr("y1",100)
//         .attr("x2",100)
//         .attr("y2",1000)
//         .attr("stroke","black")
//         .attr("stroke-width",2)
//     var line5 = svg.append("line")
//         .attr("x1",100)
//         .attr("y1",1000)
//         .attr("x2",1300)
//         .attr("y2",1000)
//         .attr("stroke","black")
//         .attr("stroke-width",2)
// // 绘制直线
//     var arrowLine1 = svg.append("line")
//         .attr("x1",1100)
//         .attr("y1",1000)
//         .attr("x2",1100)
//         .attr("y2",910)
//         .attr("stroke","black")
//         .attr("stroke-width",2)
//         .attr("marker-end","url(#arrow)");
//     var arrowLine2 = svg.append("line")
//         .attr("x1",1300)
//         .attr("y1",1000)
//         .attr("x2",1300)
//         .attr("y2",910)
//         .attr("stroke","black")
//         .attr("stroke-width",2)
//         .attr("marker-end","url(#arrow)");
//     var arrowLine3 = svg.append("line")
//         .attr("x1",600)
//         .attr("y1",500)
//         .attr("x2",990)
//         .attr("y2",500)
//         .attr("stroke","black")
//         .attr("stroke-width",2)
//         .attr("marker-end","url(#arrow)");
//     var sumText = svg.append('text')
//         .attr('x',750)
//         .attr('y',1000)
//         .attr('dy','-1em')
//         .text('sum()')
//         .attr('font-size','2em')
//         .attr('fill','red')
// }