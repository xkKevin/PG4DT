import {extractCols} from "./extractContextualCols";

export function generateDataForRowsSum(dataIn1_csv,dataOut1_csv) {
    //暂定以索引方式传入列
    let m1 = [],m2 = []
    let rowSum = []
    for(let col = 0;col < Math.min(3,dataIn1_csv.length - 1);col++)rowSum.push(0)
    for(let row = 0;row <= Math.min(3,dataIn1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < Math.min(dataIn1_csv[0].length,3);col++){
            tempRow.push(dataIn1_csv[row][col])
            if(row > 0)
                rowSum[col] += parseFloat(dataIn1_csv[row][col])
        }
        m1.push(tempRow)
        if(row === 0)m2.push(tempRow)
    }
    m2.push(rowSum)
    return {m1,m2}
}