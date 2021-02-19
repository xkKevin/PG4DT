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
            <div id="glyphs">
              Here is a set of glyphs!
            </div>
          </el-footer>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { create_column } from "./assets/js/glyph/create_column.js";
import { extractCols } from "./assets/js/utils/extractContextualCols";
import { create_row } from "./assets/js/glyph/create_row";
import { generateData } from "./assets/js/utils/generateData";
import axios from "axios";
import * as d3 from "d3";
import * as monaco from "monaco-editor"; // https://www.cnblogs.com/xuhaoliang/p/13803230.html

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
          console.log(response.data.transform_specs);
        })
        .catch((error) => {
          console.log(error);
        });
    },
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
