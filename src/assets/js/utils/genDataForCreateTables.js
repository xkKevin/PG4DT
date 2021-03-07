export function generateDataForCreateTable(data_csv) {
    let matrix = []
    for (let row = 0;row < Math.min(4,data_csv.length);row++){
        let tempRow = []
        for (let col = 0;col < Math.min(3,data_csv[0].length);col++){
            tempRow.push('')
        }
        matrix.push(tempRow)
    }
    return matrix
}