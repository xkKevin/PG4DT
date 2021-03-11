import {extractCols} from "./common/extractContextualCols";
 function generateDataForTablesExtend(dataIn1_csv, dataIn2_csv,dataOut1_csv){
    let m1 = [[]],m2 = [[]],m3 = [[]]
    for(let col = 0;col < Math.min(dataIn1_csv[0].length,3);col++){
        m1[0].push('')
        m2[0].push('')
        m3[0].push('')
    }

    console.log("m1: ",m1,m2,m3)

    for(let row = 1;row < Math.min(4,dataIn1_csv.length);row++){
        let tempRow = []
        for(let col = 0;col < m1[0].length;col++){
            tempRow.push('')
        }
        m1.push(tempRow)
        m3.push(tempRow)
    }


    console.log("m1: ",m1,m2,m3)
    for(let row = 1;row < Math.min(4,dataIn2_csv.length);row++){
        let tempRow = []
        for(let col = 0;col < m2[0].length;col++){
            tempRow.push('')
        }
        m2.push(tempRow)
        m3.push(tempRow)
    }

    console.log("m1: ",m1,m2,m3)
    let inColors1 = [],inColors2 = [],outColors = []
    for(let row = 1;row < m2.length;row++){
        inColors2.push(m1.length - 2 + row)
    }
   
    return {m1,m2,m3,inColors1,inColors2,outColors}
}

