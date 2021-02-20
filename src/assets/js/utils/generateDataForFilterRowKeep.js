export function generateDataForFilterRowKeep(dataIn1_csv, dataOut1_csv,pos){
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