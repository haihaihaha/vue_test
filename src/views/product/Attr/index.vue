<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示属性表格 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性
        </el-button>
        <!--表格：展示平台属性-->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 5px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm title="确认删除" @onConfirm="deleteAttr(row)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                  style="margin: 10px"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 
                气泡确认框 
                confirm 为Element 2.15版本
                onConfirm 该项目的Element为2.13版本 package.json查看
              -->
              <el-popconfirm
                :title="`确定删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接收平台属性的字段
      attrList: [],
      //控制表格的显示与隐藏
      isShowTable: true,
      //收集新增|修改属性的对象
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值（属性名：属性值=1：n）
          // {
          //   attrId: 0, //属性的id
          //   valueName: "", //属性值
          // },
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 0, //服务器也需要区分id等级
      },
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      // console.log(categoryId);
      //区分三级分类相应的id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        //获取单机分类的id
        this.category3Id = categoryId;
        //发请求获取品牌属性
        this.getAttrList();
      }
    },
    //获取品牌属性数据
    //当用户确定了三级分类数据时，向服务器发请求获取平台属性
    async getAttrList() {
      // console.log('发请求');
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      // console.log(result);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的回调
    addAttrValue() {
      //向属性值的数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改，可以继续新增属性值（新增属性值时，要带上已有的属性id）
        valueName: "",
        flag: true, //给每个属性值添加一个标记flag，用于用户切换查看模式和编辑模式 每个属性值相互独立，相互不影响，不会出现一起嗨现象
      });
      //
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性按钮的回调
    addAttr() {
      //切换table显示与隐藏
      this.isShowTable = false;
      //清除数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id, //收集三级分类id
        categoryLevel: 3,
      };
    },
    //修改属性按钮的回调
    updateAttr(row) {
      //切换table显示与隐藏
      this.isShowTable = false;
      //将选中的属性赋给attrInfo
      //由于数据结构当中存在对象套数组，数组套对象，因此需要使用深拷贝
      this.attrInfo = cloneDeep(row);
      //在修改属性时，给每一个属性值元素添加flag标记
      this.attrInfo.attrValueList.forEach((item) => {
        //vue无法探测普通的新增property，vue.set响应式属性（数据变化，视图跟着变）
        //第一个参数：对象 第二个参数：添加新的响应式属性 第三参数：新的属性的属性值
        this.$set(item, "flag", false); //item.flag=false 该写法错误
      });
    },
    //失去焦点的事件--切换查看模式，展示span
    toLook(row) {
      //输入属性值为空时，提示重新输入
      if (row.valueName.trim() == "") {
        this.$message("属性值为空，请输入重新输入属性值!");
        return;
      }
      //新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //row是最新新增的属性值【数组的最后一项元素】
        //判断的时候，要把自身排除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) return;
      //查看模式与编辑模式切换标记
      row.flag = false;
    },
    //
    toEdit(row, index) {
      //
      row.flag = true;
      //获取input节点，实现自动聚焦
      //需要注意：点击span的时候，切换input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间
      //点击span时，页面重绘重排一个input是需要耗费时间，因此不能一点击span就立马获取到input
      //$nextTick，当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        //获取相应的input表单元素实现聚焦
        this.$refs[index].focus();
      });
    },
    //气泡确认框确定按钮的回调
    deleteAttrValue(index) {
      //当前删除属性值的操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮：进行添加属性或者修改属性的操作
    // 整理参数：1.属性值为空的，不应该提交给服务器2.提交给服务器的数据中，不包括flag字段
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //过滤空属性值
          if (item.valueName != "") {
            //删除flag属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        //发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //展示平台属性的信号量
        this.isShowTable = true;
        //保存成功提示消息
        this.$message({ type: "success", message: "保存成功" });
        //保存成功后要再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {
        console.log(error);
        this.$message("保存失败");
      }
    },
    //删除按钮：删除属性
    async deleteAttr(attr) {
      try {
        //发请求
        let result = await this.$API.attr.reqDeleteAttr(attr.id);
        // console.log(result);
        //提示信息
        this.$message({ type: "success", message: "删除成功" });
        //删除成功后，重新获取属性列表
        this.getAttrList();
      } catch (error) {
        console.log(error);
        this.$message("删除失败");
      }
    },
  },
};
</script>

<style scoped>
</style>