function cmpRows(r1,r2,inExpCols) {
    let flag = true
    for(let col = 0;col < inExpCols.length;col++){
        if(r1[inExpCols[col]] !== r2[inExpCols[col]]){
            flag = false
            break
        }
    }
    return flag
}
function dropDupRowForTable(data_csv,expCol){
    let newCsv = []
    newCsv.push(data_csv[0])
    for(let row = 1;row < data_csv.length;row++){
        let flag = true
        for(let newRow = 1;newRow < newCsv.length;newRow++){
            if(cmpRows(data_csv[row],newCsv[newRow],expCol)){
                flag = false
                break
            }
        }
        if(flag)newCsv.push(data_csv[row])
    }
    return newCsv
}
function generateDataForLeftJoin(dataIn1_csv, dataIn2_csv, dataOut1_csv,inExpOrImpCol,naVal){
    let expVal = dataIn1_csv[0][inExpOrImpCol[0]]
    dataIn1_csv = dropDupRowForTable(dataIn1_csv,[dataIn1_csv[0].indexOf(expVal)])
    dataIn2_csv = dropDupRowForTable(dataIn2_csv,[dataIn2_csv[0].indexOf(expVal)])
    dataOut1_csv = dropDupRowForTable(dataOut1_csv,[dataOut1_csv[0].indexOf(expVal)])
    let m1 = [[]],m2 = [[]],m3 = [[]]

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
            if(sameRows.length === 0)sameRows = [row,valPosIn2 + 1]
        }
        if(sameRows.length !== 0 && diffRows !== -1)break
    }

    console.log(sameRows,diffRows)

    let rows1 = [sameRows[0],diffRows]
    rows1.sort()
    let rows2 = [sameRows[1]]
    let inColors2 = diffRows > sameRows[0] ? [0] : [1]
    for(let row = sameRows[1];row < dataIn2_csv.length;row++){
        if(dataIn2_csv[row][dataIn2_csv[0].indexOf(expVal)] !== dataIn2_csv[rows2[0]][dataIn2_csv[0].indexOf(expVal)]){
            rows2.push(row)
            inColors2 = row < sameRows[1] ? [2,inColors2[0]] : [inColors2[0],2]
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

function generateDataForLeftJoin_2(dataIn1_csv,dataIn2_csv,dataOut1_csv,inExpCols,naVal){
    let m1 = [[]],m2 =[[]],m3 = [[]]
    inExpCols.forEach(idx =>{
        m1[0].push(dataIn1_csv[0][idx])
        m2[0].push(dataIn1_csv[0][idx])
        m3[0].push(dataIn1_csv[0][idx])
    })
    for(let col = 0;col < dataIn1_csv[0].length;col++){
        if(dataIn2_csv[0].indexOf(dataIn1_csv[0][col]) === -1){
            m1[0].push(dataIn1_csv[0][col])
            m3[0].push(dataIn1_csv[0][col])
            break
        }
    }
    for(let col = 0;col < dataIn2_csv[0].length;col++){
        if(dataIn1_csv[0].indexOf(dataIn2_csv[0][col]) === -1){
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
    //找到两张表都存在的行
    //找到表一中存在而表二中不存在的行
    
    let sameRows = [],diffRow = -1
    for(let row1 = 1; row1 < dataIn1_csv.length; row1++){
        let flag = true
        for(let row2 = 1;row2 < dataIn2_csv.length; row2++){
            if(cmpRows(dataIn1_csv[row1],dataIn2_csv[row2],inExpCols)){
                flag = false
                if(sameRows.length === 0){
                    sameRows = [row1,row2]
                    break
                }
            }
        }
        if(flag && diffRow === -1)diffRow = row1
        if(sameRows.length === 2 && diffRow !== -1)break
    }

    let rows1 = [],rows2 = [],rows3 = []
    if(sameRows.length === 0){
        rows1 = Array.from(new Array(Math.max(2,dataIn1_csv.length - 1)),(x,i) => i + 1)
        rows2 = Array.from(new Array(Math.max(2,dataIn2_csv.length - 1)),(x,i) => i + 1)
        rows3 = Array.from(new Array(Math.max(2,dataIn1_csv.length - 1)),(x,i) => i + 1)
    }else if(diffRow === -1){
        rows1 = [1],rows3 = [1],rows2 = [sameRows[1]]
        
        for(let row = 2;row < dataIn1_csv.length;row++){
            if(!cmpRows(dataIn1_csv[1],dataIn1_csv[row],inExpCols)){
                rows1.push(row)
                break
            }
        }
        
        for(let row = 1;row < dataIn2_csv.length;row++){
            if(row !== rows2[0] && !cmpRows(dataIn2_csv[rows2[0]],dataIn2_csv[row],inExpCols)){
                rows2.push(row)
                break
            }
        }
        if(rows1.length === 1){
            if(rows2.length !== 1){
                for(let row = 2;row < dataOut1_csv.length;row++){
                    if(!cmpRows(dataOut1_csv[1],dataOut1_csv[row],inExpCols)){
                        rows3.push(row)
                        break
                    }
                }
            }else{
                if(dataIn2_csv.length > 2){
                    rows2 = [1,2]
                    rows3 = [1,2]
                }else{
                    rows2 = [1]
                    rows3 = [1]
                }
            }
        }
    }else{
        rows1 = [sameRows[0],diffRow]
        rows3 = [sameRows[0]]
        rows2 = [sameRows[1]]
        for(let row = 1;row < dataIn2_csv.length;row++){
            if(!cmpRows(dataIn2_csv[rows2[0]],dataIn2_csv[row],inExpCols)){
                rows2.push(row)
                break
            }
        }
        if(rows2.length > 1){
            for(let row = 1;row < dataOut1_csv.length;row++){
                if(cmpRows(dataOut1_csv[row],dataIn1_csv[diffRow],inExpCols)){
                    rows3.push(row)
                    break
                }
            }
        }
    }
    rows1.sort()
    rows2.sort()
    rows3.sort()
    let inColor1 = [],inColor2 = [],outColor = []
    let allRows = []
    for(let r1 = 0;r1 < rows1.length;r1++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(inExpCols.indexOf(col) !== -1){
                    tempRow.push(dataIn1_csv[rows1[r1]][col])
                }else{
                    tempRow.push('')
                }
            }
        }
        let isIn = false
        for(let r = 0;r < allRows.length;r++){
            if(cmpRows(allRows[r],tempRow,inExpCols)){
                isIn = true
                inColor1.push(r)
            }
        }
        if(!isIn){
            inColor1.push(allRows.length)
            allRows.push(Array.from(tempRow))
        }
        m1.push(tempRow)
    }
    for(let r2 = 0;r2 < rows2.length;r2++){
        let tempRow = []
        for(let col = 0;col < dataIn2_csv[0].length;col++){
            if(m2[0].indexOf(dataIn2_csv[0][col]) !== -1){
                if(inExpCols.indexOf(col) !== -1){
                    tempRow.push(dataIn2_csv[rows2[r2]][col])
                }else{
                    tempRow.push('')
                }
            }
        }
        let isIn = false
        for(let r = 0;r < allRows.length;r++){
            if(cmpRows(allRows[r],tempRow,inExpCols)){
                isIn = true
                inColor2.push(r)
            }
        }
        if(!isIn){
            inColor2.push(allRows.length)
            allRows.push(Array.from(tempRow))
        }
        m2.push(tempRow)
    }

    let naPos = [],naCol = []
    for(let r3 = 0;r3 < rows3.length;r3++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(m3[0].indexOf(dataOut1_csv[0][col]) !== -1){
                if(inExpCols.indexOf(col) !== -1){
                    tempRow.push(dataOut1_csv[rows3[r3]][col])
                }else{
                    tempRow.push('')
                }
                if(dataOut1_csv[rows3[r3]][col] === naVal){
                    naCol.push(col)
                    naPos.push(r3 + 1)
                }
            }
        }
        let isIn = false
        for(let r = 0;r < allRows.length;r++){
            if(cmpRows(allRows[r],tempRow,inExpCols)){
                isIn = true
                outColor.push(r)
            }
        }
        if(!isIn){
            outColor.push(allRows.length)
            allRows.push(Array.from(tempRow))
        }
        m3.push(tempRow)
    }
    return {m1,m2,m3,inColor1,inColor2,outColor,naPos,naCol}
}


function generateDataForFullJoin(dataIn1_csv, dataIn2_csv, dataOut1_csv,inExpOrImpCol,naVal){
    let m1 = [[]],m2 = [[]],m3 = [[]]
    let expVal = dataIn1_csv[0][inExpOrImpCol[0]]
    dataIn1_csv = dropDupRowForTable(dataIn1_csv,[dataIn1_csv[0].indexOf(expVal)])
    dataIn2_csv = dropDupRowForTable(dataIn2_csv,[dataIn2_csv[0].indexOf(expVal)])
    dataOut1_csv = dropDupRowForTable(dataOut1_csv,[dataOut1_csv[0].indexOf(expVal)])

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
            if(sameRows.length === 0)sameRows = [row,valPosIn2 + 1]
        }
        if(sameRows.length !== 0 && diffRows.length === 1)break
    }
    if(diffRows.length === 0){
        diffRows = [-1]
    }
    for(let row = 1;row < dataIn2_csv.length;row++){
        let valPosIn1 = colVals1.indexOf(dataIn2_csv[row][dataIn2_csv[0].indexOf(expVal)])
        if(valPosIn1 === -1){
            diffRows.push(row)
        }
        if(diffRows.length === 2)break
    }
    let rows1 = [],rows2 = [],rows3 = []
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
    if(diffRows.length === 1 && diffRows[0] !== -1){
        rows1.push(diffRows[0])
        // if(sameRows[1] > 1){
        //     rows2.push()
        // }
    } else if(diffRows.length === 2){
        if(diffRows[0] !== -1)rows1.push(diffRows[0])
        rows2.push(diffRows[1])
    }

    let inColors2 = sameRows[0] < diffRows[0] ? [0] : [1]
    if(diffRows.length === 1){
        inColors2 = sameRows[0] < diffRows[0] ? [0] : [1]
    }else{
        if(diffRows[0] !== -1)inColors2 = sameRows[1] < diffRows[1] ? [inColors2[0],2] : [2,inColors2[0]]
        else{
            inColors2 = sameRows[1] < diffRows[1] ? [0,1] : [1,0]
        }    
    }
    rows1.sort()
    rows2.sort()
    for(let row = 0;row < rows1.length;row++){
        let idx = colVals3.indexOf(dataIn1_csv[rows1[row]][dataIn1_csv[0].indexOf(expVal)])
        rows3.push(idx + 1)
    }
    for(let row = 0;row < rows2.length;row++){
        let idx = colVals3.indexOf(dataIn2_csv[rows2[row]][dataIn2_csv[0].indexOf(expVal)])
        rows3.push(idx + 1)
    }
    rows3 = Array.from(new Set(rows3))
    rows3.sort()

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
    let naCol = [],naPos = []
    for(let row = 0;row < rows3.length;row++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(m3[0].indexOf(dataOut1_csv[0][col]) !== -1){
                if(dataOut1_csv[0][col] === expVal)tempRow.push(dataOut1_csv[rows3[row]][col])
                else
                    tempRow.push('')
                if(dataOut1_csv[rows3[row]][col] === naVal){
                    naCol.push(m3[0].indexOf(dataOut1_csv[0][col]))
                    naPos.push(row + 1)
                }
            }
        }
        m3.push(tempRow)
    }
    return {m1,m2,m3,naCol,naPos,inColors2}
}

