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
  productInfo: {
    id: 0,  //产品标识
  },
  productData: {
    frontImgUrl: '', // 前景图
    backImgUrl: '', // 背景图
  },
  // 可视文本配置
  textConfig: {
    uploadLabel: 'Upload Your Photo', // 图片上传按钮提示语
    upload: 'upload', // 图片上传按钮
  },
  // 提示文本配置
  promptConfig: {

  }
}

```