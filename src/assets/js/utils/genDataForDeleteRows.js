import {extractCols} from "./common/extractContextualCols";
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
function generateDataForRows(dataIn1_csv, dataOut1_csv,inExpCols){
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpCols,inExpCols)
    let m1 = [[]],m2 = [[]]
    let outColors = []

    inExpCols.forEach(idx =>{
        m1[0].push(dataIn1_csv[0][idx])
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

    if(dataIn1_csv.length === dataOut1_csv.length){
        for(let row = 1;row <= Math.min(dataIn1_csv.length - 1,3);row++){
            let tempRow = []
            for(let col = 0;col < dataIn1_csv[0].length;col++){
                if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                    if(inExpCols.indexOf(col) !== -1)
                        tempRow.push(dataIn1_csv[row][col])
                    else
                        tempRow.push('')
                }
            }
            m1.push(tempRow)
            m2.push(tempRow)
        }
        for(let col = 0;col < m1[0].length;col++){
            if(inExpCols.indexOf(dataIn1_csv[0].indexOf(m1[0][col])) === -1){
                m1[0][col] = ''
                m2[0][col] = ''
            }
        }
        return {m1,m2,outColors}
    }

    let sameRows = []
    let diffRow = []

    let row1 = 1,row2 = 1
    while(row1 < dataIn1_csv.length && row2 < dataOut1_csv.length){
        if(cmpRows(dataIn1_csv[row1],dataOut1_csv[row2],inExpCols)){
            if(sameRows.length !== 2)sameRows.push(row1)
            row2 += 1
        }else{
            if(diffRow.length < 2)diffRow.push(row1)
        }
        if(sameRows.length === 2 && diffRow !== -1)break
        row1 += 1
    }

    if(row2 === dataOut1_csv.length && diffRow.length < 2)diffRow.push(row1)
    let rows = Array.from(sameRows)
    
    if(sameRows.length === 2 && diffRow.length !== 0){
        rows.push(diffRow[0])
    }else{
        diffRow.forEach(d => rows.push(d))
    }
    // rows.push(diffRow)
    rows.sort()
    for(let row = 0;row < rows.length;row++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                if(inExpCols.indexOf(col) !== -1)
                    tempRow.push(dataIn1_csv[rows[row]][col])
                else
                    tempRow.push('')
            }
        }
        m1.push(tempRow)
        if(diffRow.indexOf(rows[row]) === -1)m2.push(tempRow)
    }

    if(sameRows.length > 1){
        if(diffRow[0] < sameRows[0]){
            outColors = [1,2]
        }else if(diffRow[0] > sameRows[1]){
            outColors = [0,1]
        }else{
            outColors = [0,2]
        }
    }else if(diffRow.length > 1){
        if(sameRows[0] < diffRow[0]){
            outColors = [0]
        }else if(sameRows[0] > diffRow[1]){
            outColors = [2]
        }else{
            outColors = [1]
        }
    }else{
        if(diffRow[0] < sameRows[0]){
            outColors = [1]
        }else { 
            outColors = [0]
        }
    }
        
    for(let col = 0;col < m1[0].length;col++){
        if(inExpCols.indexOf(dataIn1_csv[0].indexOf(m1[0][col])) === -1){
            m1[0][col] = ''
            m2[0][col] = ''
        }
    }
    return {m1,m2,outColors}
}

function generateDataForFilterRowKeep(dataIn1_csv, dataOut1_csv,pos){
    let m1 = [[]],m2 = [[]]
    let inIndex = [],outIndex = []
    let inColors,outColors

    for(let col = 0;col < Math.min(3,dataIn1_csv[0].length);col++){
        m1[0].push('')
        m2[0].push('')
    }
    if(pos[0] > 1 && pos[0] < dataIn1_csv.length - 1){
        inIndex = [pos[0] - 1,pos[0],pos[0] + 1]
        outIndex = [pos[0]]
        inColors = [0,1,2]
        outColors = [1]
    }else if(pos[0] === 1){
        if(dataIn1_csv.length >= 4){
            inIndex = [pos[0],pos[0] + 1,pos[0] + 2]
            outIndex = [pos[0]]
            inColors = [0,1,2]
            outColors = [0]
        }else if(dataIn1_csv.length === 3){
            inIndex = [pos[0],pos[0] + 1]
            outIndex = [pos[0]]
            inColors = [0,1]
            outColors = [0]
        }else{
            inIndex = [pos[0]]
            outIndex = [pos[0]]
            inColors = [0]
            outColors = [0]
        }
    }

    for (let row = 0;row < inIndex.length;row ++){
        let tempRow = []
        for(let col = 0;col < m1[0].length;col ++){
            tempRow.push('')
        }
        m1.push(tempRow)
    }
    for (let row = 0;row < outIndex.length;row ++){
        let tempRow = []
        for(let col = 0;col < m2[0].length;col ++){
            tempRow.push('')
        }
        m2.push(tempRow)
    }
    return {m1,m2,inIndex,outIndex,inColors,outColors}
}

