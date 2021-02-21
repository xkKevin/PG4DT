
export function generateDataForTablesExtend(dataIn1_csv, dataIn2_csv,dataOut1_csv){
    let m1 = [[]],m2 = [[]],m3 = [[]],outColors = []
    for(let col = 0;col < Math.min(dataIn1_csv[0].length,3);col++){
        m1[0].push('')
        m2[0].push('')
        m3[0].push('')
    }

    if(dataIn1_csv.length >= 3){
        for(let row = 0;row < 2;row++){
            let tempRow = []
            for(let col = 0;col < m1[0].length;col++){
                tempRow.push('')
            }
            m1.push(tempRow)
            m3.push(tempRow)
        }
        outColors = [2]
        let tempRow = []
        for(let col = 0;col < m1[0].length;col++){
            tempRow.push('')
        }
        m2.push(tempRow)
        m3.push(tempRow)
    }else if(dataIn2_csv.length >= 3){
        let tempRow = []
        for(let col = 0;col < m1[0].length;col++){
            tempRow.push('')
        }
        m1.push(tempRow)
        m3.push(tempRow)
        for(let row = 0;row < 2;row++){
            let tempRow = []
            for(let col = 0;col < m1[0].length;col++){
                tempRow.push('')
            }
            m2.push(tempRow)
            m3.push(tempRow)
        }
        outColors = [1,2]
    }else{
        let tempRow = []
        for(let col = 0;col < m1[0].length;col++){
            tempRow.push('')
        }
        m1.push(tempRow)
        m3.push(tempRow)
        tempRow = []
        for(let col = 0;col < m1[0].length;col++){
            tempRow.push('')
        }
        m2.push(tempRow)
        m3.push(tempRow)
        outColors = [1]
    }
    return {m1,m2,m3,outColors}
}