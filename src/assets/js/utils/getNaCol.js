export function getNaCol(data_csv) {
    for(let row = 1;row < data_csv.length;row++){
        for(let col = 0;col < data_csv[0].length;col++){
            if(data_csv[row][col] === '')return [col]
        }
    }
    return []
}