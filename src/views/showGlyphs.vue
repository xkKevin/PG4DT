<template>
  <div id="showGlyphs">
    <remote-script src="http://ariutta.github.io/svg-pan-zoom/dist/svg-pan-zoom.min.js"></remote-script>
    <el-row type="flex" justify="center">
      <el-col :span="23" :offset="0">
        <el-container>
          <el-header height="70px">
            <!-- Header content -->
            <h2 style="text-align: center">PG4DT System</h2>
          </el-header>
          <el-row style="height: 450px">
            <el-col
              :span="12"
              :offset="0"
              class="script_table"
              style="height: 100%"
            >
              <el-row type="flex" justify="space-between">
                <div>Script View</div>
                <div>
                  Select Programming Language:
                  <el-dropdown @command="changeModel">
                    <span
                      class="el-dropdown-link"
                      style="
                        width: 69px;
                        display: inline-block;
                        text-align: right;
                      "
                    >
                      {{ language }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="item in all_langs"
                        :key="item"
                        :value="item"
                        :command="item"
                      >
                        {{ item }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-row>
              <div id="monaco" style="height: 400px; margin-top: 10px"></div>
            </el-col>
            <el-col
              :span="12"
              :offset="0"
              class="script_table"
              style="height: 100%"
            >
              <el-row type="flex" justify="space-between">
                <div>Table View</div>
                <div>
                  Select Table:
                  <el-dropdown @command="getTableData">
                    <span
                      class="el-dropdown-link"
                      style="
                        width: 135px;
                        display: inline-block;
                        text-align: right;
                      "
                    >
                      {{ table_name }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="item in all_tables"
                        :key="item"
                        :value="item"
                        :command="item"
                      >
                        {{ item }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-row>

              <el-table height="405" :data="tableData" fit>
                <el-table-column type="index"> </el-table-column>
                <el-table-column
                  v-for="item in tableHead"
                  :key="item"
                  :label="item"
                >
                  <template scope="scope">
                    {{ scope.row[item] }}
                  </template>
                </el-table-column>
              </el-table>
              <!-- <el-table :data="tableData">
                <template v-for="item in tableHead">
                  <el-table-column
                    align="center"
                    :label="item"
                    :key="item"
                    sortable
                  >
                    <template slot-scope="scope">
                      {{ scope.row[item] }}
                    </template>
                  </el-table-column>
                </template>
              </el-table> -->
            </el-col>
          </el-row>
          <el-footer height="700px">
            <el-row type="flex" justify="space-between">
              <div>Glyph View</div>
              <div>
                <el-button type="primary" size="mini" style="font-size:16px" @click="generateGlyphs">Generate</el-button>
                <span style="margin-left:10px; margin-right:5px;">Show Table Name:</span>
                <el-switch
                  v-model="show_table_name"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="controlShow"
                >
                </el-switch>
              </div>
            </el-row>
            <div id="glyphs" style="height:600px">Here is the glyphs</div>
          </el-footer>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import axios from "axios";
import * as d3 from "d3";
import * as monaco from "monaco-editor"; // https://www.cnblogs.com/xuhaoliang/p/13803230.html

import { create_table } from "@/assets/js/glyph/createTables";
import { create_row, create_row_insert } from "@/assets/js/glyph/createRows";
import { delete_table } from "@/assets/js/glyph/deleteTables";
import { create_column, create_column_create } from "@/assets/js/glyph/createColumns";
import {
  delete_column,
  delete_dropna,
  delete_duplicate,
} from "@/assets/js/glyph/deleteColumns";
import {
  delete_duplicate_row_partColumn,
  delete_filter,
  delete_row,
} from "@/assets/js/glyph/deleteRows";
import {
  transform_tables_fold,
  transform_tables_rearrange,
  transform_tables_sort,
  transform_tables_unfold,
} from "@/assets/js/glyph/transformTables";
import {
  transform_columns_mutate,
  transform_columns_replace_na,
} from "@/assets/js/glyph/transformColumns";
import { combine_columns_merge } from "@/assets/js/glyph/combineColumns";
import {
  combine_rows_interpolate,
  combine_rows_sum,
} from "@/assets/js/glyph/combineRows";
import { transform_rows_edit } from "@/assets/js/glyph/transformRows";
import {
  separate_tables_decompose,
  separate_tables_split,
  separate_tables_subset,
} from "@/assets/js/glyph/separateTables";
import { separate_columns } from "@/assets/js/glyph/separateColumns";
import { separate_rows } from "@/assets/js/glyph/separateRows";
import {
  combine_tables_extend,
  combine_tables_full_join,
  combine_tables_inner_join,
  combine_tables_left_join,
} from "@/assets/js/glyph/combineTables";
import { generateDataForCreateTable } from "@/assets/js/utils/genDataForCreateTables";
import {
  generateData,
  generateDataForCreateColumns,
  generateDataForCreateColumns_create,
  generateDataForCreateColumns_extract,
} from "@/assets/js/utils/genDataForCreateColumns";
import { generateDataForInsertRows } from "@/assets/js/utils/genDataForCreateRows";
import {
  generateDataForDeleteColumn,
  generateDataForDeleteNaColumn,
  generateDataForKeepColumns,
} from "@/assets/js/utils/genDataForDeleteColumns";
import { getDuplicatedColumns } from "@/assets/js/utils/common/getDuplicatedColumns";
import {
  generateDataForDeleteDuplicateRows,
  generateDataForFilterRow,
  generateDataForRows,
} from "@/assets/js/utils/genDataForDeleteRows";
import {
  generateDataForColumnRearrange,
  generateDataForFold,
  generateDataForTableSort,
} from "@/assets/js/utils/genDataForTransformTable";
import {
  generateDataForColumnRename,
  generateDataForMutate_cover,
  generateDataForReplace,
} from "@/assets/js/utils/genDataForTransformColumns";
import { generateDataForMergeColumns } from "@/assets/js/utils/genDataForCombineColumns";
import {
  generateDataForGroupSummarize,
  generateDataForRowInterpolate,
} from "@/assets/js/utils/genDataForCombineRows";
import { generateDataForEditRow } from "@/assets/js/utils/genDataForTransformRows";
import {
  generateDataForSeparateDecompose,
  generateDataForSeparateDecompose_q,
  generateDataForSeparateSplit,
  generateDataForSeparateSubset,
} from "@/assets/js/utils/genDataForSeparateTables";
import { generateDataForSeparateColumn } from "@/assets/js/utils/genDataForSeparateColumns";
import { generateDataForSeparateRows } from "@/assets/js/utils/genDataForSeparateRows";
import {
  generateDataForFullJoin_2,
  generateDataForInnerJoin,
  generateDataForLeftJoin_2,
  generateDataForTablesExtend,
  generateDataForTablesExtend_withExplicitCol
} from "@/assets/js/utils/genDataForCombineTables";
import { getCsv } from "@/assets/js/utils/common/getCsv";
import {getGraphs} from '@/assets/js/utils/renderTree/getLayout'
import {drawSvgAndEdge} from '@/assets/js/utils/renderTree/renderNodeAndEdge'
import {drawNode} from '@/assets/js/utils/renderTree/render'
import {getComponents} from '@/assets/js/utils/renderTree/getComponents'
import {svgSize,nodeSize} from '@/assets/js/config/config'
import '@/assets/js/utils/common/importJs.js'

const request_api = ""

export default {
  name: "showGlyphs",
  // delimiters: ["[[", "]]"],
  data() {
    return {
      svg:'',
      editor: null, // 文本编辑器
      table_name: "",
      all_tables: [
        "benchmark5.txt",
        "benchmark19.txt",
        "test.csv",
        "table1.csv",
        "table2.csv",
        "table3.csv",
        "table4.csv",
        "table5.csv",
      ],
      script_content: "", //'print("hello world!")',
      language: "r",
      all_langs: ["r", "python"],
      tableData: [
      ],
      tableHead: [
      ],
      show_table_name: true,
    };
  },
  methods: {
    initData() {
      this.initEditor();
      this.getTableData(this.all_tables[0]);
      this.getScriptData();
    },
    initEditor() {
      // 初始化编辑器，确保dom已经渲染
      this.editor = monaco.editor.create(document.getElementById("monaco"), {
        value: this.script_content, // 编辑器初始显示文字
        language: this.language, // 语言支持自行查阅demo
        automaticLayout: true, // 自动布局
        autoIndent: true, //自动布局
        fontSize: 16, //字体大小
        readOnly: false, // 只读
        theme: "vs", // 官方自带三种主题vs, hc-black, or vs-dark,
      });
    },
    changeModel(lang = "r", script_content = "", flag = true) {
      //创建新模型，value为旧文本，lang 为语言
      var oldModel = this.editor.getModel(); //获取旧模型
      if (flag) {
        script_content = this.editor.getValue(); //获取编辑器中的文本
        this.language = lang;
      }
      // modesIds即为支持语言
      // var modesIds = monaco.languages.getLanguages().map(function (lang) {
      //   return lang.id;
      // });
      var newModel = monaco.editor.createModel(script_content, lang);
      //将旧模型销毁
      if (oldModel) {
        oldModel.dispose();
      }
      //设置新模型
      this.editor.setModel(newModel);
    },
    getTableData(table_file) {
      // this.$message('click on item ' + command);
      // if (table_file.startsWith("table")) {
      //   this.$message({
      //     message: "The table does not exist.",
      //     type: "error", // success/warning/info/error
      //   });
      // } else {
      //   const table_path = `${request_api}/data/${table_file}?a=${Math.random()}`;
      //   d3.csv(table_path).then((data) => {
      //     this.table_name = table_file;
      //     this.tableData = data;
      //     this.tableHead = data.columns;
      //   });
      // }
      const table_path = `${request_api}/data/${table_file}?a=${Math.random()}`;
      d3.csv(table_path).then((data) => {
        this.table_name = table_file;
        this.tableData = data;
        this.tableHead = data.columns;
      });
    },
    getScriptData(script_content = "", language = "") {
      const path = `${request_api}/getScriptData`;
      axios
        .get(path, { params: { script_content, language } })
        .then((response) => {
          this.script_content = response.data.script_content;
          this.language = response.data.language;
          this.changeModel(this.language, this.script_content, false);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    generateGlyphs() {
      // console.log(this.editor.getValue(), this.language);
      
      const path = `${request_api}/generate_transform_specs`;
      let specsToHandle = []
      axios
        .get(path, {
          params: {
            script_content: this.editor.getValue(),
            language: this.language,
          },
        })
        .then((response) => {
          // 生成glyphs的操作
          if (response.data.error_info) {
            this.$message({
              message: response.data.error_info,
              type: "error", // success/warning/info/error
            });
          } else{
            console.log(response.data.transform_specs)
            document.getElementById("glyphs").innerHTML = "";
            // Object.assign(specsToHandle,response.data.transform_specs)
            specsToHandle = Array.from(response.data.transform_specs)
            let nullInfileCount = '*',nullOutfileCount = '#'
            specsToHandle.forEach(spec => {
                if(!spec.input_table_file){
                  spec['input_table_file'] = nullInfileCount
                  nullInfileCount += '*'
                }
                if(!spec.output_table_file){
                  spec['output_table_file'] = nullOutfileCount
                  nullOutfileCount += '#'
                }
            })

            let {groups,edges} = getComponents(specsToHandle)
            
            let graphs = getGraphs(groups,edges)

            let svgWidth = 0,svgHeight = 0

            let nodePos = {}
            const ELK = require('elkjs')
            let proms = []
            for(let idx = 0;idx < graphs.length;idx++){
              let tempElk = new Promise((resolve, reject)=>{
                let elk = new ELK()
                elk.layout(graphs[idx]).then(data =>{
                  for(let idx = 0;idx < data.children.length;idx++){
                    nodePos[data.children[idx].id] = [data.children[idx].x,data.children[idx].y]
                  }
                }).then(()=>{
                  resolve()
                })
              })
              proms.push(tempElk)
            }
            Promise.all(proms).then(() =>{
              //在高度方向上给不同的component设置偏移量，由上一组的maxY确定
              let yOffset = 0
              for(let group = 0; group < groups.length; group++){
                let maxY = 0
                groups[group].nodeGroup.forEach(tableName => {
                  maxY = Math.max(nodePos[tableName][1],maxY) 
                  nodePos[tableName][1] = nodePos[tableName][1] + yOffset
                  svgWidth = Math.max(svgWidth,nodePos[tableName][0])
                  svgHeight = Math.max(svgHeight,nodePos[tableName][1])
                })
                yOffset = yOffset + maxY + 1.2 * parseInt(nodeSize.height)
              }
              // let g = drawSvgAndEdge(specsToHandle,nodePos,
              //     svgWidth + parseInt(svgSize.width) + 50,svgHeight + parseInt(svgSize.height) + 50)
              let g = drawSvgAndEdge(specsToHandle,nodePos,
                  '100%','100%')
              this.$store.commit("setG",g)
    
              this.preparation(specsToHandle,nodePos)

            })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    controlShow(state) {
      this.show_table_name = state;
    },
    async preparation(transform_specs,nodePos) {
      console.log("spces: ",transform_specs)

      let tableInf = {}

      for (let i = 0; i < transform_specs.length; i++) {
        let pos = []
        if(typeof(transform_specs[i].input_table_file) === 'string' 
          && typeof(transform_specs[i].output_table_file) === 'string'){
            let dy = Math.abs(nodePos[transform_specs[i].input_table_file][1] - nodePos[transform_specs[i].output_table_file][1])
               > svgSize.height / 2 ? svgSize.height / 2 : 0
            pos = [
              (nodePos[transform_specs[i].input_table_file][0] + nodeSize.width 
              + nodePos[transform_specs[i].output_table_file][0]) / 2 - svgSize.width / 2,
              (nodePos[transform_specs[i].input_table_file][1] + nodeSize.height 
              + nodePos[transform_specs[i].output_table_file][1]) / 2 - svgSize.height + dy - 10
            ]
        }else if(typeof(transform_specs[i].input_table_file) === 'string'){
          let meetingPosY = nodePos[transform_specs[i].input_table_file][1] + nodeSize.height / 2
          let meetingPosX = nodePos[transform_specs[i].input_table_file][0] + nodeSize.width
              + 0.8 * (Math.min(nodePos[transform_specs[i].output_table_file[0]][0], 
              nodePos[transform_specs[i].output_table_file[1]][0]) - 
              nodePos[transform_specs[i].input_table_file][0] - nodeSize.width)
          pos = [
            (nodePos[transform_specs[i].input_table_file][0] + nodeSize.width + meetingPosX) / 2 - svgSize.width / 2,
            (nodePos[transform_specs[i].input_table_file][1] + nodeSize.height / 2 + meetingPosY) / 2 - svgSize.height - 10
          ]
        }else{
          let meetingPosY = nodePos[transform_specs[i].output_table_file][1] + nodeSize.height / 2
          let meetingPosX = Math.max(nodePos[transform_specs[i].input_table_file[0]][0],
              nodePos[transform_specs[i].input_table_file[1]][0])
              + nodeSize.width + 0.2 * (nodePos[transform_specs[i].output_table_file][0] - nodeSize.width 
              - Math.max(nodePos[transform_specs[i].input_table_file[0]][0],
              nodePos[transform_specs[i].input_table_file[1]][0]))
          pos = [
            (nodePos[transform_specs[i].output_table_file][0] + meetingPosX) / 2 - svgSize.width / 2,
            (nodePos[transform_specs[i].output_table_file][1] + nodeSize.height / 2 + meetingPosY) / 2 - svgSize.height - 10
          ]
        }

        let rule = transform_specs[i].operation_rule;
        let dataIn1_csv, dataIn2_csv, dataOut1_csv, dataOut2_csv;
        let input_explict_col = [],
          output_explict_col = [];
        let input_explict_row = [],
          output_explict_row = [];
        let input_implict_col = [];
        let input_table_name,
          output_table_name,
          input_table_name2,
          output_table_name2;
        let replace_value;
        let res;

        if (transform_specs[i].input_table_file && transform_specs[i].input_table_file[0] !== '*') {
          if (typeof transform_specs[i].input_table_file === "string") {
            dataIn1_csv = await getCsv(
              `${request_api}/data/${transform_specs[i].input_table_file}?a=${Math.random()}`
            );
            if(!tableInf[transform_specs[i].input_table_file]){
              tableInf[transform_specs[i].input_table_file] = [transform_specs[i].input_table_name,dataIn1_csv.length,dataIn1_csv[0].length]
            }
          } else {
            dataIn1_csv = await getCsv(
              `${request_api}/data/${transform_specs[i].input_table_file[0]}?a=${Math.random()}`
            );
            if(!tableInf[transform_specs[i].input_table_file[0]]){
              tableInf[transform_specs[i].input_table_file[0]] = [transform_specs[i].input_table_name[0],dataIn1_csv.length,dataIn1_csv[0].length]
            }
            if (transform_specs[i].input_table_file.length > 1)
              dataIn2_csv = await getCsv(
                `${request_api}/data/${transform_specs[i].input_table_file[1]}?a=${Math.random()}`
              );
              if(!tableInf[transform_specs[i].input_table_file[1]]){
                tableInf[transform_specs[i].input_table_file[1]] = [transform_specs[i].input_table_name[1],dataIn2_csv.length,dataIn2_csv[0].length]
              }
          }
        }
        if (transform_specs[i].output_table_file && transform_specs[i].output_table_file[0] !== '#') {
          if (typeof transform_specs[i].output_table_file === "string") {
            dataOut1_csv = await getCsv(
              `${request_api}/data/${transform_specs[i].output_table_file}?a=${Math.random()}`
            );
            if(!tableInf[transform_specs[i].output_table_file]){
              tableInf[transform_specs[i].output_table_file] = [transform_specs[i].output_table_name,dataOut1_csv.length,dataOut1_csv[0].length]
            }
          } else {
            dataOut1_csv = await getCsv(
              `${request_api}/data/${transform_specs[i].output_table_file[0]}?a=${Math.random()}`
            );
            if(!tableInf[transform_specs[i].output_table_file[0]]){
              tableInf[transform_specs[i].output_table_file[0]] = [transform_specs[i].output_table_name[0],dataOut1_csv.length,dataOut1_csv[0].length]
            }
            if (transform_specs[i].output_table_file.length > 1)
              dataOut2_csv = await getCsv(
              `${request_api}/data/${transform_specs[i].output_table_file[1]}?a=${Math.random()}`
            );
            if(!tableInf[transform_specs[i].output_table_file[1]]){
              tableInf[transform_specs[i].output_table_file[1]] = [transform_specs[i].output_table_name[1],dataOut2_csv.length,dataOut2_csv[0].length]
            }
          }
        }
        if (transform_specs[i].input_explict_col) {
          for (
            let col = 0;
            col < transform_specs[i].input_explict_col.length;
            col++
          ) {
            input_explict_col.push(
              dataIn1_csv[0].indexOf(
                transform_specs[i].input_explict_col[col]
              )
            );
          }
        }
        if (transform_specs[i].output_explict_col) {
          for (
            let col = 0;
            col < transform_specs[i].output_explict_col.length;
            col++
          ) {
            output_explict_col.push(
              dataOut1_csv[0].indexOf(
                transform_specs[i].output_explict_col[col]
              )
            );
          }
        }
        if (transform_specs[i].input_explict_row) {
          input_explict_row = transform_specs[i].input_explict_row;
        }
        if (transform_specs[i].output_explict_row) {
          output_explict_row = transform_specs[i].output_explict_row;
        }
        if (transform_specs[i].input_table_name) {
          if (typeof transform_specs[i].input_table_name === "string")
            input_table_name = transform_specs[i].input_table_name;
          else {
            input_table_name = transform_specs[i].input_table_name[0];
            if (transform_specs[i].input_table_name.length > 1)
              input_table_name2 = transform_specs[i].input_table_name[1];
          }
        }
        if (transform_specs[i].output_table_name) {
          if (typeof transform_specs[i].output_table_name === "string")
            output_table_name = transform_specs[i].output_table_name;
          else {
            output_table_name = transform_specs[i].output_table_name[0];
            if (transform_specs[i].output_table_name.length > 1)
              output_table_name2 = transform_specs[i].output_table_name[1];
          }
        }
        if (transform_specs[i].replace_value) {
          replace_value = transform_specs[i].replace_value;
        }
        if (transform_specs[i].input_implict_col) {
          if (typeof transform_specs[i].input_implict_col === "string") {
            input_implict_col = [
              dataIn1_csv[0].indexOf(transform_specs[i].input_implict_col),
            ];
          } else {
            for (
              let col = 0;
              col < transform_specs[i].input_implict_col.length;
              col++
            ) {
              input_implict_col.push(
                dataIn1_csv[0].indexOf(
                  transform_specs[i].input_implict_col[col]
                )
              );
            }
          }
        }
        switch (transform_specs[i].type) {
          case "create_tables":
            res = generateDataForCreateTable(dataOut1_csv);
            create_table(res, rule, output_table_name, i, this.show_table_name,pos,
              res[0].length / dataOut1_csv[0].length,res.length / dataOut1_csv.length);
            break;
          case "create_columns_merge":
            res = generateDataForCreateColumns(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              output_explict_col
            );
            create_column(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              input_explict_col,
              i,
              this.show_table_name,
              pos,
              [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "create_columns_extract":
            res = generateDataForCreateColumns_extract(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              output_explict_col
            );
            create_column(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              input_explict_col,
              i,
              this.show_table_name,
              pos,
              [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "create_columns_mutate":
            res = generateData(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              output_explict_col
            );
            create_column(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.inExp,
              res.outExp,
              i,
              this.show_table_name,
              pos,
               [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "create_columns_create":
            res = generateDataForCreateColumns_create(
              dataIn1_csv,
              dataOut1_csv,
              output_explict_col
            );
            create_column_create(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              i,
              this.show_table_name,
              pos,
               [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "create_rows_create":
            let m1 = [],m2 = [];
            for(let row = 0;row <= Math.min(2,dataIn1_csv.length - 1) ;row++){
              let tempRow = []
              for(let col = 0;col < Math.min(3,dataIn1_csv[0].length);col++){
                tempRow.push("")
              }
              m1.push(tempRow)
              m2.push(tempRow)
            }
            m2.push(dataOut1_csv[dataOut1_csv.length - 1])
            create_row(
              m1,
              m2,
              rule,
              input_table_name,
              output_table_name,
              1,
              i,
              this.show_table_name,
              pos,
              [m1[0].length / dataIn1_csv[0].length,m2[0].length / dataOut1_csv[0].length],
              [m1.length / dataIn1_csv.length, m2.length / dataOut1_csv.length]
            );
           
            break;
          case "create_rows_insert":
            res = generateDataForInsertRows(
              dataIn1_csv,
              dataOut1_csv,
              output_explict_row[0]
            );
            create_row_insert(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.inColors,
              res.outColors,
              res.inIdx,
              res.outIdx,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "delete_tables":
            res = generateData(dataIn1_csv, dataOut1_csv, [], []);
            delete_table(
              res.m1,
              rule,
              input_table_name,
              i,
              this.show_table_name,
              pos,
              [res.m1[0].length / dataIn1_csv[0].length],
              [res.m1.length / dataIn1_csv.length]
            );
            break;
          case "delete_columns_select_keep":
            res = generateDataForKeepColumns(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col
            );

            delete_column(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.outColors,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "delete_columns_select_remove":
            res = generateDataForDeleteColumn(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
            );
            delete_column(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.outColors,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "delete_columns_duplicate":
            let dupCols = getDuplicatedColumns(dataIn1_csv);
            res = generateData(dataIn1_csv, dataOut1_csv, dupCols, [
              dupCols[0],
            ]);
            let curCol = [];
            dupCols.forEach((value, idx) => {
              curCol.push(res.m1[0].indexOf(dataIn1_csv[0][value]));
            });
            delete_duplicate(
              res.m1,
              res.m2,
              curCol,
              rule,
              input_table_name,
              output_table_name,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "delete_columns_dropna":
            res = generateDataForDeleteNaColumn(dataIn1_csv, dataOut1_csv);
            delete_dropna(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.inColors,
              res.outColors,
              [res.Row, res.Col],
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "delete_rows_filter":
            res = generateDataForRows(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col
            );
            delete_row(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.outColors,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          // case 'delete_rows_filter_keep':
          //   res = generateDataForFilterRowKeep(dataIn1_csv,dataOut1_csv,input_explict_row)
          //   delete_row_keep(res.m1,res.m2,rule,input_table_name,output_table_name,res.inIndex,res.outIndex,res.inColors,res.outColors)
          //   break

          case "delete_rows_deduplicate":
            if (input_explict_col.length === 0)
              input_explict_col = Array.from(
                new Array(dataIn1_csv[0].length),
                (x, i) => i
              );
            res = generateDataForDeleteDuplicateRows(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col
            );
            console.log(res)
            delete_duplicate_row_partColumn(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.inColors,
              res.outColors,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "delete_rows_slice":
            res = generateDataForFilterRow(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col[0]
            );
            delete_filter(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.outColors,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "transform_tables_rearrange":
            res = generateDataForColumnRearrange(
              dataIn1_csv,
              dataOut1_csv,
              output_explict_col
            );
            transform_tables_rearrange(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.inColors,
              res.outColors,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "transform_tables_sort":
            //暂定为只对数值类型进行排序
            res = generateDataForTableSort(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              rule
            );
            console.log("sort res: ",res)
            transform_tables_sort(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.outColor,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "transform_columns_replace_na":
            res = generateDataForReplace(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col
            );
            transform_columns_replace_na(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              input_explict_col,
              res.naRow,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "transform_columns_replace":
            //没有实现阴影效果
            res = generateDataForReplace(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              replace_value
            );
            transform_columns_replace_na(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              input_explict_col,
              res.naRow,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "transform_columns_mutate":
            res = generateDataForMutate_cover(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              output_explict_col
            );
            transform_columns_mutate(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              input_explict_col,
              output_explict_col,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "transform_columns_extract":
            res = generateDataForMutate_cover(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              input_explict_col
            );
            transform_columns_mutate(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              input_explict_col,
              input_explict_col,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "transform_columns_merge":
            res = generateDataForMutate_cover(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              output_explict_col
            );
            transform_columns_mutate(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              input_explict_col,
              output_explict_col,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "transform_columns_rename":
            res = generateDataForColumnRename(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col
            );
            transform_columns_mutate(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.expAfter,
              res.expAfter,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "combine_columns_merge":
            res = generateDataForMergeColumns(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              output_explict_col
            );
            combine_columns_merge(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.newInExpOrImp,
              res.newOutExpOrImp,
              res.outColors,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "combine_columns_mutate":
            res = generateDataForMergeColumns(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              output_explict_col
            );

            console.log("res: ",res)

            combine_columns_merge(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.newInExpOrImp,
              res.newOutExpOrImp,
              res.outColors,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          // case 'combine_rows_sum':
          //   res = generateDataForRowsSum(dataIn1_csv,dataOut1_csv)
          //   combine_rows_sum(res.m1,res.m2,rule,input_table_name,output_table_name,i,this.show_table_name)
          //   break
          case "combine_rows_summarize":
            //这个操作再看看
            res = generateDataForGroupSummarize(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              output_explict_col,
              // input_implict_col
            );
            combine_rows_sum(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "combine_rows_interpolate":
            res = generateDataForRowInterpolate(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col
            );
            combine_rows_interpolate(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.naPos,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "transform_rows_edit":
            res = generateDataForEditRow(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_row
            );
            transform_rows_edit(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.rowIndex,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "separate_tables_subset":
            res = generateDataForSeparateSubset(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col
            );
            separate_tables_subset(
              res.m1,
              res.m2,
              res.m3,
              rule,
              input_table_name,
              output_table_name,
              output_table_name2,
              res.outColor1,
              res.outColor2,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataIn2_csv[0].length,res.m3[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataIn2_csv,res.m3.length / dataOut1_csv.length]
            );
            break;
          case "separate_tables_decompose":
            res = generateDataForSeparateDecompose(
              dataIn1_csv,
              input_explict_col
            );
            let xPercents = [res.m1[0].length / dataIn1_csv[0]]
            let yPercents = [res.m1.length / dataIn1_csv.length]
            for(let idx = 0;idx < res.tables.length;idx++){
              xPercents.push(1)
              yPercents.push(1)
            }

            separate_tables_decompose(
              res.m1,
              res.tables,
              rule,
              input_table_name,
              i,
              this.show_table_name,
              pos,
              xPercents,
              yPercents
            );
            break;
          case "separate_tables_decompose_q":
            res = generateDataForSeparateDecompose_q(
              dataIn1_csv,
              dataOut1_csv,
              dataOut2_csv,
              input_explict_col
            );
            separate_tables_subset(
              res.m1,
              res.m2,
              res.m3,
              rule,
              input_table_name,
              output_table_name,
              output_table_name2,
              res.outColor1,
              res.outColor2,
              i,
              this.show_table_name,
              pos,
              [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOu1_csv[0].length,res.m3[0].length / dataOut2_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOu1_csv,res.m3.length / dataOut2_csv.length]
            
            );
            break;
          case "separate_tables_split":
            res = generateDataForSeparateSplit(
              dataIn1_csv,
              input_explict_col,
              input_implict_col
            );
            separate_tables_split(
              res.m1,
              res.m2,
              res.m3,
              rule,
              input_table_name,
              output_table_name,
              output_table_name2,
              res.colors1,
              res.colors2,
              i,
              this.show_table_name,
              pos,
              [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOu1_csv[0].length,res.m3[0].length / dataOut2_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOu1_csv,res.m3.length / dataOut2_csv.length]
            
            );
            break;
          case "separate_columns":
            res = generateDataForSeparateColumn(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              output_explict_col
            );
            separate_columns(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.inExp,
              res.outExp,
              i,
              this.show_table_name,
              pos,
              [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "separate_rows":
            res = generateDataForSeparateRows(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col
            );
            separate_rows(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              res.outColors,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length,res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
          case "combine_tables_extend":
            res = {}
            if(!transform_specs[i].input_explict_col){
              res = generateDataForTablesExtend(
                dataIn1_csv,
                dataIn2_csv,
                dataOut1_csv
              );
              let sameColName = ""
              for(let col = 0;col < dataIn1_csv[0].length;col++){
                if(dataIn2_csv[0].indexOf(dataIn1_csv[0][col]) !== -1){         
                  sameColName = dataIn1_csv[0][col]
                  res = generateDataForTablesExtend_withExplicitCol(
                          dataIn1_csv,
                          dataIn2_csv,
                          dataOut1_csv,
                          [sameColName,sameColName]
                        );
                  break
                }
              }
            }else{
              res = generateDataForTablesExtend_withExplicitCol(
                dataIn1_csv,
                dataIn2_csv,
                dataOut1_csv,
                transform_specs[i].input_explict_col
              );
            }
            console.log("res: ",res)
            combine_tables_extend(
              res.m1,
              res.m2,
              res.m3,
              rule,
              input_table_name,
              input_table_name2,
              output_table_name,
              res.inColors1,
              res.inColors2,
              res.outColors,
              i,
              this.show_table_name,
              pos,
                [res.m1[0].length / dataIn1_csv[0].length, res.m2[0].length / dataIn2_csv[0].length, res.m3[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataIn2_csv.length, res.m3.length / dataOut1_csv.length]
            );
            break;
          case "combine_tables_left_join":
            //需要确定空值的表示形式，暂时以''表示空值
            res = generateDataForLeftJoin_2(
              dataIn1_csv,
              dataIn2_csv,
              dataOut1_csv,
              input_explict_col,
              'NA'
            );
            combine_tables_left_join(
              res.m1,
              res.m2,
              res.m3,
              rule,
              input_table_name,
              input_table_name2,
              output_table_name,
              res.naCol,
              res.naPos,
              res.inColor1,
              res.inColor2,
              res.outColor,
              i,
              this.show_table_name,
              pos,
               [res.m1[0].length / dataIn1_csv[0].length, res.m2[0].length / dataIn2_csv[0].length, res.m3[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataIn2_csv.length, res.m3.length / dataOut1_csv.length]
            
            );
            break;
          case "combine_tables_full_join":
            res = generateDataForFullJoin_2(
              dataIn1_csv,
              dataIn2_csv,
              dataOut1_csv,
              input_explict_col,
              'NA'
            );
            combine_tables_full_join(
              res.m1,
              res.m2,
              res.m3,
              rule,
              input_table_name,
              input_table_name2,
              output_table_name,
              res.naCol,
              res.naPos,
              res.inColor1,
              res.inColor2,
              res.outColor,
              i,
              this.show_table_name,
              pos,
               [res.m1[0].length / dataIn1_csv[0].length, res.m2[0].length / dataIn2_csv[0].length, res.m3[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataIn2_csv.length, res.m3.length / dataOut1_csv.length]
            
            ),
              this.show_table_name;
            break;
          case "combine_tables_inner_join":
            res = generateDataForInnerJoin(
              dataIn1_csv,
              dataIn2_csv,
              dataOut1_csv,
              input_explict_col,
              ""
            );
            combine_tables_inner_join(
              res.m1,
              res.m2,
              res.m3,
              rule,
              input_table_name,
              input_table_name2,
              output_table_name,
              res.inColors2,
              res.outColor,
              i,
              this.show_table_name,
              pos,
               [res.m1[0].length / dataIn1_csv[0].length, res.m2[0].length / dataIn2_csv[0].length, res.m3[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataIn2_csv.length, res.m3.length / dataOut1_csv.length]
            
            );
            break;
          case "transform_tables_fold":
            res = generateDataForFold(
              dataIn1_csv,
              dataOut1_csv,
              input_explict_col,
              output_explict_col
            );
            transform_tables_fold(
              res.m1,
              res.m2,
              rule,
              input_table_name,
              output_table_name,
              input_explict_col.length,
              i,
              this.show_table_name,
              pos,
               [res.m1[0].length / dataIn1_csv[0].length, res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            
            );
            break;
          case "transform_tables_unfold":
            output_explict_col = [];
            for (let col = 0; col < dataOut1_csv[0].length; col++) {
              if (dataIn1_csv[0].indexOf(dataOut1_csv[0][col]) === -1) {
                output_explict_col.push(col);
              }
            }
            res = generateDataForFold(
              dataOut1_csv,
              dataIn1_csv,
              output_explict_col,
              input_explict_col
            );
            let diffVals = new Set()
            for(let row = 1;row < dataIn1_csv.length;row++){
              diffVals.add(dataIn1_csv[row][input_explict_col[0]])
            }
            transform_tables_unfold(
              res.m2,
              res.m1,
              rule,
              input_table_name,
              output_table_name,
              diffVals.size,
              i,
              this.show_table_name,
              pos,
              [res.m1[0].length / dataIn1_csv[0].length, res.m2[0].length / dataOut1_csv[0].length],
              [res.m1.length / dataIn1_csv.length, res.m2.length / dataOut1_csv.length]
            );
            break;
        }
      }

      drawNode(this.$store.state.g,transform_specs,nodePos,tableInf,this.getTableData)
      var panZoomTiger = svgPanZoom('#mainsvg');
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped>

.el-col,
.el-header,
.el-aside,
.el-main,
.el-footer {
  border: 1px solid #000;
}
.script_table,
footer.el-footer {
  padding: 10px;
}
.el-dropdown {
  border: 1px solid #000;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}

</style>
