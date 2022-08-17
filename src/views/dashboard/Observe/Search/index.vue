<template>
  <el-card>
    <div slot="header" class="search-header">
      <span>线上热门搜索</span>

      <el-dropdown>
        <i class="el-icon-more"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12"><lineCharts></lineCharts></el-col>
        <el-col :span="12"><lineCharts></lineCharts></el-col>
      </el-row>
    </div>
    <div>
      <!-- :default-sort="{ prop: 'date', order: 'descending' }" -->
      <el-table style="width: 100%" border="" :data="this.listState.searchWord.slice(this.page,this.page+4)">
        <el-table-column label="排名" width="80" type="index">
        </el-table-column>
        <el-table-column prop="word" label="搜索关键字" width="180">
        </el-table-column>
        <el-table-column prop="user" label="用户数" sortable>
        </el-table-column>
        <el-table-column prop="count" label="周涨幅" sortable>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination 
      @current-change="handleCurrentChange"
      :page-size="4"
      layout="->,prev, pager, next" 
      :total="this.listState.searchWord.length"
      > </el-pagination>
    </div>
  </el-card>
</template>

<script>
import lineCharts from "./lineCharts";
import { mapState } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      tableData: [{}],
      page:0,
    };
  },
  methods:{
    handleCurrentChange(page){
      this.page=page+3;
    }
  },
  components: {
    lineCharts,
  },
  computed: {
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
</style>