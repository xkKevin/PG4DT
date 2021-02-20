export function getDuplicatedColumns(data_csv) {
    let res = []
    for(let col = 0;col < data_csv[0].length;col++){
        if(data_csv[0].indexOf(data_csv[0][col]) !== col){
            res = [data_csv[0].indexOf(data_csv[0][col]),col]
            break
        }
    }
    return res
}