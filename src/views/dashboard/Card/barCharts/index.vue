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
        //均分
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [30, 17, 33, 40, 88, 50,77,87],
        //   color:'cyan',
        },
      ],
      //鼠标放置时显示提示信息
      tooltip:{},
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