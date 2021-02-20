
export function generateDataForInsertRows(dataIn1_csv, dataOut1_csv, insertPos){
    let m1 = [[]],m2 = [[]]
    let inColors = [],outColors = []
    let inIdx = [],outIdx = []
    for(let col = 0;col < Math.min(3,dataIn1_csv[0].length);col++){
        m1[0].push('')
        m2[0].push('')
    }

    if(insertPos > 1){
        let rows
        if(dataIn1_csv.length >= 3){
            rows = [insertPos - 1,insertPos,insertPos + 1]
            inColors = [0,1]
            outColors = [0,2,1]
            inIdx = [insertPos - 1,insertPos]
            outIdx = [insertPos - 1,insertPos,insertPos + 1]
        }
        else if(dataIn1_csv.length === 2){
            rows = [insertPos - 1,insertPos]
            inColors = [0]
            outColors = [0,1]
            inIdx = [insertPos]
            outIdx = [insertPos,insertPos + 1]
        }else{
            rows = [1]
            inColors = []
            outColors = [0]
            inIdx = []
            outIdx = [insertPos]
        }
        for(let row = 0;row < rows.length;row++){
            let tempRow = []
            for(let col = 0;col < m1[0].length;col++){
                // tempRow.push(dataOut1_csv[rows[row]][col])
                tempRow.push('')
            }
            m2.push(tempRow)
            if(rows[row] !== insertPos)m1.push(tempRow)
        }
    }else if(insertPos === 1){
        let rows
        if(dataIn1_csv.length >= 3){
            rows = [1,2,3]
            inColors = [0,1]
            outColors = [2,0,1]
            inIdx = [1,2]
            outIdx = [1,2,3]
        } else if(dataIn1_csv.length === 1){
            rows = [1,2]
            inColors = [0]
            outColors = [1,0]
            inIdx = [1]
            outIdx = [1,2]
        }else{
            rows = [1]
            inColors = []
            outColors = [0]
            inIdx = []
            outIdx = [1]
        }

        for(let row = 0;row < rows.length;row++){
            let tempRow = []
            for(let col = 0;col < m1[0].length;col++){
                // tempRow.push(dataOut1_csv[rows[row]][col])
                tempRow.push('')
            }
            m2.push(tempRow)
            if(rows[row] !== insertPos)m1.push(tempRow)
        }
    }
    return {m1,m2,inColors,outColors,inIdx,outIdx}
}