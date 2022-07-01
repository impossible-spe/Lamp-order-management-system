<template>
<div>
    <div>
      <div style="height:50px">
      <el-input  placeholder="搜索订单编号" icon="search" v-model="schfilter"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
          </el-input>
      <el-input  placeholder="搜索灯具型号" icon="search" v-model="schfilter1"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
          </el-input>
      <el-input  placeholder="搜索小类别" icon="search" v-model="schfilter2"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
          </el-input>
      <el-input  placeholder="搜索供应商" icon="search" v-model="schfilter3"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
          </el-input>
      <el-input  placeholder="搜索品名" icon="search" v-model="schfilter4"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
          </el-input>
          <el-button type="success" size="small" icon="el-icon-search" circle="" @click="searchfn()"></el-button>
          <el-button type="warning" size="small" icon="el-icon-refresh" circle="" @click="getdata();searchfilterlear()"></el-button>
          <download-excel
              style="height:50px;float:right"
              class = "export-excel-wrapper"  
              :fields = 'json_fields'
              :data = "json_data" 
              name = "名下材料汇总.xls">
          <el-button type="success" @click="json_data = tableData" >execl下载</el-button>
          </download-excel>
      </div>
      <el-table :data="tableData" v-loading = loading border :height="tableheight" style="width: 100%; padding:0;">
        <el-table-column
        align='center'
        prop="cdate"
        label="日期"
        sortable
        width="120px">
        </el-table-column>
        <el-table-column
        align='center'
        prop="number"
        label="订单编号"
        width="100">
        </el-table-column>
        <el-table-column
        align='center'
        prop="ltype"
        label="灯具型号"
        width="100">
        </el-table-column>
        <el-table-column
        align='center'
        prop="ctype"
        sortable
        label="大类别"
        width="100">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cxtype"
        width="100"
        label="小类别">
        </el-table-column>
        <el-table-column
        align='center'
        prop="coder"
        label="送货单号">
        </el-table-column>
        <el-table-column
        align='center'
        prop="csupplier"
        label="供应商">
        </el-table-column>
        <el-table-column
        align='center'
        prop="csort"
        label="品名">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cguige"
        label="规格"
        width="200">
        </el-table-column>
        <el-table-column
        align='center'
        prop="ccolor"
        label="颜色">
        </el-table-column>
        <el-table-column
        align='center'
        prop="ccount"
        label="数量">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cdanwei"
        label="单位">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cprice"
        label="单价">
        </el-table-column>
        <el-table-column
        align='center'
        prop="ccost"
        label="金额">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cbeizhu"
        label="备注">
        </el-table-column>
        <el-table-column
        sortable
        align='center'
        prop="cshenhe"
        label="审核情况"
        width="120">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cjingshouren"
        label="经手人">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cshenheren"
        label="审核人">
        </el-table-column>
         <el-table-column
        align='center'
        prop="cshenhetime"
        label="审核时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">  
          <template slot-scope="scope">
            <el-button v-if="scope.row.cshenhe=='未审核'" @click="eidcailiao(scope.row);newfn()" type="primary" size="small" icon="el-icon-edit" circle></el-button>
          </template>
        </el-table-column>
    </el-table>
     <el-pagination
          style="float:right;margin-top:20px"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="page"
          :page-size="pagesize"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change = "handleCurrentChange"
          >
        </el-pagination>
  </div>
   <el-dialog title="编辑" :visible='eidcailiaodlg'>
        <el-form :model="form4"  status-icon  ref="form4" :rules="rules" class="demo-ruleForm" :inline='true'>
        <div style="margin:0 auto;width:300px">
          <el-form-item label="大类型" prop="ctype">
            <el-select v-model="form4.ctype" placeholder="请选择" @change="select(form4.ctype);supplierfn()">
              <el-option 
              v-for="item in this.list1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <div v-if="form4.ctype >0 ">
          <el-form-item v-if="form4.ctype <= 6" label="小类别" prop="cxtype">
            <el-select v-model="form4.cxtype" placeholder="请选择">
              <el-option
              v-for="item in this.list2"
              :key="item.id"
              :label="item.name"
              :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form4.ctype > 6" label="小类别" prop="cxtype">
            <el-input v-model="form4.cxtype" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="送货单号" prop="coder">
            <el-input v-model="form4.coder" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="csupplier" filterable>
            <el-select v-model="form4.csupplier" placeholder="请选择">
              <el-option
              v-for="item in this.list3"
              :key="item.id"
              :label="item.company"
              :value="item.company">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品名" prop="csort">
            <el-input v-model="form4.csort" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="规格" prop="cguige">
            <el-input v-model="form4.cguige" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="颜色" prop="ccolor">
            <el-input v-model="form4.ccolor" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="ccount">
            <el-input v-model="form4.ccount" autocomplete="true"></el-input>
          </el-form-item>
           <el-form-item label="单位" prop="cdanwei">
            <el-select v-model="form4.cdanwei" placeholder="请选择">
              <el-option
              v-for="item in this.list4"
              :key="item.id"
              :label="item.name"
              :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价" prop="cprice">
            <el-input v-model="form4.cprice" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="cbeizhu">
            <el-input v-model="form4.cbeizhu" autocomplete="true"></el-input>
          </el-form-item>
          </div>
        </div>
          <div style='width:182px; margin:0 auto;'>     
            <el-button  type="primary" @click="eidForm4('form4');">确 定</el-button>
            <el-button @click="eidcailiaodlg = false">取 消</el-button>
          </div>   
        </el-form>
    </el-dialog>
