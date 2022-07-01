<template>
  <el-container style="background-color:#545c64;height:100%">
      <el-aside width='13.5%'>
        <el-menu
          default-active="2"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b" 
          router>
           <el-menu-item index="/zhanshi" v-if="(role == '管理员')">
            <i class="el-icon-s-marketing"></i>
            <span slot="title">数据展示</span>
          </el-menu-item>
           <el-menu-item index="/bijia" v-if="(role == '管理员')">
            <i class="el-icon-s-claim"></i>
            <span slot="title">材料比价</span>
          </el-menu-item>
         <el-submenu index="2" v-if="role == '管理员'">
          <template slot="title"><i class="el-icon-box"></i>订单管理</template>
          <el-menu-item index="/dingdan"><i class="el-icon-notebook-1"></i>订单新增及查看</el-menu-item>
        </el-submenu>
        <el-menu-item index="/typeinput" v-if="(role == '管理员')|(role == '录单员')">
            <i class="el-icon-edit"></i>
            <span slot="title">数据录入</span>
          </el-menu-item>
          <el-menu-item index="/customer" v-if="(role == '管理员')">
            <i class="el-icon-s-custom"></i>
            <span slot="title">客户名录</span>
          </el-menu-item>
          <el-menu-item index="/supplier" v-if="(role == '管理员')||(role == '仓管员')||(role == '录单员')">
            <i class="el-icon-document"></i>
            <span slot="title">供应商名录</span>
          </el-menu-item>
          <el-menu-item index="/config" v-if="(role == '审批员')|(role == '管理员')">
            <i class="el-icon-s-check"></i>
            <span slot="title">原材料审核</span>
          </el-menu-item>
          <el-menu-item index="/user" v-if="(role == '管理员')">
            <i class="el-icon-user"></i>
            <span slot="title">账户管理</span>
          </el-menu-item>
          <el-menu-item index="/cailiao">
            <i class="el-icon-user"></i>
            <span slot="title">查看名下材料</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>   
          <div style="width:20%;float:left">
            <b style="left:20px">欢迎{{name}},您的权限为{{role}}</b>
         </div>
         <div style="width:20%;float:left;margin:13px auto">
           <el-button size="small" style="float:left" type="success" @click="edit()">修改密码</el-button>
         </div>
          <div style="float:right">
            <el-popconfirm title="确认退出么？" @confirm="exitfn()">
            <el-button icon="el-icon-switch-button" slot="reference" type="danger" size="big" circle="" ></el-button>
            </el-popconfirm>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      <el-dialog :visible.sync='editpassworddlg' width="30%" center="" title="修改密码">
        <el-form :model="form" :rules="rules" status-icon  ref="form" class="demo-ruleForm" :inline='true'>
        <div style="margin:0 auto;width:200px">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input v-model="form.password2" type="password" autocomplete="true"></el-input>
          </el-form-item>
        </div>
          <div style='width:182px; margin:0 auto;'>     
            <el-button  type="primary" @click="submitForm('form');">确 定</el-button>
            <el-button @click="resetForm('form')">重 置</el-button>
          </div>  
      </el-form>
      </el-dialog>
    </el-container>
</template>

<script>
import {EditpasswordAPI} from '../until/api'
export default {
  name: 'home',
  data () {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } if(value.length <= 8){
          callback(new Error('不得少于8位'))
        }
        else {
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
    return {
      role:'',
      name:'',
      editpassworddlg:false,
      form:{},
      rules:{
        password:[
          {validator:validatePass, trigger: 'blur'}
        ],
        password2:[
          {validator:validatePass2, trigger: 'blur'}
        ],
      },
    }
  },
  created(){
    this.getrole()
  },
  methods:{
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            this.editfn()         
            this.$refs[formName].resetFields()
          } else {
            return false;
          }
        });
      },
     resetForm(formName) {
        this.$refs[formName].resetFields();
      }, 
    edit(){
      this.editpassworddlg = true
    },
    editfn(){
      EditpasswordAPI({
        name:this.name,
        password:this.$md5(this.form.password)
      }).then(res =>{this.editpassworddlg = false;this.open3();this.$router.push({path:'/'})}).catch(err =>{this.open4()})
    },
    getrole(){
      var data = JSON.parse(sessionStorage.getItem('user'))
      this.role = data[0].role
      this.name = data[0].name
    },
    exitfn(){
      sessionStorage.clear()
      this.$router.replace({
        path:'/'
      })
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
<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    height: 50;
  }

   .el-aside {
    background-color: #545c64;
    color: #333;
    text-align: center;
    line-height: 90px;
    height: 100%;
  }
  
  .el-main {
    background-color: #e9eef3;
    color: #333;
    line-height: 20px !important;
  }
  
  body > .el-container 
  {
  margin-bottom: 40px;
  height: 100%;
  }

  body,html{
		height: 100%;
	}
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .el-container.is-vertical {
    overflow: auto;
  }
</style>

