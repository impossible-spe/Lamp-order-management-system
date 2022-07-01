<template>
  <div>
    <div>
      <el-button type="primary" icon="el-icon-edit" @click="dlg = true">新增客户</el-button>
    </div>
    <hr>
    <div style="height:50px">
    <el-input placeholder="搜索公司名称" icon="search" v-model="schfilter" @keyup.enter.native="searchfn(schfilter)" class="search-input" size="small" style="width:200px" >
      </el-input>
      <el-button type="success" size="small" icon="el-icon-search" circle="" @click="searchfn(schfilter)"></el-button>
      <el-button type="warning" size="small" icon="el-icon-refresh" circle="" @click="getdata();schfilter=''"></el-button>
    </div>
    <el-table :height='tableheight' :data="tableData" border style="width: 100%; padding:0;" v-loading = loading>
        <el-table-column
        align='center'
        prop="companyname"
        label="公司名称"
        width="180">
        </el-table-column>
        <el-table-column
        align='center'
        prop="name"
        label="客户名称"
        width="250">
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
        <el-table-column fixed="right" label="操作" width="200" align="center">  
          <template slot-scope="scope">
            <el-button @click="dlg3=true,editClick(scope.row)" type="primary" size="small" icon="el-icon-edit" circle></el-button>
            <el-button @click="dlg2=true,handleClick(scope.row)" type="danger" size="small" icon="el-icon-delete" circle></el-button>
            <el-button @click="dlg4=true,view(scope.row)" type="info" size="small" icon="el-icon-search" circle></el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
          style="float:right;margin-top:20px"
          background
          layout="prev, pager, next"
          :total="page"
          :page-size="10"
          :current-page="currentpage"
          @current-change = "handleCurrentChange"
          >
        </el-pagination>
    <el-dialog title="新增客户" :visible.sync='dlg' width="30%" >
        <el-form :model="form" status-icon :rules="rules" ref="form" class="demo-ruleForm">
          <el-form-item label="公司名称" prop="companyname">
            <el-input v-model="form.companyname" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="form.name" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="local">
            <el-input v-model="form.local" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" autocomplete="true"></el-input>
          </el-form-item>
          <div class="fz1">     
            <el-button  type="primary" @click="submitForm('form');">确 定</el-button>
            <el-button @click="resetForm('form')">重 置</el-button>
          </div>   
        </el-form>
    </el-dialog>
    <el-dialog title="删除确认" :visible.sync='dlg2' width="30%">
      <span>将会永久删除该项</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delfn(deldata)">确认</el-button>
        <el-button @click="dlg2 = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑客户信息" :visible.sync='dlg3' width="30%">
      <el-form :model="form3" status-icon :rules="rules" ref="form3" class="demo-ruleForm">
        <el-form-item label="公司名称"  prop="companyname">
            <el-input v-model="form3.companyname" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="form3.name" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="地址"  prop="local">
            <el-input v-model="form3.local" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="联系电话"  prop="phone">
            <el-input v-model.number="form3.phone" autocomplete="true"></el-input>
          </el-form-item>
          <div class="fz1">     
            <el-button type="primary" @click="editform('form3');">确 定</el-button>
            <el-button @click="getdata();dlg3 = false">取 消</el-button>
          </div>  
      </el-form>
    </el-dialog>
    <el-dialog title="名下订单" :visible.sync='dlg4' width="80%" top="1%">
       <download-excel
        style="height:50px;float:right"
        class = "export-excel-wrapper"  
        :fields = 'json_fields'
        :data = "json_data" 
         name = "订单总表.xls">
     <el-button type="success"  @click="json_data = tabledata2" >execl下载</el-button>
    </download-excel>
      <el-table :height="tableheight" :data="tabledata2" border style="width: 100%; padding:0;" v-loading = loading1>
        <el-table-column
        align='center'
        prop="date"
        label="日期"
        >
        </el-table-column>
        <el-table-column
        align='center'
        prop="number"
        label="订单编号"
        >
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
        <el-table-column
        align='center'
        prop="cost"
        label="订单成本">
        </el-table-column>
         <el-table-column label="查看灯具" width="200" align="center">  
          <template slot-scope="scope">
            <el-button @click="viewlight(scope.row)" type="info" size="small" icon="el-icon-search" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
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
                <el-table-column 
                  align='center'
                  label="灯具图片"
                  width="200px">
                    <template slot-scope="scope">
                      <el-image :src="imagefn(scope.row.image)"
                      :preview-src-list="imagefn2(scope.row.image)"
                      width="100%" height="100%">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                      </el-image>
                    </template>
                  </el-table-column>
            </el-table>
            </el-dialog>
            <el-dialog title="图片展示" :visible.sync='viewpicturedlg' width="35%" center=""> 
                <el-image 
                  style="width:100%;"
                  v-if='urls'
                  :src="urls" 
                  :preview-src-list="srcList">
                </el-image>
            </el-dialog>
  </div>