</div> 
</template>

<script>
import {ViewmingxiacailiaoAPI,ViewnewAPI,ViewxiaoleixingAPI,ViewcailiaoAPI,EditcailiaoAPI,ViewmingxiacailiaopageAPI} from '../until/api'
export default {
  data () {
    var lock = (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入内容'))
          }else {
            callback()
          }
        };
    return {
      tableheight:window.innerHeight - 195,
      page:1,
      currentPage:1,
      pagesize:10,
      rules:{
        csort:[
          {validator:lock, trigger: 'blur'}
        ],
        cprice:[
          {validator:lock, trigger: 'blur'}
        ],
        ccount:[
          {validator:lock, trigger: 'blur'}
        ],
        csupplier:[
          {validator:lock, trigger: 'blur'}
        ],
        ccost:[
          {validator:lock, trigger: 'blur'}
        ],
      },
        eidcailiaodlg:false,
        tableData:[],   
        schfilter:'',
        schfilter1:'',
        schfilter2:'',
        schfilter3:'',
        schfilter4:'',
        json_fields:{
        '订单编号':'number',
        '灯具型号':'ltype',
        '日期':'cdate',
        '大类别':'ctype',
        '小类别':'cxtype',
        "送货单号":'coder',
        "供应商":'csupplier',
        "品名":"csort",
        "规格":"cguige",
        "颜色":"ccolor",
        "数量":"ccount",
        "单位":"cdanwei",
        "单价":"cprice",
        "金额":"ccost",
        "备注":"cbeizhu",
        "审核情况":"cshenhe",
        "经手人":"cjingshouren",
        "审核人":"cshenheren",    
        "审核时间":"cshenhetime"   
      },
        json_data: [],
        loading:false,
        list1:[],
        list2:[],
        list3:[],
        list4:[
        {
          id:1,
          name:'个'
      },
        {
          id:2,
          name:'块'
      },
        {
          id:3,
          name:'件'
      },
        {
          id:4,
          name:'套'
      },
        {
          id:5,
          name:'条'
      },
        {
          id:6,
          name:'米'
      },
        {
          id:7,
          name:'对'
      },
        {
          id:8,
          name:'KG'
      },
      ],
        form4:{}
    }
  },
  created(){
    this.getdata()
  },
  methods:{
    handleCurrentChange(val){
      this.loading = true
      this.currentPage = val
      ViewmingxiacailiaoAPI({
      page:val,
      name:JSON.parse(sessionStorage.getItem('user'))[0].name,
      pagesize:this.pagesize
      })
      .then(res =>{this.tableData = res.data.slice(0,-1);
      this.page = res.data[res.data.length-1].totalpage
      this.loading=false})
    },
    handleSizeChange(val){
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    eidForm4(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.eidform4fn(this.form4.id)
          this.eidcailiaodlg = false
        } else {
          return false;
        }
      });
    },
    eidform4fn(id){
      EditcailiaoAPI(id,this.form4).
      then((res =>{this.handleCurrentChange(this.currentPage);this.open3()})).catch(err =>{this.open4()})
    },
    open3(){
      this.$notify({
        title:'修改成功',
        type:'success'
      })
    },
    open4(){
      this.$notify({
        title:'参数错误',
        type:'warning'
      })
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
      }, 
    supplierfn(){
      ViewcailiaoAPI().then(res =>{this.list3 = res.data})
    },
    select(id){
      ViewxiaoleixingAPI(id).then(res =>{this.list2 = res.data})
    },
    eidcailiao(data){
      this.eidcailiaodlg=true,
      this.form4=data
    },
    newfn(){
      ViewnewAPI().then(res => {this.list1 = res.data})
    },
    searchfn(){
      this.loading = true
      this.currentPage = 1
      this.page = 1
        ViewmingxiacailiaopageAPI(1,{name:JSON.parse(sessionStorage.getItem('user'))[0].name}).then(
        res =>{this.tableData = res.data;
        this.tableData = this.tableData.filter( item => (~item.number.indexOf(this.schfilter)))
        this.tableData = this.tableData.filter( item => (~item.ltype.indexOf(this.schfilter1)))
        this.tableData = this.tableData.filter( item => (~item.cxtype.indexOf(this.schfilter2)))
        this.tableData = this.tableData.filter( item => (~item.csupplier.indexOf(this.schfilter3)))
        this.tableData = this.tableData.filter( item => (~item.csort.indexOf(this.schfilter4)));
        this.loading = false
        }
      )
      
    },
    searchfilterlear(){
      this.schfilter = '',
      this.schfilter1 = '',
      this.schfilter2 = '',
      this.schfilter3 = '',
      this.schfilter4 = ''
    },
    getdata(){
         this.loading= true
         this.handleCurrentChange(1)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
