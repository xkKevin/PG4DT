import {extractCols} from "./extractContextualCols";

export function generateDataForDeleteNaColumn(dataIn1_csv, dataOut1_csv){
    let naCol,naRow
    let Row,Col
    for(let row = 1;row < dataIn1_csv.length;row++){
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(dataIn1_csv[row][col] === ''){
                naCol = col
                naRow = row
                break
            }
        }
    }

    for(let col = 0;col < dataIn1_csv[0].length;col++){
        while(col !== naCol && (dataIn1_csv[0].indexOf(dataIn1_csv[0][col]) !== col))dataIn1_csv[0][col] += '_'
    }
    for(let col = 0;col < dataOut1_csv[0].length;col++){
        while(dataOut1_csv[0].indexOf(dataOut1_csv[0][col])!== col)dataOut1_csv[0][col] += '_'
    }

    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),[naCol],[])

    let m1 = [[]],m2 = [[]]
    let inColors,outColors
    m1[0].push(dataIn1_csv[0][naCol])

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

    if(naRow === 1){
        Row = 1
        for(let row = 1;row <= Math.min(3,dataIn1_csv.length - 1);row++){
            let tempRow1 = []
            for(let col = 0;col < m1[0].length;col++){
                tempRow1.push('')
            }
            m1.push(tempRow1)
            let tempRow2 = []
            for(let col = 0;col < m2[0].length;col++){
                tempRow2.push('')
            }
            m2.push(tempRow2)
        }
    }else if(naRow === dataIn1_csv.length - 1){
        Row = 3
        for(let row = Math.max(1,dataIn1_csv.length - 3);row <= dataIn1_csv.length - 1;row++){
            let tempRow1 = []
            for(let col = 0;col < m1[0].length;col++){
                tempRow1.push('')
            }
            m1.push(tempRow1)
            let tempRow2 = []
            for(let col = 0;col < m2[0].length;col++){
                tempRow2.push('')
            }
            m2.push(tempRow2)
        }
    }else{
        Row = 2
        let rows = [naRow - 1,naRow,naRow + 1]
        for(let row = 0;row <= rows.length - 1;row++){
            let tempRow1 = []
            for(let col = 0;col < m1[0].length;col++){
                tempRow1.push('')
            }
            m1.push(tempRow1)
            let tempRow2 = []
            for(let col = 0;col < m2[0].length;col++){
                tempRow2.push('')
            }
            m2.push(tempRow2)
        }
    }
    for(let col = 0;col < m1[0].length;col++){
        if(m1[0][col] !== dataIn1_csv[0][naCol])m1[0][col] = ''
    }
    for(let col = 0;col < m2[0].length;col++){
        m2[0][col] = ''
    }
    if(m1[0].indexOf(dataIn1_csv[0][naCol]) === 0){
        Col = 0
        if(m1[0].length >= 3){
            inColors = [0,1,2]
            outColors = [1,2]
        }else if(m1[0].length === 2){
            inColors = [0,1]
            outColors = [1]
        }else{
            inColors = [0]
            outColors = []
        }
    }else if(m1[0].indexOf(dataIn1_csv[0][naCol]) === 1){
        Col = 1
        if(m1[0].length >= 3){
            inColors = [0,1,2]
            outColors = [0,2]
        }else if(m1[0].length === 2){
            inColors = [0,1]
            outColors = [0]
        }
    }else{
        Col = 2
        inColors = [0,1,2]
        outColors = [0,1]
    }
    return {m1,m2,inColors,outColors,Row,Col}
}