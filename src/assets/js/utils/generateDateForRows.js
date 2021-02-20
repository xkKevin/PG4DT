export function generateDataForRows(dataIn1_csv, dataOut1_csv, mode = 'delete',pos){
    let m1 = [],m2 = []
    let inIndex = [],outIndex = []
    m1.push(dataIn1_csv[0].slice(0,Math.min(3,dataIn1_csv[0].length)))
    m2.push(dataOut1_csv[0].slice(0,Math.min(3,dataOut1_csv[0].length)))
    //pos = 0,表示行的位置
    if(pos > 1 && pos < dataIn1_csv.length - 1){
        for(let row = pos - 1;row <= pos + 1;row ++){
            m1.push(dataIn1_csv[row].slice(0,Math.min(3,dataIn1_csv[0].length)))
        }
        inIndex = [pos - 1,pos, pos + 1]
        if(mode == 'delete'){
            m2.push(dataOut1_csv[pos - 1].slice(0,Math.min(3,dataOut1_csv[0].length)))
            m2.push(dataOut1_csv[pos].slice(0,Math.min(3,dataOut1_csv[0].length)))
            outIndex = [pos - 1,pos]
        }else{
            m2.push(dataOut1_csv[pos].slice(0,Math.min(3,dataOut1_csv[0].length)))
            outIndex = [1]
        }
    }else if(pos == 1 && pos == dataIn1_csv.length - 1){
        m1.push(dataIn1_csv[pos].slice(0,Math.min(3,dataIn1_csv[0].length)))
        inIndex = [pos]
    }else if(pos == 1){
        for(let row = pos;row <= Math.min(pos + 2,dataIn1_csv.length - 1);row ++){
            m1.push(dataIn1_csv[row].slice(0,Math.min(3,dataIn1_csv[0].length)))
            inIndex.push(row)
        }

        if(mode == 'delete'){
            for(let row = pos;row <= Math.min(pos + 1,dataOut1_csv.length - 1);row ++){
                m2.push(dataOut1_csv[row].slice(0,Math.min(3,dataOut1_csv[0].length)))
                outIndex.push(row)
            }
        }else{
            m2.push(dataOut1_csv[pos].slice(0,Math.min(3,dataOut1_csv[0].length)))
            outIndex = [1]
        }
    }else{
        for(let row = Math.max(1,dataIn1_csv.length - 3);row <= dataIn1_csv.length - 1;row ++){
            m1.push(dataIn1_csv[row].slice(0,Math.min(3,dataIn1_csv[0].length)))
            inIndex.push(row)
        }
        if(mode == 'delete'){
            for(let row = Math.max(1,dataOut1_csv.length - 2);row <= dataOut1_csv.length - 1;row ++){
                m2.push(dataOut1_csv[row].slice(0,Math.min(3,dataOut1_csv[0].length)))
                outIndex.push(row)
            }
        }else{
            m2.push(dataOut1_csv[pos].slice(0,Math.min(3,dataOut1_csv[0].length)))
            outIndex = [1]
        }
    }
    return {m1,m2,inIndex,outIndex}
}