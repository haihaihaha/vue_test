<template lang="">
	<div>
		<el-form ref="form" label-width="80px" :model="spu">
			<el-form-item label="SPU名称">
				<el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
			</el-form-item>
			<el-form-item label="品牌">
				<el-select placeholder="请选择品牌" v-model="spu.tmId">
					<el-option :label="tm.tmName" :value="tm.id" v-for="(tm,index) in tradeMarkList" :key="tm.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="SPU描述">
				<el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
			</el-form-item>
			<el-form-item label="SPU图片">
        <!--  
          上传图片
          action:上传地址
          list-type:文件列表类型
          on--preview:图片预览时触发
          on-remove:图片删除时触发
        -->
				<el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList" :on-success="handlerSuccess">
				    <i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</el-form-item>
			<el-form-item label="销售属性">
				<el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
					<el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"></el-option>
				</el-select>
				<el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示当前SUP自己的销售属性值 -->
				<el-table style="width:100%" border :data="spu.spuSaleAttrList">
					<el-table-column width="80px" align="center" type="index" label="序号">
					</el-table-column>
					<el-table-column prop="saleAttrName" label="属性名" width="width">
					</el-table-column>
					<el-table-column prop="prop" label="属性值名称列表" width="width">
            <!-- @close="handleClose(tag)" -->
            <template slot-scope="{row,$index}">
              <!-- el-tag:用户展示已有属性值列表的数据 -->
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">{{tag.saleAttrValueName}}</el-tag>
                <!-- @keyup.enter.native="handleInputConfirm"  -->
                <!-- 以下input与button同理与平台属性管理span与input -->
                <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)"></el-input>
                  <!-- @click="showInput" -->
                  <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">+ 添加</el-button>
            </template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
            </template>
					</el-table-column>
				</el-table>
			</el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
		</el-form>
	</div>
</template>
<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //spu属性初始化时是一个空对象，会向服务器发请求，返回spu信息（对象）
      //添加SPU，添加SPU时，SPU需要的字段参考文档
      spu: {
        category3Id: 0, //三级分类的id
        description: "", //描述
        spuName: "", //spu名称
        tmId: "", //平台的id
        //收集SPU图片的信息
        spuImageList: [
          //   {
          //     id: 0,
          //     imgName: "",
          //     imgUrl: "",
          //     spuId: 0,
          //   },
        ],
        //平台属性与属性值的收集
        spuSaleAttrList: [
          //   {
          //     baseSaleAttrId: 0,
          //     id: 0,
          //     saleAttrName: "",
          //     spuId: 0,
          //     spuSaleAttrValueList: [
          //       {
          //         baseSaleAttrId: 0,
          //         id: 0,
          //         isChecked: "",
          //         saleAttrName: "",
          //         saleAttrValueName: "",
          //         spuId: 0,
          //       },
          //     ],
          //   },
        ],
      }, //存储SPU信息属性
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储SPU图片数据
      saleAttrList: [], //存储销售属性的数据
      attrIdAndAttrName: "", //收集未选择的销售属性的id
    };
  },
  methods: {
    //点击取消按钮时的回调
    cancel(){
      //通知父组件切换场景0
      this.$emit('changeScene',{ scene:0,flag:''});
      //清理数据
      //Object.assign es6中新增的方法可以合并对象
      //组件实例this._data
      Object.assign(this._data,this.$options.data());
    },
    //点击添加SPU按钮时的回调
    async addSpuData(category3Id) {
      //添加SPU的时候收集三级分类的id
      this.spu.category3Id = category3Id;
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //spu保存按钮的回调
    async addOrUpdateSpu() {
      //整理参数：需要整理照片墙的数据
      //携带参数：对于图片，需要携带imageName imageUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        //提示
        this.$message({ type: "success", message: "保存成功" });
        //通知父组件回到场景0
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      //清理数据
      Object.assign(this._data,this.$options.data());
    },
    //el-input失去焦点事件的回调
    handleInputConfirm(row) {
      //解构出销售属性值当中的数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的销售属性值的名称不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空!");
        return;
      }
      //属性值不能重复,这里也可以用some
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      //上一个方法相同返回false 不同返回true
      //所以当相同时，return
      if (!result) return;
      //新增的销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      //新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //修改inputVisible，不显示button
      row.inputVisible = false;
    },
    //点击添加销售值属性按钮的回调
    addSaleAttrValue(row) {
      //点击销售属性值当中的添加按钮时，需要有button变为input，通过当前销售属性的inputVisible控制
      //添加响应式数据  挂载在销售属性上的响应式数据，其控制着button与input的切换
      this.$set(row, "inputVisible", true);
      //通过响应式数据inputVisible字段，收集新增的销售属性值
      this.$set(row, "inputValue", "");
    },
    //照片墙，图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      //收集图片的信息
      this.spuImageList = fileList;
    },
    //照片墙删除的回调
    handleRemove(file, fileList) {
      //file参数：代表删除的图片
      //fileList参数：代表删除图片后的照片墙
      // console.log(file, fileList);
      //收集照片墙的数据
      //对于已有的图片，存在name,url字段
      //对服务器而言，不需要name,url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理
      this.spuImageList = fileList;
    },
    //照片墙预览的回调
    handlePictureCardPreview(file) {
      //将图片的地址赋值
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //初始化spuForm数据
    async initSpuDate(spu) {
      //获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取SPU图标
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段，需要把服务器返回的数据进行修改
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //把整理好的数据赋值
        this.spuImageList = listArr;
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //添加新的销售属性
    addSaleAttr() {
      //把已经收集到的销售属性数据attrIdAndAttrName进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      //向SPU对象的spuSaleAttrList属性添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //清空数据
      this.attrIdAndAttrName = "";
    },
  },
  computed: {
    //计算还未选择的销售属性
    unSelectSaleAttr() {
      //整个平台的销售属性一共三个：尺寸、颜色、版本
      //数组的过滤方法，从已有的数组中过滤出用户需要的元素，并返回一个新数据
      let result = this.saleAttrList.filter((item) => {
        //every数组的方法，会返回一个布尔值
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      // console.log(result);
      return result;
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>