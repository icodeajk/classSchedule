<template>
  <div class="hz-cell">
    <div class="hz-cell-wrapper"
      @click="toggleStatus()"
    >
      <div ref="wrapper" class="scroller">
        <div class="part hz-cell-left-part"></div>
        <div ref="el" class="part hz-cell-center-part"
          @touchstart="doOnTouchStart"
          @touchend="doOnTouchEnd"
          @touchmove="doOnTouchMove"
        >
            <div ref="title" class="hz-cell-title" v-if="!value|| type === 'input'">{{ title }}</div>
            <div class="hz-cell-expand-title" v-else>{{ title }}</div>

            <div v-if="type === 'slot'">
              <slot></slot>
            </div>
            <div v-else>
              <input v-if="type === 'input'"
                class="inline-input"
                v-model="valueObj[valueKey]"
                :placeholder="placeholder"
              />
              <div class="hz-cell-value">{{ value }}</div>
              <div :class="'hz-cell-arrow ' + iconArrowType" v-if="!value"></div>
            </div>

        </div>
        <div ref="btn" v-if="type === 'swiper'" class="part hz-cell-right-part">
          <span class="btn"
            v-for="(btnItem, index) in btnConfig.btns"
            v-bind:style="btnItem.style"
            @click="removeItem"
          >{{ btnItem.text }}</span>
        </div>
      </div>

    </div>
    <div class="hz-cell-board" v-show="type === 'accordion' && _isExpand">
      <!-- {{ _isExpand ? 'expand' : ''}} -->
      <slot></slot>
    </div>
  </div>
</template>

<script>

import { CellSwipe } from 'mint-ui'

