export function getDuplicatedRows(data_csv,col = '') {
    let row1 = -1,row2 = -1
    if(col === ''){
        for(row1 = 1;row1 < data_csv.length - 1;row1 ++){
            for (row2 = row1 + 1;row2 < data_csv.length;row2 ++){
                if(JSON.stringify(data_csv[row1]) === JSON.stringify(data_csv[row2])){
                    return [row1,row2]
                }
            }
        }
    }else{
        for(row1 = 1;row1 < data_csv.length - 1;row1 ++){
            for (row2 = row1 + 1;row2 < data_csv.length;row2 ++){
                if(data_csv[row1][col] === data_csv[row2][col]){
                    return [row1,row2]
                }
            }
        }
    }
    return [row1,row2]
}