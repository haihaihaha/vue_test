<template>
  <div>
    <div class="title">
      <span>我是标题</span>
      <svg style="margin:0px 10px" t="1647938931740" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2197" width="16" height="16"><path d="M512 96c-229.76 0-416 186.24-416 416s186.24 416 416 416 416-186.24 416-416-186.24-416-416-416zM577.248 665.056c-31.392 47.136-63.328 83.456-117.056 83.456-36.672-5.984-51.744-32.256-43.808-59.04l69.12-228.928c1.696-5.6-1.12-11.584-6.24-13.408-5.088-1.792-15.072 4.832-23.712 14.304l-41.792 50.272c-1.12-8.448-0.128-22.4-0.128-28.032 31.392-47.136 82.976-84.32 117.952-84.32 33.248 3.392 48.992 29.984 43.2 59.2l-69.6 230.048c-0.928 5.184 1.824 10.464 6.528 12.128 5.12 1.792 15.872-4.832 24.544-14.304l41.76-50.24c1.12 8.448-0.768 23.232-0.768 28.864zM567.936 366.048c-26.432 0-47.872-19.264-47.872-47.616s21.44-47.584 47.872-47.584 47.872 19.264 47.872 47.584c0 28.384-21.44 47.616-47.872 47.616z" p-id="2198" fill="#8a8a8a"></path></svg>
    </div>
    <div class="num">
      <span style="font-size:35px">123</span>
      <span style="margin-left:20px;margin-right:5px">123</span>
      <svg t="1647940425619" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2194" width="16" height="16"><path d="M573.056 272l308.8 404.608A76.8 76.8 0 0 1 820.736 800H203.232a76.8 76.8 0 0 1-61.056-123.392L450.976 272a76.8 76.8 0 0 1 122.08 0z" p-id="2195" fill="#d81e06"></path></svg>
      <svg t="1647940674862" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2464" width="16" height="16"><path d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z" p-id="2465" fill="#1afa29"></path></svg>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name:'lineCharts',
  mounted() {
    //初始化
    let mycharts=echarts.init(this.$refs.charts);
    //配置对象
    mycharts.setOption({
      xAxis: {
        //隐藏x轴
        // show: false,
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        // show: false,
      },
      series: [
        {
          type: "line",
          data: [30, 17, 33, 40, 88, 50,77,87],
          //拐点样式
          itemStyle: {
            opacity: 0,
          },
          //线条的样式
          lineStyle: {
            color: "greenyellow",
          },
        },
      ],
      //鼠标放置时显示提示信息
      tooltip: {},
    })
  },

}
</script>

<style scoped>
.title{
  display: flex;
  align-content: center;
}
.num{
  margin: 10px 0px;
}
.charts{
  width:100%;
  height:80px;
}
</style>