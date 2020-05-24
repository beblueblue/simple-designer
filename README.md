# simple-designer
shopify设计器第一版

# 使用指南
1. 准备模板模板文件  
  1.1 进入 shopify 后台代码编辑
  ![enter-code-editor.jpg](./img/enter-code-editor.jpg)
  1.2 将本项目 `./fonts` 中文件全部加到 `asset` 中
  ![add-fonts.jpg](./img/add-fonts.jpg)
  1.3 新建模板文件 `product.designer.liquid`，将本项目 `designer.v1.liquid` 文件代码复制到里面。  
  ![add-template.jpg](./img/add-template.jpg)
  1.4 编辑产品，定制产品模板文件切换为 `product.designer.liquid`  
  ![add-product-1.jpg](./img/add-product-1.jpg)
  ![add-product-2.jpg](./img/add-product-2.jpg)


# 配置参数说明
```javascript
{
  uploadImgUrl: 'http://snb.lichengxx.cn/api/product', // 图片参数交互地址
  orderPropertyName: "properties[customisationId]", // 向 shopify 订单增加的属性名。
  width: 500, // 设计区域大小
  height: 500, // 设计区域大小
  viewerRatio: 1.5, // 可视区域高宽比
  angleStep: 15, // 单次旋转角度
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
image_width, // 图片在画布里面的宽
image_height, // 图片在画布里面的高
image_top, // 图片中心距离画布左顶点
image_left, // 图片中心距离画布左顶点
image_angle, // 图片绕中心旋转的角度（顺时针角度）
design_params_width, // 裁剪窗宽度
design_params_height, // 裁剪窗高度
design_params_top, // 裁剪窗左顶点距离画布左顶点高
design_params_left, // 裁剪窗左顶点距离画布左顶点宽
third_product_id, // shopify 产品id

// 返回值
data: {
  hash, // 放入 shopify 订单中属性中（属性名：配置项的 orderPropertyName）
}
```