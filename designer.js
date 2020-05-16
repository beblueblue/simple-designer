class Designer {
  constructor(config) {
    this.configCache = this.formatConfig(config);
    this.uniqueId = 'v-' + Number(new Date())
    this.$container = null;
    this.$pop = null;
    this._init()
  }

  formatConfig(config) {
    return Object.assign({}, config || {},  {
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
    })
  }

  _init(){
    // 检测入口是否构建
    if(!this.getApp()){
      this.buildApp();
    }
  }

  buildApp() {
    const { 
      textConfig: {
        upload,
        uploadLabel,
      }
    } = this.configCache;
    const $fileInput = $(`<input data-v-${this.uniqueId} type="file" name="file">`);
    const $fileBtn = $(`<div data-v-${this.uniqueId} class="designer-interface-btn">${upload}</div>`);
    const $container = $(`
      <div data-v-${this.uniqueId} class="designer-interface-container mb-20">
        <div data-v-${this.uniqueId}><span data-v-${this.uniqueId} class="designer-interface-text">${uploadLabel}</span></div>
      </div>
    `);
    const $fileContainer = $(`<div data-v-${this.uniqueId}>`);
    const $insertionPoint = this.getInsertionPoint();

    $container.append(
      $fileContainer.append(
        $fileBtn,$fileInput
      )
    );
    $fileBtn.on('click', function(){
      $fileInput.trigger('click');
    });
    $fileInput.on('change', function(e){
      let files = e.target.files
      if(!files || !files[0]){
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        // const $img = $('<img />');
        // $container.append($img);
        //  $img.attr('src', evt.target.result);
        this.buildDesigner(evt.target.result)
      }
      reader.readAsDataURL(files[0]);
    });
    this.$container = $container;

    $insertionPoint.before($container);
  }

  getApp() {
    return !!this.$container;
  }
  getPop() {
    return !!this.$pop;
  }

  getInsertionPoint() {
    const $form = $('.product-page-main form[action="/cart/add"]').length ? $('.product-page-main form[action="/cart/add"]') : $('form[action="/cart/add"]').eq(0);
    return $form.find('button[type="submit"]').eq(0).closest('div');
  }

  buildDesigner(imgData, opt) {
    let $pop = this.getPop() ? this.$pop : $(`<div class="designer-pop-container" data-v-${this.uniqueId}>`);

    
  }
}