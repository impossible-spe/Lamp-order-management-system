import * as echarts from 'echarts/core';
import Vue from 'vue'
// 引入柱状图,折线图图表，散点图图表后缀都为 Chart
import { BarChart,LineChart,ScatterChart,PieChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  DatasetComponentOption,
  TransformComponent,
  LegendComponent 
} from 'echarts/components';

// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition, } from 'echarts/features';

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
// 注册必须的组件
echarts.use([
  LegendComponent,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  ScatterChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);
//绑定在原型链上
Vue.prototype.$echarts = echarts
//导出echarts
export default echarts 