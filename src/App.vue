<template>
  <div id="app">
    <el-row type="flex" justify="center">
      <el-col :span="23" :offset="0">
        <el-container>
          <el-header height="80px">
            <!-- Header content -->
            <h2 style="text-align: center">PG4DT System</h2>
          </el-header>
          <el-row style="height: 550px">
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
              <div id="monaco" style="height: 500px; margin-top: 10px"></div>
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

              <el-table height="505" :data="tableData" fit>
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
          <el-footer height="500px">
            <el-row type="flex" justify="space-between">
              <div>Glyph View</div>
              <div>
                <el-button type="primary" size="mini" style="font-size:16px" @click="generateGlyphs">Generate</el-button>
                <span style="margin-left:10px; margin-right:5px;">Show Table Name:</span>
                <el-switch
                  v-model="show_table_name"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </div>
            </el-row>
            <div id="glyphs" >
              Here is a set of glyphs!
            </div>
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

import {create_column} from './assets/js/glyph/create_column.js'
import {extractCols} from "./assets/js/utils/extractContextualCols"
import {create_row} from "./assets/js/glyph/create_row";
import {generateData} from "./assets/js/utils/generateData";
import {delete_column} from "./assets/js/glyph/delete_column";
import {delete_table} from "./assets/js/glyph/delete_table";
import {delete_duplicate} from "./assets/js/glyph/delete_duplicate";
import {delete_dropna} from "./assets/js/glyph/delete_dropna";
import {delete_row} from "./assets/js/glyph/delete_row";
import {generateDataForRows} from "./assets/js/utils/generateDateForRows";
import {delete_duplicate_row_partColumn} from "./assets/js/glyph/delete_duplicate_row_partColumn";
import {generateDataForDeleteDuplicateRows} from "./assets/js/utils/generateDataForDeleteDuplicateRows";
import {generateDataForDeleteDuplicateRows_fullRow} from "./assets/js/utils/generateDataForDeleteDuplicateRows_fullRow";
import {delete_duplicate_row_fullColumn} from "./assets/js/glyph/delete_duplicated_row_fullColumn";
import {delete_filter} from "./assets/js/glyph/delete_filter";
import {generateDataForFilter_keep} from "./assets/js/utils/generateDataForFilter_keep";
import {generateDataForFilter_delete} from "./assets/js/utils/generateDataForFilter_delete";
import {generateDataForInsertRows} from "./assets/js/utils/generateDataForInsertRow";
import {create_row_insert} from "./assets/js/glyph/create_row_insert";
import {generateDataForDeleteColumn} from "./assets/js/utils/generateDataForDeleteColumn";
import {generateDataForKeepColumns} from "./assets/js/utils/generateDataForKeepColumns";
import {getDuplicatedColumns} from "./assets/js/utils/getDuplicatedColumns";
import {getNaCol} from "./assets/js/utils/getNaCol";
import {generateDataForDeleteNaColumn} from "./assets/js/utils/generateDataForDeleteNaColumn";
import {generateDataForFilterRowKeep} from "./assets/js/utils/generateDataForFilterRowKeep";
import {delete_row_keep} from "./assets/js/glyph/delete_row_keep";
import {getDuplicatedRows} from "./assets/js/utils/getDupicateRows";
import {generateDataForFilterRow} from "./assets/js/utils/generateDataForFilterRow";
import {create_table} from "./assets/js/glyph/create_table";
import {generateDataForCreateTable} from "./assets/js/utils/generateDataForCreateTable";
import {generateDataForCreateColumns} from "./assets/js/utils/generateDataForCreateColumns";
import {getCsv} from "./assets/js/utils/getCsv";
import {generateDataForColumnRearrange} from "./assets/js/utils/generateDataForColumnRearrange";
import {transform_tables_rearrange} from "./assets/js/glyph/transform_tables_rearrange";
import {generateDataForTableSort} from "./assets/js/utils/generateDataForTableSort";
import {transform_tables_sort} from "./assets/js/glyph/transform_tables_sort";
import {generateDataForReplace} from "./assets/js/utils/generateDataForReplace";
import {transform_columns_replace_na} from "./assets/js/glyph/transform_columns_replace_na";
import {generateDataForMutate_cover} from "./assets/js/utils/generateDataForMutate_cover";
import {transform_columns_mutate} from "./assets/js/glyph/transform_columns_mutate";
import {generateDataForColumnRename} from "./assets/js/utils/generateDataForColumnRename";
import {generateDataForMergeColumns} from "./assets/js/utils/generateDataForMergeColumns";
import {combine_columns_merge} from "./assets/js/glyph/combine_columns_merge";
import {generateDataForRowsSum} from "./assets/js/utils/generateDataForRowsSum";
import {combine_rows_sum} from "./assets/js/glyph/combine_rows_sum";
import {generateDataForGroupSummarize} from "./assets/js/utils/generateDataForGroupSummarize";
import {generateDataForRowInterpolate} from "./assets/js/utils/generateDataForRowInterpolate";
import {combine_rows_interpolate} from "./assets/js/glyph/combine_rows_interpolate";
import {generateDataForEditRow} from "./assets/js/utils/generateDataForEditRow";
import {transform_rows_edit} from "./assets/js/glyph/transform_rows_edit";
import {generateDataForSeparateSubset} from "./assets/js/utils/generateDataForSeparateSubset";
import {separate_tables_subset} from "./assets/js/glyph/separate_tables_subset";
import {generateDataForSeparateDecompose} from "./assets/js/utils/generateDataForSeparateDecompose";
import {separate_tables_decompose} from "./assets/js/glyph/separate_tables_decompose";
import {generateDataForSeparateDecompose_q} from "./assets/js/utils/generateDataForSeparateDecompose_q";
import {generateDataForSeparateSplit} from "./assets/js/utils/generateDataForSeparateSplit";
import {separate_tables_split} from "./assets/js/glyph/separate_tables_split";
import {generateDataForSeparateColumn} from "./assets/js/utils/generateDataForSeparateColumn";
import {separate_columns} from "./assets/js/glyph/separate_columns";
import {generateDataForSeparateRows} from "./assets/js/utils/generateDataForSeparateRows";
import {separate_rows} from "./assets/js/glyph/separate_rows";

