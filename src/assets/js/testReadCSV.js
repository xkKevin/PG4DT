import * as d3 from 'd3'
export function readCsv() {
    d3.csv('/static/csv/d1.csv',data => {
        console.log(data)
    })
}