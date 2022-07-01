<template>
    <div>
        <div style="height:50px">
        <el-input placeholder='全局搜索订单编号' v-model="form.ordernumber" size="small" class='fz'>
        </el-input>
        <el-input placeholder='全局搜索灯具型号' v-model="form.ltype" size="small" class='fz'>
        </el-input>
        <el-input placeholder='全局搜索小类别' v-model="form.xtype" size="small" class='fz'>
        </el-input>
        <el-input placeholder='全局搜索供应商' v-model="form.csupplier" size="small" class='fz'>
        </el-input>
        <el-input placeholder='全局搜索送货单号' v-model="form.coder" size="small" class='fz'>
        </el-input>
        <el-input placeholder='全局搜索品名' v-model="form.csort" size="small" class='fz'>
        </el-input>
        <el-input placeholder='全局搜索规格' v-model="form.cguige" size="small" class='fz'>
        </el-input>
        <div style="margin-left:3%;width:10%;float:left">
         <el-button type="success" size="small" icon="el-icon-search" circle="" @click="searchfn(form)"></el-button>
         <el-button type="warning" size="small" icon="el-icon-refresh" circle="" @click="getdata();formclear()"></el-button>
        </div>
        </div>
        <el-table :data="tableData" v-loading = loading border :height="tableconfig.height" style="width: 100%; padding:0;">
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
</template>

<script>
import {BijiaAPI} from '../until/api'
export default {
    data(){
        return{
            tableconfig:{
                height:window.innerHeight - 200
            },
            tableData:[],
            form:{
                ordernumber:'',
                ltype:'',
                xtype:'',
                coder:'',
                csort:'',
                cguige:'',
                csupplier:''
            },
            loading:false,
            page:1,
            currentPage:1,
            pagesize:10
        }
    },
    created(){
        this.getdata()
    },
    methods:{
        getHeight(){
            tableconfig.height = window.innerHeight - 200
        },
        formclear(){
            this.form = {
                ordernumber:'',
                ltype:'',
                xtype:'',
                coder:'',
                csort:'',
                cguige:'',
                csupplier:''
            }
        },
        getdata(){
            this.loading = true
            this.handleCurrentChange(1)
        },
        handleCurrentChange(val){
            this.loading = true
            this.currentPage = val
            BijiaAPI(1,{page:this.currentPage,pagesize:this.pagesize}).
            then(res =>{this.page = res.data[res.data.length-1].totalpage
            ;this.tableData = res.data.slice(0,-1);this.loading=false})
        },
        handleSizeChange(val){
            this.pagesize = val
            this.handleCurrentChange(1)
        },
        searchfn(data){
            this.loading = true
            this.currentPage = 1
            this.page = 1
            BijiaAPI(2,this.form).then(res =>{this.tableData = res.data;
            this.tableData = this.tableData.filter( item => (~item.number.indexOf(data.ordernumber)))
            this.tableData = this.tableData.filter( item => (~item.ltype.indexOf(data.ltype)))
            this.tableData = this.tableData.filter( item => (~item.cxtype.indexOf(data.xtype)))
            this.tableData = this.tableData.filter( item => (~item.coder.indexOf(data.coder)))
            this.tableData = this.tableData.filter( item => (~item.csort.indexOf(data.csort)))
            this.tableData = this.tableData.filter( item => (~item.csupplier.indexOf(data.csupplier)))
            this.tableData = this.tableData.filter( item => (~item.cguige.indexOf(data.cguige)));
            this.loading = false
            }).catch(err =>{
                this.loading=false
                this.getdata()
            })               
        }
    }
}
</script>

<style scoped>
    .fz{
        width: 10%;
        float: left;
        margin-left: 1%; 
        height: 1%; 
    }
</style>