<template>
  <div style="height:100%">
    <div style="height:8%">
      <el-button type="primary" @click="dlg = true;getrole();form={}" icon="el-icon-edit">新增用户</el-button>
    </div>
    <el-table :data="tableData" border :height="tableheight" style="width:100%; padding:0;" v-loading='loading'>
        <el-table-column
        align='center'
        prop="user"
        label="用户">
        </el-table-column>
        <el-table-column
        align='center'
        prop="role"
        label="角色">
        </el-table-column>
        <el-table-column
        align='center'
        prop="name"
        label="使用人">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">  
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" circle @click="edit(scope.row)" ></el-button>
            <el-popconfirm title="确定删除此账户么" @confirm="delfn(scope.row)">
            <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" circle></el-button>
            </el-popconfirm>
            <el-popconfirm title="确定重置密码吗？" @confirm="resetpassword(scope.row.id)">
            <el-button slot="reference" type="primary" size="small" icon="el-icon-refresh" circle></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
    </el-table>
    <el-dialog :visible.sync='dlg' center="" title="新增用户" width="30%" top="1%">
      <el-form :model="form" :rules="rules" status-icon  ref="form" class="demo-ruleForm" :inline='true'>
        <div style="margin:0 auto;width:200px">
          <el-form-item label="用户" prop="user">
            <el-input v-model="form.user" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input v-model="form.password2" type="password" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择">
              <el-option
              v-for="item in this.rolelist"
              :key="item.id"
              :label="item.role"
              :value="item.role">
              </el-option>
            </el-select> 
          </el-form-item>
          <el-form-item label="使用人" prop="name">
            <el-input v-model="form.name" autocomplete="true"></el-input>
          </el-form-item>
        </div>
          <div style='width:182px; margin:0 auto;'>     
            <el-button  type="primary" @click="submitForm('form');">确 定</el-button>
            <el-button @click="resetForm('form')">重 置</el-button>
          </div>  
      </el-form>
  </el-dialog>
  <el-dialog :visible.sync='editdlg' center="" title="编辑用户" width="30%">
     <el-form :model="form" :rules="rules" status-icon  ref="form" class="demo-ruleForm" :inline='true'>
        <div style="margin:0 auto;width:200px">
          <el-form-item label="用户" prop="user">
            <el-input v-model="form.user" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择">
              <el-option
              v-for="item in this.rolelist"
              :key="item.id"
              :label="item.role"
              :value="item.role">
              </el-option>
            </el-select> 
          </el-form-item>
          <el-form-item label="使用人" prop="name">
            <el-input v-model="form.name" autocomplete="true"></el-input>
          </el-form-item>
        </div>
          <div style='width:182px; margin:0 auto;'>     
            <el-button  type="primary" @click="editForm('form');">确 定</el-button>
            <el-button @click="resetForm('form')">重 置</el-button>
          </div>  
      </el-form>
  </el-dialog>
  </div>
</template>

<script>
import {GetuserAPI,DeluserAPI,GetroleAPI,EdituserAPI,AdduserAPI,ResetuserAPI} from '../until/api'
export default {
   data () {
     var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } 
        if(value.length <= 8){
          callback(new Error('不得少于8位'))
        }else {
          if (this.form.password2 !== '') {
            this.$refs.form.validateField('from');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
     var lock = (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入内容'))
          }else {
            callback()
          }
        };
    return {
      tableheight:window.innerHeight - 220,
      loading:false,
      tableData:[],
      editdlg:false,
      dlg:false,
      form:{
      },
      rolelist:{
        id:'',
        role:'',
      },
      delid:'',
      editid:'',
      rules:{
        user:[
          {validator:lock, trigger: 'blur'}
        ],
        password:[
          {validator:validatePass, trigger: 'blur'}
        ],
        password2:[
          {validator:validatePass2, trigger: 'blur'}
        ],
        role:[
          {validator:lock, trigger: 'blur'}
        ],
        name:[
          {validator:lock, trigger: 'blur'}
        ],
      },
    }
  },
  created(){
    this.getdata()
  },
  methods:{
    resetpassword(id){
      ResetuserAPI(id).then(res =>{
        this.$notify({
          title:'重置密码为123',
          type:'success'
        })
      }).catch(err =>{this.open4()})
    },
    edit(data){
      this.form = data
      this.editid = data.id
      this.getrole()
      this.editdlg = true
    },
    delfn(id){
      id = id.id
      DeluserAPI(id).then(res =>{this.getdata()})
    },
    deluser(id){
      this.delid = id.id
    },
    getrole(){
      GetroleAPI().then(res =>{this.rolelist = res.data})
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
            this.eidtfn(this.editid)
            this.$refs[formName].resetFields()
          } else {
            return false;
          }
        });
      },
    eidtfn(id){
      EdituserAPI(id,this.form).then(res =>{this.getdata()}).then(res =>{this.editdlg = false}).then(res =>{this.open3()})
    },
    sub(){
      this.form.password = this.$md5(this.form.password)
      AdduserAPI(this.form).then(res =>{this.getdata();this.dlg = false}).then(res =>{this.open1()}).catch(err =>{
        this.open4()
      })
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
      }, 
    getdata(){
      this.loading = true
      GetuserAPI().then(res =>{this.tableData = res.data;this.loading = false})
    },
    open2() {
        this.$notify({
          title: '删除成功',
          type: 'success'
        });
      },
    open4() {
        this.$notify({
          title: '参数出错',
          type: 'warning'
        });
      },
      open1() {
        this.$notify({
          title: '新增成功',
          type: 'success'
        });
      },
      open3() {
        this.$notify({
          title: '修改成功',
          type: 'success'
        });
      },
  }
}
</script>

