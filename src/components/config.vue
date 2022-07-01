<template>
<div>
  <div style="height:60px;">
      请选择录单人
      <el-select v-model="number" placeholder="请选择" @change="getcailiao(number)" v-loading = loading filterable>
              <el-option
              v-for="item in this.ludanname"
              :key="item.id"
              :label="item.name"
              :value="item.name">
              </el-option>
      </el-select>
      <download-excel
          style="height:50px;float:right"
          class = "export-excel-wrapper"  
          :fields = 'json_fields'
          :data = "json_data" 
          name = "审核材料明细.xls">
      <el-button type="success" @click="json_data = tableData1" >execl下载</el-button>
      </download-excel>
    </div>
    <div style="height:50px">
      <el-input  placeholder="搜索订单编号" icon="search" v-model="form.schfilter"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
        </el-input>
      <el-input  placeholder="搜索大类别" icon="search" v-model="form.schfilter1"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
        </el-input>
        <el-input  placeholder="搜索小类别" icon="search" v-model="form.schfilter2"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
        </el-input>
        <el-input  placeholder="搜索送货单号" icon="search" v-model="form.schfilter3"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
        </el-input>
        <el-input  placeholder="搜索供应商" icon="search" v-model="form.schfilter4"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
        </el-input>
        <el-button type="success" size="small" icon="el-icon-search" circle="" @click="searchfn()"></el-button>
        <el-button type="warning" size="small" icon="el-icon-refresh" circle="" @click="getcailiao(number);clearfilter()"></el-button>
    </div>
    <div style="height:60%">
      <el-table :data="tableData1" v-loading = loading1 border :height='tableheight' style="width:100%;height:100%,padding:0;">
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
        <el-table-column fixed="right" label="操作" width="100" align="center">  
          <template slot-scope="scope">
            <el-popconfirm v-if="scope.row.cshenhe==='未审核'" title="审核后不可撤销，确认吗？" @confirm="shenhefn(scope.row)">
              <el-button  slot="reference" type="danger" size="small"><i class="el-icon-s-check"></i>审核</el-button>
            </el-popconfirm>
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
  </div>
</template>

<script>
import {GetludannameAPI,ViewmingxiacailiaoAPI,ShenheAPI,ViewmingxiacailiaopageAPI} from '../until/api'
export default {
  name: 'config',
  data () {
    return {
      form:{
        schfilter:'',
        schfilter1:'',
        schfilter2:'',
        schfilter3:'',
        schfilter4:'',
      },
      tableheight:window.innerHeight-270,
      page:1,
      pagesize:10,
      currentPage:1,
      number:'',
      schfilter:'',
      schfilter1:'',
      schfilter2:'',
      ludanname:{},
      tableData1:[],
      loading:false,
      loading1:false,
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
    }
  },
  created(){
    this.getdata()
  },
  methods:{
    clearfilter(){
      this.form.schfilter = '',
      this.form.schfilter1 = '',
      this.form.schfilter2 = '',
      this.form.schfilter3 = '',
      this.form.schfilter4 = ''
    },
    handleCurrentChange(val){
      this.loading1 = true
      this.currentPage = val
      ViewmingxiacailiaoAPI({page:val,name:this.number,pagesize:this.pagesize})
      .then(res =>{this.tableData1 = res.data;this.loading1 = false})
    },
    handleSizeChange(val){
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    searchfn(){
      this.page = 1
      this.loading1 = true;
      ViewmingxiacailiaopageAPI(1,{name:this.number}).then(res =>{this.tableData1 = res.data;
      this.tableData1 = this.tableData1.filter( item => (~item.number.indexOf(this.form.schfilter)));
      this.tableData1 = this.tableData1.filter( item => (~item.ctype.indexOf(this.form.schfilter1)));
      this.tableData1 = this.tableData1.filter( item => (~item.cxtype.indexOf(this.form.schfilter2)));
      this.tableData1 = this.tableData1.filter( item => (~item.coder.indexOf(this.form.schfilter3)));
      this.tableData1 = this.tableData1.filter( item => (~item.csupplier.indexOf(this.form.schfilter4)));
      this.loading1 = false
      })
      
    },
    open1() {
        this.$notify({
          title: '审核通过',
          type: 'success'
        });
      },
    shenhefn(id){
      var id = id.id
      ShenheAPI(id,{
        'cshenheren':JSON.parse(sessionStorage.getItem('user'))[0].name
      }).then(res =>{this.handleCurrentChange(this.currentPage);this.open1()}).catch(
        err =>{
          this.$notify({
            title:'参数出错',
            type:'warning'
          })
        }
      )
    },
    getdata(){
      this.loading = true
      GetludannameAPI().then(res => {this.ludanname = res.data;this.loading = false})
    },
    getcailiao(name){
      this.loading1 = true
      this.page = 1
      this.currentPage = 1
      ViewmingxiacailiaoAPI({
      page:this.currentPage,
      name:name,
      pagesize:this.pagesize}).
      then(res =>{this.tableData1 = res.data.slice(0,-1);
      this.page = res.data[res.data.length-1].totalpage
      this.loading1= false})
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