export default {
  name: "App",
  // delimiters: ["[[", "]]"],
  data() {
    return {
      editor: null, // 文本编辑器
      table_name: "",
      all_tables: [
        "benchmark5.txt",
        "benchmark19.txt",
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
        /*
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄sladfj ",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄sladfj ",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        */
      ],
      tableHead: [
        /*"date", "name", "address"*/
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
      if (table_file.startsWith("table")) {
        this.$message({
          message: "The table does not exist.",
          type: "error", // success/warning/info/error
        });
      } else {
        const table_path = "http://localhost/data/" + table_file;
        d3.csv(table_path).then((data) => {
          this.table_name = table_file;
          this.tableData = data;
          this.tableHead = data.columns;
        });
      }
    },
    getScriptData(script_content = "", language = "") {
      const path = "http://localhost/getScriptData";
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
      const path = "http://localhost/generate_transform_specs";
      axios
        .get(path, { params: { script_content:this.editor.getValue(), language:this.language } })
        .then((response) => {
          // 生成glyphs的操作
          document.getElementById('glyphs').innerHTML = ''
          this.preparation(response.data.transform_specs)
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async preparation(transform_specs){
      for(let i = 0;i < transform_specs.length; i++){
        let rule = transform_specs[i].operation_rule
        let dataIn1_csv,dataIn2_csv,dataOut1_csv,dataOut2_csv
        let input_explict_col = [],output_explict_col = []
        let input_explict_row = [],output_explict_row = []
        let input_implict_col = []
        let input_table_name,output_table_name
        let replace_value
        let res
        // console.log(`http://localhost/data/${transform_specs[i].input_table_file}`)
        if(transform_specs[i].input_table_file){
          if(transform_specs[i].input_table_file){
            if(typeof transform_specs[i].input_table_file === 'string')
              dataIn1_csv = await getCsv(`http://localhost/data/${transform_specs[i].input_table_file}`)
            else{
              dataIn1_csv = await getCsv(`http://localhost/data/${transform_specs[i].input_table_file[0]}`)
              if(transform_specs[i].input_table_file.length > 1)
                dataIn2_csv = await getCsv(`http://localhost/data/${transform_specs[i].input_table_file[1]}`)
            }
          }
        }
        if(transform_specs[i].output_table_file){
          if(typeof transform_specs[i].output_table_file === 'string'){
            dataOut1_csv = await getCsv(`http://localhost/data/${transform_specs[i].output_table_file}`)
          }
          else{
            dataOut1_csv = await getCsv(`http://localhost/data/${transform_specs[i].output_table_file[0]}`)
            if(transform_specs[i].output_table_file.length > 1)
              dataOut2_csv = await getCsv(`http://localhost/data/${transform_specs[i].output_table_file[1]}`)
          }
        }
        if(transform_specs[i].input_explict_col){
          if(typeof transform_specs[i].input_explict_col === 'string'){
            input_explict_col = [dataIn1_csv[0].indexOf(transform_specs[i].input_explict_col)]
          }else{
            for(let col = 0;col < transform_specs[i].input_explict_col.length;col++){
              input_explict_col.push(dataIn1_csv[0].indexOf(transform_specs[i].input_explict_col[col]))
            }
          }
        }
        if(transform_specs[i].output_explict_col){
          if(typeof transform_specs[i].output_explict_col === 'string'){
            output_explict_col = [dataIn1_csv[0].indexOf(transform_specs[i].output_explict_col)]
          }else{
            for(let col = 0;col < transform_specs[i].output_explict_col.length;col++){
              output_explict_col.push(dataOut1_csv[0].indexOf(transform_specs[i].output_explict_col[col]))
            }
          }
        }
        if(transform_specs[i].input_explict_row){
          input_explict_row = transform_specs[i].input_explict_row
        }
        if(transform_specs[i].output_explict_row){
          output_explict_row = transform_specs[i].output_explict_row
        }
        if(transform_specs[i].input_table_name){
          input_table_name = transform_specs[i].input_table_name
        }
        if(transform_specs[i].output_table_name){
          output_table_name = transform_specs[i].output_table_name
        }
        if(transform_specs[i].replace_value){
          replace_value = transform_specs[i].replace_value
        }
        if(transform_specs[i].input_implict_col){
          input_implict_col = transform_specs[i].input_implict_col
        }
        switch (transform_specs[i].type) {
          case 'create_tables':
            res = generateDataForCreateTable(dataOut1_csv)
            create_table(res,rule,output_table_name,i)
            break
          case 'create_columns_merge':
            res = generateDataForCreateColumns(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col)
            create_column(res.m1,res.m2,rule,input_table_name,output_table_name,input_explict_col,i)
            break
          case 'create_columns_extract':
            res = generateData(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col)
            create_column(res.m1,res.m2,rule,input_table_name,output_table_name,input_explict_col,i)
            break
          case 'create_columns_mutate':
            res = generateData(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col)
            create_column(res.m1,res.m2,rule,input_table_name,output_table_name,res.inExp,res.outExp,i)
            break
          case 'create_columns_create':
            res = generateData(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col)
            create_column(res.m1,res.m2,rule,input_table_name,output_table_name,res.inExp,res.outExp,i)
            break
          case 'create_rows_create':
            let m1 = [], m2 = []
            dataIn1_csv.forEach(d => {
              if(m1.length <= 3)m1.push(d)
            })
            dataOut1_csv.forEach(d => {
              if(m2.length <= 4)m2.push(d)
            })
            create_row(m1,m2,rule,input_table_name,output_table_name,1)
            break
          case 'create_rows_insert':
            res = generateDataForInsertRows(dataIn1_csv,dataOut1_csv,output_explict_row[0])
            create_row_insert(res.m1,res.m2,rule,input_table_name,output_table_name,res.inColors,res.outColors,res.inIdx,res.outIdx)
            break
          case 'delete_tables':
            res = generateData(dataIn1_csv,dataOut1_csv,[],[])
            delete_table(res.m1,rule,input_table_name)
            break
          case 'delete_columns_select_keep':
            res = generateDataForKeepColumns(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col)
            delete_column(res.m1,res.m2,rule,input_table_name,output_table_name,res.inColors,res.outColors)
            break
          case 'delete_columns_select_remove':
            res = generateDataForDeleteColumn(dataIn1_csv,dataOut1_csv,input_explict_col,[])
            delete_column(res.m1,res.m2,rule,input_table_name,output_table_name,res.inColors,res.outColors)
            break
          case 'delete_columns_duplicate':
            let dupCols = getDuplicatedColumns(dataIn1_csv)
            res = generateData(dataIn1_csv,dataOut1_csv,dupCols,[dupCols[0]])
            let curCol = []
            dupCols.forEach((value,idx) => {
              curCol.push(res.m1[0].indexOf(dataIn1_csv[0][value]))
            })
            delete_duplicate(res.m1,res.m2,curCol,rule,input_table_name,output_table_name,i)
            break
          case 'delete_columns_dropna':
            res = generateDataForDeleteNaColumn(dataIn1_csv,dataOut1_csv)
            delete_dropna(res.m1,res.m2,rule,input_table_name,output_table_name,res.inColors,res.outColors,[res.Row,res.Col],i)
            break
          case 'delete_rows_filter':
            res = generateDataForRows(dataIn1_csv,dataOut1_csv,'delete',input_explict_row)
            let deletePos = input_explict_row === 1 ? 0 :
                    input_explict_row === dataIn1_csv.length - 1 ? -1 : 1
            delete_row(res.m1,res.m2,"Delete row",input_table_name,output_table_name,deletePos,-1,res.inIndex,res.outIndex,i)
            break
          // case 'delete_rows_filter_keep':
          //   res = generateDataForFilterRowKeep(dataIn1_csv,dataOut1_csv,input_explict_row)
          //   delete_row_keep(res.m1,res.m2,rule,input_table_name,output_table_name,res.inIndex,res.outIndex,res.inColors,res.outColors)
          //   break

          // case 'delete_rows_duplicate_partColumn':
          //   let dupRows = getDuplicatedRows(dataIn1_csv,input_explict_col[0])
          //   res = generateDataForDeleteDuplicateRows(dataIn1_csv,dataOut1_csv,dupRows,input_explict_col[0])
          //   delete_duplicate_row_partColumn(res.m1,res.m2,rule,input_table_name,output_table_name,res.outColors)
          //   break
          case 'delete_rows_deduplicate':
            let dupRows = getDuplicatedRows(dataIn1_csv)
            res = generateDataForDeleteDuplicateRows_fullRow(dataIn1_csv,dataOut1_csv,dupRows)
            delete_duplicate_row_fullColumn(res.m1,res.m2,rule,input_table_name,output_table_name,res.inColors,res.outColors,i)
            break
          case 'delete_rows_slice':
            res = generateDataForFilterRow(dataIn1_csv,dataOut1_csv,input_explict_col[0])
            delete_filter(res.m1,res.m2,rule,input_table_name,output_table_name,res.outColors)
            break
          case 'transform_tables_rearrange':
            res = generateDataForColumnRearrange(dataIn1_csv,dataOut1_csv,output_explict_col)
            transform_tables_rearrange(res.m1,res.m2,rule,input_table_name,output_table_name,res.inColors,res.outColors,i)
            break
          case 'transform_tables_sort':
            //暂定为只对数值类型进行排序
            res = generateDataForTableSort(dataIn1_csv,dataOut1_csv,input_explict_col,rule)
            console.log(res)
            transform_tables_sort(res.m1,res.m2,rule,input_table_name,output_table_name,i)
            break
          case 'transform_columns_replace_na':
            res = generateDataForReplace(dataIn1_csv,dataOut1_csv,input_explict_col)
            transform_columns_replace_na(res.m1,res.m2,rule,input_table_name,output_table_name,input_explict_col,res.naRow)
            break
          case 'transform_columns_replace':
            //没有实现阴影效果
            res = generateDataForReplace(dataIn1_csv,dataOut1_csv,input_explict_col,replace_value)
            transform_columns_replace_na(res.m1,res.m2,rule,input_table_name,output_table_name,input_explict_col,res.naRow)
            break
          case 'transform_columns_mutate':
            res = generateDataForMutate_cover(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col)
            transform_columns_mutate(res.m1,res.m2,rule,input_table_name,output_table_name,input_explict_col,output_explict_col)
            break
          case 'transform_columns_extract':
            res = generateDataForMutate_cover(dataIn1_csv,dataOut1_csv,input_explict_col,input_explict_col)
            transform_columns_mutate(res.m1,res.m2,rule,input_table_name,output_table_name,input_explict_col,input_explict_col)
            break
          case 'transform_columns_merge':
            res = generateDataForMutate_cover(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col)
            transform_columns_mutate(res.m1,res.m2,rule,input_table_name,output_table_name,input_explict_col,output_explict_col)
            break
          case 'transform_columns_rename':
            res = generateDataForColumnRename(dataIn1_csv,dataOut1_csv,input_explict_col)
            transform_columns_mutate(res.m1,res.m2,rule,input_table_name,output_table_name,input_explict_col,input_explict_col)
            break
          case 'combine_columns_merge':
            res = generateDataForMergeColumns(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col)
            combine_columns_merge(res.m1,res.m2,rule,input_table_name,output_table_name,res.newInExpOrImp,res.newOutExpOrImp,res.outColors)
            break
          case 'combine_columns_mutate':
            res = generateDataForMergeColumns(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col)
            combine_columns_merge(res.m1,res.m2,rule,input_table_name,output_table_name,res.newInExpOrImp,res.newOutExpOrImp,res.outColors)
            break
          case 'combine_rows_sum':
            res = generateDataForRowsSum(dataIn1_csv,dataOut1_csv)
            combine_rows_sum(res.m1,res.m2,rule,input_table_name,output_table_name)
            break
          case 'combine_rows_summarize':
            res = generateDataForGroupSummarize(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col,input_implict_col)
            combine_rows_sum(res.m1,res.m2,rule,input_table_name,output_table_name)
            break
          case 'combine_rows_interpolate':
            res = generateDataForRowInterpolate(dataIn1_csv,dataOut1_csv,input_explict_col)
            combine_rows_interpolate(res.m1,res.m2,rule,input_table_name,output_table_name,res.naPos,i)
            break
          case 'transform_rows_edit':
            res = generateDataForEditRow(dataIn1_csv,dataOut1_csv,input_explict_row)
            transform_rows_edit(res.m1,res.m2,rule,input_table_name,output_table_name,res.rowIndex,i)
            break
          case 'separate_tables_subset':
            res = generateDataForSeparateSubset(dataIn1_csv,dataOut1_csv,input_explict_col)
            separate_tables_subset(res.m1,res.m2,res.m3,rule,input_table_name,output_table_name,output_table_name,res.outColor1,res.outColor2,i)
            break
          case 'separate_tables_decompose':
            res = generateDataForSeparateDecompose(dataIn1_csv,input_explict_col)
            separate_tables_decompose(res.m1,res.tables,rule,input_table_name,i)
            break
          case 'separate_tables_decompose_q':
            res = generateDataForSeparateDecompose_q(dataIn1_csv,dataOut1_csv,dataOut2_csv,input_explict_col)
            separate_tables_subset(res.m1,res.m2,res.m3,rule,input_table_name,output_table_name,output_table_name,res.outColor1,res.outColor2,i)
            break
          case 'separate_tables_split':
            res = generateDataForSeparateSplit(dataIn1_csv,input_explict_col,input_implict_col)
            separate_tables_split(res.m1,res.m2,res.m3,rule,input_table_name,output_table_name,output_table_name,res.colors1,res.colors2,i)
            break
          case 'separate_columns':
            res = generateDataForSeparateColumn(dataIn1_csv,dataOut1_csv,input_explict_col,output_explict_col)
            separate_columns(res.m1,res.m2,rule,input_table_name,output_table_name,input_explict_col,output_explict_col)
            break
          case 'separate_rows':
            res = generateDataForSeparateRows(dataIn1_csv,dataOut1_csv,input_explict_col)
            separate_rows(res.m1,res.m2,rule,input_table_name,output_table_name,res.outColors,i)
            break
                // case 'combine_tables_extend':

        }
      }
    }
  },
  /* # 同时监听到两个值的变化再执行方法
  computed: {
    address() {
      const { script_content, language } = this;
      return { script_content, language };
    },
  },
  watch: {
    address(val) {
      console.log(val);
      this.changeModel(val.script_content, val.language)
    },
  },
  */
  mounted() {
    this.initData();
    /*
    function getTable(path) {
      return new Promise((resolve, reject) => {
        d3.csv(path).then((data) => {
          let tempData = [];
          tempData.push(Array.from(data.columns));
          data.forEach((d) => {
            tempData.push(Array.from(Object.values(d)));
          });
          resolve(tempData);
        });
      });
    }

    let transform_specs = {
      type: "create_column_mutate",
      input_table_file: "data1.csv",
      output_table_file: "data2.csv",
      input_table_name: "t1",
      output_table_name: "t2",
      original_col: [], // 也可以写成数字，如 [1, 3]
      new_col: "d",
      operation: "sum",
    };

    let t1 = transform_specs.input_table_file;
    let t2 = transform_specs.output_table_file;
    let rule = transform_specs.operation;
    let t1_name = transform_specs.input_table_name;
    let t2_name = transform_specs.output_table_name;
    let oriCol = transform_specs.original_col;
    let newCol = transform_specs.new_col;

    async function preparation(transform_specs) {
      let data1_csv = await getTable("http://localhost/static/d1.csv");
      let data2_csv = await getTable("http://localhost/static/d2.csv");

      //提取出满足条件的矩阵
      let res = generateData(data1_csv, data2_csv, oriCol, newCol);
      let curCol = [];
      //curCol记录的是input glyph的所有列（包括explicit/implicit列和contextual列）
      //在input table中的位置
      oriCol.forEach((idx) => {
        curCol.push(res.m1[0].indexOf(data1_csv[0][idx]));
      });

      //创建列
      create_column(res.m1, res.m2, curCol, rule, t1_name, t2_name);

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

    preparation(transform_specs);
    */
  },
};
</script>

<style>
#app {
}
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
