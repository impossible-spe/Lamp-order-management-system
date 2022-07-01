<template>
  <div v-loading='loading' style="height:100%">
    <div style="height:130px">
    <el-card class="box-card">
        <b>订单总数</b>
        <br>
        <div class='fz'>{{form.ordernumber}} 个</div>
    </el-card>
    <el-card class="box-card">
        <b>客户总数</b>
        <br>
        <div class='fz'>{{form.cusnumber}} 个</div>
    </el-card>
    <el-card class="box-card">
        <b>利润总和</b>
        <br>
        <div class='fz'>{{form.totalprofit}} 元</div>
    </el-card>
    <el-card class="box-card">
        <b>销售额</b>
        <br>
        <div class='fz'>{{form.number}} 元</div>
    </el-card>
    </div>
    <hr>
    <div style="height:40%">
      <div id="myChart" style="width:50%;height:300px;float:left"></div>
      <div id="myChart2" style="float:right;width:50%;height:300px;"></div>
    </div>
       <div id="myChart3" style="float:left;width:100%;height:300px;"></div>
  </div>
</template>

<script>
import {ZhanshiAPI,Zhanshi2API,Zhanshi3API,Zhanshi4API} from '../until/api'
export default {
    data(){
        return{
          form:{},
          loading:false,
        }
    },
    created(){
      this.getdata()     
    },
    mounted(){
      this.drawLine()
      this.initData()
      this.drawLine2()
    },
    methods:{
      getdata(){
        this.loading = true
        ZhanshiAPI().then(res =>{this.form = res.data;this.loading=false})
      },
      drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表 
        Zhanshi2API().then(res =>{
          myChart.setOption({
                    legend: {},
                    tooltip: {},
                    title:{text:'订单销售额总和Top5'},
                    dataset: {
                      source: [
                        ['product', '销售额', '成本', '利润'],
                        res.data.total[0],
                        res.data.total[1],
                        res.data.total[2],
                        res.data.total[3],
                        res.data.total[4]
                      ]
                    },
                    xAxis: { type: 'category',
                    axisLabel: {
                        interval: 0,      // 坐标轴刻度标签的显示间隔
                        rotate: 10        // 标签倾斜的角度
                      }},
                    yAxis: {},
                    grid:{
                      right:'30%'
                    },
                    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
                          });
                          })
                      },
          drawLine2(){
                let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
                Zhanshi4API().then(res =>{
                    myChart3.setOption({
                          legend: {},
                          tooltip: {},
                          title:{text:'有利客户Top10',
                          x:'left'
                          },
                          dataset: {
                            source: res.data
                                },
                            xAxis: { type: 'category',
                            axisLabel: {
                                interval: 0,      // 坐标轴刻度标签的显示间隔
                                rotate: 0        // 标签倾斜的角度
                              }},
                            yAxis: {},
                            grid:{
                              right:'30%'
                            },
                            series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
                                  });
                                  })
                              },
          initData(){
          let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
              Zhanshi3API().then(res =>{
              myChart2.setOption({
              title : {
              text: '客户订单总数TOP10',//主标题
              x:'left',//x轴方向对齐方式
              },
              tooltip : {
              },
              series : [
                  {
                      name: '订单数量',
                      type: 'pie',
                      radius : '55%',
                      center: ['50%', '60%'],
                      data:[
                          res.data[0],
                          res.data[1],
                          res.data[2],
                          res.data[3],
                          res.data[4],
                          res.data[5],
                          res.data[6],
                          res.data[7],
                          res.data[8],
                          res.data[9],
                      ],
                      itemStyle: {
                          emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                      }
                  }
                   ]
                    })
                     })
                   }
                   }
                  }
               
        
</script>

<style scoped>
 .text {
    font-size: 14px;
  }

  .fz {
    text-align: center;
    font-size: 29px;
    margin-top:8% ;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    line-height: 100%;
    height: 80%;
    width: 20%;
    float:left;
    margin-left: 3%;
  }

</style>