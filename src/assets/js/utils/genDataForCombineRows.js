import {extractCols} from "./common/extractContextualCols";

function cmpRow(row1,row2){
    let flag = true
    for(let col = 0;col < row1.length;col++){
        if(row1[col] !== row2[col]){
            flag = false
            break
        }
    }
    return flag
}
function generateDataForGroupSummarize(dataIn1_csv, dataOut1_csv, inExpOrImpCol, outExpOrImpCol){

    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,inExpOrImpCol)

    // let allExpOrImp = Array.from(new Set(inExpOrImpCol.concat(outExpOrImpCol)))
    let m1 = [[]],m2 = [[]]

    inExpOrImpCol.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
        // m2[0].push(dataOut1_csv[0][idx])
    })
    
    // m1[0] = Array.from(new Set(m1[0]))
    // m2[0] = Array.from(new Set(m2[0]))
    outExpOrImpCol.forEach(idx => {
        m2[0].push(dataOut1_csv[0][idx])
    })

    contextualCols.forEach(val => {
        m1[0].push(val)
        // m2[0].push(val)
    })

    m1[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })
    m2[0].sort(function(a,b){
        return dataOut1_csv[0].indexOf(a) - dataOut1_csv[0].indexOf(b)
    })

    for(let row = 1;row < Math.min(dataIn1_csv.length,4);row++){
        let tempRow = []
        for(let col = 0;col < m1[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(inExpOrImpCol.indexOf(col) !== -1)tempRow.push(dataIn1_csv[row][col])
                else{
                    tempRow.push("")
                }
            }
        }
        m1.push(tempRow)
    }
    for(let row = 1;row < Math.min(dataOut1_csv.length,4);row++){
        let tempRow = []
        for(let col = 0;col < m2[0].length;col++){
            if(m2[0].indexOf(dataOut1_csv[0][col]) !== -1){
                if(outExpOrImpCol.indexOf(col) !== -1)tempRow.push(dataOut1_csv[row][col])
                else{
                    tempRow.push("")
                }
            }
        }
        m2.push(tempRow)
    }
    for(let col = 0;col < m1[0].length;col++){
        if(inExpOrImpCol.indexOf(dataIn1_csv[0].indexOf(m1[0][col])) === -1)m1[0][col] = ''
    }
    for(let col = 0;col < m2[0].length;col++){
        if(outExpOrImpCol.indexOf(dataOut1_csv[0].indexOf(m2[0][col])) === -1)m2[0][col] = ''
    }
    // let rows1 = []
    // for(let row = 1;row < dataIn1_csv.length;row++){
    //     if(cmpRow(dataIn1_csv[row],dataOut1_csv[1]) || cmpRow(dataIn1_csv[row],dataOut1_csv[2])){
    //         rows1.push(row)
    //     }
    // }

    // for(let row = 0;row < rows1.length;row ++){
    //     let tempRow = []
    //     for(let col = 0;col < dataIn1_csv[0].length;col++){
    //         if(inExpOrImpCol.indexOf(col) !== -1)tempRow.push(dataIn1_csv[rows1[row]][col])
    //         else if(contextualCols.indexOf(dataIn1_csv[0][col]) !== -1) tempRow.push('')
    //     }
    //     m1.push(tempRow)
    // }

    // let allExpOrImp = Array.from(new Set(input_implict_col.concat(outExpOrImpCol).concat(inExpOrImpCol)))
    // for(let row = 1;row <= 2;row ++){
    //     let tempRow = []
    //     for(let col = 0;col < dataOut1_csv[0].length;col++){
    //         if(allExpOrImp.indexOf(col) !== -1)tempRow.push(dataOut1_csv[row][col])
    //         else if(contextualCols.indexOf(dataOut1_csv[0][col]) !== -1) tempRow.push('')
    //     }
    //     m2.push(tempRow)
    // }

    return {m1,m2}
}

function generateDataForRowInterpolate(dataIn1_csv, dataOut1_csv, inExpOrImpCol){
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

export {generateDataForRowInterpolate,generateDataForGroupSummarize}