function generateDataForFullJoin_2(dataIn1_csv, dataIn2_csv, dataOut1_csv,inExpCols,naVal){
    let m1 = [[]],m2 =[[]],m3 = [[]]
    inExpCols.forEach(idx =>{
        m1[0].push(dataIn1_csv[0][idx])
        m2[0].push(dataIn1_csv[0][idx])
        m3[0].push(dataIn1_csv[0][idx])
    })
    for(let col = 0;col < dataIn1_csv[0].length;col++){
        if(dataIn2_csv[0].indexOf(dataIn1_csv[0][col]) === -1){
            m1[0].push(dataIn1_csv[0][col])
            m3[0].push(dataIn1_csv[0][col])
            break
        }
    }
    for(let col = 0;col < dataIn2_csv[0].length;col++){
        if(dataIn1_csv[0].indexOf(dataIn2_csv[0][col]) === -1){
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

    let sameRows = [],notInD2 = -1,notInD1 = -1
    for(let row1 = 1; row1 < dataIn1_csv.length; row1++){
        let flag = true
        for(let row2 = 1;row2 < dataIn2_csv.length; row2++){
            if(cmpRows(dataIn1_csv[row1],dataIn2_csv[row2],inExpCols)){
                flag = false
                if(sameRows.length === 0){
                    sameRows = [row1,row2]
                    break
                }
            }
        }
        if(flag && notInD2 === -1)notInD2 = row1
        if(sameRows.length === 2 && notInD2 !== -1)break
    }

    for(let row2 = 1; row2 < dataIn2_csv.length; row2++){
        let flag = true
        for(let row1 = 1;row1 < dataIn1_csv.length; row1++){
            if(cmpRows(dataIn1_csv[row1],dataIn2_csv[row2],inExpCols)){
                flag = false
                break
            }
        }
        if(flag){
            notInD1 = row2
            break
        }
    }

    let rows1 = [],rows2 = [],rows3 = []
    let sameRows2 = []
    rows1.push(sameRows[0])
    rows2.push(sameRows[1])
    if(notInD1 !== -1 && notInD2 !== -1){
        rows1.push(notInD2)
        rows2.push(notInD1)
    }else if(notInD2 !== -1){
        rows1 = [sameRows[0],notInD2]
        rows2 = [sameRows[1]]
        if(sameRows[1] > 1){
            rows2.push(sameRows[1] - 1)
        }else if(sameRows[1] < dataIn2_csv.length - 1){
            rows2.push(sameRows[1] + 1)
        }
    }else if(notInD1 !== -1){
        rows2 = [sameRows[1],notInD1]
        rows1 = [sameRows[0]]
        if(sameRows[0] > 1){
            rows1.push(sameRows[0] - 1)
        }else if(sameRows[0] < dataIn1_csv.length - 1){
            rows1.push(sameRows[0] + 1)
        }
    }else{
        for(let row1 = 1; row1 < dataIn1_csv.length; row1++){
            for(let row2 = 1;row2 < dataIn2_csv.length; row2++){
                if(cmpRows(dataIn1_csv[row1],dataIn2_csv[row2],inExpCols) && !cmpRows(dataIn1_csv[row1],dataIn1_csv[sameRows[0]],inExpCols)){
                    if(sameRows2.length === 0){
                        rows1.push(row1)
                        rows2.push(row2)
                    }
                }
            }
            if(rows1.length === 2)break
        }
    }
    rows1.sort()
    rows2.sort()
    for(let row = 0;row < rows1.length;row++){
        for(let row3 = 1;row3 < dataOut1_csv.length;row3 ++){
            if(cmpRows(dataOut1_csv[row3],dataIn1_csv[rows1[row]],inExpCols)){
                rows3.push(row3)
                break
            }
        }
    }
    if(sameRows2.length === 0){
        if(!cmpRows(dataIn2_csv[rows2[0]],dataIn2_csv[rows2[1]],inExpCols)){
            for(let row = 0;row < rows2.length;row++){
                for(let row3 = 1;row3 < dataOut1_csv.length;row3++){
                    if(cmpRows(dataOut1_csv[row3],dataIn2_csv[rows2[row]],inExpCols)){
                        rows3.push(row3)
                        break
                    }
                }
            }
        }else{
            for(let row3 = 1;row3 < dataOut1_csv.length;row3 ++){
                if(cmpRows(dataOut1_csv[row3],dataIn2_csv[rows2[0]],inExpCols)){
                    rows3.push(row3)
                    break
                }
            }
        }
    }
  
    // rows3 = Array.from(new Set(rows3))
    rows3.sort()

    let inColor1 = [],inColor2 = [],outColor = []
    let allRows = []
    for(let r1 = 0;r1 < rows1.length;r1++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(inExpCols.indexOf(col) !== -1){
                    tempRow.push(dataIn1_csv[rows1[r1]][col])
                }else{
                    tempRow.push('')
                }
            }
        }
        let isIn = false
        for(let r = 0;r < allRows.length;r++){
            if(cmpRows(allRows[r],tempRow,inExpCols)){
                isIn = true
                inColor1.push(r)
            }
        }
        if(!isIn){
            inColor1.push(allRows.length)
            allRows.push(Array.from(tempRow))
        }
        m1.push(tempRow)
    }
    for(let r2 = 0;r2 < rows2.length;r2++){
        let tempRow = []
        for(let col = 0;col < dataIn2_csv[0].length;col++){
            if(m2[0].indexOf(dataIn2_csv[0][col]) !== -1){
                if(inExpCols.indexOf(col) !== -1){
                    tempRow.push(dataIn2_csv[rows2[r2]][col])
                }else{
                    tempRow.push('')
                }
            }
        }
        let isIn = false
        for(let r = 0;r < allRows.length;r++){
            if(cmpRows(allRows[r],tempRow,inExpCols)){
                isIn = true
                inColor2.push(r)
            }
        }
        if(!isIn){
            inColor2.push(allRows.length)
            allRows.push(Array.from(tempRow))
        }
        m2.push(tempRow)
    }

    let naPos = [],naCol = []
    for(let r3 = 0;r3 < rows3.length;r3++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(m3[0].indexOf(dataOut1_csv[0][col]) !== -1){
                if(inExpCols.indexOf(col) !== -1){
                    tempRow.push(dataOut1_csv[rows3[r3]][col])
                }else{
                    tempRow.push('')
                }
                if(dataOut1_csv[rows3[r3]][col] === naVal){
                    naCol.push(col)
                    naPos.push(r3 + 1)
                }
            }
        }
        let isIn = false
        for(let r = 0;r < allRows.length;r++){
            if(cmpRows(allRows[r],tempRow,inExpCols)){
                isIn = true
                outColor.push(r)
            }
        }
        if(!isIn){
            outColor.push(allRows.length)
            allRows.push(Array.from(tempRow))
        }
        m3.push(tempRow)
    }
    return {m1,m2,m3,inColor1,inColor2,outColor,naPos,naCol}
}

