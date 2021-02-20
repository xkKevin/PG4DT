import {extractCols} from "./extractContextualCols";

export function generateDataForColumnRearrange(dataIn1_csv,dataOut1_csv,colsAfterArrange) {
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