export default {
  props: {
    type: {
      type: String,
      default: 'normal' // accordion, link, normal, swiper, input, slot
    },
    title: {
      type: String,
      default: ''
    },

    value: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'expand'
    },
    isExpand: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    config: {
      type: Object,
      default: function() {
        return {}
      }
    },
    /* type is input-start */
    valueObj: {
      type: Object,
      default: function() {
        return {}
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    valueKey: {
      type: String,
      default: ''
    },
    /* type is input-end */


    btnConfig: {
      type: Object,
      default: function() {
        return {}
      }
    },
    removeItem: {
      type: Function
    }
  },
  data() {
    return {
      toastInstance: null,
      iconArrowType: '',
      startX : 0 ,
      endX : 0 ,
      start: { x: 0, y: 0 },
      swiping: false,
      opened: false,
      btnGroupWidth: 0,
      wrapperHeight: 48,
      dragState: {},
      prevent: true,
      stopPropagation: true,
      userScrolling: false,
      animating: false
    }
  },
  directives: {
    focus: {
      inserted: function (el, {value}) {
        console.log(el,{value})
        if (value) {
          el.focus();
        }
      }
    }
  },
  created() {
    this._isExpand =  this.isExpand
  },
  mounted() {
    if (this.$refs.btn) {

      this.getBtnGroupWidth()
    }
    this.iconType()
    // this.wrap = this.$refs.cell.$this.$refs.el.querySelector('.hz-cell-wrapper')
    // this.leftElm = this.$refs.left
    // this.rightElm = this.$refs.right
    // this.leftWrapElm = this.leftElm.parentNode
    // this.rightWrapElm = this.rightElm.parentNode
    // this.leftWidth = this.leftElm.getBoundingClientRect().width
    // this.rightWidth = this.rightElm.getBoundingClientRect().width

    // this.leftDefaultTransform = this.translate3d(-this.leftWidth - 1)
    // this.rightDefaultTransform = this.translate3d(this.rightWidth)

    // this.rightWrapElm.style.webkitTransform = this.rightDefaultTransform
    // this.leftWrapElm.style.webkitTransform = this.leftDefaultTransform
  },
  updated() {
    this.iconType()
  },  // computed: {
  //   iconArrowType() {
  //     return this._isExpand ? 'hz-cell-arrow-down' : 'hz-cell-arrow-up'
  //   }
  // },
  methods: {
    toggleStatus () {
      this._isExpand = !this._isExpand
      this.$forceUpdate()
    },
    iconType() {
      if(this.type === 'accordion'){
        this.iconArrowType = this._isExpand ? 'hz-cell-arrow-up' : 'hz-cell-arrow-down'
      } else if (this.type === 'link'){
        this.iconArrowType = 'hz-cell-arrow-right'
      } else {
        this.iconArrowType = ''
      }
    },
    touchstartHandler(e) {
      console.log('start')
    },
      resetSwipeStatus: function resetSwipeStatus() {
      this.swiping = false
      this.opened = true
      this.offsetLeft = 0
    },

    translate3d: function translate3d(offset) {
      return ("translate3d(" + offset + "px, 0, 0)")
    },

    setAnimations: function setAnimations(val) {
      this.wrap.style.transitionDuration = val
      this.rightWrapElm.style.transitionDuration = val
      this.leftWrapElm.style.transitionDuration = val
    },

    swipeMove: function swipeMove(offset) {
      if ( offset === void 0 ) offset = 0

      this.wrap.style.webkitTransform = this.translate3d(offset)
      this.rightWrapElm.style.webkitTransform = this.translate3d(this.rightWidth + offset)
      this.leftWrapElm.style.webkitTransform = this.translate3d(-this.leftWidth + offset)
      offset && (this.swiping = true)
    },

    swipeLeaveTransition: function swipeLeaveTransition(direction) {
      this$1 = this

      setTimeout(function () {
        this$1.swipeLeave = true

        // left
        if (direction > 0 && -this$1.offsetLeft > this$1.rightWidth * 0.4) {
          this$1.swipeMove(-this$1.rightWidth)
          this$1.resetSwipeStatus()
          return
        // right
        } else if (direction < 0 && this$1.offsetLeft > this$1.leftWidth * 0.4) {
          this$1.swipeMove(this$1.leftWidth)
          this$1.resetSwipeStatus()
          return
        }

        this$1.swipeMove(0)
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mint_ui_src_utils_dom__["c" /* once */])(this$1.wrap, 'webkitTransitionEnd', function (_) {
          this$1.wrap.style.webkitTransform = ''
          this$1.rightWrapElm.style.webkitTransform = this$1.rightDefaultTransform
          this$1.leftWrapElm.style.webkitTransform = this$1.leftDefaultTransform
          this$1.swipeLeave = false
          this$1.swiping = false
        })
      }, 0)
    },

    startDrag: function startDrag(evt) {
      evt = evt.changedTouches ? evt.changedTouches[0] : evt
      this.dragging = true
      this.start.x = evt.pageX
      this.start.y = evt.pageY
      this.direction = ''
    },

    onDrag: function onDrag(evt) {
      if (this.opened) {
        if (!this.swiping) {
          this.swipeMove(0)
          this.setAnimations('')
        }
        this.opened = false
        return
      }
      if (!this.dragging) return

      swiping
      e = evt.changedTouches ? evt.changedTouches[0] : evt
      offsetTop = e.pageY - this.start.y
      offsetLeft = this.offsetLeft = e.pageX - this.start.x

      y = Math.abs(offsetTop)
      x = Math.abs(offsetLeft)

      this.setAnimations('0ms')

      if (this.direction === '') {
        this.direction = x > y ? 'horizonal' : 'vertical'
      }

      if (this.direction === 'horizonal') {
        evt.preventDefault()
        evt.stopPropagation()

        swiping = !(x < 5 || (x >= 5 && y >= x * 1.73))
        if (!swiping) return

        if ((offsetLeft < 0 && -offsetLeft > this.rightWidth) ||
          (offsetLeft > 0 && offsetLeft > this.leftWidth) ||
          (offsetLeft > 0 && !this.leftWidth) ||
          (offsetLeft < 0 && !this.rightWidth)) {
        } else {
          this.swipeMove(offsetLeft)
        }
      }
    },

    endDrag: function endDrag() {
      this.direction = ''
      this.setAnimations('')
      if (!this.swiping) return
      this.swipeLeaveTransition(this.offsetLeft > 0 ? -1 : 1)
    },

    getBtnGroupWidth() {

      this.btnGroupWidth = this.$refs.btn.getBoundingClientRect().width
      // this.wrapperHeight = this.$refs.el.getBoundingClientRect().height
      // this.$refs.wrapper.style.height = this.wrapperHeight + 'px'
      // this.$refs.el.children[0].style.height = this.wrapperHeight + 'px'
      // this.$refs.btn.style.lineHeight = this.wrapperHeight + 'px'
    },
    translate(element, offset, speed) {

      if (speed) {
          this.animating = true
          element.style.webkitTransition = `-webkit-transform ${speed}ms ease-in-out`
          setTimeout(function() {
              element.style.webkitTransform = `translate(${offset}px, 0) translateZ(0)`
          }, 50)
      } else {
          element.style.webkitTransition = ''
          element.style.webkitTransform = `translate(${offset}px, 0) translateZ(0)`
      }
    },
    doOnTouchStart(event) {
      if (this.type !== 'swiper')return
      var touch = event.touches[0]
      this.dragState.startTime = new Date()
      this.dragState.startLeft = touch.pageX
      this.dragState.startTop = touch.pageY
      this.swiping = true
    },
    doOnTouchMove(event) {
      if (this.type !== 'swiper')return
      var touch = event.touches[0]
      this.dragState.currentLeft = touch.pageX
      this.dragState.currentTop = touch.pageY
      var offsetLeft = this.dragState.currentLeft - this.dragState.startLeft
      var offsetTop = this.dragState.currentTop - this.dragState.startTop
      var distanceX = Math.abs(offsetLeft)
      var distanceY = Math.abs(offsetTop)
      if (distanceX < 5 || ( distanceY >= 5 && distanceY >= 1.73 * distanceX )) {
          this.userScrolling = true
          return
      } else {
          this.userScrolling = false
          event.preventDefault()
      }
      if (offsetLeft > 0) {
          offsetLeft = offsetLeft - this.btnGroupWidth
          if (!this.opened) {
              return
          }
      } else {
          if (this.opened) {
              return
          }
      }
      offsetLeft = Math.min(Math.max(-this.btnGroupWidth, offsetLeft), 0)

      this.translate(this.$refs.el, offsetLeft)
    },
    doOnTouchEnd() {
        if (this.type !== 'swiper')return
        var dragDuration = new Date() - this.dragState.startTime
        var offsetLeft = this.dragState.currentLeft - this.dragState.startLeft
        var offsetTop = this.dragState.currentTop - this.dragState.startTop
        if (dragDuration < 300) {
            var fireTap = Math.abs(offsetLeft) < 5 && Math.abs(offsetTop < 5)
            if (isNaN(offsetLeft) || isNaN(offsetTop)) {
                fireTap = true
            }
            if (fireTap) {
                this.translate(this.$refs.el, 0, 150)
                this.opened = false
                this.swiping = false
                return
            }
        }
        var distanceX = Math.abs(offsetLeft)
        if (distanceX > this.btnGroupWidth * 0.4 && offsetLeft < 0) {
            this.translate(this.$refs.el, - this.btnGroupWidth, 150)
            this.opened = true
        } else {
            this.translate(this.$refs.el, 0, 150)
            this.opened = false
        }
        this.dragState = {}
    }
  },

  components: {
    CellSwipe,
  }
}
</script>

