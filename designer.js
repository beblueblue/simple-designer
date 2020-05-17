class Designer {
  constructor(config) {
    this.configCache = this.formatConfig(config);
    this.uniqueId = 'v-' + Number(new Date())
    this.$container = null;
    this.$pop = null;
    this.$backImg = null;
    this.$frontImg = null;
    this.$designerContainer = null;

    this.imgOriginData = '';
    this._init()
  }

  formatConfig(config) {
    return $.extend(true, {
      width: 600, // 设计区域大小
      height: 600, // 设计区域大小
      viewerProportion: 0.8, // 可视区域占设计区域的比例
      viewerRatio: 1.5, // 可视区域高宽比
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
        popTitle: '', // 弹窗标题
      },
      // 提示文本配置
      promptConfig: {
    
      }
    }, config || {})
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
    const $this = this;

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
        $this.imgOriginData = evt.target.result;
        $this.buildDesigner()
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

  buildDesigner() {
    const initFlag = this.getPop();
    const $pop = initFlag ? this.$pop : $(`<div class="designer-pop-container" data-v-${this.uniqueId}>`);
    const $dialog = $(`<div class="designer-pop-dialog" role="dialog" aria-label="dialog" aria-modal="true" data-v-${this.uniqueId}>`);
    this.$pop = $pop;
    const $header = this.buildDesignerHeader();
    const $body = this.buildDesignerBody();
    const $footer = this.buildDesignerFooter();

    $pop.empty().append(
      $dialog.append(
        $header,
        $body.append($footer)
      )
    )
    if(!initFlag) {
      this.$container.append($pop);
    }
  }
  buildDesignerHeader() {
    const {
      textConfig: {
        popTitle,
      }
    } = this.configCache;
    const $pop = this.$pop;
    const $closeBtn = $(`<i class="designer-icon-delete designer-f24 designer-pointer" data-v-${this.uniqueId}>`);

    $closeBtn.on('click', function(){
      $pop.hide();
    });
    return $(`<div class="designer-pop-header" data-v-${this.uniqueId}>`).append(
      `<div data-v-${this.uniqueId}><span>${popTitle}</span></div>`,
      $('<div data-v-${this.uniqueId}>').append($closeBtn),
    );
  }
  buildDesignerBody() {
    const {width, height} = this.configCache;
    const $backImg = $(`<img class="designer-canvas-img" data-v-${this.uniqueId}>`);
    const $frontImg = $(`<img data-v-${this.uniqueId}>`);
    const $designerCanvasArea = $(`<div class="designer-canvas-area" data-v-${this.uniqueId} style="width: ${width}px; height: ${height}px">`);
    const $designerContainer = $(`<div class="designer-view-container" data-v-${this.uniqueId}>`);
    const $this = this;

    $backImg.attr('src', this.imgOriginData);
    $frontImg.attr('src', this.imgOriginData);
    $designerContainer.append(
      $(`<div class="designer-view-box" data-v-${this.uniqueId}>`).append($frontImg),
      `
      <span class="designer-dashed dashed-width"></span>
      <span class="designer-dashed dashed-height"></span>
      <span class="designer-dashed dashed-center"></span>
      <span class="designer-line line-left"></span>
      <span class="designer-line line-top"></span>
      <span class="designer-line line-right"></span>
      <span class="designer-line line-bottom"></span>
      <span class="designer-point point-w"></span>
      <span class="designer-point point-wn"></span>
      <span class="designer-point point-n"></span>
      <span class="designer-point point-ne"></span>
      <span class="designer-point point-e"></span>
      <span class="designer-point point-es"></span>
      <span class="designer-point point-s"></span>
      <span class="designer-point point-sw"></span>
      `
    )
    $designerCanvasArea.append(
      $(`<div class="designer-background-container" data-v-${this.uniqueId}>`).append($backImg),
      `<div class="designer-canvas-shadow" data-v-${this.uniqueId}></div>`,
      $designerContainer
    );

    this.$backImg = $backImg;
    this.$frontImg = $frontImg;
    this.$designerContainer = $designerContainer;

    $frontImg.on('load', () => {
      $this.calcOriginPosition();
      $this.resetPosition();
    })

    return  $(`<div class="designer-canvas-container" data-v-${this.uniqueId}>`).append($designerCanvasArea);
  }
  buildDesignerFooter() {
    return $(`
      <div class="designer-pop-footer">交互按钮</div>
    `);
  }
  calcOriginPosition() {
    const { width, height, viewerProportion, viewerRatio } = this.configCache;
    const originImgWidth = this.$backImg.width();
    const originImgHeight = this.$backImg.height();
    let originViewerWidth = 0;
    let originViewerHeight = 0;
    if(originImgWidth <= originImgHeight) {
      originViewerWidth = originImgWidth * viewerProportion;
      originViewerHeight = originViewerWidth / viewerRatio;
    } else {
      originViewerHeight = originImgHeight * viewerProportion;
      originViewerWidth = originViewerHeight * viewerRatio;
    }
    const originTransX = (width - originViewerWidth) / 2;
    const originTransY = (height - originViewerHeight) / 2;
    const originDiffX = (originViewerWidth - originImgWidth) / 2;
    const originDiffY = (originViewerHeight - originImgHeight) / 2;

    this.originImgWidth = originImgWidth;
    this.originImgHeight = originImgHeight;
    this.originViewerWidth = originViewerWidth;
    this.originViewerHeight = originViewerHeight;
    this.originTransX = originTransX;
    this.originTransY = originTransY;
    this.originDiffX = originDiffX;
    this.originDiffY = originDiffY;
  }
  resetPosition() {
    const {
      originImgWidth,
      originImgHeight,
      originViewerWidth,
      originViewerHeight,
      originTransX,
      originTransY,
      originDiffX,
      originDiffY,
    } = this;

    this.$frontImg.width(originImgWidth);
    this.$frontImg.height(originImgHeight);
    this.$designerContainer.width(originViewerWidth);
    this.$designerContainer.height(originViewerHeight);
    this.$designerContainer.css('transform', `translate(${originTransX}px, ${originTransY}px)`);
    this.$frontImg.css('transform', `translate(${originDiffX}px, ${originDiffY}px)`);
  }
}