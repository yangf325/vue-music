<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner" alt="底部灰色">
      <div class="progress" alt="黄色进度条" ref="progress"></div>
      <div
        alt="圆形按钮"
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { prefixStyle } from "common/js/dom";
const transform = prefixStyle("transform");
const progressBtnWidth = 16;
export default {
  data() {
    return {
      touch: {}
    };
  },
  components: {},
  computed: {},
  mounted() {},
  created() {
    this.touch = {};
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;//按钮按下的初始x
      this.touch.oldLeft = this.$refs.progress.clientWidth;//进度栏的拖动前宽度
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return false;
      }
      const changedX = e.touches[0].pageX - this.touch.startX;//x的变化量
      //offsetWidth是旧的x位置加上变化的x位置,并且在0和bar宽度之间 (this.touch.oldLeft + changedX)
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.oldLeft + changedX)
      );
      // console.log(e.touches[0].pageX, this.startX);
      // console.log(changedX, offsetWidth);
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      this.touch.initiated = false;
      this._trigerPercent();//派发事件
    },
    //接受一个宽度,将进度栏和小圆球的位置重新设置
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
    },
    //根据当前进度条宽度计算当前百分比并派发事件去父组件
    _trigerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;//计算进度条总宽度
      const percent = this.$refs.progress.clientWidth / barWidth;//计算当前百分比
      this.$emit("percentChange", percent);
    },
    //点击滚动栏直接跳到新的百分比
    progressClick(e){
      this._offset(e.offsetX)
      this._trigerPercent();
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>