</template>
<script>
import {ViewdingdanAPI,EditcustomerAPI,AddcustomerAPI,GetcustomerAPI,GetcustomerpageAPI,
DelcustomerAPI,GetlightAPI} from '../until/api'
import {url} from '../until/upload'

export default {
  name: 'customer',
  data () {
      var phone = (rule, value, callback) => {
          if (value == '' || value == undefined || value == null) {
            callback(new Error('电话不能为空'));
          } else {
            callback();
          }
          
        };
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
      currentpage:1,
      page:1,
      urls:'',
      srcList:[],
      viewimage:false,
      viewpicturedlg:false,
      dialogVisible:false,
      tableData1:[],
      tableheight:window.innerHeight-220,
      json_fields:{
        '日期':'date',
        "订单编号":'number',
        "订单销售额":"sales",
        "订单利润":"profit",
        "订单成本":'cost',
      },
      json_data: [],
      loading :false,
      loading1:false,
      tableData:[],
      tabledata2:[],
      dlg: false,
      dlg2: false,
      dlg3: false,
      dlg4: false,
      deldata:-1,
      schfilter:'',
      form: {
          companyname: '',
          name: '',
          local: '',
          phone: ''
        },
      form3: {
          id:'',
          companyname: '',
          name: '',
          local: '',
          phone: ''
        },
      formLabelWidth: '120px',
      loading1:false,
      rules:{
        companyname:[
          { validator:local, trigger: 'blur'}
        ],
        name:[
          { validator:local, trigger: 'blur'}
        ],
        local:[
          { validator:local, trigger: 'blur'}
        ],
        phone:[
          { validator:phone , trigger:'blur'}
        ]
      }
    }
  },
  created(){
    this.getdata()
  },
  methods:{
    imagefn(baseurl){
      if(baseurl){
        return url+baseurl[0]
      }else{
        return 'false'
      }
    },
    imagefn2(baseurllist){
      if(baseurllist){
        var list = new Array(baseurllist.length)
      for(var i=0;i<baseurllist.length;i++){
        list.push(url+baseurllist[i])
      }
      return list
      }else{
        return ['false']
      }
    },
    viewlight(data){
      this.dialogVisible = true
      var id = data.id
      this.loading1=true
      GetlightAPI(id).then(res =>{this.tableData1 = res.data;this.loading1=false})
    },
    searchfn(data){
      GetcustomerAPI().then(res =>{
        this.tableData = res.data;
        this.tableData = this.tableData.filter( item => (~item.companyname.indexOf(data)));
      }) 
    },
    view(id){
      this.loading1 = true
      var id =id.id
      ViewdingdanAPI(id).then(res =>{this.tabledata2 = res.data;this.loading1=false})
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
    editform(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.eid(this.form3.id)
          } else {
            return false;
          }
        });
    },
    eid(id){
      EditcustomerAPI(id,this.form3).then(res =>{this.getdata();this.dlg3 = false;this.open3()})
      .catch(err =>{this.open4()})
    },
    editClick(data){
      this.form3 = data
    },  
    sub(){
      AddcustomerAPI(this.form).then(res =>{this.getdata();this.dlg = false;this.open2()})
      .catch(err =>{this.open4()})
    },
    getdata(){
      this.loading=true
      GetcustomerpageAPI({page:this.currentpage}).
      then(res => {this.tableData = res.data.slice(0,10);this.page = res.data[10].page;this.loading=false}).catch(err =>{this.open4()})
    },
    handleCurrentChange(val){
      this.currentpage = val
      this.loading=true
      GetcustomerpageAPI({page:val}).then(res =>{
        this.tableData = res.data;this.loading=false
      })
    },
    handleClick(data){
      this.deldata = data.id
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    delfn(id){
      this.dlg2 = false,
      DelcustomerAPI(id).then(res =>{this.getdata();this.open1()}).catch(err =>{this.open4()})
     },
     open1() {
        this.$notify({
          title: '删除成功',
          type: 'success'
        });
      },
      open2() {
        this.$notify({
          title: '新增客户成功',
          type: 'success'
        });
      },
      open3() {
        this.$notify({
          title: '成功修改信息',
          type: 'success'
        });
      },
      open4() {
        this.$notify({
          title: '参数错误',
          type: 'warning'
        });
      },
  }
}
</script>
<style scoped>

.fz1{
  width: 182px;
  margin: 0 auto;
  height: 60px;
}
.fz2{
  margin: 0 auto;
}

</style>

