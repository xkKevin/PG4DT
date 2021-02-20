import {extractCols} from "./extractContextualCols";

export function generateDataForSeparateSubset(dataIn1_csv, dataOut1_csv, inExpOrImpCol){
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,inExpOrImpCol)

    let m1 = [[]],m2 = [[]],m3 = [[]]
    inExpOrImpCol.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
        m2[0].push(dataIn1_csv[0][idx])
        m3[0].push(dataIn1_csv[0][idx])
    })

    contextualCols.forEach(val => {
        m1[0].push(val)
        m2[0].push(val)
        m3[0].push(val)
    })

    m1[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })
    m2[0].sort(function(a,b){
        return dataOut1_csv[0].indexOf(a) - dataOut1_csv[0].indexOf(b)
    })
    m3[0].sort(function(a,b){
        return dataOut1_csv[0].indexOf(a) - dataOut1_csv[0].indexOf(b)
    })

    let rowInM2 = [],rowInM3 = []
    let row1 = 1,row2 = 1
    while(row1 < dataIn1_csv.length){
        if(row2 < dataOut1_csv.length && dataIn1_csv[row1][inExpOrImpCol[0]] === dataOut1_csv[row2][inExpOrImpCol[0]]) {
            if(rowInM2.length < 2){
                rowInM2.push(row1)
                row2 += 1
            }
            row1 += 1
        }else{
            if(rowInM3.length < 2)rowInM3.push(row1)
            row1 += 1
        }
        if(rowInM2.length + rowInM3.length === 3)break
    }

    let allRows = rowInM2.concat(rowInM3)
    allRows.sort()

    for(let row = 0;row < allRows.length;row++){
        let tempRow = []
        for (let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(col === inExpOrImpCol[0])tempRow.push(dataIn1_csv[allRows[row]][col])
                else
                    tempRow.push('')
            }
        }
        m1.push(tempRow)
    }
    for(let row = 0;row < rowInM2.length;row++){
        let tempRow = []
        for (let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(col === inExpOrImpCol[0])tempRow.push(dataIn1_csv[rowInM2[row]][col])
                else
                    tempRow.push('')
            }
        }
        m2.push(tempRow)
    }
    for(let row = 0;row < rowInM3.length;row++){
        let tempRow = []
        for (let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(col === inExpOrImpCol[0])tempRow.push(dataIn1_csv[rowInM3[row]][col])
                else
                    tempRow.push('')
            }
        }
        m3.push(tempRow)
    }
    let outColor1 = [],outColor2 = []
    rowInM2.forEach(idx => {
        outColor1.push(allRows.indexOf(idx))
    })
    rowInM3.forEach(idx => {
        outColor2.push(allRows.indexOf(idx))
    })
    for(let col = 0;col < m1[0].length;col++){
        if(m1[0][col] !== dataIn1_csv[0][inExpOrImpCol[0]]){
            m1[0][col] = ''
            m2[0][col] = ''
            m3[0][col] = ''
        }
    }
    return {m1,m2,m3,outColor1,outColor2}
}