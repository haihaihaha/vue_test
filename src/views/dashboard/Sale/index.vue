<template>
  <div>
    <el-card class="box-card">
      <!-- 头部区域 -->
      <div class="clearfix">
        <!--   -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="setDay(1)">今日</span>
          <span @click="setDay(2)">本周</span>
          <span @click="setDay(3)">本月</span>
          <span @click="setDay(4)">本年</span>
          <!-- v-model="value1" -->
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            size="mini"
          >
          </el-date-picker>
        </div>
      </div>
      <!-- 内容区域 -->
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <!-- 容器 -->
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6" class="right">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li
                v-for="(row, index) in this.listState.orderRank"
                :key="row.no"
              >
                <span v-if="row.no < 4" class="rindex">{{ row.no }}</span>
                <span v-else>{{ index }}</span>
                <span>{{ row.name }}</span>
                <span class="rvalue">{{ row.money }}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      mycharts: null,
      date: [],
    };
  },
  methods: {
    //tab切换
    // handleClick() {
    //   this.mycharts.setOption({
    //     title: {
    //       text: this.title + "趋势",
    //     },

    //   });
    // },
    //时间切换
    setDay(type) {
      if (type == 1) {
        //今日
        const day = dayjs().format("YYYY-MM-DD");
        this.date = [day, day];
      } else if (type == 2) {
        //本周
        const start = dayjs().day(1).format("YYYY-MM-DD");
        const end = dayjs().day(7).format("YYYY-MM-DD");
        this.date = [start, end];
      } else if (type == 3) {
        //本月
        const start = dayjs().startOf("month").format("YYYY-MM-DD");
        const end = dayjs().endOf("month").format("YYYY-MM-DD");
        this.date = [start, end];
      } else if (type == 4) {
        //本年
        const start = dayjs().startOf("year").format("YYYY-MM-DD");
        const end = dayjs().endOf("year").format("YYYY-MM-DD");
        this.date = [start, end];
      }
    },
  },
  mounted() {
    //初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts);
    //配置数据
    this.mycharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
        },
      ],
    });
  },
  computed: {
    //计算属性-标题
    title() {
      //重新设置配置项
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list
    }),
  },
  //监听属性
  watch: {
    title() {
      // console.log("修改配置数据");
      //重新修改图标的配置数据
      //图标配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: {
          data:
            this.title == "销售额"
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:
              this.title == "销售额"
                ? this.listState.orderFullYear
                : this.listState.userFullYear,
            color: "yellowgreen",
          },
        ],
      });
    },
    listState() {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.listState.orderFullYear,
            color: "yellowgreen",
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
.box-card {
  margin: 10px 0px;
}
.clearfix {
  display: flex;
  border-bottom: 2px;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.right span {
  margin: 0px 10px;
}
.date {
  width: 250px;
  margin: 0px 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>