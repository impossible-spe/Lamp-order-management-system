<template>
    <div class="login-container">
        <el-form :model="form" :rules="rules"
         status-icon
         ref="form" 
         label-position="left" 
         label-width="0px" 
         class="demo-ruleForm login-page">
         <div style="width:240px;margin:0 auto;height:70px">
            <h2 class="title">墨晶灯饰订单管理平台</h2>
          </div>
          <div style="width:60%;margin:0 auto;">
            <el-form-item prop="username">
                <el-input type="text" 
                prefix-icon="el-icon-user-solid"
                    v-model="form.username" 
                    auto-complete="true" 
                    placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" 
                prefix-icon="el-icon-key"
                    v-model="form.password" 
                    auto-complete="off" 
                    placeholder="密码"
                    @keyup.enter.native="login('form')" ></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input 
                style="float:left;width:100px"
                size="small"
                type="text" 
                prefix-icon="el-icon-link"
                    v-model="form.code" 
                    placeholder="验证码"
                    @keyup.enter.native="login('form')" ></el-input>
                    <img @click="getyanzhengcode()" :src='icon'  style="width:100px;height:30px;float:left;margin-top:5px;margin-left:9px">
            </el-form-item>
          </div>
            <el-form-item style="width:25%;margin:0 auto">
                <el-button type="primary" style="width:100%;" @click="login('form')" :loading="logining">登录</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
  import {PostloginAPI,YanzhengcodeAPI} from '../until/api'
  export default {
    data() {
      var local = (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入内容'))
          }
          else {
            callback()
          }
        };
      return {
        icon:'',
        logining: false,
        list:{
          role:'',
        },
        form: {
        },
        rules: {
          username: [
            { validator: local, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { validator: local, message: '请输入密码', trigger: 'blur' },
          ],
          code: [
            { validator: local, message: '请输入验证码', trigger: 'blur' },
          ]
        },
      };
    },
    created(){
      this.clear()
      this.getyanzhengcode()
    },
    methods: {
      getyanzhengcode(){
        YanzhengcodeAPI().then(data=> {this.icon = 'data:image/png;base64,' + 
        btoa(new Uint8Array(data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
         })
      },
      clear(){
        sessionStorage.clear()
      },
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sub()
            this.$refs[formName].resetFields()
          } else {
            return false
          }
        });
     },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      sub(){
        PostloginAPI({
            user:this.form.username,
            password:this.$md5(this.form.password),
            code:this.form.code
          }).then(res =>{
            if(res.data.code == 402){   
              this.$notify({
              title:'验证码错误',
              type:'warning'
            })
            this.getyanzhengcode()
            return
          }if(res.data.code == 403){
            this.$notify({
              title:'账户密码错误',
              type:'warning'
            })
            this.getyanzhengcode()
          }
          else{
            sessionStorage.setItem("user",JSON.stringify([res.data[0]]));
            sessionStorage.setItem('token',JSON.stringify(res.data[1].token))
            this.loginfn()
          }})},
      loginfn(){
        var role = JSON.parse(sessionStorage.getItem("user"))
        var token = JSON.parse(sessionStorage.getItem("token"))
        if((role[0].role)&&(token)){
          this.$router.push({
            path:'/home'
          }).then(
            this.$notify({
                title:'登录成功',
                type:'success'
              })
          )
        }else{
          this.$notify({
                title:'请不要攻击我，谢谢！',
                type:'warning'
              })
        }
      },
  }
  }
</script>

<style scoped>
   .login-container {
    width: 100%;
    height: 100%;
}
.login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
</style>