function generateDataForInnerJoin(dataIn1_csv, dataIn2_csv, dataOut1_csv,inExpOrImpCol){
    let m1 = [[]],m2 = [[]],m3 = [[]]
    let expVal = dataIn1_csv[0][inExpOrImpCol[0]]
    dataIn1_csv = dropDupRowForTable(dataIn1_csv,[dataIn1_csv[0].indexOf(expVal)])
    dataIn2_csv = dropDupRowForTable(dataIn2_csv,[dataIn2_csv[0].indexOf(expVal)])
    dataOut1_csv = dropDupRowForTable(dataOut1_csv,[dataOut1_csv[0].indexOf(expVal)])

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
    if(diffRows.length === 0)diffRows.push(-1)
    for(let row = 1;row < dataIn2_csv.length;row++){
        let valPosIn1 = colVals1.indexOf(dataIn2_csv[row][dataIn2_csv[0].indexOf(expVal)])
        if(valPosIn1 === -1){
            diffRows.push(row)
        }
        if(diffRows.length === 2)break
    }

    let rows1 = [],rows2 = [],rows3
    if(sameRows.length === 2){
        rows1.push(sameRows[0])
        rows2.push(sameRows[1])
    }
    if(diffRows.length === 1){
        rows1.push(diffRows[0])
    } else if(diffRows.length === 2){
        if(diffRows[0] !== -1)rows1.push(diffRows[0])
        rows2.push(diffRows[1])
    }
    let inColors2 = []
    let outColor = []
    if(diffRows.length === 1 ){
        inColors2 = sameRows[0] < diffRows[0] ? [0] : [1]
        outColor = inColors2
    }else{
        if(diffRows[0] === -1){
            outColor = [0]
            inColors2 = sameRows[1] < diffRows[1] ? [0,1] : [1,0]
        }else{
            outColor = sameRows[0] < diffRows[0] ? [0] : [1]
            let color0 = sameRows[0] < diffRows[0] ? [0] : [1]
            inColors2 = sameRows[1] < diffRows[1] ? [color0,2] : [2,color0]
        }
    }
    
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

function generateDataForTablesExtend_withExplicitCol(dataIn1_csv, dataIn2_csv, dataOut1_csv,inExpOrImpCol){
    // inExpOrImpCol保存的是值，不是下标
    let contextualCols1 = extractCols(Array.from(dataIn1_csv[0]),[dataIn1_csv[0].indexOf(inExpOrImpCol[0])],[1,2,3])
    let contextualCols2 = extractCols(Array.from(dataIn2_csv[0]),[dataIn2_csv[0].indexOf(inExpOrImpCol[1])],[1,2,3])
    let m1 = [[]],m2 = [[]],m3 = [[]]
    m1[0].push(inExpOrImpCol[0])
    m2[0].push(inExpOrImpCol[1])
    m3[0].push(inExpOrImpCol[0])
    contextualCols1.forEach(val =>{
        m1[0].push(val)
        m3[0].push(val)
    })

    contextualCols2.forEach(val => {
        m2[0].push(val)
        m3[0].push(val)
    })

    m1[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })
    m2[0].sort(function(a,b){
        return dataIn2_csv[0].indexOf(a) - dataIn2_csv[0].indexOf(b)
    })
    m3[0].sort(function(a,b){
        return dataOut1_csv[0].indexOf(a) - dataOut1_csv[0].indexOf(b)
    })

    let publicVals = {}
    let inExp1 = dataIn1_csv[0].indexOf(inExpOrImpCol[0])
    let inExp2 = dataIn2_csv[0].indexOf(inExpOrImpCol[1])
    let outExp = dataOut1_csv[0].indexOf(inExpOrImpCol[0])
    let valuesToShow = []
    for(let row = 1;row < dataIn1_csv.length;row++){
        if(publicVals[dataIn1_csv[row][inExp1]]){
            publicVals[dataIn1_csv[row][inExp1]] += 1
        }else{
            publicVals[dataIn1_csv[row][inExp1]] = 1
        }
    }
    for(let row = 1;row < dataIn2_csv.length;row++){
        if(publicVals[dataIn2_csv[row][inExp2]]){
            publicVals[dataIn2_csv[row][inExp2]] += 1
        }else{
            publicVals[dataIn2_csv[row][inExp2]] = 1
        }
    }
    for(let key in publicVals){
        if(publicVals[key] >= 2 && valuesToShow.length < 3){
            valuesToShow.push(key)
        }
    }
    // console.log("values to show: ",valuesToShow)
    // console.log(inExpOrImpCol,inExp1,inExp2,outExp)
    let hasHad1 = {},hasHad2 = {},hasHad3 ={}
    let rows1 = [],rows2 = [],rows3 = []
    let inColors1 = [],inColors2 = [],outColors = []
    for(let row = 1;row < dataIn1_csv.length;row++){
        if(hasHad1[dataIn1_csv[row][inExp1]])continue
        if(valuesToShow.indexOf(dataIn1_csv[row][inExp1]) !== -1){
            rows1.push(row)
            inColors1.push(valuesToShow.indexOf(dataIn1_csv[row][inExp1]))
            hasHad1[dataIn1_csv[row][inExp1]] = 1
        }
    }
    for(let row = 1;row < dataIn2_csv.length;row++){
        if(hasHad2[dataIn2_csv[row][inExp2]])continue
        if(valuesToShow.indexOf(dataIn2_csv[row][inExp2]) !== -1){
            rows2.push(row)
            inColors2.push(valuesToShow.indexOf(dataIn2_csv[row][inExp2]))
            hasHad2[dataIn2_csv[row][inExp2]] = 1
        }
    }
    for(let row = 1;row < dataOut1_csv.length;row++){
        if(hasHad3[dataOut1_csv[row][outExp]])continue
        if(valuesToShow.indexOf(dataOut1_csv[row][outExp]) !== -1){
            rows3.push(row)
            outColors.push(valuesToShow.indexOf(dataOut1_csv[row][outExp]))
            hasHad3[dataOut1_csv[row][outExp]] = 1
        }
    }
    for(let idx = 0;idx < rows1.length;idx++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(col === inExp1)tempRow.push(dataIn1_csv[rows1[idx]][col])
                else{
                    tempRow.push('')
                }
            }
        }
        m1.push(tempRow)
    }
    for(let idx = 0;idx < rows2.length;idx++){
        let tempRow = []
        for(let col = 0;col < dataIn2_csv[0].length;col++){
            if(m2[0].indexOf(dataIn2_csv[0][col]) !== -1){
                if(col === inExp2)tempRow.push(dataIn2_csv[rows2[idx]][col])
                else{
                    tempRow.push('')
                }
            }
        }
        m2.push(tempRow)
    }
    for(let idx = 0;idx < rows3.length;idx++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(m3[0].indexOf(dataOut1_csv[0][col]) !== -1){
                if(col === outExp)tempRow.push(dataOut1_csv[rows3[idx]][col])
                else{
                    tempRow.push('')
                }
            }
        }
        m3.push(tempRow)
    }
    for(let col = 0;col < m1[0].length;col++){
        if(m1[0][col] !== inExpOrImpCol[0])m1[0][col] = ''
    }
    for(let col = 0;col < m2[0].length;col++){
        if(m2[0][col] !== inExpOrImpCol[1])m2[0][col] = ''
    }
    for(let col = 0;col < m3[0].length;col++){
        if(m3[0][col] !== inExpOrImpCol[0])m3[0][col] = ''
    }
    return {m1,m2,m3,inColors1,inColors2,outColors}
}

export {generateDataForInnerJoin,generateDataForFullJoin,generateDataForLeftJoin,
    generateDataForTablesExtend,generateDataForLeftJoin_2,generateDataForFullJoin_2,
    generateDataForTablesExtend_withExplicitCol}

