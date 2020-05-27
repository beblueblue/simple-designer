(function(){
    class Designer {
      constructor(config) {
        this.configCache = this.formatConfig(config);
        this.uniqueId = Number(new Date())
        this.aliData = null;
        this.aliReturnData = null;
        this.aliStatus = false;
        this.$container = null;
        this.$form = null;
        this.$designerArea = null;

        this.$fileInput = null;
        this.$fileInputCart = null;
        this.$pop = null;
        this.$backImg = null;
        this.$viewer = null;
        this.designerCropper = null;
  
        this._init()
      }
  
      formatConfig(config) {
        return $.extend(true, {
          uploadImgUrl: 'http://snb.lichengxx.cn/api/product', // 定制图片交互地址
          uploadImgAliUrl: 'https://snb.lichengxx.cn/api/ossUpload', // 阿里云地址
          imgCount: 2, // 用户需要上传的图片数量
          third_product_id: 0, // 第三方产品ID
          product_price: 1000, // 第三方产品价格
          product_title: '', // 第三方产品标题
          assetUrl: '/', // 静态资源地址
          orderPropertyName: "properties[customisationId]", // 定制产品hash字段
          width: 500, // 设计区域大小
          height: 500, // 设计区域大小
          viewerRatio: 1.5, // 可视区域高宽比
          angleStep: 15, // 单次旋转角度
          // 可视文本配置
          textConfig: {
            designerBtnText: 'CUSTOMIZE NOW', // 定制按钮文本
            uploadLabel: 'Upload Your Photo', // 图片上传按钮提示语
            upload: 'upload', // 图片上传按钮
            popTitle: '', // 弹窗标题
            imgPopTitle: '', // 图片预览弹窗标题
            designerTips: '', // 设计提示
            popCancel: '取消', // 取消按钮文本
            popConfirm: '确认', // 确认按钮文本
            addToCart: "Add to cart", //加入购物车文本
            buyItNow: "Buy it now", //加入购物车文本
          }
        }, config || {})
      }
  
      _init(){
        // 检测入口是否构建
        if(!this.getApp()){
          this.$form = this.getForm();
          this.buildApp();
        }
      }
  
      buildApp() {
        const {
          $form,
          configCache:{
            textConfig: {
              designerBtnText,
            }
          }
        } = this;
        // 清除按钮 CSS 控制
        // 构建入口
        const $container = $(`
          <div data-v-${this.uniqueId} class="designer-interface-container-v2 mb-20">
            <div class="to-designer-container"><a>${designerBtnText}</a></div>
          </div>
        `);
        const $insertionPoint = this.getInsertionPoint();

        const $designerArea = $(`<div data-v-${this.uniqueId} class="designer-dialog-container-v2">`)

        this.getDialogInsertionPoint().append($designerArea);

        this.$container = $container;
        this.$designerArea = $designerArea;

        $insertionPoint.before(
          $container.append(
            $designerArea
          )
        );
        this.buildDialogHeader();
        this.buildDialogBody();

        $container.find('.to-designer-container>a').on('click',function() {
          const body = $("html, body");
          $designerArea.show();
          body.stop().animate({scrollTop:0}, 500, 'swing');
        })
      }
  
      getApp() {
        return !!this.$container;
      }
      getPop() {
        return !!this.$pop;
      }

      getForm() {
        return $('.product-page-main form[action="/cart/add"]').length ? $('.product-page-main form[action="/cart/add"]') : $('form[action="/cart/add"]').eq(0);
      }
  
      getInsertionPoint() {
        return this.$form.find('button[type="submit"]').eq(0).closest('div');
      }

      getDialogInsertionPoint() {
        return this.$form.closest('#shopify-section-product .product-page__main .product-page-info');
      }

      buildDialogHeader() {
        const {
          $designerArea,
          configCache: {
            assetUrl,
            product_price,
            product_title,
            textConfig: {
              addToCart,
              buyItNow,
            },
          },
        } = this;
        const $this = this;
        const $dialogHeader = $(`
          <div class="designer-v2-area-header">
            <a href="javascript:void(0);" class="designer-v2-event-close">
              <svg aria-hidden="true" focusable="false" role="presentation" class="designer-v2-icon" viewBox="0 0 30 30">
                <path
                  d="M15,12.8786797 L21.9393398,5.93933983 C22.5251263,5.35355339 23.4748737,5.35355339 24.0606602,5.93933983 C24.6464466,6.52512627 24.6464466,7.47487373 24.0606602,8.06066017 L17.1213203,15 L24.0606602,21.9393398 C24.6464466,22.5251263 24.6464466,23.4748737 24.0606602,24.0606602 C23.4748737,24.6464466 22.5251263,24.6464466 21.9393398,24.0606602 L15,17.1213203 L8.06066017,24.0606602 C7.47487373,24.6464466 6.52512627,24.6464466 5.93933983,24.0606602 C5.35355339,23.4748737 5.35355339,22.5251263 5.93933983,21.9393398 L12.8786797,15 L5.93933983,8.06066017 C5.35355339,7.47487373 5.35355339,6.52512627 5.93933983,5.93933983 C6.52512627,5.35355339 7.47487373,5.35355339 8.06066017,5.93933983 L15,12.8786797 Z"
                  id="path-1"></path>
              </svg>
            </a>
            <div class="designer-v2-price-sale">
              <h2><span class="designer-v2-money">$${(product_price/100).toFixed(2)}</span></h2>
              <p class="designer-v2-text-ellipsis">${product_title}</p>
            </div>
            <a href="javascript:void(0)" class="designer-v2-add-cart-cart">
              <span class="designer-v2-load"><img class="designer-v2-loading"
                  src="${assetUrl}icon-loading_40x.png"></span>${addToCart}</a>
            <a href="javascript:void(0)" class="designer-v2-buy-it-now">
              <span class="designer-v2-load"><img class="designer-v2-loading"
                  src="${assetUrl}icon-loading_40x.png"></span>${buyItNow}</a>
          </div>
        `);

        $designerArea.append($dialogHeader);
        $designerArea.find('.designer-v2-event-close').on('click',function() {
          $designerArea.fadeOut();
        });
        $designerArea.find('.designer-v2-add-cart-cart').on('click',function() {
          $this.addToCart();
        });
        $designerArea.find('.designer-v2-buy-it-now').on('click',function() {
          $this.buyItNow();
        });
      }
      buildDialogBody() {
        const {
          $designerArea,
          configCache: {
            imgCount,
          },
        } = this;
        const imgArr = [];
        for(let i = 0; i < imgCount; i++){
          imgArr.push(i);
        }
        const $this = this;
        const reducer = (accumulator, currentValue, i) => {
          return accumulator + `
            <div class="designer-v2-upload-item" data-id="${i}"> 
              <div class="designer-v2-upload-item-img">
                <img id="designer-v2-img-${i}" width="200" src="" style="display:none;">
                <span>Photo ${i + 1}</span>
              </div>
              <div class="designer-v2-upload-item-btn">
                <div>Add</div>
              </div>
            </div>
            <input type="file" class="designer-v2-img-input" id="designer-v2-add-img-${i}" data-id="${i}" accept="*" style="display: none;">
          `;
        }
        const $dialogBody = $(`
          <div class="designer-v2-area-body">
            <div class="designer-v2-preview-image">
              <h3>Preview:</h3>
              <img id="designer-v2-merge-preview" src="">
              <p>P.S. This is for online preview only, our designers will adjust the details for best performance.</p>
            </div>
            <div class="designer-v2-photo-upload">
              <span>Upload Your Photo</span>
              <i class="designer-v2-photo-unfold designer-icon-photo-unfold"></i>
            </div>
            <div class="designer-v2-upload-container">  
              <span class="designer-v2-input-field-title">Photos</span>
              ${imgArr.reduce(reducer, '')}
            </div>
          </div>
        `);

        $designerArea.append($dialogBody);
        $designerArea.find('.designer-v2-photo-upload').on('click',function() {
          $(this).toggleClass('close')
          $designerArea.find('.designer-v2-upload-container').slideToggle();
        });
        $designerArea.find('.designer-v2-upload-item').on('click', function() {
          const id = $(this).data('id');
          $this.aliData = null;
          $this.handleImgClick(id);
          $designerArea.find(`#designer-v2-add-img-${id}`).trigger('click');
        });
        $designerArea.find('.designer-v2-img-input').on('change', function() {
          $this.handleImgChange($(this).data('id'), $this)
        });
      }
      addToCart() {

      }
      buyItNow() {

      }
      handleImgClick(id, callBack) {
        const {
          configCache: {
            uploadImgAliUrl
          }
        } = this;
        const $this = this;

        $.ajax({
          url: uploadImgAliUrl,
          method: 'GET',
          dataType:'json',
          success(data) {
            $this.aliData = data;
            callBack && callBack(id, $this);
          },
          error(error) {
            console.log('get ali failed: ', error);
          },
        })
      }
      handleImgChange(id, $this) {
        const {
          aliData
        } = $this;
        
        if(aliData) {
          $this.handleImgAliLoad($this)
        } else {
          setTimeout(() => {
            if($this.aliData){
              $this.handleImgAliLoad($this);
            } else {
              $this.handleImgClick(id, $this.handleImgChange)
            }
          }, 500);
        }
      }
      handleImgAliLoad($this) {
        const {
          aliData
        } = $this;
        console.log('ssss', aliData)
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
        const {viewerRatio, uploadImgUrl, third_product_id} = $this.configCache
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
            image_top: parseInt(canvasData.top) + parseInt(imgData.top) + parseInt(imgData.height)/2, // 图片中心距离画布左顶点
            image_left: parseInt(canvasData.left) + parseInt(imgData.left) + parseInt(imgData.width)/2, // 图片中心距离画布左顶点
            image_angle: parseInt(imgData.rotate), // 图片绕中心旋转的 角度
          },
          design_params:{
            design_params_width: parseInt(viewerData.width),
            design_params_height: parseInt(viewerData.height),
            design_params_top: parseInt(viewerData.left),
            design_params_left: parseInt(viewerData.top),
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
            $this.$fileInputCart.val(data.hash);
            $this.$container.find('.designer-progress-bar-inner').text(`100%`).css('width', `100%`);
            $this.$container.find('.designer-preview-img').attr('src', imgSrc);
            $this.$container.find('.designer-preview-sm').show().siblings().hide();
            $this.$pop.hide();
          },
          error() {
            clearInterval(timer);
            $this.$container.find('.designer-progress-bar-inner').text(`0%`).css('width', `0%`);
            $this.$fileInputCart.val('')
            $this.$container.find('.designer-confirm-btn').removeClass('disabled')
          },
        });
      }
    }
  
    window.Designer = Designer;
  }())
  