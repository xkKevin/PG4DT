
export function generateDataForLeftJoin(dataIn1_csv, dataIn2_csv, dataOut1_csv,inExpOrImpCol,naVal){
    let m1 = [[]],m2 = [[]],m3 = [[]]
    let expVal = dataIn1_csv[0][inExpOrImpCol[0]]

    m1[0].push(expVal)
    m2[0].push(expVal)
    m3[0].push(expVal)
    for(let col = 0;col < dataIn1_csv[0].length;col++){
        if(dataIn1_csv[0][col] !== expVal && dataIn2_csv[0].indexOf(dataIn1_csv[0][col]) === -1){
            m1[0].push(dataIn1_csv[0][col])
            m3[0].push(dataIn1_csv[0][col])
            break
        }
    }
    for(let col = 0;col < dataIn2_csv[0].length;col++){
        if(dataIn2_csv[0][col] !== expVal && dataIn1_csv[0].indexOf(dataIn2_csv[0][col]) === -1){
            m2[0].push(dataIn2_csv[0][col])
            m3[0].push(dataIn2_csv[0][col])
            break
        }
    }
    m1[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })
    m2[0].sort(function(a,b){
        return dataIn2_csv[0].indexOf(a) - dataIn2_csv[0].indexOf(b)
    })
    m3[0].sort(function(a,b){
        return dataOut1_csv[0].indexOf(a) - dataOut1_csv[0].indexOf(b)
    })

    //找到table1的exp列和table2的exp列都存在的值
    //以及table1的exp列存在而table2的exp列不存在的值
    let colVals2 = []
    let sameRows = [],diffRows = -1
    for(let row = 1;row < dataIn2_csv.length;row++){
        colVals2.push(dataIn2_csv[row][dataIn2_csv[0].indexOf(expVal)])
    }
    for(let row = 1;row < dataIn1_csv.length;row++){
        let valPosIn2 = colVals2.indexOf(dataIn1_csv[row][dataIn1_csv[0].indexOf(expVal)])
        if(valPosIn2 === -1){
            diffRows = row
        }else{
            sameRows = [row,valPosIn2 + 1]
        }
        if(sameRows.length !== 0 && diffRows !== -1)break
    }
    let rows1 = [sameRows[0],diffRows]
    rows1.sort()
    let rows2 = [sameRows[1]]
    let inColors2 = diffRows > sameRows[0] ? [0] : [1]
    for(let row = 1;row < dataIn2_csv.length;row++){
        if(dataIn2_csv[row][dataIn2_csv[0].indexOf(expVal)] !== dataIn2_csv[rows2[0]][dataIn2_csv[0].indexOf(expVal)]){
            rows2.push(row)
            inColors2 = row > sameRows[1] ? [2,inColors2[0]] : [inColors2[0],2]
            rows2.sort()
            break
        }
    }
    for(let row = 0;row < rows1.length;row++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(dataIn1_csv[0][col] === expVal)tempRow.push(dataIn1_csv[rows1[row]][col])
                else
                    tempRow.push('')
            }
        }
        m1.push(tempRow)
    }
    for(let row = 0;row < rows2.length;row++){
        let tempRow = []
        for(let col = 0;col < dataIn2_csv[0].length;col++){
            if(m2[0].indexOf(dataIn2_csv[0][col]) !== -1){
                if(dataIn2_csv[0][col] === expVal)tempRow.push(dataIn2_csv[rows2[row]][col])
                else
                    tempRow.push('')
            }
        }
        m2.push(tempRow)
    }
    let naCol,naPos
    for(let row = 0;row < rows1.length;row++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(m3[0].indexOf(dataOut1_csv[0][col]) !== -1){
                if(dataOut1_csv[0][col] === expVal)tempRow.push(dataOut1_csv[rows1[row]][col])
                else
                    tempRow.push('')
                if(dataOut1_csv[rows1[row]][col] === naVal){
                    naCol = m3[0].indexOf(dataOut1_csv[0][col])
                    naPos = row + 1
                }
            }
        }
        m3.push(tempRow)
    }
    return {m1,m2,m3,naCol,naPos,inColors2}
}