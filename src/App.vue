<template>
  <div id="app">
  </div>
</template>

<script>
  import {create_column} from './assets/js/glyph/create_column.js'
  import {extractCols} from "./assets/js/utils/extractContextualCols"
  import {create_row} from "./assets/js/glyph/create_row";
  import {generateData} from "./assets/js/utils/generateData";
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
        original_col: [],  // 也可以写成数字，如 [1, 3]
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

        //提取出满足条件的矩阵
        let res = generateData(data1_csv,data2_csv,oriCol,newCol)
        let curCol = []
        //curCol记录的是input glyph的所有列（包括explicit/implicit列和contextual列）
        //在input table中的位置
        oriCol.forEach(idx => {
          curCol.push(res.m1[0].indexOf(data1_csv[0][idx]))
        })

        //创建列
        create_column(res.m1,res.m2,curCol,rule,t1_name,t2_name)

        //创建行，不需要提取contextual行，所以转化为矩阵的过程比较简单
        // let m1 = [], m2 = []
        // data1_csv.forEach(d => {
        //   if(m1.length <= 3)m1.push(d)
        // })
        // data2_csv.forEach(d => {
        //   if(m2.length <= 4)m2.push(d)
        // })
        // create_row(m1,m2,rule,t1_name,t2_name,-1)
      }

      preparation(transform_specs)
    }
  }
</script>
