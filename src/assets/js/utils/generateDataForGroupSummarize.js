import {extractCols} from "./extractContextualCols";

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
export function generateDataForGroupSummarize(dataIn1_csv, dataOut1_csv, inExpOrImpCol, outExpOrImpCol,input_implict_col){

    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,Array.from(new Set(input_implict_col.concat(outExpOrImpCol))))

    // let allExpOrImp = Array.from(new Set(inExpOrImpCol.concat(outExpOrImpCol)))
    let m1 = [[]],m2 = [[]]

    inExpOrImpCol.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
        m2[0].push(dataOut1_csv[0][idx])
    })
    input_implict_col.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
        m2[0].push(dataOut1_csv[0][idx])
    })
    m1[0] = Array.from(new Set(m1[0]))
    m2[0] = Array.from(new Set(m2[0]))
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

    let rows1 = []
    for(let row = 1;row < dataIn1_csv.length;row++){
        if(cmpRow(dataIn1_csv[row],dataOut1_csv[1]) || cmpRow(dataIn1_csv[row],dataOut1_csv[2])){
            rows1.push(row)
        }
    }

    for(let row = 0;row < rows1.length;row ++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(inExpOrImpCol.indexOf(col) !== -1)tempRow.push(dataIn1_csv[rows1[row]][col])
            else if(contextualCols.indexOf(dataIn1_csv[0][col]) !== -1) tempRow.push('')
        }
        m1.push(tempRow)
    }

    let allExpOrImp = Array.from(new Set(input_implict_col.concat(outExpOrImpCol).concat(inExpOrImpCol)))
    for(let row = 1;row <= 2;row ++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(allExpOrImp.indexOf(col) !== -1)tempRow.push(dataOut1_csv[row][col])
            else if(contextualCols.indexOf(dataOut1_csv[0][col]) !== -1) tempRow.push('')
        }
        m2.push(tempRow)
    }

    // let rows = []
    // let vals = []
    // for(let row = 1;row < dataIn1_csv.length;row++) {
    //     if (vals.length === 2 && vals[1] !== dataIn1_csv[row][input_implict_col[0]])
    //         break
    //     rows.push(row)
    //     if (vals.length === 0) {
    //         vals.push(dataIn1_csv[row][input_implict_col[0]])
    //     } else if (vals.length === 1 && vals[0] !== dataIn1_csv[row][input_implict_col[0]]) {
    //         vals.push(dataIn1_csv[row][input_implict_col[0]])
    //     }
    // }
    //
    // for(let row = 0;row < rows.length;row ++){
    //     let tempRow = []
    //     for(let col = 0;col < dataIn1_csv[0].length;col++){
    //         if(allExpOrImp.indexOf(col) !== -1)tempRow.push(dataIn1_csv[rows[row]][col])
    //         else if(contextualCols.indexOf(dataIn1_csv[0][col]) !== -1) tempRow.push('')
    //     }
    //     m1.push(tempRow)
    // }
    //
    //
    // for(let row = 1;row <= vals.length;row ++){
    //     let tempRow = []
    //     for(let col = 0;col < dataOut1_csv[0].length;col++){
    //         if(allExpOrImp.indexOf(col) !== -1)tempRow.push(dataOut1_csv[row][col])
    //         else if(contextualCols.indexOf(dataOut1_csv[0][col]) !== -1) tempRow.push('')
    //     }
    //     m2.push(tempRow)
    // }
    //
    // let colVals = []
    // for(let col = 0;col < allExpOrImp.length;col++){
    //     colVals.push(dataIn1_csv[0][allExpOrImp[col]])
    // }
    // for(let col = 0;col < m1[0].length;col++){
    //     if(colVals.indexOf(m1[0][col]) === -1){
    //         m1[0][col] = ''
    //         m2[0][col] = ''
    //     }
    // }

    return {m1,m2}
}