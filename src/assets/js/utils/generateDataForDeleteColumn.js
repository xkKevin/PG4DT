import {extractCols} from "./extractContextualCols";

export function generateDataForDeleteColumn(dataIn1_csv, dataOut1_csv, inExpOrImpCol, outExpOrImpCol){

    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,outExpOrImpCol)
    for(let col = 0;col < dataIn1_csv.length;col++){
        if(col !== inExpOrImpCol[0] && dataIn1_csv[0][col] === dataIn1_csv[0][inExpOrImpCol[0]])
            dataIn1_csv[0][col] += '_'
    }
    for(let col = 0;col < dataOut1_csv.length;col++){
        if(col !== inExpOrImpCol[0] && dataOut1_csv[0][col] === dataIn1_csv[0][inExpOrImpCol[0]])
            dataOut1_csv[0][col] += '_'
    }
    let m1 = [[]],m2 = [[]]
    let inColors,outColors
    inExpOrImpCol.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
    })
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

    for(let row = 1;row <= Math.min(3,dataIn1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) != -1)tempRow.push('')
        }
        m1.push(tempRow)
    }

    for(let row = 1;row <= Math.min(3,dataOut1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(m2[0].indexOf(dataOut1_csv[0][col]) != -1)tempRow.push('')
        }
        m2.push(tempRow)
    }

    for(let col = 0;col < m1[0].length;col ++)
        if(m1[0][col] !== dataIn1_csv[0][inExpOrImpCol[0]])m1[0][col] = ''
    for(let col = 0;col < m2[0].length;col ++)
        if(m2[0][col] !== dataIn1_csv[0][inExpOrImpCol[0]])m2[0][col] = ''

    if(m1[0].indexOf(dataIn1_csv[0][inExpOrImpCol[0]]) === 0){
        if(m1[0].length === 3){
            inColors = [0,1,2]
            outColors = [1,2]
        }else if(m1[0].length === 2){
            inColors = [0,1]
            outColors = [1]
        }else{
            inColors = [0]
            outColors = []
        }
    }else if(m1[0].indexOf(dataIn1_csv[0][inExpOrImpCol[0]]) === 1){
        if(m1[0].length === 3){
            inColors = [0,1,2]
            outColors = [0,2]
        }else if(m1[0].length === 2){
            inColors = [0,1]
            outColors = [0]
        }
    }else{
        inColors = [0,1,2]
        outColors = [0,1]
    }
    return {m1,m2,inColors,outColors}
}