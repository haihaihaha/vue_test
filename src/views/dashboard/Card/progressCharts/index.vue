<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
export default {
  name: "barCharts",
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置对象
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        //最大值与最小值
        min:0,
        max:100,
      },
      yAxis: {
        //隐藏y轴
        show: false,
        //均分
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          color:'red',
          //柱状图的宽度
          barWidth:15,
          //背景颜色设置
          showBackground:true,
        },
      ],
    });
  },
};
</script>
<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>