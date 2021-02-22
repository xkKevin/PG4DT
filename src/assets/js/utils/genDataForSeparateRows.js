import {extractCols} from "./common/extractContextualCols";

export function generateDataForSeparateRows(dataIn1_csv,dataOut1_csv,expCol) {
    let m1 = [[]],m2 = [[]]
    let outColors = []
    for(let col = 0;col < dataIn1_csv[0].length;col++){
        if(col !== expCol[0] && dataIn1_csv[0].indexOf(dataIn1_csv[0][col]) !== col)dataIn1_csv[0][col] += '_'
    }
    for(let col = 0;col < dataOut1_csv[0].length;col++){
        if(col !== expCol[0] && dataOut1_csv[0].indexOf(dataOut1_csv[0][col]) !== col)dataOut1_csv[0][col] += '_'
    }
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),expCol,expCol)

    m1[0].push(dataIn1_csv[0][expCol[0]])
    m2[0].push(dataOut1_csv[0][expCol[0]])

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
    let sameRows = -1
    let diffRow = -1
    let row1 = 1,row2 = 1;
    while(row1 < dataIn1_csv.length && row2 < dataOut1_csv.length){
        if(dataIn1_csv[row1][expCol[0]] === dataOut1_csv[row2][expCol[0]]){
            if(sameRows === -1)sameRows = row2
            row1 += 1
        }else{
            if(diffRow === -1) diffRow = row2
        }
        row2 += 1
        if(sameRows !== -1 && diffRow !== -1)break
    }

    let rows1 = [],rows2 = [],outColor = []
    if(sameRows !== -1){
        if(sameRows < diffRow){
            rows1 = [sameRows,diffRow]
            rows2 = [sameRows,diffRow,diffRow + 1]
            outColors = [0,1,1]
        }else{
            rows1 = [diffRow,sameRows]
            rows2 = [diffRow,diffRow + 1,sameRows]
            outColors = [0,0,1]
        }
    }else{
        rows1 = [diffRow]
        rows2 = [diffRow,diffRow + 1]
        outColors = [0,0]
    }

    for(let row = 0;row < rows1.length;row ++){
        let tempRow = []
        for(let col = 0;col < m1[0].length;col++){
            if(m1[0][col] === dataIn1_csv[0][expCol[0]])tempRow.push(dataIn1_csv[rows1[row]][expCol[0]])
            else
                tempRow.push('')
        }
        m1.push(tempRow)
    }
    for(let row = 0;row < rows2.length;row ++){
        let tempRow = []
        for(let col = 0;col < m2[0].length;col++){
            if(m2[0][col] === dataIn1_csv[0][expCol[0]])tempRow.push(dataOut1_csv[rows2[row]][expCol[0]])
            else
                tempRow.push('')
        }
        m2.push(tempRow)
    }
    for(let col = 0;col < m1[0].length;col++){
        if(m1[0][col] !== dataIn1_csv[0][expCol[0]])m1[0][col] = ''
    }
    for(let col = 0;col < m2[0].length;col++){
        if(m2[0][col] !== dataOut1_csv[0][expCol[0]])m2[0][col] = ''
    }
    return {m1,m2,outColors}
}