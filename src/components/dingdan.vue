<template>
  <div>
    <div style="height:50px">
      <el-button type="primary" icon="el-icon-edit" @click="dlg1 = true;form1={};req()">新增订单</el-button>  
      <el-input placeholder="搜索订单编号" icon="search" v-model="schfilter" @keyup.enter.native="searchfn(schfilter)" class="search-input" size="small" style="width:200px" >
      </el-input>
      <el-button type="success" size="small" icon="el-icon-search" circle="" @click="searchfn(schfilter)"></el-button>
      <el-button type="warning" size="small" icon="el-icon-refresh" circle="" @click="getdata();schfilter=''"></el-button>
      <download-excel
        style="height:50px;float:right"
        class = "export-excel-wrapper"  
        :fields = 'json_fields'
        :data = "json_data" 
         name = "订单总表.xls">
     <el-button type="success"  @click="json_data = tableData" >execl下载</el-button>
    </download-excel>
    </div>
    <hr>
    <el-table :data="tableData" v-loading='loading' border :height="tableheight" style="width: 100%; padding:0;" :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column
        align='center'
        prop="date"
        label="日期"
        sortable
        width="120">
        </el-table-column>
        <el-table-column
        align='center'
        prop="number"
        label="订单编号"
        width="250">
        </el-table-column>
        <el-table-column
        align='center'
        prop="name"
        label="客户名称"
        width="120">
        </el-table-column>
        <el-table-column
        align='center'
        prop="phone"
        label="联系电话"
        width="160">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cost"
        label="订单成本">
        </el-table-column>
        <el-table-column
        align='center'
        prop="sales"
        label="订单销售额">
        </el-table-column>
        <el-table-column
        align='center'
        prop="profit"
        label="订单利润">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">  
          <template slot-scope="scope">
            <el-button @click="dlg3=true,editClick(scope.row);req()" type="primary" size="small" icon="el-icon-edit" circle></el-button>
            <el-button @click="dlg = true;handleClick(scope.row)" type="danger" size="small" icon="el-icon-delete" circle></el-button>
            <el-button @click="dialogVisible = true;getlight(scope.row)" type="info" size="small" icon="el-icon-search" circle></el-button>
          </template>
        </el-table-column>
    </el-table>
        <el-pagination
          style="float:right;margin-top:20px"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalpage"
          :page-size="pagesize"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change = "handleCurrentChange"
          >
        </el-pagination>
    <el-dialog title="新增订单" :visible.sync='dlg1' width="30%" >
        <el-form :model="form1" status-icon  ref="form1" :rules="rules" class="demo-ruleForm" :inline='true'>
        <div class="fz2">
          <el-form-item label="订单编号" prop="number">
            <el-input v-model="form1.number" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="客户公司" prop="name">
            <el-select v-model="form1.name" placeholder="请选择" filterable>
              <el-option v-for="item in cusdata"
              :key="item.id"
              :label='item.companyname'
              :value="item.companyname">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
          <div class="fz1">     
            <el-button  type="primary" @click="submitForm('form1');">确 定</el-button>
            <el-button @click="resetForm('form1')">重 置</el-button>
          </div>   
        </el-form>
    </el-dialog>
    <el-dialog title="编辑订单" :visible.sync='dlg3' width="30%" >
        <el-form :model="form1" status-icon  ref="form1" :rules="rules" class="demo-ruleForm" :inline='true'>
        <div class="fz2">
          <el-form-item label="订单编号" prop="number">
            <el-input v-model="form1.number" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="客户公司" prop="name">
            <el-select v-model="form1.name" placeholder="请选择" filterable>
              <el-option v-for="item in cusdata"
              :key="item.id"
              :label='item.companyname'
              :value="item.companyname">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
          <div class="fz1">     
            <el-button  type="primary" @click="editForm('form1');">确 定</el-button>
            <el-button @click="resetForm('form1')">重 置</el-button>
          </div>   
        </el-form>
    </el-dialog>
    <el-dialog title='订单详情' :visible.sync="dialogVisible"  width="80%" center="" top="1%">
          <el-table :data="tableData1" v-loading='loading1' border :height="tableheight" style="width: 100%; padding:0;">
                <el-table-column
                align='center'
                prop="ltype"
                label="型号"
                width="240">
                </el-table-column>
                <el-table-column
                align='center'
                prop="lsort"
                label="品名">
                </el-table-column>
                <el-table-column
                align='center'
                prop="lsize"
                label="尺寸">
                </el-table-column>
                <el-table-column
                width="260"
                align='center'
                prop="lcolor"
                label="颜色">
                </el-table-column>
                <el-table-column
                align='center'
                prop="lcount"
                label="数量">
                </el-table-column>
                <el-table-column
                align='center'
                prop="lcost"
                label="成本">
                </el-table-column>
                <el-table-column
                align='center'
                prop="lprice"
                label="单价">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="160" align="center">  
                  <template slot-scope="scope">
                     <el-button @click="viewClick(scope.row);viewdlg= true" type="primary" size="small" icon="el-icon-search" circle></el-button>
                  </template>
                </el-table-column>
            </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog title="操作确认" :visible.sync='dlg' width="30%" center="">
          <span style="fz">你确认要删除么？</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="delfn(deldata)">确 定</el-button>
            <el-button @click="dlg = false">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog title="灯具详情" :visible.sync='innerVisible' width="90%" top="1%">
          <div style="height:50px">
            <el-input  placeholder="搜索小类别名称" icon="search" v-model="schfilter2"  @keyup.enter.native="searchfn2(schfilter2)" class="search-input" size="small" style="width:200px" >
              </el-input>
              <el-button type="success" size="small" icon="el-icon-search" circle="" @click="searchfn2(schfilter2)"></el-button>
              <el-button type="warning" size="small" icon="el-icon-refresh" circle="" @click="viewClick(viewdata);schfilter=''"></el-button>
            </div>
          <el-table :data="tableData2" v-loading='loading2' border :height="tableheight" style="width: 100%; padding:0;">
            <el-table-column
            sortable
            align='center'
            prop="cdate"
            label="日期"
            width="100">
            </el-table-column>
            <el-table-column
            align='center'
            prop="ctype"
            column-key="ctype"
            :filter-method="filterctype"
            :filters = 
            "[
            {text:'原材料',value:'原材料'},
            {text:'加工',value:'加工'},
            {text:'表面处理',value:'表面处理'},
            {text:'电器',value:'电器'},
            {text:'包材',value:'包材'},
            {text:'灯罩',value:'灯罩'},
            {text:'成品灯',value:'成品灯'},
            {text:'半成品',value:'半成品'},
            {text:'其他',value:'其他'},
            ]"
            label="大类别">
            </el-table-column>
            <el-table-column
            align='center'
            prop="cxtype"
            label="小类别"
            width="100">
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
            align='center'
            prop="cshenhe"
            label="审核情况">
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
            label="审核时间"
            width="100">
            </el-table-column>
    </el-table>
        </el-dialog>
  </div>
