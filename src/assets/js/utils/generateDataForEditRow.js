
export function generateDataForEditRow(dataIn1_csv, dataOut1_csv, edit_rows){
    let m1 = [[]],m2 = [[]]
    for(let col = 0;col < Math.min(dataIn1_csv[0].length,3);col++){
        m1[0].push('')
        m2[0].push('')
    }

    let rowIndex = []
    if(edit_rows[0] > 1 && edit_rows[0] < dataIn1_csv.length){
        rowIndex = [edit_rows[0] - 1,edit_rows[0],edit_rows[0] + 1]
    }else if(edit_rows[0] === 1){
        if(dataIn1_csv.length > 3)rowIndex = [1,2,3]
        else if(dataIn1_csv.length === 3)rowIndex = [1,2]
        else
            rowIndex = [1]
    }else{
        if(dataIn1_csv.length > 3)rowIndex = [edit_rows[0] - 2,edit_rows[0] - 1,edit_rows[0]]
        else if(dataIn1_csv.length === 3)rowIndex = [edit_rows[0] - 1,edit_rows[0]]
        else
            rowIndex = [edit_rows[0]]
    }
    for (let row = 0;row < rowIndex.length;row++){
        let tempRow1 = [],tempRow2 = []
        for(let col = 0;col <m1[0].length;col++){
            if(rowIndex[row] === edit_rows[0]){
                tempRow1.push(dataIn1_csv[rowIndex[row]][col])
                tempRow2.push(dataOut1_csv[rowIndex[row]][col])
            }else{
                tempRow1.push("")
                tempRow2.push("")
            }
        }
        m1.push(tempRow1)
        m2.push(tempRow2)
    }
    return {m1,m2,rowIndex}
}