class Designer {
  constructor(config) {
    this.configCache = this.formatConfig(config);
    this.uniqueId = Number(new Date())
    this.$container = null;
    this.$pop = null;
    this.$backImg = null;
    this.$frontImg = null;
    this.$viewer = null;

    // 设计参数
    // this.imgLeft = 0;
    // this.imgTop = 0;
    // this.imgWidth = 0;
    // this.imgHeight = 0;
    // this.imgAngle = 0;
    // this.viewLeft = 0;
    // this.viewTop = 0;
    // this.viewWidth = 0;
    // this.viewHeight = 0;

    this.backImgTransX = 0;
    this.backImgTransY = 0;
    this.viewerTransX = 0;
    this.viewerTransY = 0;
    this.backImgAngle = 0;

    this.viewerLeft = 0;
    this.viewerRight = 0;
    this.viewerTop = 0;
    this.viewerBottom = 0;
    this.backImgLeft = 0;
    this.backImgRight = 0;
    this.backImgTop = 0;
    this.backImgBottom = 0;
    this.containerLeft = 0;
    this.containerTop = 0;

    this.imgOriginData = '';
    this._init()
  }

  formatConfig(config) {
    return $.extend(true, {
      width: 500, // 设计区域大小
      height: 500, // 设计区域大小
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
        designerTips: '', // 设计提示
        popCancel: '取消', // 取消按钮文本
        popConfirm: '确认', // 确认按钮文本
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
    ).show();
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
    const $viewer = $(`<div class="designer-view-container" data-v-${this.uniqueId}>`);
    const $this = this;

    $backImg.attr('src', this.imgOriginData);
    $frontImg.attr('src', this.imgOriginData);
    $viewer.append(
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
      $viewer
    );

    this.$backImg = $backImg;
    this.$frontImg = $frontImg;
    this.$viewer = $viewer;

    $frontImg.on('load', () => {
      $this.calcOriginPosition();
      $this.resetPosition();
      $this.registerHandle();
    })

    return  $(`<div class="designer-canvas-container" data-v-${this.uniqueId}>`).append($designerCanvasArea);
  }
  buildDesignerFooter() {
    const {textConfig: {
      designerTips,
      popCancel,
      popConfirm
    }} = this.configCache;
    return $(`
      <div class="designer-pop-footer">
        <div class="designer-tool-bar">
          <div><i class="designer-f38 designer-pointer designer-icon-counterclockwise designer-opposite-rotate-btn"></i></div>
          <div><i class="designer-f30 designer-pointer designer-icon-loop designer-reset-btn"></i></div>
          <div><i class="designer-f38 designer-pointer designer-icon-clockwise designer-rotate-btn"></i></div>
        </div>
        <div class="designer-pop-prompt designer-tc">${designerTips}</div>
        <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
            class="designer-progress-container">
          <div class="designer-progress-bar">
            <div class="designer-progress-bar-outer">
              <div class="designer-progress-bar-inner" style="width: 0%;" data-v-${this.uniqueId}>
                <div class="designer-progress-bar-text" data-v-${this.uniqueId}>0%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="designer-pop-tool-bar designer-tc">
          <a class="designer-pop-btn designer-cancel-btn" data-v-${this.uniqueId}>${popCancel}</a>
          <a class="designer-pop-btn designer-confirm-btn" data-v-${this.uniqueId}>${popConfirm}</a>
        </div>
      </div>
    `);
  }
  registerHandle() {
    const $pop = this.$pop;
    const $this = this;
    let clickFlag = false;
    let viewType = '';
    let prevX = 0;
    let prevY = 0;
    let shadowLimitObj = null;
    let viewLimitObj = null;
    const {
      originImgWidth,
      originImgHeight,
      configCache: {
        width,
        height
      }
    } = $this;
    const viewMethods = {
      E: $this.moveViewerE.bind($this),
      S: $this.moveViewerS.bind($this),
      W: $this.moveViewerW.bind($this),
      N: $this.moveViewerN.bind($this),
      ES: $this.moveViewerES.bind($this),
      SW: $this.moveViewerSW.bind($this),
      WN: $this.moveViewerWN.bind($this),
      NE: $this.moveViewerNE.bind($this),
      MOVE: $this.moveViewer.bind($this),
    }

    $pop.find('.designer-canvas-shadow').off('mousedown')
    $pop.find('.designer-canvas-shadow').on('mousedown', function(e) {
      const offset = $this.$viewer.offset();
      const containerOffset = $pop.find('.designer-canvas-area').offset();
      const backImgOffset = $this.$backImg.offset();
      clickFlag = true;
      viewType = '';
      prevX = e.pageX;
      prevY = e.pageY;

      $this.viewerLeft = offset.left;
      $this.viewerRight = $this.viewerLeft + $this.$viewer.width();
      $this.viewerTop = offset.top;
      $this.viewerBottom = $this.viewerTop + $this.$viewer.height();

      $this.backImgLeft = backImgOffset.left;
      $this.backImgRight = $this.backImgLeft + originImgWidth;
      $this.backImgTop = backImgOffset.top;
      $this.backImgBottom = $this.backImgTop + originImgHeight;

      $this.containerLeft = containerOffset.left;
      $this.containerTop = containerOffset.top;

      shadowLimitObj = {
        maxX: $this.viewerLeft - $this.containerLeft,
        maxY: $this.viewerTop - $this.containerTop,
        minX: $this.viewerRight - originImgWidth - $this.containerLeft,
        minY: $this.viewerBottom - originImgHeight - $this.containerTop,
      };
    })

    $this.$viewer.off('mousedown')
    $this.$viewer.on('mousedown', function(e) {
      const $target = $(e.target);
      const offset = $this.$viewer.offset();
      const containerOffset = $pop.find('.designer-canvas-area').offset();
      const backImgOffset = $this.$backImg.offset();
      clickFlag = false;
      prevX = e.pageX;
      prevY = e.pageY;

      $this.viewerLeft = offset.left;
      $this.viewerRight = $this.viewerLeft + $this.$viewer.width();
      $this.viewerTop = offset.top;
      $this.viewerBottom = $this.viewerTop + $this.$viewer.height();

      $this.backImgLeft = backImgOffset.left;
      $this.backImgRight = $this.backImgLeft + originImgWidth;
      $this.backImgTop = backImgOffset.top;
      $this.backImgBottom = $this.backImgTop + originImgHeight;

      $this.containerLeft = containerOffset.left;
      $this.containerTop = containerOffset.top;

      if($target.is('.point-e') || $target.is('.line-right')) {
        viewType = 'E';
      } else if($target.is('.point-s') || $target.is('.line-bottom')) {
        viewType = 'S';
      } else if($target.is('.point-w') || $target.is('.line-left')) {
        viewType = 'W';
      } else if($target.is('.point-n') || $target.is('.line-top')) {
        viewType = 'N';
      } else if($target.is('.point-es')) {
        viewType = 'ES';
      } else if($target.is('.point-sw')) {
        viewType = 'SW';
      } else if($target.is('.point-wn')) {
        viewType = 'WN';
      } else if($target.is('.point-ne')) {
        viewType = 'NE';
      } else {
        viewType = 'MOVE';
      }
      
      viewLimitObj = {
        maxX: Math.min(width, $this.backImgRight - $this.containerLeft) - $this.$viewer.width(),
        maxY: Math.min(height, $this.backImgBottom - $this.containerTop) - $this.$viewer.height(),
        minX: Math.max(0, $this.backImgLeft - $this.containerLeft),
        minY: Math.max(0, $this.backImgTop - $this.containerTop),
      };
    })

    $pop.off('mousemove')
    $pop.on('mousemove', function(e) {
      if(clickFlag){
        const diffX = e.pageX - prevX;
        const diffY = e.pageY - prevY;

        prevX = e.pageX;
        prevY = e.pageY;
        $this.updatePosition(diffX, diffY, shadowLimitObj);
      }
      if(viewType) {
        const diffX = e.pageX - prevX;
        const diffY = e.pageY - prevY;
        prevX = e.pageX;
        prevY = e.pageY;
        viewMethods[viewType](diffX, diffY, viewLimitObj);
      }
    })
    $pop.find('.designer-reset-btn').off('click')
    $pop.find('.designer-reset-btn').on('click', function(e) {
      $this.resetPosition();
    })
    $pop.find('.designer-opposite-rotate-btn').off('click')
    $pop.find('.designer-opposite-rotate-btn').on('click', function(e) {
      $this.rotate(false);
    })
    $pop.find('.designer-rotate-btn').off('click')
    $pop.find('.designer-rotate-btn').on('click', function(e) {
      $this.rotate(true);
    })


    $(document).on('mouseup', function() {
      clickFlag = false;
      viewType = '';
    })
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
    const originBackTransX = (width - originImgWidth) / 2;
    const originBackTransY = (height - originImgHeight) / 2;
    const originTransX = (width - originViewerWidth) / 2;
    const originTransY = (height - originViewerHeight) / 2;
    const originDiffX = originBackTransX - originTransX;
    const originDiffY = originBackTransY - originTransY;

    this.originImgWidth = originImgWidth;
    this.originImgHeight = originImgHeight;
    this.originViewerWidth = originViewerWidth;
    this.originViewerHeight = originViewerHeight;
    this.originBackTransX = originBackTransX;
    this.originBackTransY = originBackTransY;
    this.originTransX = originTransX;
    this.originTransY = originTransY;
    this.originDiffX = originDiffX;
    this.originDiffY = originDiffY;
  }

  // 旋转
  rotate(flag) {
    const {
      backImgAngle,
      backImgTransX,
      backImgTransY,
      viewerTransX,
      viewerTransY,
    } = this;
    const Angle = flag ? this.backImgAngle + 45 : this.backImgAngle - 45;
    this.backImgAngle = Angle;
    const frontImgDiffX = backImgTransX - viewerTransX;
    const frontImgDiffY = backImgTransY - viewerTransY;
    this.$backImg.css('transform', `translate(${backImgTransX}px, ${backImgTransY}px) rotate(${Angle}deg)`);
    this.$frontImg.css('transform', `translate(${frontImgDiffX}px, ${frontImgDiffY}px) rotate(${Angle}deg)`);
  }
  // 视窗调整
  moveViewerE(diffX, diffY, {
    minX,
    minY,
    maxX,
    maxY,
  }){
    const {
      viewerWidth,
      viewerLeft,
      viewerTop,
      backImgRight,
      backImgBottom,
      containerLeft,
      containerTop,
      configCache: {
        width,
        height,
        viewerRatio,
      }
    } = this;
    const newViewerWidth = diffX + viewerWidth;
    if(newViewerWidth > 0) {
      const newViewerHeight = newViewerWidth / viewerRatio;

      const maxWidth = Math.min(backImgRight, containerLeft + width) - viewerLeft;
      const maxHeight = Math.min(backImgBottom, containerTop + height) - viewerTop;
      if(newViewerWidth > maxWidth || newViewerHeight > maxHeight){
        return false;
      }


      this.viewerWidth = newViewerWidth;
      this.viewerHeight = newViewerHeight;
      this.$viewer.width(newViewerWidth);
      this.$viewer.height(newViewerHeight);
    } else {
      // this.moveViewerW(diffX, diffY, {
      //   minX,
      //   minY,
      //   maxX,
      //   maxY,
      // });
    }
  }
  moveViewerS(diffX, diffY, {
    minX,
    minY,
    maxX,
    maxY,
  }) {
    const {
      viewerHeight,
      viewerLeft,
      viewerTop,
      backImgRight,
      backImgBottom,
      containerLeft,
      containerTop,
      viewerTransX,
      viewerTransY,
      backImgTransX,
      backImgTransY,
      backImgAngle,
      configCache: {
        width,
        height,
        viewerRatio,
      }
    } = this;
    const newViewerHeight = diffY + viewerHeight;
    if(newViewerHeight > 0) {
      const newViewerWidth = newViewerHeight * viewerRatio;

      const maxWidth = Math.min(backImgRight, containerLeft + width) - viewerLeft;
      const maxHeight = Math.min(backImgBottom, containerTop + height) - viewerTop;
      if(newViewerWidth > maxWidth || newViewerHeight > maxHeight){
        return false;
      }

      const newViewerTransX = viewerTransX - diffY * viewerRatio;
      const newViewerTransY = viewerTransY;
      const frontImgDiffX = backImgTransX - newViewerTransX;
      const frontImgDiffY = backImgTransY - newViewerTransY;

      this.viewerTransX = newViewerTransX;
      this.viewerTransY = newViewerTransY;
      this.$viewer.css('transform', `translate(${newViewerTransX}px, ${newViewerTransY}px)`);
      this.$frontImg.css('transform', `translate(${frontImgDiffX}px, ${frontImgDiffY}px) rotate(${backImgAngle}deg)`);

      this.viewerWidth = newViewerWidth;
      this.viewerHeight = newViewerHeight;
      this.$viewer.width(newViewerWidth);
      this.$viewer.height(newViewerHeight);
    } else {
      // this.moveViewerS(diffX, diffY, {
      //   minX,
      //   minY,
      //   maxX,
      //   maxY,
      // });
    }
  }
  moveViewerW(diffX, diffY, {
    minX,
    minY,
    maxX,
    maxY,
  }) {
    const {
      viewerWidth,
      viewerRight,
      viewerBottom,
      backImgLeft,
      backImgTop,
      containerLeft,
      containerTop,
      viewerTransX,
      viewerTransY,
      backImgTransX,
      backImgTransY,
      backImgAngle,
      configCache: {
        viewerRatio,
      }
    } = this;
    const newViewerWidth = viewerWidth - diffX;
    if(newViewerWidth > 0) {
      const newViewerHeight = newViewerWidth / viewerRatio;

      const maxWidth = viewerRight - Math.max(containerLeft, backImgLeft);
      const maxHeight = viewerBottom  - Math.max(containerTop, backImgTop);
      if(newViewerWidth > maxWidth || newViewerHeight > maxHeight){
        return false;
      }
      const newViewerTransX = viewerTransX + diffX;
      const newViewerTransY = viewerTransY + diffX / viewerRatio;
      const frontImgDiffX = backImgTransX - newViewerTransX;
      const frontImgDiffY = backImgTransY - newViewerTransY;

      this.viewerTransX = newViewerTransX;
      this.viewerTransY = newViewerTransY;
      this.$viewer.css('transform', `translate(${newViewerTransX}px, ${newViewerTransY}px)`);
      this.$frontImg.css('transform', `translate(${frontImgDiffX}px, ${frontImgDiffY}px) rotate(${backImgAngle}deg)`);

      this.viewerWidth = newViewerWidth;
      this.viewerHeight = newViewerHeight;
      this.$viewer.width(newViewerWidth);
      this.$viewer.height(newViewerHeight);

    } else {
      // this.moveViewerE(diffX, diffY, {
      //   minX,
      //   minY,
      //   maxX,
      //   maxY,
      // });
    }
  }
  moveViewerN(diffX, diffY, {
    minX,
    minY,
    maxX,
    maxY,
  }) {
    const {
      viewerHeight,
      viewerRight,
      viewerBottom,
      backImgLeft,
      backImgTop,
      containerLeft,
      containerTop,
      viewerTransX,
      viewerTransY,
      backImgTransX,
      backImgTransY,
      backImgAngle,
      configCache: {
        viewerRatio,
      }
    } = this;
    const newViewerHeight = viewerHeight - diffY;
    if(viewerHeight > 0) {
      const newViewerWidth = newViewerHeight * viewerRatio;

      const maxWidth = viewerRight - Math.max(containerLeft, backImgLeft);
      const maxHeight = viewerBottom  - Math.max(containerTop, backImgTop);
      if(newViewerWidth > maxWidth || newViewerHeight > maxHeight){
        return false;
      }
      const newViewerTransX = viewerTransX;
      const newViewerTransY = viewerTransY + diffY;
      const frontImgDiffX = backImgTransX - newViewerTransX;
      const frontImgDiffY = backImgTransY - newViewerTransY;

      this.viewerTransX = newViewerTransX;
      this.viewerTransY = newViewerTransY;
      this.$viewer.css('transform', `translate(${newViewerTransX}px, ${newViewerTransY}px)`);
      this.$frontImg.css('transform', `translate(${frontImgDiffX}px, ${frontImgDiffY}px) rotate(${backImgAngle}deg)`);

      this.viewerWidth = newViewerWidth;
      this.viewerHeight = newViewerHeight;
      this.$viewer.width(newViewerWidth);
      this.$viewer.height(newViewerHeight);

    } else {
      // this.moveViewerE(diffX, diffY, {
      //   minX,
      //   minY,
      //   maxX,
      //   maxY,
      // });
    }
  }
  moveViewerES(...pros) {
    this.moveViewerE(...pros);
    // this.moveViewerS(...pros);
  }
  moveViewerSW(...pros) {
    this.moveViewerS(...pros);
    // this.moveViewerW(...pros);
  }
  moveViewerWN(...pros) {
    this.moveViewerW(...pros);
    // this.moveViewerN(...pros);
  }
  moveViewerNE(...pros) {
    // this.moveViewerE(...pros);
    this.moveViewerN(...pros);
  }


  moveViewer(diffX, diffY, {
    minX,
    minY,
    maxX,
    maxY,
  }) {
    const {
      viewerTransX,
      viewerTransY,
      backImgTransX,
      backImgTransY,
      backImgAngle,
    } = this;
    let newViewerTransX = viewerTransX + diffX;
    let newViewerTransY = viewerTransY + diffY;

    newViewerTransX = Math.min(Math.max(newViewerTransX, minX), maxX);
    newViewerTransY = Math.min(Math.max(newViewerTransY, minY), maxY);
    const frontImgDiffX = backImgTransX - newViewerTransX;
    const frontImgDiffY = backImgTransY - newViewerTransY;

    this.viewerTransX = newViewerTransX;
    this.viewerTransY = newViewerTransY;
    this.$viewer.css('transform', `translate(${newViewerTransX}px, ${newViewerTransY}px)`);
    this.$frontImg.css('transform', `translate(${frontImgDiffX}px, ${frontImgDiffY}px) rotate(${backImgAngle}deg)`);
  }
  // 背景图移动更新
  updatePosition(diffX, diffY, {
    minX,
    minY,
    maxX,
    maxY,
  }) {
    const {
      viewerTransX,
      viewerTransY,
      backImgTransX,
      backImgTransY,
      backImgAngle,
    } = this;
    let newBackImgTransX = backImgTransX + diffX;
    let newBackImgTransY = backImgTransY + diffY;

    newBackImgTransX = Math.min(Math.max(newBackImgTransX, minX), maxX);
    newBackImgTransY = Math.min(Math.max(newBackImgTransY, minY), maxY);

    const frontImgDiffX = newBackImgTransX - viewerTransX;
    const frontImgDiffY = newBackImgTransY - viewerTransY;
    this.backImgTransX = newBackImgTransX;
    this.backImgTransY = newBackImgTransY;

    this.$backImg.css('transform', `translate(${newBackImgTransX}px, ${newBackImgTransY}px) rotate(${backImgAngle}deg)`);
    this.$frontImg.css('transform', `translate(${frontImgDiffX}px, ${frontImgDiffY}px) rotate(${backImgAngle}deg)`);
  }
  // 重置按钮
  resetPosition() {
    const {
      originImgWidth,
      originImgHeight,
      originViewerWidth,
      originViewerHeight,
      originBackTransX,
      originBackTransY,
      originTransX,
      originTransY,
      originDiffX,
      originDiffY,
    } = this;

    this.backImgTransX = originBackTransX;
    this.backImgTransY = originBackTransY;
    this.viewerTransX = originTransX;
    this.viewerTransY = originTransY;
    this.viewerWidth = originViewerWidth;
    this.viewerHeight = originViewerHeight;
    this.backImgAngle = 0;

    this.$frontImg.width(originImgWidth);
    this.$frontImg.height(originImgHeight);
    this.$viewer.width(originViewerWidth);
    this.$viewer.height(originViewerHeight);
    this.$backImg.css('transform', `translate(${originBackTransX}px, ${originBackTransY}px) rotate(${this.backImgAngle}deg)`);
    this.$viewer.css('transform', `translate(${originTransX}px, ${originTransY}px)`);
    this.$frontImg.css('transform', `translate(${originDiffX}px, ${originDiffY}px) rotate(${this.backImgAngle}deg)`);
  }

  // getParams(){
  //   return {
  //     imgLeft: this.imgLeft,
  //     imgTop: this.imgTop,
  //     imgWidth: this.imgWidth,
  //     imgHeight: this.imgHeight,
  //     imgAngle: this.imgAngle,
  //     viewLeft: this.viewLeft,
  //     viewTop: this.viewTop,
  //     viewWidth: this.viewWidth,
  //     viewHeight: this.viewHeight,
  //   };
  // }
  
}