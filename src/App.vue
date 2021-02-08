<template>
  <div id="app">
  </div>
</template>

<script>
  import {mutate} from './assets/js/utils/sum.js'
  import {extractCols} from "./assets/js/utils/extractContextualCols"
  import * as d3 from 'd3'
  export default {
    name:'App',

    mounted() {
      function getTable(path){
        return new Promise((resolve, reject) => {
          d3.csv(path).then(data => {
            let tempData = []
            tempData.push(Array.from(data.columns))
            data.forEach(d => {
              tempData.push(Array.from(Object.values(d)))
            })
            resolve(tempData)
          })
        })
      }

      let transform_specs = {
        type: 'create_column_mutate',
        input_table_file: "data1.csv",
        output_table_file: "data2.csv",
        input_table_name: "t1",
        output_table_name: "t2",
        original_col: [0,1],  // 也可以写成数字，如 [1, 3]
        new_col: 'd',
        operation: 'sum'
      }

      let t1 = transform_specs.input_table_file
      let t2 = transform_specs.output_table_file
      let rule = transform_specs.operation
      let t1_name = transform_specs.input_table_name
      let t2_name = transform_specs.output_table_name
      let oriCol = transform_specs.original_col
      let newCol = transform_specs.new_col

      async function preparation(transform_specs){
        let data1_csv = await getTable('http://localhost/static/d1.csv')
        let data2_csv = await getTable('http://localhost/static/d2.csv')
        let res = generateData(data1_csv,data2_csv)
        let curCol = []
        oriCol.forEach(idx => {
          curCol.push(res.m1[0].indexOf(data1_csv[0][idx]))
        })

        mutate(res.m1,res.m2,curCol,rule,t1_name,t2_name)
      }

      preparation(transform_specs)

      function generateData(data1_csv,data2_csv){
        let inExpOrImpCol = []
        oriCol.forEach(d => {
          inExpOrImpCol.push(data1_csv[0][d])
        })

        let contextualCols = extractCols(Array.from(data1_csv[0]),inExpOrImpCol,inExpOrImpCol.concat(newCol))
        let cols1 = contextualCols

        let m1 = [],m2 = []
        oriCol.forEach(c => {
          cols1.push(data1_csv[0][c])
        })
        m1.push(Array.from(cols1))
        cols1.push(newCol)
        m2.push(Array.from(cols1))

        m1[0].sort(function(a,b){
          return data1_csv[0].indexOf(a) - data1_csv[0].indexOf(b)
        })
        m2[0].sort(function(a,b){
          return data2_csv[0].indexOf(a) - data2_csv[0].indexOf(b)
        })

        for(let row = 1;row <= Math.min(3,data1_csv.length - 1);row ++){
          let tempRow = []
          for(let col = 0;col < data1_csv[0].length;col++){
            if(m1[0].indexOf(data1_csv[0][col]) != -1)tempRow.push(data1_csv[row][col])
          }
          m1.push(tempRow)
        }

        for(let row = 1;row <= Math.min(3,data2_csv.length - 1);row ++){
          let tempRow = []
          for(let col = 0;col < data2_csv[0].length;col++){
            if(m2[0].indexOf(data2_csv[0][col]) != -1)tempRow.push(data2_csv[row][col])
          }
          m2.push(tempRow)
        }
        return {m1,m2}
        //input table中列在m1中的位置

      }
    }
  }
</script>
