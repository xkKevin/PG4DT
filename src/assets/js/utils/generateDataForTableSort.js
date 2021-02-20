import {extractCols} from "./extractContextualCols";

export function generateDataForTableSort(dataIn1_csv,dataOut1_csv,sortedCol,order) {
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
    if(order.indexOf("desc") !== -1){
        //暂定为只对数值类型进行排序
        colVal.sort((a,b)=>{
            return b - a
        })
    }
    else
        colVal.sort()

    for(let row = 1;row < m2.length;row ++){
        m2[row][colInM1] = colVal[row - 1]
    }
    return {m1,m2}
}