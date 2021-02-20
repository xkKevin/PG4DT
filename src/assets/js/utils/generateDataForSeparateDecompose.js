import {extractCols} from "./extractContextualCols";

export function generateDataForSeparateDecompose(dataIn1_csv, inExpOrImpCol){
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,inExpOrImpCol)

    let m1 = [[]],m2 = [[]]
    inExpOrImpCol.forEach(idx => {
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
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })

    let rows = [],vals = []
    for(let row = 1;row < dataIn1_csv.length;row++){
        if(vals.indexOf(dataIn1_csv[row][inExpOrImpCol[0]]) === -1){
            rows.push(row)
            vals.push(dataIn1_csv[row][inExpOrImpCol[0]])
        }
        if(rows.length === 3)break
    }

    let tables = []
    for(let idx = 0;idx < rows.length;idx++){
        let tempTable = [Array.from(m2[0])]
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(col === inExpOrImpCol[0])tempRow.push(dataIn1_csv[rows[idx]][col])
                else
                    tempRow.push('')
            }
        }
        for (let col = 0;col < m1[0].length;col++){
            if(tempTable[0][col] !== dataIn1_csv[0][inExpOrImpCol[0]])tempTable[0][col] = ''
        }
        tempTable.push(Array.from(tempRow))
        m1.push(Array.from(tempRow))
        tables.push(tempTable)
    }

    for(let col = 0;col < m1[0].length;col++){
        if(m1[0][col] !== dataIn1_csv[0][inExpOrImpCol[0]]){
            m1[0][col] = ''
        }
    }
    return {m1,tables}
}