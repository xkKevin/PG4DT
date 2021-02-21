
export function generateDataForInnerJoin(dataIn1_csv, dataIn2_csv, dataOut1_csv,inExpOrImpCol,naVal){
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
    let colVals1 = [],colVals2 = [],colVals3 = []
    let sameRows = [],diffRows = []
    for(let row = 1;row < dataIn1_csv.length;row++){
        colVals1.push(dataIn1_csv[row][dataIn1_csv[0].indexOf(expVal)])
    }
    for(let row = 1;row < dataIn2_csv.length;row++){
        colVals2.push(dataIn2_csv[row][dataIn2_csv[0].indexOf(expVal)])
    }
    for(let row = 1;row < dataOut1_csv.length;row++){
        colVals3.push(dataOut1_csv[row][dataOut1_csv[0].indexOf(expVal)])
    }
    for(let row = 1;row < dataIn1_csv.length;row++){
        let valPosIn2 = colVals2.indexOf(dataIn1_csv[row][dataIn1_csv[0].indexOf(expVal)])
        if(valPosIn2 === -1){
            diffRows.push(row)
        }else{
            sameRows = [row,valPosIn2 + 1]
        }
        if(sameRows.length !== 0 && diffRows.length === 1)break
    }
    for(let row = 1;row < dataIn2_csv.length;row++){
        let valPosIn1 = colVals1.indexOf(dataIn2_csv[row][dataIn2_csv[0].indexOf(expVal)])
        if(valPosIn1 === -1){
            diffRows.push(row)
        }
        if(diffRows.length === 2)break
    }

    let rows1 = [],rows2 = [],rows3
    // rows1.sort()
    // let rows2 = [sameRows[1],diffRows[1]]
    // rows2.sort()
    // let rows3 =  [sameRows[0],diffRows[0],diffRows[1]]
    // rows3.sort()
    //默认两张表中均有与对方不同的数据
    if(sameRows.length === 2){
        rows1.push(sameRows[0])
        rows2.push(sameRows[1])
    }
    if(diffRows.length === 1){
        rows1.push(diffRows[0])
    } else if(diffRows.length === 2){
        rows1.push(diffRows[0])
        rows2.push(diffRows[1])
    }
    let inColors2 = sameRows[0] < diffRows[0] ? [0] : [1]
    let outColor = sameRows[0] < diffRows[0] ? [0] : [1]
    inColors2 = sameRows[1] < diffRows[1] ? [inColors2[0],2] : [2,inColors2[0]]
    rows1.sort()
    rows2.sort()
    rows3 = [colVals3.indexOf(dataIn1_csv[sameRows[0]][dataIn1_csv[0].indexOf(expVal)]) + 1]

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
    for(let row = 0;row < rows3.length;row++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(m3[0].indexOf(dataOut1_csv[0][col]) !== -1){
                if(dataOut1_csv[0][col] === expVal)tempRow.push(dataOut1_csv[rows3[row]][col])
                else
                    tempRow.push('')
            }
        }
        m3.push(tempRow)
    }
    return {m1,m2,m3,inColors2,outColor}
}