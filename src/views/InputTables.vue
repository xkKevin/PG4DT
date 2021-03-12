<template>
  <div id="inputTables">
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
                <div>Input Table View</div>
                <div>
                  Select Input Table:
                  <el-dropdown @command="getInputTableData">
                    <span
                      class="el-dropdown-link"
                      style="
                        width: 135px;
                        display: inline-block;
                        text-align: right;
                      "
                    >
                    {{ inputTableName }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-for="item in inputfileList"
                                :key="item.name"
                                :value="item.name"
                                :command="item.name">
                                {{ item.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
              </el-row>
              <el-row>
                  <el-table height="405" :data="inputTableToShow" fit>
                        <el-table-column type="index"> </el-table-column>
                        <el-table-column
                        v-for="item in inputTableHead"
                        :key="item"
                        :label="item"
                        >
                        <template scope="scope">
                            {{ scope.row[item] }}
                        </template>
                        </el-table-column>
                    </el-table>
              </el-row>
            </el-col>
            
             <el-col
              :span="12"
              :offset="0"
              class="script_table"
              style="height: 100%"
            >
               <el-row type="flex" justify="space-between">
                <div>Output Table View</div>
                <div>
                  Select Output Table:
                  <el-dropdown @command="getOutputTableData">
                    <span
                      class="el-dropdown-link"
                      style="
                        width: 135px;
                        display: inline-block;
                        text-align: right;
                      "
                    >
                    {{ outputTableName }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-for="item in outputfileList"
                                :key="item.name"
                                :value="item.name"
                                :command="item.name">
                                {{ item.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
              </el-row>
              <el-row>
                  <el-table height="405" :data="outputTableToShow" fit>
                        <el-table-column type="index"> </el-table-column>
                        <el-table-column
                        v-for="item in outputTableHead"
                        :key="item"
                        :label="item"
                        >
                        <template scope="scope">
                            {{ scope.row[item] }}
                        </template>
                        </el-table-column>
                    </el-table>
              </el-row>
            </el-col>
          </el-row>

          <el-footer height="300px" direction="horizontal">
            <el-row type="flex" justify="space-between">
              <div>Upload Tables</div> 
            </el-row>
            <div id="glyphs" style="height:200px">
                <el-row>select tables</el-row>
                <el-row style="margin-top:2%">
                    <el-col style="width:45%;border:none;display: flex;justify-content:center;">
                        <el-upload
                        action=""
                        ref="inputfiles"
                        :on-remove="handleInputRemove"
                        :on-change="handleInputChange"
                        :auto-upload="false"
                        multiple
                        >
                            <el-button slot="trigger" size="small" type="primary">选取输入文件（csv、txt）</el-button>
                        </el-upload>
                    </el-col>
                    <el-col style="margin-left:10%;width:45%;border:none;display: flex;justify-content:center;">
                        <el-upload   
                        action=""
                        ref="outputfiles"
                        :on-remove="handleOutputRemove"
                        multiple
                        :on-change="handleOutputChange"
                        :auto-upload="false"
                        >
                            <el-button slot="trigger" size="small" type="primary">选取输出文件（csv、txt）</el-button>
                        </el-upload>
                    </el-col>
                </el-row>
                <el-row style="margin-top:5%;display: flex;justify-content:center;">
                    <el-button @click="submitUpload" size="small" type="primary">确认上传</el-button>
                </el-row>
            </div>
          </el-footer>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const request_api = ""
import Papa from 'papaparse'
export default {
  name: "showGlyphs",
  data() {
    return {
      inputTableName: "",
      outputTableName:"",
      inputTableToShow:[],
      inputTableHead:[],
      outputTableToShow:[],
      outputTableHead:[],
      inputFilesAsString:{},
      outputFilesAsString:{},

      inputfileList:[],
      outputfileList:[],
    }
  },

  methods:{
        getInputTableData(filename){
            this.inputTableName = filename
      	   
            var data = Papa.parse(this.inputFilesAsString[filename]).data;
            this.inputTableHead = data[0]
            let objArr = []
            for(let row = 1;row < data.length;row++){
                let tempObj = {}
                for(let col = 0;col < data[0].length;col++){
                    tempObj[data[0][col]] = data[row][col]
                }
                objArr.push(tempObj)
            }
            this.inputTableToShow = objArr 
        },
        getOutputTableData(filename){
            this.outputTableName = filename
            var data = Papa.parse(this.outputFilesAsString[filename]).data;
            this.outputTableHead = data[0]
            let objArr = []
            for(let row = 1;row < data.length;row++){
                let tempObj = {}
                for(let col = 0;col < data[0].length;col++){
                    tempObj[data[0][col]] = data[row][col]
                }
                objArr.push(tempObj)
            }
            this.outputTableToShow = objArr  
        },
        handleInputChange(file, fileList) {
            this.inputfileList = fileList

            let reader = new FileReader()
            reader.readAsText(file.raw)
            reader.onload = (e) => {
                const fileString = e.target.result
                this.inputFilesAsString[file.name] = fileString
            }
        },
        handleOutputChange(file, fileList) {
            this.outputfileList = fileList
            
            let reader = new FileReader()
            reader.readAsText(file.raw)
            //这里用箭头函数主要是考虑到涉及到this时作用域的问题
            reader.onload = (e) => {
                const fileString = e.target.result
                this.outputFilesAsString[file.name] = fileString
            }
        },
        submitUpload(){
            if(this.$refs.inputfiles.$children[0].fileList.length===0 && this.$refs.outputfiles.$children[0].fileList.length===0){
                this.$message({
                    type:'error',
                    showClose:true,
                    duration:3000,
                    message:'请选择文件!'
                });
            }else{
                let flag1 = true,flag2 = true
                let p1 = new Promise((resolve,reject)=>{
                    let data = {}
                    for(let key in this.outputFilesAsString){
                        data[key] = this.outputFilesAsString[key]
                    }
                    data['type'] = "output"
                    this.$axios({
                        url: "/api/getTablesAndParse",
                        method: "post",
                        data: this.$qs.stringify(data),
                    }).then(res => {
                        if(res.data === "False")flag1 = false
                        resolve()
                    }).catch(err=>{
                        alert(err)
                        reject()
                    })     
                })
                let p2 = new Promise((resolve,reject)=>{
                    let data = {}
                    for(let key in this.inputFilesAsString){
                        data[key] = this.inputFilesAsString[key]
                    }
                    data['type'] = "input"
                    this.$axios({
                        url: "/api/getTablesAndParse",
                        method: "post",
                        data: this.$qs.stringify(data),
                    }).then(res => {
                        if(res.data === "False")flag2 = false
                        resolve()
                    }).catch(err=>{
                        alert(err)
                        reject()
                    })     
                })

                Promise.all([p1,p2]).then(()=>{
                    if(flag1 && flag2){
                        alert("解析成功")
                        this.$router.push('/showGlyphs')
                    }
                    else{
                        alert("解析失败")
                    }
                })
            };
        },
        handleOutputRemove(file,fileList){
            this.outputfileList = fileList
        },
        handleInputRemove(file,fileList){
            this.inputfileList = fileList
        },
    }
}
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