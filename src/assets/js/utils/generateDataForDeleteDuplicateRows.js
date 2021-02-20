import {extractCols} from "./extractContextualCols";

export function generateDataForDeleteDuplicateRows(dataIn1_csv, dataOut1_csv, duplicated_rows, duplicated_col){
    let expOrImp = [duplicated_col]
    for(let col = 0;col < dataIn1_csv[0].length;col++){
        if(col !== duplicated_col && dataIn1_csv[0].indexOf(dataIn1_csv[0][col]) !== col)dataIn1_csv[0][col] += '_'
    }
    for(let col = 0;col < dataOut1_csv[0].length;col++){
        if(col !== duplicated_col && dataOut1_csv[0].indexOf(dataOut1_csv[0][col]) !== col)dataOut1_csv[0][col] += '_'
    }
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),expOrImp,expOrImp)
    let m1 = [[]],m2 = [[]]
    let outColors = []

    m1[0].push(dataIn1_csv[0][duplicated_col])
    m2[0].push(dataOut1_csv[0][duplicated_col])

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

    for(let col = 0;col < m1[0].length;col++){
        if(m1[0][col] !== dataIn1_csv[0][duplicated_col])m1[0][col] = ''
    }
    for(let col = 0;col < m2[0].length;col++){
        if(m2[0][col] !== dataOut1_csv[0][duplicated_col])m2[0][col] = ''
    }

    if(duplicated_rows[0] > 1){
        let rows = [1,duplicated_rows[0],duplicated_rows[1]]
        for(let row = 0;row < rows.length;row++){
            let tempRow = []
            for(let col = 0;col < m1[0].length;col++){
                if(row !== 0 && m1[0][col] !== '')tempRow.push(dataIn1_csv[rows[row]][duplicated_col])
                else
                    tempRow.push('')
            }
            m1.push(tempRow)
            if(row !== rows.length - 1)m2.push(tempRow)
        }
        outColors = [0,1]
    }else if(duplicated_rows[1] < dataIn1_csv.length - 1){
        let rows = [duplicated_rows[0],duplicated_rows[1],dataIn1_csv.length - 1]
        for(let row = 0;row < rows.length;row++){
            let tempRow = []
            for(let col = 0;col < m1[0].length;col++){
                if(row !== rows.length - 1 && m1[0][col] !== '')tempRow.push(dataIn1_csv[rows[row]][duplicated_col])
                else
                    tempRow.push('')
            }
            m1.push(tempRow)
            if(row !== 0)m2.push(tempRow)
        }
        outColors = [0,2]
    }else{
        let rows = [duplicated_rows[0],duplicated_rows[1]]
        for(let row = 0;row < rows.length;row++) {
            let tempRow = []
            for (let col = 0; col < m1[0].length; col++) {
                if (m1[0][col] !== '') tempRow.push(dataIn1_csv[rows[row]][duplicated_col])
                else
                    tempRow.push('')
            }
            m1.push(tempRow)
            if (row !== 0) m2.push(tempRow)
        }
        outColors = [0]
    }

    return {m1,m2,outColors}
}