<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "lineCharts",
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置对象
    // console.log(this.listState);
    lineCharts.setOption(this.options);

  },
  computed: {
    ...mapState({
      listState: (state) => state.home.list,
    }),
    options(){
      let option={
        xAxis: {
          //隐藏x轴
          show: true,
          type: "category",
        },
        yAxis: {
          //隐藏y轴
          show: false,
        },
        series: [
          {
            type: "line",
            smooth: true,
            data: this.listState.visitTrend,
            //拐点样式
            itemStyle: {
              opacity: 0,
            },
            //线条的样式
            lineStyle: {
              color: "purple",
            },
            //填充颜色设置
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "purple", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#fff", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
        //鼠标放置时显示提示信息
        tooltip: {},
      }
      return option;
    },
    
  },
};
</script>
<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>