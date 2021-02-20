import {extractCols} from "./extractContextualCols";

export function generateDataForRowInterpolate(dataIn1_csv, dataOut1_csv, inExpOrImpCol){
    //要求相邻范围内只能有一个空值

    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,inExpOrImpCol)

    let m1 = [[]],m2 = [[]]
    inExpOrImpCol.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
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

    let naRow = 0,naCol = 0
    for(let row = 1;row < dataIn1_csv[0].length;row++){
        if(dataIn1_csv[row][inExpOrImpCol[0]] === ''){
            naRow = row
            break
        }
    }
    let rows = []
    if(naRow > 1 && naRow < dataIn1_csv.length - 1){
        rows = [naRow - 1,naRow,naRow + 1]
        naRow = 2
    }else if(naRow === 1){
        if(dataIn1_csv.length > 3){
            rows = [naRow,naRow + 1,naRow + 2]
            naRow = 1
        }else if(dataIn1_csv.length === 3){
            rows = [naRow,naRow + 1]
            naRow = 1
        }else{
            rows = [naRow]
            naRow = 1
        }
    }else{
        if(dataIn1_csv.length > 3){
            rows = [naRow - 2,naRow - 1,naRow]
            naRow = 4
        }else if(dataIn1_csv.length === 3){
            rows = [naRow - 1,naRow]
            naRow = 3
        }else{
            rows = [naRow]
            naRow = 2
        }
    }
    for(let row = 0;row < rows.length;row++){
        let tempRow1 = [],tempRow2 = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(col === inExpOrImpCol[0]){
                tempRow1.push(dataIn1_csv[rows[row]][col])
                tempRow2.push(dataOut1_csv[rows[row]][col])
            }
            else if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                tempRow1.push('')
                tempRow2.push('')
            }
        }
        m1.push(tempRow1)
        m2.push(tempRow2)
    }
    for(let col = 0;col < m1[0].length;col++){
        if(m1[0][col] !== dataIn1_csv[0][inExpOrImpCol[0]]){
            m1[0][col] = ''
            m2[0][col] = ''
        }else{
            m2[0][col] = dataOut1_csv[0][inExpOrImpCol[0]]
        }
    }
    naCol = m1[0].indexOf(dataIn1_csv[0][inExpOrImpCol[0]])
    let naPos = [naRow,naCol]
    return {m1,m2,naPos}
}