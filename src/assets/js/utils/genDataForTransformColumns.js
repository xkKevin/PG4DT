import {extractCols} from "./common/extractContextualCols";

function generateDataForReplace(dataIn1_csv, dataOut1_csv, inExpOrImpCol,replaceValue = ''){

    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,inExpOrImpCol)

    let m1 = [[]],m2 = [[]]
    inExpOrImpCol.forEach(idx => {
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

    let rows = [],naRow = []
    for(let row = 1;row < dataIn1_csv.length;row++){
        if(dataIn1_csv[row][inExpOrImpCol[0]] === replaceValue && rows.length < 2)rows.push(row)
    }
    if(rows.length === 2){
        if(rows[0] > 1){
            rows = [rows[0] - 1,rows[0],rows[1]]
            naRow = [2,3]
        }else if(rows[1] < dataIn1_csv.length - 1){
            rows = [rows[0],rows[1],rows[1] + 1]
            naRow = [1,2]
        }else{
            naRow = [1,2]
        }
    }
    //对于只有一个空值的情况，是否需要显示三行？
    else if(rows.length === 1){
        if(rows[0] > 1){
            rows = [rows[0] - 1,rows[0]]
            naRow = [2]
        }else if(rows[0] < dataIn1_csv.length - 1){
            rows = [rows[0],rows[0] + 1]
            naRow = [1]
        }else{
            naRow = [1]
        }
    }else{
        rows = Array.from(new Array(Math.min(3,dataIn1_csv.length)), (x,i) => i)
        naRow = []
    }
    for(let row = 0;row < rows.length;row ++){
        let tempRow1 = [],tempRow2 = []
        for(let col = 0;col < m1[0].length;col++){
            if(m1[0][col] === dataIn1_csv[0][inExpOrImpCol[0]] && dataIn1_csv[rows[row]][inExpOrImpCol[0]] === replaceValue && naRow.length !== 0)
                tempRow1.push(dataIn1_csv[rows[row]][inExpOrImpCol[0]])
            else
                tempRow1.push('')
            if(m2[0][col] === dataIn1_csv[0][inExpOrImpCol[0]] && dataIn1_csv[rows[row]][inExpOrImpCol[0]] === replaceValue && naRow.length !== 0)
                tempRow2.push(dataOut1_csv[rows[row]][inExpOrImpCol[0]])
            else
                tempRow2.push('')
        }
        m1.push(tempRow1)
        m2.push(tempRow2)
    }
    for(let col = 0;col < m1[0].length;col++){
        if(m1[0][col] !== dataIn1_csv[0][inExpOrImpCol[0]]){
            m1[0][col] = ''
            m2[0][col] = ''
        }
    }
    if(replaceValue !== '')naRow = []
    return {m1,m2,naRow}
}

 function generateDataForMutate_cover(dataIn1_csv, dataOut1_csv, inExpOrImpCol, outExpOrImpCol){

    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),Array.from(new Set(inExpOrImpCol.concat(outExpOrImpCol))),Array.from(new Set(inExpOrImpCol.concat(outExpOrImpCol))))

    let allExpOrImp = Array.from(new Set(inExpOrImpCol.concat(outExpOrImpCol)))
    let m1 = [[]],m2 = [[]]
    allExpOrImp.forEach(idx => {
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

    for(let row = 1;row <= Math.min(3,dataIn1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(allExpOrImp.indexOf(col) !== -1)tempRow.push(dataIn1_csv[row][col])
            else
                tempRow.push('')
        }
        m1.push(tempRow)
    }

    for(let row = 1;row <= Math.min(3,dataOut1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataOut1_csv[0].length;col++){
            if(allExpOrImp.indexOf(col) !== -1)tempRow.push(dataOut1_csv[row][col])
            else
                tempRow.push('')
        }
        m2.push(tempRow)
    }
    let colVals = []
    for(let col = 0;col < allExpOrImp.length;col++){
        colVals.push(dataIn1_csv[0][allExpOrImp[col]])
    }
    for(let col = 0;col < m1[0].length;col++){
        if(colVals.indexOf(m1[0][col]) === -1){
            m1[0][col] = ''
            m2[0][col] = ''
        }
    }
    return {m1,m2}
}

 function generateDataForColumnRename(dataIn1_csv, dataOut1_csv, inExpOrImpCol){
    inExpOrImpCol.sort()
    let contextualCols = extractCols(Array.from(dataIn1_csv[0]),inExpOrImpCol,inExpOrImpCol)
    
    let m1 = [[]],m2 = [[]]
    inExpOrImpCol.forEach(idx => {
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

    for(let row = 1;row <= Math.min(3,dataIn1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < dataIn1_csv[0].length;col++){
            if(m1[0].indexOf(dataIn1_csv[0][col]) !== -1)tempRow.push('')
        }
        m1.push(tempRow)
        m2.push(tempRow)
    }

    for(let col = 0;col < m1[0].length;col++){
        if(inExpOrImpCol.indexOf(dataIn1_csv[0].indexOf(m1[0][col])) === -1){
            m1[0][col] = ''
            m2[0][col] = ''
        }
    }

    let expAfter = []
    for(let col = 0;col < inExpOrImpCol.length;col++){
        expAfter.push(m1[0].indexOf(dataIn1_csv[0][inExpOrImpCol[col]]))
    }
    return {m1,m2,expAfter}
}

export {generateDataForColumnRename,generateDataForMutate_cover,generateDataForReplace}