</template>

<script>
import {GetcustomerAPI,GetdingdanpageAPI,GetdingdanAPI,GetcailiaoAPI,GetlightAPI,DeldingdanAPI,AdddingdanAPI,EditdingdanAPI} from '../until/api'
export default {
  data () {
    var local = (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入内容'))
          }
          if (value.length < 2) {
            callback(new Error('长度需要大于2个字符'))
          }
          else {
            callback()
          }
        };
    return {
      currentPage:1,
      page:1,
      pagesize:10,
      totalpage:1,
      tableheight:window.innerHeight-200,
      loading:false,
      loading1:false,
      loading2:false,
      dlg3:false,
      json_fields:{
        '日期':'date',
        "订单编号":'number',
        "客户名称":'name',
        "联系电话":'phone',
        "订单成本":'cost',
        "订单销售额":"sales",
        "订单利润":"profit",
      },
      json_data: [],
      schfilter:'',
      schfilter2:'',
      tableData:[],
      tableData1:[],
      tableData2:[],
      dialogVisible: false,
      innerVisible: false,
      dlg: false,
      dlg1:false,
      gridData:[],
      gridData2:[],
      form1: {
        },
      cusdata:[
        {
          companyname:''
        }
      ],
      data1:'',
      viewdata:[],
      deldata:'',
      rules:{
        number:[
          { validator:local, trigger: 'blur'}
        ],
        name:[
          { validator:local, trigger: 'blur'}
        ]
      }
   }
  },
  activated(){
    keepAlive = true
  },
  created(){
      this.getdata()
      this.otableData = this.tableData
  },
  methods:{
    handleCurrentChange(val){
      this.loading = true
      this.currentPage = val
      GetdingdanpageAPI({
        id:1,
        pagesize:this.pagesize,
        page:this.currentPage
        }).then(res => {this.tableData = res.data.slice(0,-1);
        this.loading=false;
        this.totalpage=res.data[res.data.length-1].totalpage;})
    },
    editClick(data){
      this.form1 = data
    },
    searchfn(data){
      if(data){
      this.loading = true
      this.currentPage = 1
      this.totalpage = 1
      GetdingdanAPI().then(res =>{this.tableData = res.data}).then
      (res =>{this.tableData = 
      this.tableData.filter( item => (~item.number.indexOf(data)));
      this.loading=false}
      );}
    },
    searchfn2(data){
      this.tableData2 = this.tableData2.filter( item => (~item.cxtype.indexOf(data)));
    },
    filterctype(value,row){
      return row.ctype === value;
    },
    open1() {
        this.$notify({
          title: '删除成功',
          type: 'success'
        });
      },
    open2() {
      this.$notify({
        title: '成功新增订单',
        type: 'success'
      });
    },
    open3() {
      this.$notify({
        title: '成功修改订单',
        type: 'success'
      });
    },
    open4() {
      this.$notify({
        title: '参数错误',
        type: 'warning'
      });
    },
    viewClick(data){
      this.loading2 = true
      this.viewdata = data
      this.innerVisible = true;
      var id =data.id
      GetcailiaoAPI(id).then(res =>{ this.tableData2 = res.data;this.loading2=false})
    },
    getlight(id){
      this.loading1 = true
      var id = id.id
      GetlightAPI(id).then(res =>{this.tableData1 = res.data;this.loading1=false})
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
    editForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editsub(this.form1.id)
            this.dlg3 = false
            this.$refs[formName].resetFields()
          } else {
            return false;
          }
        });
      },
    editsub(id){
      EditdingdanAPI(id,{
        number:this.form1.number,
        name:this.form1.name
      }).then(res =>{this.getdata();this.open3()}).catch(err =>{
        this.open4()
      })
    }, 
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    sub() {
      AdddingdanAPI({
        date:new Date().getTime(),
        number:this.form1.number,
        name:this.form1.name,
        phone:'',
        sales:0	
      }).then(res => {this.getdata();this.dlg1 = false;this.open2()}).catch(err =>{this.open4()})
      },
      delfn(id){
        DeldingdanAPI(id).then(res => {this.getdata();this.dlg = false;this.open1()}).catch(err =>{this.open4()})
      },
      req(){
        GetcustomerAPI().then(res => {this.cusdata = res.data})
        },
      handleClick(id){
        this.deldata = id.id;
      },
      getdata(){
        this.loading=true
        this.handleCurrentChange(1)
        },
      handleSizeChange(val){
            this.pagesize = val
            this.handleCurrentChange(1)
      },
      },
  }
</script>
<style scoped>
.fz1{
  width: 182px;
  margin: 0 auto;
}
.fz2{
  width: 320px;
  margin: 0 auto;
}
</style>

