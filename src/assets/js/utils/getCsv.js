import * as d3 from 'd3'
// function getTable(path){
//     return new Promise((resolve, reject) => {
//         d3.csv(path).then(data => {
//             let tempData = []
//             tempData.push(Array.from(data.columns))
//             data.forEach(d => {
//                 tempData.push(Array.from(Object.values(d)))
//             })
//             resolve(tempData)
//         })
//     })
// }
export function getCsv(path){
    return new Promise((resolve, reject) => {
        d3.text(path).then(data => {
            let tempData = d3.csvParseRows(data)
            resolve(tempData)
        })
    })
}