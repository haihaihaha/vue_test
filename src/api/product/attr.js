//平台属性管理模块的请求文件
import request from '@/utils/request';

//获取一级分类数据接口
///admin/product/getCategory1 get
export const reqCategory1list = () => request({ url: `/admin/product/getCategory1`, method: 'get' });

//获取二级分类数据接口
///admin/product/getCategory2/{category1Id} get
export const reqCategory2list = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' });

//获取三级分类数据接口
///admin/product/getCategory3/{category2Id} get
export const reqCategory3list = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' });

//获取平台属性接口
///admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

//添加属性与属性值接口
///admin/product/saveAttrInfo post
export const reqAddOrUpdateAttr = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'post', data });
/*
 {
     "attrName":"", 属性名
     "attrValueList":[  属性值（属性名：属性值=1：n）
         {
             "attrId":, 属性的id
            "valueName":,   属性值
         }
     ],
     "categoryId":,
     "categoryLevel":,
 } 
 */

//删除属性接口
///admin/product/deleteAttr/{attrId}
export const reqDeleteAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' });
