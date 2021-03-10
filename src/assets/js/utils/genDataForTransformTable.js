import {extractCols} from "./common/extractContextualCols";


function generateDataForColumnRearrange(dataIn1_csv,dataOut1_csv,colsAfterArrange) {
    //暂定以索引方式传入列
    let colsBeforeArrange = Array.from(colsAfterArrange)
    colsBeforeArrange.sort()
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),colsBeforeArrange,colsAfterArrange)
    let m1 = [[]],m2 = [[]]
    let inColors = [],outColors = []
    colsBeforeArrange.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
        m2[0].push(dataIn1_csv[0][idx])
    })

    contextualCols.forEach(val => {
        m1[0].push(val)
        m2[0].push(val)
    })

    m1[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })

    m2[0].sort(function(a,b){
        return dataOut1_csv[0].indexOf(a) - dataOut1_csv[0].indexOf(b)
    })

    for(let row = 1;row <= Math.min(3,dataIn1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < m1[0].length;col++){
            tempRow.push('')
        }
        m1.push(tempRow)
    }

    for(let row = 1;row <= Math.min(3,dataOut1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < m2[0].length;col++){
            tempRow.push('')
        }
        m2.push(tempRow)
    }

    inColors = Array.from(new Array(m1[0].length), (x,i) => i)
    outColors = Array.from(new Array(m2[0].length), (x,i) => i)
    for (let col = 0;col < m2[0].length;col++){
        outColors[col] = m1[0].indexOf(m2[0][col])
    }
    return {m1,m2,inColors,outColors}
}

function generateDataForTableSort(dataIn1_csv,dataOut1_csv,sortedCol,order) {
    //暂定以索引方式传入列
    //sortedCol是一个数组
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),sortedCol,sortedCol)
    let m1 = [[]],m2 = [[]]
    sortedCol.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
        m2[0].push(dataIn1_csv[0][idx])
    })

    contextualCols.forEach(val => {
        m1[0].push(val)
        m2[0].push(val)
    })

    m1[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })

    m2[0].sort(function(a,b){
        return dataOut1_csv[0].indexOf(a) - dataOut1_csv[0].indexOf(b)
    })

    for(let row = 1;row <= Math.min(3,dataIn1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < m1[0].length;col++){
            if(m1[0][col] === dataIn1_csv[0][sortedCol[0]])tempRow.push(dataIn1_csv[row][sortedCol[0]])
            else
                tempRow.push('')
        }
        m1.push(tempRow)
    }

    for(let row = 1;row <= Math.min(3,dataOut1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < m2[0].length;col++){
            if(m2[0][col] === dataIn1_csv[0][sortedCol[0]])tempRow.push(dataIn1_csv[row][sortedCol[0]])
            else
                tempRow.push('')
        }
        m2.push(tempRow)
    }
    for(let col = 0;col < m1[0].length;col++)
        if(m1[0][col] !== dataIn1_csv[0][sortedCol[0]])m1[0][col] = ''
    for(let col = 0;col < m2[0].length;col++)
        if(m2[0][col] !== dataOut1_csv[0][sortedCol[0]])m2[0][col] = ''
    let colVal = [],colInM1 = 0
    for(let col = 0;col < m1[0].length;col++){
        if(m1[0][col] === dataIn1_csv[0][sortedCol]){
            colInM1 = col
            break
        }
    }
    for(let row = 1;row < m1.length;row++){
        colVal.push(m1[row][colInM1])
    }
    let valBeforeSort = Array.from(colVal)
    if(order.indexOf("desc") === -1){
        //暂定为只对数值类型进行排序
        colVal = colVal.sort(function(a,b){
            return parseInt(a) - parseInt(b)
        })
    }else{
        colVal = colVal.sort(function(a,b){
            return parseInt(b) - parseInt(a)
        })
    }

    console.log("sorted: ",colVal)

    for(let row = 1;row < m2.length;row ++){
        m2[row][colInM1] = colVal[row - 1]
    }
    for(let idx = 0;idx < valBeforeSort.length;idx++){
        while(valBeforeSort.indexOf(valBeforeSort[idx]) !== idx)valBeforeSort[idx] += '_'
    }
    for(let idx = 0;idx < colVal.length;idx++){
        while(colVal.indexOf(colVal[idx]) !== idx)colVal[idx] += '_'
    }
    let outColor = []
    for(let idx = 0;idx < colVal.length;idx++){
        outColor.push(valBeforeSort.indexOf(colVal[idx]))
    }
   
    return {m1,m2,outColor}
}

function generateDataForFold(dataIn1_csv, dataOut1_csv, inExpOrImpCol, outExpOrImpCol){

    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,outExpOrImpCol)
    let m1 = [[]],m2 = [[]]
    inExpOrImpCol.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
    })
    outExpOrImpCol.forEach(idx => {
        m2[0].push(dataOut1_csv[0][idx])
    })
    contextualCols.forEach(val => {
        m1[0].push(val)
        m2[0].push(val)
    })

    m1[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })
    m2[0].sort(function(a,b){
        return dataOut1_csv[0].indexOf(a) - dataOut1_csv[0].indexOf(b)
    })

    //m1选取两列
    for(let row = 1;row <= 2;row++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1)tempRow.push(dataIn1_csv[row][col])
        }
        m1.push(tempRow)
    }

    for(let row = 1;row <= 2 * inExpOrImpCol.length;row ++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(m2[0].indexOf(dataOut1_csv[0][col]) !== -1)tempRow.push(dataOut1_csv[row][col])
        }
        m2.push(tempRow)
    }
    return {m1,m2}
}

export {generateDataForTableSort,generateDataForColumnRearrange,generateDataForFold}