import request from '@/utils/request';

//sku列表的接口
///admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' });

//上架
///admin/product/onSale/{skId}
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

//下架
///admin/product/cancelSale/{skId}
export const reqCancel = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

//获取SKU详情的接口
///admin/product/getSkuById/{skuId} get
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });

//删除SKU接口
//DELETE /admin/product/deleteSku/{skuId}
export const reqDeleteSku = (skuId) => request({ url:`/admin/product/deleteSku/${skuId}`,method:'delete'});