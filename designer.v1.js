;(function() {
  class Designer {
    constructor(config) {
      this.configCache = this.formatConfig(config);
      this.uniqueId = Number(new Date())
      this.$container = null;
      this.$fileInput = null;
      this.$fileInputCart = null;
      this.$pop = null;
      this.$backImg = null;
      this.$viewer = null;
      this.designerCropper = null;

      this.imgOriginData = '';
      this._init()
    }

    formatConfig(config) {
      return $.extend(true, {
        uploadImgUrl: 'http://snb.lichengxx.cn/api/product',
        third_product_id: 0,
        orderPropertyName: 'properties[customisationId]',
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
          popCancel: 'Cancel', // 取消按钮文本
          popConfirm: 'Confirm', // 确认按钮文本
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
        orderPropertyName,
        angleStep,
        textConfig: {
          upload,
          uploadLabel,
        }
      } = this.configCache;
      const $fileInput = $(`<input data-v-${this.uniqueId} type="file">`);
      const $fileInputCart = $(`<input data-v-${this.uniqueId} type="text" name="${orderPropertyName}">`);
      const $fileBtn = $(`<div data-v-${this.uniqueId} class="designer-interface-btn">${upload}</div>`);
      const $container = $(`
        <div data-v-${this.uniqueId} class="designer-interface-container designer-interface-container-v1 mb-20">
          <div data-v-${this.uniqueId}>
            <span data-v-${this.uniqueId} class="designer-interface-text">${uploadLabel}</span>
            <div data-v-${this.uniqueId} class="designer-preview-sm"><img class="designer-preview-img"></div>
          </div>
        </div>
      `);
      const $fileContainer = $(`<div data-v-${this.uniqueId}>`);
      const $insertionPoint = this.getInsertionPoint();
      const $this = this;

      $container.append(
        $fileContainer.append(
          $fileBtn,
          $fileInput,
          $fileInputCart
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
          $container.find('.designer-preview-sm').hide();
          $container.find('.designer-confirm-btn').removeClass('disabled')
          $this.buildDesigner()
        }
        reader.readAsDataURL(files[0]);
      });
      this.$container = $container;
      this.$fileInput = $fileInput;
      this.$fileInputCart = $fileInputCart;

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
      const {
        textConfig: {
          popTitle,
          imgPopTitle,
        }
      } = this.configCache;
      const initFlag = this.getPop();
      const $pop = initFlag ? this.$pop : $(`<div class="designer-pop-container" data-v-${this.uniqueId}>`);
      const $dialog = $(`<div class="designer-pop-dialog" role="dialog" aria-label="dialog" aria-modal="true" data-v-${this.uniqueId}>`);
      this.$pop = $pop;
      const $header = this.buildDesignerHeader(popTitle, $pop);
      const $footer = this.buildDesignerFooter();
      const $imgPop = $(`<div class="designer-img-pop" data-v-${this.uniqueId}>`);
      const $imgPopHeader = this.buildDesignerHeader(imgPopTitle, $imgPop);
      const $body = this.buildDesignerBody();

      $pop.empty().append(
        $dialog.append(
          $header,
          $body.append($footer)
        )
      ).show();
      $imgPop.empty().append(
        $(`<div class="designer-img-dialog">`).append(
          $imgPopHeader,
          `<div class="designer-preview-lg"><img class="designer-preview-img" src="" alt=""></div>`
        )
      ).hide();
      if(!initFlag) {
        this.$container.append($pop, $imgPop);
        $pop.show();
      }
    }
    buildDesignerHeader(title, $pop) {
      const $closeBtn = $(`<i class="designer-icon-delete designer-f24 designer-pointer" data-v-${this.uniqueId}>`);

      $closeBtn.on('click', function(){
        $pop.hide();
      });
      return $(`<div class="designer-pop-header" data-v-${this.uniqueId}>`).append(
        `<div data-v-${this.uniqueId}><span>${title}</span></div>`,
        $('<div data-v-${this.uniqueId}>').append($closeBtn),
      );
    }
    buildDesignerBody() {
      const {width, height, viewerRatio} = this.configCache;
      const $designerCanvasArea = $(`<div class="designer-canvas-area" data-v-${this.uniqueId} style="width: ${width}px; height: ${height}px">`);
      const $backImg = $(`<img class="designer-canvas-img" data-v-${this.uniqueId}>`);
      const $this = this;

      $backImg.attr('src', this.imgOriginData);
      $designerCanvasArea.append(
        $(`<div class="designer-background-container" data-v-${this.uniqueId}>`).append($backImg),
      );

      this.$backImg = $backImg;
      this.$viewer = $(`<div class="designer-canvas-container" data-v-${this.uniqueId}>`).append($designerCanvasArea);
      if($backImg.get(0).complete) {
        $this.designerCropper = new Cropper($this.$backImg.get(0), {
          aspectRatio: viewerRatio,
          dragMode: 'move',
          viewMode: 1,
        });
        setTimeout(function() {
          $this.registerHandle();
        }, 10)
      } else {
        $backImg.on('load', () => {
          $this.designerCropper = new Cropper($this.$backImg.get(0), {
            aspectRatio: viewerRatio,
            dragMode: 'move',
            viewMode: 1,
          });
          $this.registerHandle()
        })
      }

      return this.$viewer;
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
            <div><i class="designer-f28 designer-pointer designer-icon-loop designer-reset-btn"></i></div>
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
      const $this = this;
const {angleStep} = this.configCache;
      this.$container.find('.designer-opposite-rotate-btn').off('click')
      this.$container.find('.designer-opposite-rotate-btn').on('click', function(e) {
        $this.designerCropper.rotate(-1 * angleStep);
      });
      this.$container.find('.designer-rotate-btn').off('click')
      this.$container.find('.designer-rotate-btn').on('click', function(e) {
        $this.designerCropper.rotate(angleStep);
      });
      this.$container.find('.designer-reset-btn').off('click')
      this.$container.find('.designer-reset-btn').on('click', function(e) {
        $this.designerCropper.reset();
      });
      this.$pop.find('.designer-cancel-btn, .designer-icon-delete').off('click')
      this.$pop.find('.designer-cancel-btn, .designer-icon-delete').on('click', function(e) {
        $this.$pop.hide();
        $this.$container.find('.designer-preview-sm').hide().siblings().show();
        $this.$fileInputCart.val('');
        $this.$container.find('.designer-progress-bar-inner').text(`0%`).css('width', `0%`);
      });
      // this.$pop.find('.designer-icon-delete').off('click')
      // this.$pop.find('.designer-icon-delete').on('click', function(e) {
      //   $this.$pop.hide();
      //   $this.$container.find('.designer-preview-sm').hide().siblings().show();
      // });
      this.$container.find('.designer-confirm-btn').off('click')
      this.$container.find('.designer-confirm-btn').on('click', function(e) {
        if($(this).is('.disabled')){
          return false;
        }
        $(this).addClass('disabled')
        $this.postParams($this);
      });
      this.$container.find('.designer-preview-sm').off('click')
      this.$container.find('.designer-preview-sm').on('click', function(e) {
        $this.$container.find('.designer-img-pop').show();
      });
      this.$container.find('.designer-img-pop').off('click')
      this.$container.find('.designer-img-pop').on('click', function(e) {
        $this.$container.find('.designer-img-pop').hide();
      });
      this.$container.find('.designer-img-dialog').off('click')
      this.$container.find('.designer-img-dialog').on('click', function(e) {
        if(e.stopPropagation){
          e.stopPropagation()
        }else {
          e.cancelBubble=true;
        }
      });
    }
    postParams($this){
      const {
        viewerRatio,
        uploadImgUrl,
        third_product_id,
      } = $this.configCache
      const imgData = $this.designerCropper.getImageData();
      const canvasData = $this.designerCropper.getCanvasData();
      const viewerData = $this.designerCropper.getCropBoxData();
      const imgSrc = $this.designerCropper.getCroppedCanvas({
        width: 900,
        height: 900 / viewerRatio,
        fillColor: '#fff'
      }).toDataURL('image/jpeg');
      let progressBarNum = 0;
      let timer = null;
      let formData = new FormData();
      const imgRotateAngle = parseInt(imgData.rotate);

      timer = setInterval(function() {
        if(progressBarNum < 98) {
          progressBarNum += 1;
          $this.$container.find('.designer-progress-bar-inner').text(`${progressBarNum}%`).css('width', `${progressBarNum}%`);
        } else {
          clearInterval(timer)
        }
      }, 50)

      formData.append('img_data', $this.$fileInput.get(0).files[0]);
      formData.append('third_product_id', third_product_id);

      const dataItem = {
        img_data: formData,
        image: {
          image_width: parseInt(imgData.width), // 图片在画布里面的宽
          image_height: parseInt(imgData.height), // 图片在画布里面的高
          image_left: parseInt(canvasData.left) + parseInt(imgData.left) + parseInt(imgData.width)/2, // 图片中心距离画布左顶点
          image_top: parseInt(canvasData.top) + parseInt(imgData.top) + parseInt(imgData.height)/2, // 图片中心距离画布左顶点
          image_angle: imgRotateAngle, // 图片绕中心旋转的 角度
        },
        design_params:{
          design_params_width: parseInt(viewerData.width),
          design_params_height: parseInt(viewerData.height),
          design_params_left: parseInt(viewerData.left),
          design_params_top: parseInt(viewerData.top),
        }
      }
      for(let key in dataItem.image) {
        formData.append(key, dataItem.image[key]);
      }
      for(let key in dataItem.design_params) {
        formData.append(key, dataItem.design_params[key]);
      }
      
      $.ajax({
        url: uploadImgUrl,
        method: 'POST',
        async: true,  
        cache: false,  
        contentType: false, 
        processData: false, 
        // traditional:true,
        dataType:'json',
        data: formData,
        success(data) {
          clearInterval(timer);
          $this.$fileInput.val('');
          $this.$fileInputCart.val(data.hash);
          $this.$container.find('.designer-progress-bar-inner').text(`100%`).css('width', `100%`);
          $this.$container.find('.designer-preview-img').attr('src', imgSrc);
          $this.$container.find('.designer-preview-sm').show().siblings().hide();
          $this.$pop.fadeOut();
        },
        error() {
          clearInterval(timer);
          $this.$fileInput.val('');
          $this.$container.find('.designer-progress-bar-inner').text(`0%`).css('width', `0%`);
          $this.$fileInputCart.val('')
          $this.$container.find('.designer-confirm-btn').removeClass('disabled')
        },
      });
    }
  }

  window.Designer = Designer;
})();
