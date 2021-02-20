import {extractCols} from "./extractContextualCols";

export function generateDataForDeleteDuplicateRows_fullRow(dataIn1_csv, dataOut1_csv, duplicated_rows){
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),[],[])
    let m1 = [[]],m2 = [[]]
    let inColors = [],outColors = []

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

    if(duplicated_rows[0] > 1){
        let rows = [1,duplicated_rows[0],duplicated_rows[1]]
        for(let row = 0;row < rows.length;row++){
            let tempRow = []
            for(let col = 0;col < m1[0].length;col++){
                if(row !== 0)tempRow.push(dataIn1_csv[rows[row]][dataIn1_csv[0].indexOf(m1[0][col])])
                else
                    tempRow.push('')
            }
            m1.push(tempRow)
            if(row !== rows.length - 1)m2.push(tempRow)
        }
        inColors = [0,1,1]
        outColors = [0,1]
    }else if(duplicated_rows[1] < dataIn1_csv.length - 1){
        let rows = [duplicated_rows[0],duplicated_rows[1],dataIn1_csv.length - 1]
        for(let row = 0;row < rows.length;row++){
            let tempRow = []
            for(let col = 0;col < m1[0].length;col++){
                if(row !== rows.length - 1 && m1[0][col] !== '')tempRow.push(dataIn1_csv[rows[row]][dataIn1_csv[0].indexOf(m1[0][col])])
                else
                    tempRow.push('')
            }
            m1.push(tempRow)
            if(row !== 0)m2.push(tempRow)
        }
        inColors = [0,0,1]
        outColors = [0,1]
    }else{
        let rows = [duplicated_rows[0],duplicated_rows[1]]
        for(let row = 0;row < rows.length;row++) {
            let tempRow = []
            for (let col = 0; col < m1[0].length; col++) {
                if (m1[0][col] !== '') tempRow.push(dataIn1_csv[rows[row]][dataIn1_csv[0].indexOf(m1[0][col])])
                else
                    tempRow.push('')
            }
            m1.push(tempRow)
            if (row !== 0) m2.push(tempRow)
        }
        inColors = [0,0]
        outColors = [0]
    }
    for(let col = 0;col < m1[0].length;col++){
        m1[0][col] = ''
        m2[0][col] = ''
    }
    return {m1,m2,inColors,outColors}
}