function generateDataForDeleteDuplicateRows(dataIn1_csv, dataOut1_csv, inExpCols){
    for(let col = 0;col < dataIn1_csv[0].length;col++){
        if(inExpCols.indexOf(col) === -1 && dataIn1_csv[0].indexOf(dataIn1_csv[0][col]) !== col)dataIn1_csv[0][col] += '_'
    }
    for(let col = 0;col < dataOut1_csv[0].length;col++){
        if(inExpCols.indexOf(col) === -1 && dataOut1_csv[0].indexOf(dataOut1_csv[0][col]) !== col)dataOut1_csv[0][col] += '_'
    }
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpCols,inExpCols)
    let m1 = [[]],m2 = [[]]
    let outColors = [],inColors = []

    inExpCols.forEach(idx =>{
        m1[0].push(dataIn1_csv[0][idx])
        m2[0].push(dataIn1_csv[0][idx])
    })

    contextualCols.forEach(val => {
        m1[0].push(val)
        m2[0].push(val)
    })

    m1[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })
    m2[0].sort(function(a,b){
        return dataIn1_csv[0].indexOf(a) - dataIn1_csv[0].indexOf(b)
    })

    let duplicated_rows = []
    for(let row1 = 1;row1 < dataIn1_csv.length;row1++){
        for(let row2 = row1 + 1;row2 < dataIn1_csv.length;row2++){
            if(cmpRows(dataIn1_csv[row1],dataIn1_csv[row2],inExpCols)){
                duplicated_rows = [row1,row2]
                break
            }
        }
        if(duplicated_rows.length !== 0)break
    }

    if(duplicated_rows[0] > 1){
        let rows = [1,duplicated_rows[0],duplicated_rows[1]]
        for(let row = 0;row < rows.length;row++){
            let tempRow = []
            for(let col = 0;col < dataIn1_csv[0].length;col++){
                if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                    if(inExpCols.indexOf(col) !== -1 && duplicated_rows.indexOf(rows[row]) !== -1)
                        tempRow.push(dataIn1_csv[rows[row]][col])
                    else
                        tempRow.push('')
                }
            }
            m1.push(tempRow)
            if(row !== rows.length - 1)m2.push(tempRow)
        }
        outColors = [0,1]
        if(dataIn1_csv[0].length === inExpCols.length)inColors = [0,1,1]
    }else if(duplicated_rows[1] < dataIn1_csv.length - 1){
        let rows = [duplicated_rows[0],duplicated_rows[1],dataIn1_csv.length - 1]
        for(let row = 0;row < rows.length;row++){
            let tempRow = []
            for(let col = 0;col < dataIn1_csv[0].length;col++){
                if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                    if(inExpCols.indexOf(col) !== -1 && duplicated_rows.indexOf(rows[row]) !== -1)
                        tempRow.push(dataIn1_csv[rows[row]][col])
                    else
                        tempRow.push('')
                }
            }
            m1.push(tempRow)
            if(row !== 0)m2.push(tempRow)
        }
        outColors = [0,1]
        if(dataIn1_csv[0].length === inExpCols.length)inColors = [0,0,1]
    }else{
        let rows = [duplicated_rows[0],duplicated_rows[1]]
        for(let row = 0;row < rows.length;row++) {
            let tempRow = []
            for(let col = 0;col < dataIn1_csv[0].length;col++){
                if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1){
                    if(inExpCols.indexOf(col) !== -1 && duplicated_rows.indexOf(rows[row]) !== -1)
                        tempRow.push(dataIn1_csv[rows[row]][col])
                    else
                        tempRow.push('')
                }
            }
            m1.push(tempRow)
            if (row !== 0) m2.push(tempRow)
        }
        outColors = [0]
        inColors = [0,0]
    }
    for(let col = 0;col < m1[0].length;col++){
        if(inExpCols.indexOf(dataIn1_csv[0].indexOf(m1[0][col])) === -1){
            m1[0][col] = ''
            m2[0][col] = ''
        }
    }
    if(inExpCols.length === dataIn1_csv[0].length){
        for(let row = 0;row < m1.length;row++){
            let tempRow = []
            for(let col = 0;col < Math.min(3,m1[0].length);col++){
                if(row === 0)tempRow.push("")
                else    
                    tempRow.push(m1[row][col])
            }
            m1[row] = tempRow
        }
       
        for(let row = 0;row < m2.length;row++){
            let tempRow = []
            for(let col = 0;col < Math.min(3,m2[0].length);col++){
                if(row === 0)tempRow.push("")
                else    
                    tempRow.push(m2[row][col])
            }
            m2[row] = tempRow
        }
    }else{
        if(dataIn1_csv[0].length !== dataOut1_csv[0].length){
            for(let row = m2.length - 1;row >= 0;row--){
                let tempRow = []
                for(let col = 0;col < Math.min(3,m2[0].length);col++){
                    if(m2[0][col] !== ''){ 
                        tempRow.push(m2[row][col])
                    } 
                }
                m2[row] = tempRow
            }
        }
    }
    return {m1,m2,inColors,outColors}
}

function generateDataForFilterRow(dataIn1_csv,dataOut1_csv,expCol) {
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
export {generateDataForDeleteDuplicateRows,generateDataForFilterRow,generateDataForRows,generateDataForFilterRowKeep}