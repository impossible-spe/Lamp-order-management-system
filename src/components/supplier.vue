<template>
  <div id="app">
    <div style="height:50px"> 
      <el-button type="primary" @click="dlg = true" icon="el-icon-plus">新增供应商</el-button>
    </div>
    <div style="height:50px">
    <el-input placeholder="搜索公司名称" icon="search" v-model="schfilter" @keyup.enter.native="searchfn(schfilter)" class="search-input" size="small" style="width:200px" >
      </el-input>
      <el-button type="success" size="small" icon="el-icon-search" circle="" @click="searchfn(schfilter)"></el-button>
      <el-button type="warning" size="small" icon="el-icon-refresh" circle="" @click="getdata();schfilter=''"></el-button>
    </div>
    <el-table :data="tableData" border :height="tableheight" style="width: 100%; padding:0;" v-loading = loading>
        <el-table-column
        align='center'
        prop="company"
        label="公司名称"
        width="180">
        </el-table-column>
        <el-table-column
        align='center'
        prop="name"
        label="联系人名称"
        width="250">
        </el-table-column>
        <el-table-column
        align='center'
        prop="sort"
        label="供给大类">
        </el-table-column>
        <el-table-column
        align='center'
        prop="local"
        label="地址">
        </el-table-column>
        <el-table-column
        align='center'
        prop="phone"
        label="联系电话">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">  
          <template slot-scope="scope">
            <el-button @click="viewdlg = true;view(scope.row)" type="primary" size="small" icon="el-icon-search" circle></el-button>
            <el-button @click="eiddlg = true;eid(scope.row)" type="info" size="small" icon="el-icon-edit" circle></el-button>
            <el-button @click="delclick(scope.row);deldlg = true" type="danger" size="small" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
          style="float:right;margin-top:20px"
          background
          layout="prev, pager, next"
          :total="pagenumber"
          :page-size="10"
          :current-page="currentpage"
          @current-change = "handleCurrentChange"
          >
        </el-pagination>
    <el-dialog :visible.sync='dlg' title="新增供应商" width="30%" top="1%">
      <div style="margin:0 auto;width:230px">
      <el-form :model="form" status-icon  ref="form" :rules="rules" class="demo-ruleForm" :inline='true'>
        <el-form-item label="公司名称" prop="company">
            <el-input v-model="form.company" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="供应大类" prop="sort">
            <el-select v-model="form.sort" placeholder="请选择">
              <el-option v-for="item in sortdata"
              :key="item.id"
              :label='item.name'
              :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="联系人" prop="name">
            <el-input v-model="form.name" autocomplete="true"></el-input>
          </el-form-item>
        <el-form-item label="地址" prop="local">
            <el-input v-model="form.local" autocomplete="true"></el-input>
          </el-form-item>
        <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone" autocomplete="true"></el-input>
          </el-form-item>
           <div style="margin:0 auto;width:182px">     
            <el-button  type="primary" @click="submitForm('form');">确 定</el-button>
            <el-button @click="resetForm('form')">重 置</el-button>
          </div> 
      </el-form>
      </div>
    </el-dialog>
    <el-dialog title="操作确认" :visible.sync='deldlg' width="30%" center="">
      <span style="fz">你确认要删除么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deldlg = false;delfn(delid)">确 定</el-button>
        <el-button @click="deldlg = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑供应商信息" :visible.sync='eiddlg' width="30%" center=""> 
      <div style="margin:0 auto;width:250px">
        <el-form :model="form" status-icon :rules="rules" ref="form" class="demo-ruleForm">
        <el-form-item label="公司名称"  prop="company">
            <el-input v-model="form.company" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="form.name" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="供应大类" prop="sort">
            <el-select v-model="form.sort" placeholder="请选择">
              <el-option v-for="item in sortdata"
              :key="item.id"
              :label='item.name'
              :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址"  prop="local">
            <el-input v-model="form.local" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="联系电话"  prop="phone">
            <el-input v-model.number="form.phone" autocomplete="true"></el-input>
          </el-form-item>
          <div style="margin:0 auto;width:182px">     
            <el-button type="primary" @click="editform('form');">确 定</el-button>
            <el-button @click="getdata();eiddlg = false">取 消</el-button>
          </div>  
      </el-form>
      </div>
    </el-dialog>
    <el-dialog title="查看名下原材料" :visible.sync='viewdlg' width="90%" center="" top="1%"> 
        <div class="block" style="height:50px">
          <el-date-picker
            size="small"
            v-model="value1"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp">
          </el-date-picker>
            <el-button type="primary" size="small" icon="el-icon-search" circle="" @click="viewtime(value1,viewid)"></el-button>
            <download-excel
              style="height:50px;float:right"
              class = "export-excel-wrapper"  
              :fields = 'json_fields'
              :data = "json_data" 
              name = "供应商名下材料.xls">
          <el-button type="success" @click="json_data = tableData1" >execl下载</el-button>
          </download-excel>
        </div>
      <el-table :data="tableData1" border :height="tableheight" style="width: 100%; padding:0;" v-loading = loading1>
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
    </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {GetsupplierAPI,ViewcailiaoshijianAPI,Viewcailiaoshijian2API,CatcailiaoAPI,DelsupplierAPI,EditsupplierAPI,GetsupplierpageAPI,
AddsupplierAPI} from '../until/api'
export default {
  name: 'supplier',
  data () {
    var local = (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入内容'))
          }
          if (value.length < 2 || value.length > 20) {
            callback(new Error('长度在2到20个字符'))
          }
          else {
            callback()
          }
        };
    return {
      pagenumber:1,
      currentpage:1,
      tableheight:window.innerHeight-250,
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
      loading:false,
      loading1:false,
      json_data: [],
      viewid:'',
      value1: '',
      tableData1:[],
      viewdlg:false,
      sortdata:{
        id:'',
        name:''
      },
      schfilter:'',
      eiddata:[],
      eiddlg:false,
      delid:'',
      deldlg:false,
      tableData:[],
      dlg:false,
      form:{
        sort:'',
        company:'',
        name:'',
        local:'',
        phone:''
      },
      rules:{
        company:[
          { validator:local, trigger: 'blur'}
        ],
        name:[
          { validator:local, trigger: 'blur'}
        ],
        local:[
          { validator:local, trigger: 'blur'}
        ],
        phone:[
          { validator:local, trigger: 'blur'}
        ],
      }
    }
  },
  created(){
    this.getdata()
    this.getsortdata()
  },
  methods:{
    handleCurrentChange(val){
      this.currentpage = val
      this.loading = true
      GetsupplierpageAPI({page:val}).then(res =>{this.tableData=res.data.slice(0,10);this.loading=false})
    },
    viewtime(time,id){
      ViewcailiaoshijianAPI(id,{
        time:time
      }).then(res =>{this.tableData1 = res.data})
    },
    view(id){
      this.loading1=true
      this.viewid = id.id
      var id =id.id
      Viewcailiaoshijian2API(id).then(res =>{this.tableData1 = res.data;this.loading1=false})
    },
    getsortdata(){
      CatcailiaoAPI().then(res => {this.sortdata = res.data})
    },
    delclick(id){
      this.delid = id.id
    },
    delfn(id){
      DelsupplierAPI(id).then(res => { this.getdata()  
      }).then(res =>{this.open2()}).catch(err =>{this.open4()})
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sub()
            this.$refs[formName].resetFields()
          } else {
            return false;
          }
        });
      },
    editform(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.subeid(this.eiddata.id)
            this.$refs[formName].resetFields()
          } else {
            return false;
          }
        });
      },
    subeid(id){
      EditsupplierAPI(id,this.form).then(() => {
        this.getdata();this.eiddlg = false;this.open3()
      }).catch(err =>{this.open4()})
    },
    open2() {
        this.$notify({
          title: '删除成功',
          type: 'success'
        });
      },
    open1() {
      this.$notify({
        title: '新增客户成功',
        type: 'success'
      });
    },
    open4() {
      this.$notify({
        title: '参数错误',
        type: 'warning'
      });
    },
    open3() {
      this.$notify({
        title: '成功修改信息',
        type: 'success'
      });
    },
    eid(id){
      this.eiddata = id,
      this.form.company = id.company,
      this.form.name = id.name,
      this.form.local = id.local,
      this.form.phone = id.phone
    },
    searchfn(data){
      this.loading = true
      this.currentpage = 1
      this.pagenumber = 1
      GetsupplierAPI().then(res =>{this.tableData = res.data;
      this.tableData = this.tableData.filter( item => (~item.company.indexOf(data)));
      this.loading=false})
    },
    sub(){
      AddsupplierAPI(this.form).then(res =>{this.getdata()}).then(res =>{this.open1();this.dlg = false}).catch(err =>{this.open4})
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    getdata(){
      this.loading=true
      GetsupplierpageAPI({page:this.currentpage}).then(res =>{this.tableData = res.data.slice(0,10);this.loading=false;
      this.pagenumber = res.data[10].pagenumber;
      })
      
    }
  },
}
</script>
<style scoped>
.fz{
    text-align: center;
    border: red,solid,2px;
    height: 50px;
}
</style>

