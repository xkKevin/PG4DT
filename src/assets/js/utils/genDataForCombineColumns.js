import {extractCols} from "./common/extractContextualCols";

export function generateDataForMergeColumns(dataIn1_csv, dataOut1_csv, inExpOrImpCol, outExpOrImpCol){

    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,inExpOrImpCol)

    let m1 = [[]],m2 = [[]]
    inExpOrImpCol.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
    })
    outExpOrImpCol.forEach(idx => {
        m2[0].push(dataOut1_csv[0][idx])
    })
    let contextualVal = []
    contextualCols.forEach(val => {
        m1[0].push(val)
        m2[0].push(val)
        contextualVal.push(val)
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
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(inExpOrImpCol.indexOf(col) !== -1)tempRow.push(dataIn1_csv[row][col])
                else
                    tempRow.push('')
            }
        }
        m1.push(tempRow)
    }

    for(let row = 1;row <= Math.min(3,dataOut1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(m2[0].indexOf(dataOut1_csv[0][col]) !== -1){
                if(outExpOrImpCol.indexOf(col) !== -1)tempRow.push(dataOut1_csv[row][col])
                else
                    tempRow.push('')
            }
        }
        m2.push(tempRow)
    }
    let inVals = [],outVals = []
    for(let col = 0;col < inExpOrImpCol.length;col++){
        inVals.push(dataIn1_csv[0][inExpOrImpCol[col]])
    }
    for(let col = 0;col < outExpOrImpCol.length;col++){
        outVals.push(dataOut1_csv[0][outExpOrImpCol[col]])
    }

    let outColors = []
    for(let idx = 0;idx < contextualVal.length;idx++){
        outColors.push(m1[0].indexOf(contextualVal[idx]))
    }
    outColors.push(m1[0].length)

    let newInExpOrImp = [],newOutExpOrImp = []
    for(let col = 0;col < m1[0].length;col++){
        if(inVals.indexOf(m1[0][col]) === -1){
            m1[0][col] = ''
        }else{
            newInExpOrImp.push(col)
        }
    }
    for(let col = 0;col < m2[0].length;col++){
        if(outVals.indexOf(m2[0][col]) === -1){
            m2[0][col] = ''
        }else{
            newOutExpOrImp.push(col)
        }
    }

    return {m1,m2,newInExpOrImp,newOutExpOrImp,outColors}
}