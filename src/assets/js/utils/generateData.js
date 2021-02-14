import {extractCols} from "./extractContextualCols";

export function generateDataForCreate(data1_csv, data2_csv, inExpOrImpCol, outExpOrImpCol){

    let contextualCols = extractCols(Array.from(data1_csv[0]),inExpOrImpCol,outExpOrImpCol)

    let m1 = [[]],m2 = [[]]
    inExpOrImpCol.forEach(idx => {
        m1[0].push(data1_csv[0][idx])
    })
    outExpOrImpCol.forEach(idx => {
        m2[0].push(data2_csv[0][idx])
    })
    contextualCols.forEach(val => {
        m1[0].push(val)
        m2[0].push(val)
    })

    m1[0].sort(function(a,b){
        return data1_csv[0].indexOf(a) - data1_csv[0].indexOf(b)
    })
    m2[0].sort(function(a,b){
        return data2_csv[0].indexOf(a) - data2_csv[0].indexOf(b)
    })

    for(let row = 1;row <= Math.min(3,data1_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < data1_csv[0].length;col++){
            if(m1[0].indexOf(data1_csv[0][col]) != -1)tempRow.push(data1_csv[row][col])
        }
        m1.push(tempRow)
    }

    for(let row = 1;row <= Math.min(3,data2_csv.length - 1);row ++){
        let tempRow = []
        for(let col = 0;col < data2_csv[0].length;col++){
            if(m2[0].indexOf(data2_csv[0][col]) != -1)tempRow.push(data2_csv[row][col])
        }
        m2.push(tempRow)
    }
    return {m1,m2}
}