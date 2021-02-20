import {extractCols} from "./extractContextualCols";

export function generateDataForFilterRow(dataIn1_csv,dataOut1_csv,expCol) {
    let m1 = [[]],m2 = [[]]
    let outColors = []
    for(let col = 0;col < dataIn1_csv[0].length;col++){
        if(col !== expCol && dataIn1_csv[0].indexOf(dataIn1_csv[0][col]) !== col)dataIn1_csv[0][col] += '_'
    }
    for(let col = 0;col < dataOut1_csv[0].length;col++){
        if(col !== expCol && dataOut1_csv[0].indexOf(dataOut1_csv[0][col]) !== col)dataOut1_csv[0][col] += '_'
    }
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),[expCol],[expCol])

    m1[0].push(dataIn1_csv[0][expCol])
    m2[0].push(dataOut1_csv[0][expCol])

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
    let sameRows = []
    let diffRow = -1
    let outRows = []
    let row1 = 1,row2 = 1;
    while(row1 < dataIn1_csv.length && row2 < dataOut1_csv.length){
        if(dataIn1_csv[row1][expCol] === dataOut1_csv[row2][expCol]){
            if(sameRows.length < 2)sameRows.push(row1)
            row1 += 1
            row2 += 1
        }else{
            if(diffRow === -1) diffRow = row1
            row1 += 1
        }
        if(sameRows.length === 2 && diffRow !== -1)break
    }

    if(sameRows.length === 2){
        if(diffRow < sameRows[0]){
            outColors = [1,2]
            outRows = [sameRows[0] - 1,sameRows[1] - 1]
        }
        else if(diffRow < sameRows[1]){
            outColors = [0,2]
            outRows = [sameRows[0],sameRows[1] - 1]
        }
        else {
            outColors = [0,1]
            outRows = [sameRows[0],sameRows[1]]
        }
    }else if(sameRows.length === 1){
        if(diffRow < sameRows[0]){
            outColors = [1]
            outRows = [sameRows[0] - 1]
        }
        else {
            outColors = [0]
            outRows = [sameRows[0]]
        }
    }

    let allRows = diffRow !== -1 ? sameRows.concat(diffRow).sort() : sameRows

    for(let row = 0;row < allRows.length;row ++){
        let tempRow = []
        for(let col = 0;col < m1[0].length;col++){
            if(m1[0][col] === dataIn1_csv[0][expCol])tempRow.push(dataIn1_csv[allRows[row]][expCol])
            else
                tempRow.push('')
        }
        m1.push(tempRow)
    }
    for(let row = 0;row < outRows.length;row ++){
        let tempRow = []
        for(let col = 0;col < m2[0].length;col++){
            if(m2[0][col] === dataIn1_csv[0][expCol])tempRow.push(dataOut1_csv[outRows[row]][expCol])
            else
                tempRow.push('')
        }
        m2.push(tempRow)
    }
    for(let col = 0;col < m1[0].length;col++){
        if(m1[0][col] !== dataIn1_csv[0][expCol])m1[0][col] = ''
    }
    for(let col = 0;col < m2[0].length;col++){
        if(m2[0][col] !== dataOut1_csv[0][expCol])m2[0][col] = ''
    }
    return {m1,m2,outColors}
}