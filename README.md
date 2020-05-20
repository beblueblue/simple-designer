# simple-designer
shopify设计器第一版

# 设计思路
- 产品页面： product.liquid

# 使用指南
1. 添加配置
2. 初始化设计器

# 配置参数说明
```javascript
{
  uploadImgUrl: '', // 图片参数交互地址
  orderPropertyName: 'IMG_HASH', // 向 shopify 订单增加的属性名。
  width: 500, // 设计区域大小
  height: 500, // 设计区域大小
  viewerRatio: 1.5, // 可视区域高宽比
  // 可视文本配置
  textConfig: {
    uploadLabel: 'Upload Your Photo', // 图片上传按钮提示语
    upload: 'upload', // 图片上传按钮
    popTitle: '', // 弹窗标题
    imgPopTitle: '', // 图片预览弹窗标题
    designerTips: '', // 设计提示
    popCancel: '取消', // 取消按钮文本
    popConfirm: '确认', // 确认按钮文本
  }
}

```

# 接口说明
- 接口地址： 配置项里的 uploadImgUrl
- 接口参数： 
```javascript
img_data, // 图片源数据
image: {
  width, // 图片在画布里面的宽
  height, // 图片在画布里面的高
  top, // 图片中心距离画布左顶点
  left, // 图片中心距离画布左顶点
  angle, // 图片绕中心旋转的角度（顺时针角度）
},
design_params:{
  width, // 裁剪窗宽度
  height, // 裁剪窗高度
  top, // 裁剪窗左顶点距离画布左顶点高
  left, // 裁剪窗左顶点距离画布左顶点宽
}

// 返回值
data: {
  hash, // 放入 shopify 订单中属性中（属性名：配置项的 orderPropertyName）
}
```