<style scoped lang="less">
  .hz-cell {
    background: #fff;
    border-top:1px solid #F0F2F3;/*no*/
    .hz-cell-wrapper {
      height: 44px;
      line-height: 44px;
      overflow: hidden;

      text-align: right;
      .scroller {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        .hz-cell-left-part {

        }
        .hz-cell-center-part {
            box-sizing: border-box;
            position: absolute;
            background: #fff;
            width: 100%;
            height: 100%;
            padding: 0 12px 0 16px;
            z-index: 2;
          .hz-cell-center-part-wrapper {
            width: 100%;
          }
          .hz-cell-title {
            float: left;
            font-size: 16px;
            color: #333333;
          }
          .hz-cell-expand-title{
            float: left;
            font-size: 16px;
            color: #666666;
          }
          .hz-cell-value {
            display:inline-block;
            font-size: 14px;
          }
          .hz-cell-arrow {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-top: 1px solid #979797;/*no*/
            border-right: 1px solid #979797;/*no*/
            &.hz-cell-arrow-up {
              transform: rotate(-45deg);
              margin-bottom: -2px;
            }
            &.hz-cell-arrow-down {
              transform: rotate(135deg);
              margin-bottom: 4px;
            }
            &.hz-cell-arrow-right {
              transform: rotate(45deg);
            }
          }

        }
        .hz-cell-right-part {
          position: absolute;
          z-index: 1;
          right: 0;
          .btn {
            display: inline-block;
            padding: 0 16px;
          }
        }
      }
      .part {
        float: left;
      }
      .inline-input {
        display: inline-block;
        border: 0;
        width: 135px;
      }
    }
  }
</style>
