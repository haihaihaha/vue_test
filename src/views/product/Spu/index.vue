<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 三级联动已经是全局组件了 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部有三个部分进行切换 -->
      <!-- 模块1： 展示SPU列表的结构-->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="ei-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border style="width: 100%" :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的按钮将来用hintButton替换 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm title="确认删除" @onConfirm="deleteSpu(row)">
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next,jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 模块2： -->
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <!-- 模块3： -->
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>
    <el-dialog 
      :title="`${spu.spuName}的sku列表`" 
      :visible.sync="dialogTableVisible"
      :before-close="close">
      <el-table :data="skuList" style="width:100%" border="" v-loading="loading">
        <el-table-column property="skuName" label="名称" width="width"></el-table-column>
        <el-table-column property="price" label="价格" width="width"></el-table-column>
        <el-table-column property="weight" label="重量" width="width" ></el-table-column>
        <el-table-column label="默认图片" width="width" >
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      //分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动的可操作性
      page: 1, //分页器当前第几页
      limit: 3, //每一页需要展示多少条数据
      records: [], //spu列表的数据
      total: 0, //分页器一共需要展示数据的条数
      scene: 0, //0代表展示模块1：展示SPU列表的结构  1代表展示模块2：添加修改SPU  2代表展示模块2：添加SKU
      //控制对话框的显示与隐藏
      dialogTableVisible:false,
      spu:{},
      skuList:[],//存储sku列表的数据
      loading:true,
    };
  },
  methods: {
    //三级联动的自定义事件，可以把子组件的相应id传递给父组件
    getCategoryId({ categoryId, level }) {
      //categoryId:获取到一二三级分类的id level：为了区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        //清除二三级
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        //清除三id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //获取SPU列表数据进行展示
        this.getSpuList();
      }
    },
    //获取SPU列表的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      //携带三个参数 page,limit,category3Id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //点击分页器第几页按钮的回调
    // handleCurrentChange(page){
    //   this.page=page;
    //   this.getSpuList();
    // }
    //分页器数据条数发生变化时的回调
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      //发请求
      this.getSpuList();
    },
    //添加Spu按钮的回调
    addSpu() {
      //切换场景为1
      this.scene = 1;
      //通知子组件SpuForm发请求--两个
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改SPU按钮的回调
    updateSpu(row) {
      this.scene = 1;
      //获取子组件 在父组件当中可以通过$ref获取子组件等等
      this.$refs.spu.initSpuDate(row);
    },
    //spuForm自定义事件回调
    changeScene({ scene, flag }) {
      //flag 区分保存按钮是添加还是修改
      // console.log(scene);
      //切换到模块1的场景
      this.scene = scene;
      if (flag == "修改") {
        //子组件通知父组件切换场景 需要重新获取SPU列表
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    //skuForm自定义事件回调 切换场景
    changeScenes(scene) {
      //切换到模块1的场景
      this.scene = scene;
    },
    //删除SPU的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        //删除小细节 删没了回去上一页，还有在当前页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //添加SKU按钮的回调
    addSku(row) {
      //切换场景为2
      this.scene = 2;
      //父组件调用子组件的方法，让子组件发请求--三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //查看sku按钮的回调
    async handler(spu){
      //当点击按钮时，对话框可见
      this.dialogTableVisible=true;
      //保存spu信息
      this.spu=spu;
      //发请求，获取sku列表的数据进行展示
      let result=await this.$API.spu.reqSkuList(spu.id);
      // console.log(result);
      if(result.code==200){
        this.skuList=result.data;
        this.loading=false;
      }
    },
    //关闭对话框的回调
    close(done){
      //loading属性再次变为真
      this.loading=true;
      //清除skuList的数据
      this.skuList=[];
      //关闭对话框
      done();
    },
  },
  components: {
    //注册
    SpuForm,
    SkuForm,
  },
};
</script>

<style scoped>
</style>