import {extractCols} from "./extractContextualCols";

export function generateDataForKeepColumns(dataIn1_csv, dataOut1_csv, inExpOrImpCol, outExpOrImpCol){

    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,outExpOrImpCol)
    let values = []
    for(let col = 0;col < inExpOrImpCol.length;col++){
        values.push(dataIn1_csv[0][inExpOrImpCol[col]])
    }
    for(let col = 0;col < dataIn1_csv.length;col++){
        let idx = inExpOrImpCol.indexOf(col)
        while(idx === -1 && values.indexOf(dataIn1_csv[0][idx]) !== -1)
            dataIn1_csv[0][col] += '_'
    }

    let m1 = [[]],m2 = [[]]
    let inColors,outColors = []
    inExpOrImpCol.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
    })
    outExpOrImpCol.forEach(idx => {
        m2[0].push(dataOut1_csv[0][idx])
    })
    contextualCols.forEach(val => {
        m1[0].push(val)
    })

    m1[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })
    m2[0].sort(function(a,b){
        return dataOut1_csv[0].indexOf(a) - dataOut1_csv[0].indexOf(b)
    })

    for(let row = 1;row <= Math.min(3,dataIn1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1)tempRow.push('')
        }
        m1.push(tempRow)
    }

    for(let row = 1;row <= Math.min(3,dataOut1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(m2[0].indexOf(dataOut1_csv[0][col]) !== -1)tempRow.push('')
        }
        m2.push(tempRow)
    }

    for(let col = 0;col < m1[0].length;col ++)
        if(values.indexOf(m1[0][col]) === -1)m1[0][col] = ''

    inColors = Array.from(new Array(m1[0].length), (x,i) => i)
    for(let col = 0;col < m2[0].length;col++){
        outColors.push(m1[0].indexOf(m2[0][col]))
    }
    return {m1,m2,inColors,outColors}
}