import * as d3 from 'd3'
export function getCsv(path){
    return new Promise((resolve, reject) => {
        d3.text(path).then(data => {
            let tempData = d3.csvParseRows(data)
            resolve(tempData)
        })
    })
}