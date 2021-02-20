import {extractCols} from "./extractContextualCols";

export function generateDataForSeparateSplit(dataIn1_csv,inExp, inImp){

    let expOrImp = Array.from(inExp)
    inImp.forEach(v => {expOrImp.push(v)})
    expOrImp.sort()
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),expOrImp,expOrImp)

    let m1 = [[]],m2 = [[]],m3 = [[]]
    inExp.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
        m2[0].push(dataIn1_csv[0][idx])
    })
    inImp.forEach(idx => {
        m1[0].push(dataIn1_csv[0][idx])
        m2[0].push(dataIn1_csv[0][idx])
        m3[0].push(dataIn1_csv[0][idx])
    })
    contextualCols.forEach(val => {
        m1[0].push(val)
        m3[0].push(val)
    })

    m1[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })
    m2[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })
    m3[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })

    for(let row = 1;row <= Math.min(3,dataIn1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1)tempRow.push('')

        }
        m1.push(tempRow)
    }

    for(let row = 1;row <= Math.min(3,dataIn1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m2[0].indexOf(dataIn1_csv[0][col]) !== -1)tempRow.push('')
        }
        m2.push(tempRow)
    }

    for(let row = 1;row <= Math.min(3,dataIn1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m3[0].indexOf(dataIn1_csv[0][col]) !== -1)tempRow.push('')
        }
        m3.push(tempRow)
    }
    let colors1 = [],colors2 = []
    for(let col = 0;col < m2[0].length;col++){
        colors1.push(m1[0].indexOf(m2[0][col]))
    }
    for(let col = 0;col < m3[0].length;col++){
        colors2.push(m1[0].indexOf(m3[0][col]))
    }
    for(let col = 0;col < m1[0].length;col++){
        if(contextualCols.indexOf(m1[0][col]) !== -1)
            m1[0][col] = ''
    }
    for(let col = 0;col < m3[0].length;col++){
        if(contextualCols.indexOf(m3[0][col]) !== -1)
            m3[0][col] = ''
    }
    return {m1,m2,m3,colors1,colors2}
}